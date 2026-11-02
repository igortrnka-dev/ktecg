import { db } from "../supabase/admin";
import { COMPANY_MAILBOX } from "../mail/config";
import { snippetOf } from "../mail/parse";
import { recordEmails } from "../mail/record";
import { readMailState, writeMailState } from "../mail/state";
import type { SyncResult } from "../mail/sync";

/*
 * Stand-in for the IMAP sync in the local preview when no IMAP settings are present: "Synchronizovať teraz"
 * finds one new sample reply and records it through the same code as the real sync (recordEmails).
 */

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Replies the simulated sync "finds", in order; each comes once (the unique message id keeps it so). */
const REPLIES = [
  {
    domain: "weserwerft.example",
    from_name: "Jana Hansen",
    from_email: "j.hansen@weserwerft.example",
    subject: "AW: Schweißer und Rohrschlosser für Ihre Serviceschiffe",
    body: "Guten Tag,\n\nentschuldigen Sie die späte Antwort, ich war im Urlaub. Für die zwei Serviceschiffe brauchen wir ab Januar voraussichtlich 4 Schweißer und 2 Rohrschlosser für etwa neun Monate. Können Sie uns Profile und Ihre Stundensätze schicken?\n\nMit freundlichen Grüßen\nJana Hansen\nLeiterin Fertigung",
  },
  {
    domain: "alpenstahl.example",
    from_name: "Stefan Gruber",
    from_email: "s.gruber@alpenstahl.example",
    subject: "AW: Stahlbaumonteure für Ihre Projekte in Oberösterreich",
    body: "Hallo,\n\nist das Angebot für die 8 Monteure schon fertig? Wir möchten nächste Woche entscheiden.\n\nGrüße\nStefan Gruber",
  },
];

export async function simulateMailSync(): Promise<SyncResult> {
  await wait(1500);
  let saved = 0;
  for (const reply of REPLIES) {
    const { data: lead } = await db().from("leads").select("id").eq("domain", reply.domain).maybeSingle();
    if (!lead) continue;
    const { domain, ...email } = reply;
    saved = await recordEmails([
      {
        ...email,
        lead_id: lead.id,
        message_id: `<demo-reply@${domain}>`,
        folder: "INBOX",
        direction: "in",
        kind: "normal",
        to_emails: [COMPANY_MAILBOX],
        cc_emails: [],
        snippet: snippetOf(email.body),
        sent_at: new Date(Date.now() - 6 * 60_000).toISOString(),
        in_reply_to: null,
      },
    ]);
    if (saved) break;
  }
  const now = new Date().toISOString();
  const state = await readMailState();
  const stats = { scanned: 3, matched: saved, saved, remaining: 0 };
  await writeMailState({ ...state, last_run_at: now, last_ok_at: now, last_error: null, running_since: null, stats });
  return { status: "ok", saved, scanned: stats.scanned, remaining: 0 };
}
