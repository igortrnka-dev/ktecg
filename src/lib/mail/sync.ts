import { ImapFlow, type FetchMessageObject, type MessageAddressObject } from "imapflow";
import { simpleParser, type AddressObject } from "mailparser";
import { mailConfig, mailConfigured, ownAddress, type MailConfig } from "./config";
import { MailStepError, logText, mailErrorText } from "./errors";
import { leadMatcher, type LeadMatcher } from "./match";
import { capBody, clean, deliveryReport, headerLines, isListMail, mailKind, normAddress, snippetOf, stripQuoted, uniqueAddresses } from "./parse";
import { recordEmails, type NewEmail } from "./record";
import { AUTO_SYNC_MS, isRunning, readMailState, writeMailState, type FolderCursor, type MailSyncState } from "./state";

/*
 * Reads the company mailbox over IMAP, read-only: folders are opened with EXAMINE, so nothing is marked read,
 * moved or changed. Only messages that match a lead are fetched in full and stored (see record.ts).
 */

const SINCE_DAYS = 90;
const BATCH = 300;
const MAX_SOURCE = 5 * 1024 * 1024;
const TIMEOUT_MS = 20_000;
/** Folder names to try when the server marks no folder as \Sent and IMAP_SENT_FOLDER is not set. */
const SENT_NAMES = ["sent", "inbox.sent", "sent items", "odoslané"];
/** Just the headers that decide the kind of a message, fetched with the envelope. */
const KIND_HEADERS = [
  "auto-submitted", "x-autoreply", "x-autorespond", "precedence", "content-type", "x-failed-recipients", "list-id", "list-unsubscribe",
];

export type SyncResult =
  | { status: "ok"; saved: number; scanned: number; remaining: number }
  | { status: "busy" }
  | { status: "off" }
  | { status: "error"; error: string };

type FolderRead = { path: string; emails: NewEmail[]; cursor: FolderCursor; scanned: number; remaining: number };

const g = globalThis as unknown as { __ktMailSync?: Promise<SyncResult> };

/** Runs one sync and never throws: a failure is stored as the state's last_error and returned. */
export function syncMail(options: { reset?: boolean } = {}): Promise<SyncResult> {
  // One run per server process; running_since in the state keeps a second process out too.
  if (g.__ktMailSync) return Promise.resolve({ status: "busy" });
  const run = runSync(Boolean(options.reset))
    .catch((err): SyncResult => {
      console.error("Mail sync failed:", logText(err));
      return { status: "error", error: mailErrorText(err) };
    })
    .finally(() => {
      g.__ktMailSync = undefined;
    });
  g.__ktMailSync = run;
  return run;
}

/**
 * Opening Pošta or the overview starts a sync in the background (like startRun) when the last one is older than
 * five minutes, or right away while the last run left mail to read. Returns true when it started one.
 */
export async function maybeSyncMail(): Promise<boolean> {
  if (!mailConfigured() || g.__ktMailSync) return false;
  const state = await readMailState();
  if (isRunning(state)) return false;
  const catchingUp = !state.last_error && (state.stats?.remaining ?? 0) > 0;
  const age = Date.now() - (state.last_run_at ? Date.parse(state.last_run_at) : 0);
  if (!catchingUp && age < AUTO_SYNC_MS) return false;
  void syncMail();
  return true;
}

async function runSync(reset: boolean): Promise<SyncResult> {
  const config = mailConfig();
  if (!config) return { status: "off" };
  const state = await readMailState();
  if (isRunning(state)) return { status: "busy" };
  const startedAt = new Date().toISOString();
  await writeMailState({ ...state, running_since: startedAt });

  const next: MailSyncState = { ...state, folders: reset ? {} : state.folders, last_run_at: startedAt, running_since: null };
  try {
    const match = await leadMatcher();
    const reads = await readMailbox(config, next.folders, match);
    const emails = reads.flatMap((r) => r.emails);
    const saved = await recordEmails(emails);
    // Only now, after everything read was saved, do the cursors move on.
    for (const r of reads) next.folders = { ...next.folders, [r.path]: r.cursor };
    const scanned = reads.reduce((n, r) => n + r.scanned, 0);
    const remaining = reads.reduce((n, r) => n + r.remaining, 0);
    next.last_ok_at = new Date().toISOString();
    next.last_error = null;
    next.stats = { scanned, matched: emails.length, saved, remaining };
    return { status: "ok", saved, scanned, remaining };
  } catch (err) {
    console.error("Mail sync failed:", logText(err));
    next.last_error = mailErrorText(err);
    return { status: "error", error: next.last_error };
  } finally {
    await writeMailState(next);
  }
}

async function readMailbox(config: MailConfig, cursors: Record<string, FolderCursor>, match: LeadMatcher) {
  const client = new ImapFlow({
    host: config.host,
    port: config.port,
    // TLS from the start on 993; on any other port the connection must upgrade with STARTTLS or fail.
    secure: config.port === 993,
    doSTARTTLS: config.port === 993 ? undefined : true,
    auth: { user: config.user, pass: config.password },
    logger: false,
    disableAutoIdle: true,
    connectionTimeout: TIMEOUT_MS,
    greetingTimeout: TIMEOUT_MS,
    socketTimeout: TIMEOUT_MS,
  });
  // Without a listener, a socket error emitted between commands would crash the server process.
  client.on("error", (err) => console.error("IMAP:", logText(err)));
  await client.connect();
  try {
    const sent = await sentFolder(client, config.sentFolder);
    const reads: FolderRead[] = [];
    for (const [path, direction] of [["INBOX", "in"], [sent, "out"]] as const) {
      reads.push(await readFolder(client, path, direction, cursors[path], match));
    }
    return reads;
  } finally {
    await client.logout().catch(() => client.close());
  }
}

async function sentFolder(client: ImapFlow, configured: string | null): Promise<string> {
  const folders = await client.list();
  const byName = (name: string) =>
    folders.find((f) => f.path === name) ?? folders.find((f) => f.path.toLowerCase() === name.toLowerCase() || f.name.toLowerCase() === name.toLowerCase());
  if (configured) {
    const found = byName(configured);
    if (!found) throw new MailStepError(`Priečinok „${configured}“ z IMAP_SENT_FOLDER v schránke nie je. Opravte názov alebo riadok zmažte.`);
    return found.path;
  }
  const found = folders.find((f) => f.specialUse === "\\Sent") ?? SENT_NAMES.map(byName).find(Boolean);
  if (!found) throw new MailStepError("Priečinok s odoslanou poštou sa nenašiel. Doplňte IMAP_SENT_FOLDER (napr. Sent alebo INBOX.Sent).");
  return found.path;
}

const addresses = (list?: MessageAddressObject[]) => uniqueAddresses((list ?? []).map((a) => a.address ?? ""));
const parsedAddresses = (field?: AddressObject | AddressObject[]) =>
  uniqueAddresses([field ?? []].flat().flatMap((o) => o.value.map((a) => a.address ?? "")));

function sentAt(msg: FetchMessageObject): string {
  for (const value of [msg.envelope?.date, msg.internalDate]) {
    const time = value ? new Date(value).getTime() : NaN;
    // A date far in the future comes from a wrong clock; the server's arrival time is better then.
    if (Number.isFinite(time) && time < Date.now() + 864e5) return new Date(time).toISOString();
  }
  return new Date().toISOString();
}

async function readFolder(
  client: ImapFlow,
  path: string,
  defaultDirection: "in" | "out",
  cursor: FolderCursor | undefined,
  match: LeadMatcher,
): Promise<FolderRead> {
  const lock = await client.getMailboxLock(path, { readOnly: true });
  try {
    const box = client.mailbox;
    if (!box) throw new MailStepError(`Priečinok „${path}“ sa nepodarilo otvoriť.`);
    const uidvalidity = String(box.uidValidity);
    const fresh = !cursor || cursor.uidvalidity !== uidvalidity;
    const found = fresh
      ? await client.search({ since: new Date(Date.now() - SINCE_DAYS * 864e5) }, { uid: true })
      : await client.search({ uid: `${cursor.last_uid + 1}:*` }, { uid: true });
    // "n:*" always includes the newest message, even when its UID is below n.
    const uids = (found || []).filter((uid) => fresh || uid > cursor.last_uid).sort((a, b) => a - b);
    const batch = uids.slice(0, BATCH);
    const lastUid = batch.length ? batch[batch.length - 1] : fresh ? Math.max(0, box.uidNext - 1) : cursor.last_uid;

    // Step 1: envelopes and a few headers. Other commands must wait until the fetch is done.
    const heads: FetchMessageObject[] = [];
    if (batch.length) {
      const query = { uid: true, envelope: true, internalDate: true, size: true, headers: KIND_HEADERS };
      for await (const msg of client.fetch(batch, query, { uid: true })) heads.push(msg);
    }

    // Step 2: the full source, only for messages that belong to a lead (and bounces, whose recipient is inside).
    const emails: NewEmail[] = [];
    for (const msg of heads) {
      const env = msg.envelope ?? {};
      const from = { address: normAddress(env.from?.[0]?.address), name: clean(env.from?.[0]?.name).trim() || null };
      const direction = defaultDirection === "in" && from.address === ownAddress() ? "out" : defaultDirection;
      const headers = headerLines(msg.headers);
      if (direction === "in" && isListMail(headers)) continue;
      let subject = clean(env.subject).trim().slice(0, 500) || null;
      const replyTo = addresses(env.replyTo);
      let kind = mailKind({ direction, from: from.address, replyTo, subject: subject ?? "", headers });
      const to = addresses(env.to);
      const cc = addresses(env.cc);
      let leadIds = kind === "bounce" ? [] : match(direction === "in" ? [from.address, ...replyTo] : [...to, ...cc]);
      if (kind !== "bounce" && !leadIds.length) continue;

      let text = "";
      let failed = kind === "bounce" ? uniqueAddresses((headers.get("x-failed-recipients") ?? "").split(/[,\s]+/)) : [];
      let returnedSubject: string | null = null;
      if ((msg.size ?? 0) <= MAX_SOURCE) {
        const full = await client.fetchOne(String(msg.uid), { source: true }, { uid: true });
        if (full && full.source) {
          const parsed = await simpleParser(full.source, { skipImageLinks: true, skipTextLinks: true, skipTextToHtml: true });
          text = stripQuoted(parsed.text ?? "");
          // The parser also decodes headers written in raw 8-bit, which the envelope leaves garbled.
          subject = clean(parsed.subject).trim().slice(0, 500) || subject;
          from.name = clean(parsed.from?.value[0]?.name).trim() || from.name;
          if (kind === "normal") kind = mailKind({ direction, from: from.address, replyTo, subject: subject ?? "", headers });
          if (kind === "bounce") {
            const returned = await returnedMessage(parsed.attachments);
            const report = deliveryReport([parsed.text ?? "", ...returned.reports]);
            failed = uniqueAddresses([...failed, ...report.failed]);
            // A delay warning or a success notice reports no failed recipient: it matches no lead and is not stored.
            if (!failed.length && !report.reported) failed = returned.to;
            returnedSubject = returned.subject;
          }
        }
      }
      if (kind === "bounce") leadIds = match(failed);

      const messageId = clean(env.messageId).trim().slice(0, 500) || `${path}:${uidvalidity}:${msg.uid}`;
      for (const lead_id of leadIds) {
        emails.push({
          lead_id,
          message_id: messageId,
          folder: path,
          direction,
          kind,
          from_email: from.address || null,
          from_name: from.name?.slice(0, 200) ?? null,
          // For a bounce: this lead's recipients that failed and the subject of the returned e-mail.
          to_emails: kind === "bounce" ? failed.filter((a) => match([a]).includes(lead_id)) : to,
          cc_emails: cc,
          subject: kind === "bounce" ? (returnedSubject ?? subject) : subject,
          snippet: snippetOf(text),
          body: capBody(text),
          sent_at: sentAt(msg),
          in_reply_to: clean(env.inReplyTo).trim().slice(0, 500) || null,
        });
      }
    }
    return { path, emails, cursor: { uidvalidity, last_uid: lastUid }, scanned: batch.length, remaining: uids.length - batch.length };
  } finally {
    lock.release();
  }
}

/** The delivery-status parts and the returned original (its To and Subject) attached to a bounce. */
async function returnedMessage(attachments: { contentType: string; content: Buffer }[]) {
  const result = { reports: [] as string[], to: [] as string[], subject: null as string | null };
  for (const a of attachments) {
    if (/^message\/(global-)?delivery-status$/i.test(a.contentType)) result.reports.push(a.content.toString());
    if (/^(message\/rfc822|message\/global|text\/rfc822-headers|message\/global-headers)$/i.test(a.contentType)) {
      const original = await simpleParser(a.content, { skipImageLinks: true, skipTextLinks: true, skipTextToHtml: true });
      result.to.push(...parsedAddresses(original.to));
      result.subject ??= clean(original.subject).trim().slice(0, 500) || null;
    }
  }
  return result;
}
