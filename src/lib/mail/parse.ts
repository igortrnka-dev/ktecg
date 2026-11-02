/*
 * Pure helpers of the mail sync: header lines, the kind of a message (normal, auto-reply, bounce), the failed
 * recipients of a bounce, and the new text of a reply without the quoted history.
 */

export type MailKind = "normal" | "auto_reply" | "bounce";

const SNIPPET = 300;
const BODY = 20_000;

/** Postgres text cannot hold NUL characters. */
export const clean = (s: string | null | undefined) => (s ?? "").replace(/\u0000/g, "");

/** "<T.Weidner@Firma.de> " → "t.weidner@firma.de" */
export const normAddress = (s: string | null | undefined) => clean(s).trim().replace(/^<|>$/g, "").toLowerCase();

const isAddress = (s: string) => /^[^\s@<>,;]+@[^\s@<>,;]+\.[^\s@<>,;]+$/.test(s);
/** Valid addresses, normalised, without duplicates. */
export const uniqueAddresses = (list: string[]) => [...new Set(list.map(normAddress).filter(isAddress))];

/** Requested header lines (a Buffer from IMAP FETCH) as lowercase name → unfolded value; the first one wins. */
export function headerLines(raw: Buffer | string | undefined): Map<string, string> {
  const map = new Map<string, string>();
  const text = (raw ?? "").toString().replace(/\r\n?/g, "\n").replace(/\n[ \t]+/g, " ");
  for (const line of text.split("\n")) {
    const colon = line.indexOf(":");
    if (colon <= 0) continue;
    const name = line.slice(0, colon).trim().toLowerCase();
    if (!map.has(name)) map.set(name, line.slice(colon + 1).trim());
  }
  return map;
}

const fold = (s: string) => s.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");

/**
 * Subject starts of out-of-office replies (accents folded), EN/DE/FR/SV/NO/DA/FI/SK/CS/PL/IT/NL/ES. Whole phrases only:
 * words such as "Abwesenheit", "Frånvaro" or "Fuori sede" also start ordinary subjects about staffing.
 */
const OUT_OF_OFFICE = [
  "automatic reply", "auto reply", "auto-reply", "autoreply", "auto response", "auto-response", "autoresponse",
  "out of office", "out of the office",
  "automatische antwort", "abwesenheitsnotiz", "nicht im buro",
  "reponse automatique", "absence du bureau", "absent du bureau",
  "autosvar", "automatiskt svar", "automatisk svar", "franvaromeddelande", "fraværsmelding", "ikke pa kontoret",
  "automaattinen vastaus", "poissa toimistolta",
  "automaticka odpoved", "mimo kancelarie", "mimo kancelar", "nepritomnost v kancelari",
  "odpowiedz automatyczna", "automatyczna odpowiedz", "poza biurem", "nieobecnosc w biurze",
  "risposta automatica", "fuori ufficio",
  "automatisch antwoord", "afwezigheidsbericht", "respuesta automatica", "fuera de la oficina",
];

/** Auto-replies put the phrase first ("Automatische Antwort: …"); "AW: Automatische Antwort: …" is a person answering. */
export function isOutOfOffice(subject: string): boolean {
  const s = fold(subject).trim();
  return OUT_OF_OFFICE.some((phrase) => s.startsWith(phrase) && !/[\p{L}\p{N}]/u.test(s.charAt(phrase.length)));
}

/** noreply@, no-reply@, donotreply@ … */
const NO_REPLY = /^(no[-_.]?reply|do[-_.]?not[-_.]?reply)\b/i;

/** Newsletters and other list mail: not an answer from the lead, so it is not stored at all. */
export const isListMail = (headers: Map<string, string>) => headers.has("list-id") || headers.has("list-unsubscribe");

/**
 * bounce: a delivery report (from mailer-daemon/postmaster, or multipart/report with report-type delivery-status);
 * auto_reply: Auto-Submitted other than "no", X-Autoreply, X-Autorespond, Precedence auto_reply/bulk/junk, a read
 * receipt, and for incoming mail an out-of-office subject or a noreply sender without a Reply-To of a person.
 */
export function mailKind(m: {
  direction: "in" | "out";
  from: string;
  replyTo?: string[];
  subject: string;
  headers: Map<string, string>;
}): MailKind {
  const type = m.headers.get("content-type") ?? "";
  const report = /multipart\/report/i.test(type);
  const incoming = m.direction === "in";
  if (incoming && (/^(mailer-daemon|postmaster)@/i.test(m.from) || (report && /report-type\s*=\s*"?delivery-status/i.test(type)))) {
    return "bounce";
  }
  const auto = m.headers.get("auto-submitted");
  if (
    (auto !== undefined && !/^no\b/i.test(auto)) ||
    m.headers.has("x-autoreply") ||
    m.headers.has("x-autorespond") ||
    /^(auto_reply|bulk|junk)$/i.test(m.headers.get("precedence") ?? "") ||
    (report && /report-type\s*=\s*"?disposition-notification/i.test(type)) ||
    (incoming && isOutOfOffice(m.subject)) ||
    // A reply sent through a system from noreply@ names the person in Reply-To.
    (incoming && NO_REPLY.test(m.from) && !(m.replyTo ?? []).some((a) => a !== m.from))
  ) {
    return "auto_reply";
  }
  return "normal";
}

const RECIPIENT = /^\s*(?:final|original)-recipient\s*:\s*(?:rfc822\s*;)?\s*<?([^\s<>;]+@[^\s<>;]+?)>?\s*$/gim;

/**
 * The recipients of delivery reports (RFC 3464) whose delivery failed for good: the per-recipient blocks with
 * "Action: failed", or with a 5.x.x Status where the Action is missing. A delay warning or a success notice
 * reports recipients but none that failed.
 */
export function deliveryReport(texts: string[]): { reported: boolean; failed: string[] } {
  let reported = false;
  const failed: string[] = [];
  for (const block of texts.join("\n\n").replace(/\r\n?/g, "\n").split(/\n[ \t]*\n/)) {
    const recipients = [...block.matchAll(RECIPIENT)].map((m) => m[1]);
    if (!recipients.length) continue;
    reported = true;
    const action = block.match(/^\s*action\s*:\s*([a-z]+)/im)?.[1].toLowerCase();
    if (action === "failed" || (!action && /^\s*status\s*:\s*5\./im.test(block))) failed.push(...recipients);
  }
  return { reported, failed: uniqueAddresses(failed) };
}

/** "wrote" in the languages of our customers, as in the attribution line of a quoted reply. */
const WROTE_WORD =
  "(wrote|schrieb|a écrit|skrev|kirjoitti|napísal\\(a\\)|napísal|napísala|napsal\\(a\\)|napsal|napsala|napisał\\(a\\)|napisał|napisała|ha scritto|escribió|schreef)";
/** "… Thomas Weidner <t.weidner@…> wrote:" */
const WROTE = new RegExp(`${WROTE_WORD}\\s*:\\s*$`, "i");
/** "Am 2. Nov. 2026 schrieb Thomas Weidner <" + "t.weidner@…>:": the verb comes before the name. */
const WROTE_BEFORE_NAME = new RegExp(`\\s${WROTE_WORD}\\s`, "i");
/** The start of an attribution: "On Mon, 2 Nov 2026, Thomas Weidner" + "<t.weidner@…> wrote:". */
const ATTRIBUTION_START = /^\s*(on|am|le|den|dňa|dna|dne|w dniu|il|el|op|em)\s/i;
/** "-----Original Message-----", "---------- Forwarded message ---------" and their translations. */
const ORIGINAL =
  /^\s*-{2,}\s*(original message|forwarded message|ursprüngliche nachricht|originalnachricht|weitergeleitete nachricht|message d['’]origine|message transféré|ursprungligt meddelande|vidarebefordrat meddelande|opprinnelig melding|videresendt melding|oprindelig meddelelse|videresendt meddelelse|alkuperäinen viesti|välitetty viesti|pôvodná správa|preposlaná správa|původní zpráva|přeposlaná zpráva|oryginalna wiadomość|wiadomość oryginalna|wiadomość przekazana dalej|messaggio originale|messaggio inoltrato|oorspronkelijk bericht|doorgestuurd bericht)\s*-{2,}/i;
/** Apple Mail's forward. */
const FORWARDED = /^\s*(begin forwarded message|anfang der weitergeleiteten nachricht|début du message réexpédié)\s*:\s*$/i;
/**
 * Outlook puts the quoted message under a "From: … <address> / Sent: / To: / Subject:" block. The address and the
 * Sent and Subject lines tell it from a date range in a request ("Od: 1. 12. 2026" / "Do: 31. 3. 2027").
 */
const QUOTE_FROM = /^\s*\*?(from|von|de|från|fra|lähettäjä|od|da|van)\s*\*?\s*:.*[@<]/i;
const QUOTE_SENT = /^\s*\*?(sent|date|gesendet|datum|dátum|envoyé|skickat|sendt|lähetetty|odoslané|odesláno|wysłano|data|inviato|verzonden|enviado|fecha)\s*\*?\s*:/i;
const QUOTE_SUBJECT = /^\s*\*?(subject|betreff|objet|ämne|emne|aihe|predmet|předmět|temat|oggetto|onderwerp|asunto)\s*\*?\s*:/i;

/** The new text of an e-mail: the quoted history (attribution line, Outlook header block, "> " lines) removed. */
export function stripQuoted(text: string): string {
  const lines = clean(text).replace(/\r\n?/g, "\n").split("\n");
  const headerBlock = (i: number) =>
    QUOTE_FROM.test(lines[i]) && [QUOTE_SENT, QUOTE_SUBJECT].every((re) => lines.slice(i + 1, i + 7).some((l) => re.test(l)));
  // A real attribution names the address or is followed by "> " lines; "Am Montag schrieb ich Ihnen bereits:" is not one.
  const attributed = (from: number, to: number) =>
    lines.slice(from, to + 1).some((l) => /[@<]/.test(l)) || lines.slice(to + 1, to + 4).some((l) => /^\s*>/.test(l));
  let end = lines.length;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (ORIGINAL.test(line) || FORWARDED.test(line) || headerBlock(i)) {
      end = i;
      break;
    }
    if (WROTE.test(line)) {
      const start = !ATTRIBUTION_START.test(line) && i > 0 && ATTRIBUTION_START.test(lines[i - 1]) ? i - 1 : i;
      if (attributed(start, i)) {
        end = start;
        break;
      }
    } else if (ATTRIBUTION_START.test(line) && WROTE_BEFORE_NAME.test(line)) {
      const last = /:\s*$/.test(line) ? i : i + 1;
      if (/:\s*$/.test(lines[last] ?? "") && attributed(i, last)) {
        end = i;
        break;
      }
    }
  }
  const kept = lines.slice(0, end).filter((l) => !/^\s*>/.test(l));
  // Outlook's "____" or "-----" line above the quoted header block.
  while (kept.length && /^\s*([-_=*]{2,}\s*)?$/.test(kept[kept.length - 1])) kept.pop();
  const result = kept.join("\n").replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n").trim();
  // A message that is only a quote (e.g. a bare forward) keeps its text.
  return result || clean(text).trim();
}

export function snippetOf(text: string): string | null {
  const flat = text.replace(/\s+/g, " ").trim();
  if (!flat) return null;
  return flat.length > SNIPPET ? `${flat.slice(0, SNIPPET).trimEnd()}…` : flat;
}

/** Whether the snippet cut the text short, so the full text is worth showing. */
export const longerThanSnippet = (text: string) => text.replace(/\s+/g, " ").trim().length > SNIPPET;

export function capBody(text: string): string | null {
  if (!text.trim()) return null;
  return text.length > BODY ? `${text.slice(0, BODY).trimEnd()}\n…` : text;
}
