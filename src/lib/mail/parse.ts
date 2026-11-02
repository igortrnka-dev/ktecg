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

/** Subject starts of out-of-office replies (accents folded), EN/DE/FR/SV/NO/DA/FI/SK/CS/PL/IT/NL/ES. */
const OUT_OF_OFFICE = [
  "automatic reply", "auto reply", "auto-reply", "autoreply", "auto response", "auto-response", "autoresponse",
  "out of office", "out of the office",
  "automatische antwort", "abwesenheitsnotiz", "abwesenheit", "nicht im buro",
  "reponse automatique", "absence du bureau", "absent du bureau",
  "autosvar", "automatiskt svar", "automatisk svar", "franvaro", "fraværsmelding", "ikke pa kontoret",
  "automaattinen vastaus", "poissa toimistolta",
  "automaticka odpoved", "mimo kancelarie", "mimo kancelar", "nepritomnost",
  "odpowiedz automatyczna", "automatyczna odpowiedz", "poza biurem", "nieobecnosc",
  "risposta automatica", "fuori ufficio", "fuori sede",
  "automatisch antwoord", "afwezig", "respuesta automatica", "fuera de la oficina",
];
/** "Re:", "AW:", "SV:", "Odp:" … before the subject. */
const REPLY_PREFIX = /^((re|aw|sv|vs|odp|antw|rif|r|fw|fwd|wg|tr)\s*:\s*)+/;

export function isOutOfOffice(subject: string): boolean {
  const s = fold(subject).trim().replace(REPLY_PREFIX, "");
  return OUT_OF_OFFICE.some((phrase) => s.startsWith(phrase));
}

/**
 * bounce: a delivery report (from mailer-daemon/postmaster, or multipart/report with report-type delivery-status);
 * auto_reply: Auto-Submitted other than "no", X-Autoreply, X-Autorespond, Precedence auto_reply/bulk/junk, a read
 * receipt, or an out-of-office subject.
 */
export function mailKind(m: { direction: "in" | "out"; from: string; subject: string; headers: Map<string, string> }): MailKind {
  const type = m.headers.get("content-type") ?? "";
  const report = /multipart\/report/i.test(type);
  if (m.direction === "in" && (/^(mailer-daemon|postmaster)@/i.test(m.from) || (report && /report-type\s*=\s*"?delivery-status/i.test(type)))) {
    return "bounce";
  }
  const auto = m.headers.get("auto-submitted");
  if (
    (auto !== undefined && !/^no\b/i.test(auto)) ||
    m.headers.has("x-autoreply") ||
    m.headers.has("x-autorespond") ||
    /^(auto_reply|bulk|junk)$/i.test(m.headers.get("precedence") ?? "") ||
    (report && /report-type\s*=\s*"?disposition-notification/i.test(type)) ||
    isOutOfOffice(m.subject)
  ) {
    return "auto_reply";
  }
  return "normal";
}

/** Final-Recipient and Original-Recipient of a delivery report, plus an X-Failed-Recipients header. */
export function failedRecipients(report: string, xFailed?: string): string[] {
  const found = [...report.matchAll(/^\s*(?:final|original)-recipient\s*:\s*(?:rfc822\s*;)?\s*<?([^\s<>;]+@[^\s<>;]+?)>?\s*$/gim)].map((m) => m[1]);
  return uniqueAddresses([...found, ...(xFailed ?? "").split(/[,\s]+/)]);
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
const ORIGINAL =
  /^\s*-{2,}\s*(original message|ursprüngliche nachricht|originalnachricht|message d['’]origine|ursprungligt meddelande|opprinnelig melding|oprindelig meddelelse|alkuperäinen viesti|pôvodná správa|původní zpráva|oryginalna wiadomość|wiadomość oryginalna|messaggio originale|oorspronkelijk bericht)\s*-{2,}/i;
/** Outlook puts the quoted message under a "From: / Sent: / To: / Subject:" block. */
const QUOTE_FROM = /^\s*\*?(from|von|de|från|fra|lähettäjä|od|da|van)\s*\*?\s*:/i;
const QUOTE_NEXT =
  /^\s*\*?(sent|date|gesendet|datum|envoyé|skickat|sendt|lähetetty|odoslané|odesláno|wysłano|data|inviato|verzonden|to|an|à|till|til|vastaanottaja|komu|do|aan|subject|betreff|objet|ämne|emne|aihe|predmet|předmět|temat|oggetto|onderwerp)\s*\*?\s*:/i;

/** The new text of an e-mail: the quoted history (attribution line, Outlook header block, "> " lines) removed. */
export function stripQuoted(text: string): string {
  const lines = clean(text).replace(/\r\n?/g, "\n").split("\n");
  let end = lines.length;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (ORIGINAL.test(line) || (QUOTE_FROM.test(line) && lines.slice(i + 1, i + 4).some((l) => QUOTE_NEXT.test(l)))) {
      end = i;
      break;
    }
    if (WROTE.test(line)) {
      end = !ATTRIBUTION_START.test(line) && i > 0 && ATTRIBUTION_START.test(lines[i - 1]) ? i - 1 : i;
      break;
    }
    if (ATTRIBUTION_START.test(line) && WROTE_BEFORE_NAME.test(line) && [line, lines[i + 1] ?? ""].some((l) => /:\s*$/.test(l))) {
      end = i;
      break;
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
