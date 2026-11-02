import { db } from "../supabase/admin";
import { FOLLOW_UP, NEXT_ACTION, workdayIn } from "../inquiries";
import { PRE_CONTACT } from "@/components/admin/ui";
import { MailDbError } from "./errors";
import type { MailKind } from "./parse";
import { CHECK_ADDRESS, MAIL_REPLY, mailLog } from "./text";

/** One lead_emails row; a message that matches two leads is two rows. */
export type NewEmail = {
  lead_id: string;
  message_id: string;
  folder: string | null;
  direction: "in" | "out";
  kind: MailKind;
  from_email: string | null;
  from_name: string | null;
  to_emails: string[];
  cc_emails: string[];
  subject: string | null;
  snippet: string | null;
  body: string | null;
  sent_at: string;
  in_reply_to: string | null;
};

type Lead = { id: string; status: string; next_action: string | null; next_action_at: string | null };

/** Statuses a reply moves to "replied"; later ones (meeting, won) and closed leads keep theirs. */
const REPLY_MOVES: string[] = ["new", "qualified", "contacted"];
const CLOSED: string[] = ["won", "lost", "disqualified"];

const today = () => new Date().toISOString().slice(0, 10);

/**
 * Saves the e-mails oldest first, so status changes follow the real sequence, and returns how many were new.
 * The unique (lead_id, message_id) makes a re-run harmless: only a first insert changes the lead.
 */
export async function recordEmails(emails: NewEmail[]): Promise<number> {
  let saved = 0;
  for (const email of [...emails].sort((a, b) => Date.parse(a.sent_at) - Date.parse(b.sent_at))) {
    const { error } = await db().from("lead_emails").insert(email);
    // 23505: recorded before; 23503: the lead was deleted after matching.
    if (error?.code === "23505" || error?.code === "23503") continue;
    if (error) throw new MailDbError(error.message);
    saved++;
    await applyEffects(email);
  }
  return saved;
}

/** Whether the lead has a normal e-mail newer than this one (in that direction). */
async function newerExists(email: NewEmail, direction?: "in" | "out"): Promise<boolean> {
  let query = db()
    .from("lead_emails")
    .select("id", { count: "exact", head: true })
    .eq("lead_id", email.lead_id)
    .eq("kind", "normal")
    .gt("sent_at", email.sent_at);
  if (direction) query = query.eq("direction", direction);
  const { count, error } = await query;
  if (error) throw new MailDbError(error.message);
  return Boolean(count);
}

/** The follow-up a sent e-mail sets replaces a reply task, or an empty or older follow-up of an open lead, never a task set by hand. */
const followUpReplaces = (lead: Lead) =>
  lead.next_action === NEXT_ACTION ||
  lead.next_action === MAIL_REPLY ||
  (!CLOSED.includes(lead.status) && (!lead.next_action || lead.next_action === FOLLOW_UP));

/**
 * What a newly recorded e-mail does to its lead. A reply moves an early lead to "replied" and asks for an answer
 * (a closed lead is not reopened, it only gets the task); a sent e-mail moves a new or qualified lead to
 * "contacted" and sets the follow-up "Označiť ako oslovený" sets; a bounce asks to check the address. Tasks come
 * only from the newest e-mail of their kind, so a rescan of older mail does not bring back answered ones.
 */
async function applyEffects(email: NewEmail) {
  const { data: lead, error } = await db().from("leads").select("id, status, next_action, next_action_at").eq("id", email.lead_id).maybeSingle<Lead>();
  if (error) throw new MailDbError(error.message);
  if (!lead) return;

  let status: string | null = null;
  let task: { next_action: string; next_action_at: string } | null = null;
  if (email.kind === "normal" && email.direction === "in") {
    if (REPLY_MOVES.includes(lead.status)) status = "replied";
    if (!(await newerExists(email, "out"))) task = { next_action: MAIL_REPLY, next_action_at: today() };
  } else if (email.kind === "normal") {
    if (PRE_CONTACT.includes(lead.status)) status = "contacted";
    if (followUpReplaces(lead) && !(await newerExists(email, "in"))) {
      task = { next_action: FOLLOW_UP, next_action_at: workdayIn(3, new Date(email.sent_at)) };
    }
  } else if (email.kind === "bounce" && !(await newerExists(email))) {
    task = { next_action: CHECK_ADDRESS, next_action_at: today() };
  }
  if (task && task.next_action === lead.next_action && task.next_action_at === lead.next_action_at) task = null;

  if (status || task) {
    const { error: updateError } = await db().from("leads").update({ ...(status ? { status } : {}), ...task }).eq("id", lead.id);
    if (updateError) throw new MailDbError(updateError.message);
  }
  // The history shows the e-mail when it was sent, not when the sync found it.
  const at = Math.min(Date.parse(email.sent_at) || Date.now(), Date.now());
  const events = [
    {
      lead_id: lead.id,
      type: "email",
      body: mailLog.event(email) + (task ? mailLog.task(task.next_action, task.next_action_at, lead) : ""),
      created_at: new Date(at).toISOString(),
    },
    ...(status ? [{ lead_id: lead.id, type: "status", body: `${lead.status} → ${status}`, created_at: new Date().toISOString() }] : []),
  ];
  const { error: eventError } = await db().from("lead_events").insert(events);
  if (eventError) throw new MailDbError(eventError.message);
}
