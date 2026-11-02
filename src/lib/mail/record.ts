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
type Task = { next_action: string; next_action_at: string };

/** Statuses a reply moves to "replied"; later ones (meeting, won) and closed leads keep theirs. */
const REPLY_MOVES: string[] = ["new", "qualified", "contacted"];
const CLOSED: string[] = ["won", "lost", "disqualified"];
/**
 * Older e-mails, as the first sync and "Prehľadať znova 90 dní" find them, only go into the history: what happened
 * since (a call, a meeting, a step set by hand) is not in the mailbox.
 */
const FRESH_MS = 14 * 864e5;

const today = () => new Date().toISOString().slice(0, 10);

/**
 * Saves the e-mails and returns how many were new. The unique (lead_id, message_id) makes a re-run harmless: only
 * a first insert changes the lead. It goes lead by lead, so a failed write costs only that lead: the cursors stay
 * put and the next run tries it again, while the leads already done skip their e-mails as recorded.
 */
export async function recordEmails(emails: NewEmail[]): Promise<number> {
  const byLead = new Map<string, NewEmail[]>();
  for (const email of [...emails].sort((a, b) => Date.parse(a.sent_at) - Date.parse(b.sent_at))) {
    byLead.set(email.lead_id, [...(byLead.get(email.lead_id) ?? []), email]);
  }
  let saved = 0;
  let failure: unknown = null;
  for (const [leadId, list] of byLead) {
    try {
      saved += await recordLead(leadId, list);
    } catch (err) {
      failure ??= err;
    }
  }
  if (failure) throw failure;
  return saved;
}

/** One lead's e-mails, then what they change: the lead's newest e-mail is known once all its rows are in. */
async function recordLead(leadId: string, list: NewEmail[]): Promise<number> {
  const added: NewEmail[] = [];
  let failure: MailDbError | null = null;
  for (const email of list) {
    const { error } = await db().from("lead_emails").insert(email);
    // 23505: recorded before; 23503: the lead was deleted after matching.
    if (error?.code === "23505" || error?.code === "23503") continue;
    if (error) {
      failure = new MailDbError(error.message);
      break;
    }
    added.push(email);
  }
  // The rows saved before a failed insert still get their history: the next run skips them as recorded.
  if (added.length) {
    try {
      await applyEffects(leadId, added);
    } catch (err) {
      // Removed again, the rows count as new on the next run, which then changes the lead after all.
      await db().from("lead_emails").delete().eq("lead_id", leadId).in("message_id", added.map((e) => e.message_id));
      throw err;
    }
  }
  if (failure) throw failure;
  return added.length;
}

/** The message id of the lead's newest e-mail that sets a next step: a normal one either way, or a bounce. */
async function newestEmail(leadId: string): Promise<string | null> {
  const { data, error } = await db()
    .from("lead_emails")
    .select("message_id")
    .eq("lead_id", leadId)
    .in("kind", ["normal", "bounce"])
    .order("sent_at", { ascending: false })
    .limit(1)
    .maybeSingle<{ message_id: string }>();
  if (error) throw new MailDbError(error.message);
  return data?.message_id ?? null;
}

/**
 * The follow-up a sent e-mail sets replaces a reply task, a check-the-address task (sent again, to a working
 * address), or an empty or older follow-up of an open lead; never a task set by hand.
 */
const followUpReplaces = (lead: Lead) =>
  [NEXT_ACTION, MAIL_REPLY, CHECK_ADDRESS].includes(lead.next_action ?? "") ||
  (!CLOSED.includes(lead.status) && (!lead.next_action || lead.next_action === FOLLOW_UP));

/**
 * The next step of the lead's newest e-mail: a reply asks for an answer (not on a won lead, whose mail is everyday
 * business; a closed one gets the task without being reopened), a sent e-mail sets the follow-up "Označiť ako
 * oslovený" sets, a bounce asks to check the address.
 */
function taskFor(email: NewEmail, lead: Lead): Task | null {
  if (email.kind === "bounce") return { next_action: CHECK_ADDRESS, next_action_at: today() };
  if (email.direction === "in") return lead.status === "won" ? null : { next_action: MAIL_REPLY, next_action_at: today() };
  return followUpReplaces(lead) ? { next_action: FOLLOW_UP, next_action_at: workdayIn(3, new Date(email.sent_at)) } : null;
}

/**
 * What newly recorded e-mails do to their lead. In the order they were sent, a reply moves an early lead to
 * "replied" and a sent e-mail moves a new or qualified lead to "contacted". The next step comes only from the lead's
 * newest e-mail, so a rescan of older mail does not bring back answered ones. E-mails older than FRESH_MS change
 * neither; every e-mail goes into the history.
 */
async function applyEffects(leadId: string, added: NewEmail[]) {
  const { data: lead, error } = await db().from("leads").select("id, status, next_action, next_action_at").eq("id", leadId).maybeSingle<Lead>();
  if (error) throw new MailDbError(error.message);
  if (!lead) return;

  const fresh = added.filter((e) => Date.now() - Date.parse(e.sent_at) < FRESH_MS);
  let status = lead.status;
  for (const e of fresh) {
    if (e.kind === "normal" && e.direction === "in" && REPLY_MOVES.includes(status)) status = "replied";
    if (e.kind === "normal" && e.direction === "out" && PRE_CONTACT.includes(status)) status = "contacted";
  }
  const newestId = fresh.length ? await newestEmail(lead.id) : null;
  const newest = fresh.find((e) => e.message_id === newestId);
  let task = newest ? taskFor(newest, lead) : null;
  if (task && task.next_action === lead.next_action && task.next_action_at === lead.next_action_at) task = null;

  const moved = status !== lead.status;
  if (moved || task) {
    const { error: updateError } = await db().from("leads").update({ ...(moved ? { status } : {}), ...task }).eq("id", lead.id);
    if (updateError) throw new MailDbError(updateError.message);
  }
  const events = added.map((e) => ({
    lead_id: lead.id,
    type: "email",
    body: mailLog.event(e) + (task && e === newest ? mailLog.task(task.next_action, task.next_action_at, lead) : ""),
    // The history shows the e-mail when it was sent, not when the sync found it.
    created_at: new Date(Math.min(Date.parse(e.sent_at) || Date.now(), Date.now())).toISOString(),
  }));
  if (moved) events.push({ lead_id: lead.id, type: "status", body: `${lead.status} → ${status}`, created_at: new Date().toISOString() });
  const { error: eventError } = await db().from("lead_events").insert(events);
  // 23503: the lead was deleted meanwhile, and its e-mails with it.
  if (eventError && eventError.code !== "23503") throw new MailDbError(eventError.message);
}
