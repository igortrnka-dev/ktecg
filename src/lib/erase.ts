import { db } from "@/lib/supabase/admin";

/*
 * Personal data deleteLead removes besides the lead row, its history and its recorded e-mails: website inquiries
 * sent from the contacts' addresses, and the contacts' e-mails, names, phone numbers and LinkedIn profiles in the
 * prospecting run logs and in other leads' recorded e-mails.
 */

type Contact = { name?: string | null; role?: string | null; email?: string | null; phone?: string | null; linkedin?: string | null };

export const REDACTED = "[vymazané]";

/** Lowercase without accents, so "Directeur Général" and "Vedúci výroby" meet the word lists either way. */
const fold = (w: string) => w.toLowerCase().normalize("NFD").replace(/\p{M}/gu, "");

/** Words of a job title or department: a "name" made only of these is a role ("Plant Manager"), not a person. */
const ROLE_WORDS = new Set(
  (
    "manager management managing director head chief lead team department dept office hr human resources " +
    "sales purchasing procurement operations plant production maintenance engineering recruiting recruitment " +
    "contact info support abteilung personal personalabteilung leitung leiter leiterin einkauf vertrieb " +
    "produktion werk kontakt geschäftsführer geschäftsführerin geschäftsführung betrieb technik " +
    "directeur directrice general generale responsable achats service ressources humaines " +
    "kierownik kierowniczka dyrektor dyrektorka dział działu zakupów produkcji kadr " +
    "chef vd inköp personalavdelning " +
    "oddelenie oddelenia vedúci vedúca riaditeľ riaditeľka nákup nákupu výroba výroby personálne personálneho ľudských zdrojov " +
    "project projekt projektu quality qualität logistics logistik site technical rh recrutement zakładu ansprechpartner ansprechpartnerin"
  ).split(" ").map((w) => fold(w)),
);
/** Joining words inside a title ("Head of Production", "Leiter für Einkauf", "vedúci pre nákup"). */
const CONNECTORS = new Set("of and & for the der die des für de du la le pre a i och".split(" ").map((w) => fold(w)));
/** Compound titles ("Produktionsleiter", "Einkaufsabteilung", "inköpschef"). */
const ROLE_SUFFIX = /(leiter|leiterin|leitung|abteilung|manager|managerin|direktor|direktorin|chef|chefin)$/;
const isRoleWord = (w: string) => ROLE_WORDS.has(fold(w)) || CONNECTORS.has(fold(w)) || ROLE_SUFFIX.test(fold(w));

const digitsOf = (s: string) => s.replace(/\D/g, "");
/**
 * A phone number as its digits, with "+" for an international number and without its trunk "(0)":
 * "+49 (0) 375 555-0140" and "0049 375 5550140" → "+493755550140"; "0375 5550140" and "(0)375 5550140" → "03755550140".
 */
const phoneDigits = (phone: string) => {
  // From the first digit or "+": a label ("Tel."), a bracket ("(+49)") or the invisible marks of a copied number come off.
  const p = phone.normalize("NFKC").replace(/^[^\d+]+/, "");
  // "(0)" after 1–3 digits follows a country code written without "+" ("49 (0) 375 …").
  const international = /^(\+|00)/.test(p) || /^\d{1,3}\s*\(\s*0\s*\)/.test(p);
  return international ? `+${digitsOf(p.replace(/\(\s*0\s*\)/g, "")).replace(/^00/, "")}` : digitsOf(p);
};
/** "https://www.linkedin.com/in/thomas-weidner-123/" → "thomas-weidner-123". */
const linkedinSlug = (url: string) => url.match(/linkedin\.com\/in\/([^/?#\s]+)/i)?.[1]?.toLowerCase() ?? "";

/**
 * The contacts' e-mail addresses (lowercased), full names (two words or more, and not a job title: a lone first
 * name or a role would also hit unrelated text), phone numbers (see phoneDigits, 7 digits or more) and LinkedIn
 * profile slugs.
 */
export function erasureTerms(contacts: Contact[] | null) {
  const list = contacts ?? [];
  const emails = list.map((c) => String(c.email ?? "").trim().toLowerCase()).filter((e) => e.includes("@"));
  const names = list
    .filter((c) => {
      const name = String(c.name ?? "").trim();
      const words = name.toLowerCase().split(/\s+/);
      return words.length >= 2 && !words.every(isRoleWord) && name.toLowerCase() !== String(c.role ?? "").trim().toLowerCase();
    })
    .map((c) => String(c.name).trim());
  const phones = list.map((c) => phoneDigits(String(c.phone ?? ""))).filter((p) => digitsOf(p).length >= 7);
  const profiles = list.map((c) => linkedinSlug(String(c.linkedin ?? ""))).filter(Boolean);
  const unique = (a: string[]) => [...new Set(a)];
  return { emails: unique(emails), names: unique(names), phones: unique(phones), profiles: unique(profiles) };
}

/** A LIKE pattern that matches `s` literally. */
const likeLiteral = (s: string) => s.replace(/[\\%_]/g, "\\$&");
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function rows<T>(result: { data: T[] | null; error: { message: string } | null }): T[] {
  if (result.error) throw new Error(result.error.message);
  return result.data ?? [];
}

/**
 * Website inquiries linked to the lead, or sent from one of its contacts' addresses (in any letter case) and
 * not linked to another lead: those belong to that lead and go only with it.
 */
export async function leadInquiryIds(leadId: string, contacts: Contact[] | null): Promise<string[]> {
  const ids = new Set(rows<{ id: string }>(await db().from("inquiries").select("id").eq("lead_id", leadId)).map((r) => r.id));
  for (const email of erasureTerms(contacts).emails) {
    // ILIKE finds every letter case; the exact comparison drops anything a wildcard (PostgREST reads * as %) let in.
    const found = rows<{ id: string; email: string; lead_id: string | null }>(
      await db().from("inquiries").select("id, email, lead_id").ilike("email", likeLiteral(email)),
    );
    for (const r of found) {
      if (String(r.email).trim().toLowerCase() === email && (r.lead_id == null || r.lead_id === leadId)) ids.add(r.id);
    }
  }
  return [...ids];
}

/** Other leads that list one of these contacts' e-mail addresses: an erasure request has to cover them too. */
type OtherLead = { id: string; company_name: string; status: string; created_at: string };

export async function otherLeadsWithContacts(leadId: string, contacts: Contact[] | null): Promise<OtherLead[]> {
  const found = new Map<string, OtherLead>();
  for (const email of erasureTerms(contacts).emails) {
    for (const address of new Set([email, ...(contacts ?? []).map((c) => String(c.email ?? "").trim()).filter((e) => e.toLowerCase() === email)])) {
      const list = rows<OtherLead>(
        await db().from("leads").select("id, company_name, status, created_at").contains("contacts", JSON.stringify([{ email: address }])),
      );
      for (const l of list) if (l.id !== leadId) found.set(l.id, l);
    }
  }
  return [...found.values()];
}

/** Separators between the digits of a phone number, including the trunk "(0)" of "+49 (0) 375 …". */
const SEP = "(?:[\\s\\-./()]|\\(0\\))*";
const PREFIX = `(?:\\+|00)${SEP}`;

/**
 * Matches a phone number with the usual separators between its digits ("+49 375 555-0140", "0049 (375) 5550140"),
 * also written the other way: an international number nationally ("0375 5550140", "375 5550140") and a national one with a
 * country code or without its trunk 0. Separators before the number only count after + or 00, so the text around it keeps its spaces;
 * an attached extension ("…0140-12") goes with the number.
 */
function phonePattern(phone: string) {
  const join = (digits: string) => digits.split("").join(SEP);
  const forms: string[] = [];
  if (phone.startsWith("+")) {
    const digits = phone.slice(1);
    forms.push(`(?:${PREFIX})?${join(digits)}`);
    // The country code is 1–3 digits; the national form puts the trunk 0 in its place, or nothing ("(212) 555-0140").
    for (const k of [1, 2, 3]) {
      if (digits.length - k >= 6) forms.push(join(`0${digits.slice(k)}`));
      if (digits.length - k >= 9) forms.push(join(digits.slice(k)));
    }
  } else if (/^0[1-9]/.test(phone)) {
    forms.push(join(phone), `${PREFIX}\\d{1,3}${SEP}${join(phone.slice(1))}`);
    // Without the trunk 0 ("664 1234567"), as the international form reads with its country code left out.
    if (phone.length - 1 >= 9) forms.push(join(phone.slice(1)));
  } else {
    forms.push(`(?:${PREFIX})?${join(phone)}`);
  }
  return new RegExp(`(?<!\\d)(?:${forms.join("|")})(?:[\\-./]\\d{1,5})?(?!\\d)`, "g");
}

const PAGE = 500;

type Page<T> = (from: number, to: number) => PromiseLike<{ data: T[] | null; error: { message: string } | null }>;

/** Every row a query finds, page by page: a phone search matches many rows, and PostgREST returns at most 1000 per request. */
async function allPages<T>(query: Page<T>): Promise<T[]> {
  const found: T[] = [];
  for (let from = 0; ; from += PAGE) {
    const page = rows(await query(from, from + PAGE - 1));
    found.push(...page);
    if (page.length < PAGE) return found;
  }
}

/** Regexes that find the contacts' e-mails, names, phone numbers and LinkedIn profiles in text, and LIKE terms that find the rows to run them on. */
function redaction(contacts: Contact[] | null) {
  const { emails, names, phones, profiles } = erasureTerms(contacts);
  const words = names.map((n) => n.split(/\s+/));
  const patterns = [
    // Address boundaries: "m.kroll@x" leaves "tom.kroll@x" and "…@x.cz" alone; a sentence-final period still matches.
    ...emails.map((e) => new RegExp(`(?<![A-Za-z0-9._%+'\\-])${escapeRe(e)}(?![A-Za-z0-9\\-]|\\.[A-Za-z0-9])`, "gi")),
    // Whole words only, so "Jan Novák" leaves "Jan Nováková" alone.
    ...words.map((w) => new RegExp(`(?<![\\p{L}\\p{N}])${w.map(escapeRe).join("\\s+")}(?![\\p{L}\\p{N}])`, "gu")),
    ...phones.map(phonePattern),
    ...profiles.map((s) => new RegExp(`(?:https?:\\/\\/)?(?:[a-z]{2,3}\\.)?linkedin\\.com\\/in\\/${escapeRe(s)}(?![A-Za-z0-9\\-%])\\/?(?:\\?[^\\s)\\]]*)?`, "gi")),
  ];
  const searches = [
    ...emails.map(likeLiteral),
    ...words.map((w) => w.map(likeLiteral).join("%")),
    // The last seven digits in order, with anything between them ("555 01 40"); the regex then checks the whole number.
    ...phones.map((p) => digitsOf(p).slice(-7).split("").join("%")),
    ...profiles.map((s) => `/in/${likeLiteral(s)}`),
  ];
  const redact = (text: string) => patterns.reduce((t, re) => t.replace(re, REDACTED), text);
  return { emails, searches, redact };
}

/** Replaces the contacts' e-mails, names, phone numbers and LinkedIn profiles with REDACTED in every run log; returns how many logs changed. */
export async function redactRunLogs(contacts: Contact[] | null): Promise<number> {
  const { searches, redact } = redaction(contacts);
  const logs = new Map<string, string>();
  for (const term of searches) {
    const found = await allPages<{ id: string; log: string | null }>((from, to) =>
      db().from("lead_runs").select("id, log").ilike("log", `%${term}%`).order("id").range(from, to),
    );
    for (const r of found) logs.set(r.id, r.log ?? "");
  }
  let changed = 0;
  for (const [id, log] of logs) {
    const redacted = redact(log);
    if (redacted === log) continue;
    const { error } = await db().from("lead_runs").update({ log: redacted }).eq("id", id);
    if (error) throw new Error(error.message);
    changed++;
  }
  return changed;
}

type MailRow = {
  id: string; from_email: string | null; from_name: string | null; to_emails: string[]; cc_emails: string[];
  subject: string | null; snippet: string | null; body: string | null;
};
const MAIL_COLUMNS = "id, from_email, from_name, to_emails, cc_emails, subject, snippet, body";

/** PostgREST's answer while a table does not exist yet (a migration not run): nothing is stored there. */
const missingTable = (error: { code?: string } | null) => error?.code === "PGRST205" || error?.code === "42P01";

type Redaction = ReturnType<typeof redaction>;

/**
 * The contacts' data in other leads' recorded e-mails (one sent to both companies, a bounce for both) and in those
 * leads' e-mail history lines, replaced with REDACTED; returns how many rows changed. The lead's own e-mails and
 * history are deleted with it.
 */
export async function redactOtherMail(leadId: string, contacts: Contact[] | null): Promise<number> {
  const terms = redaction(contacts);
  if (!terms.searches.length) return 0;
  return (await redactMailRows(leadId, terms)) + (await redactMailEvents(leadId, terms));
}

async function redactMailRows(leadId: string, { emails, searches, redact }: Redaction): Promise<number> {
  const probe = await db().from("lead_emails").select("id").limit(1);
  if (missingTable(probe.error)) return 0;
  rows(probe);
  const mail = () => db().from("lead_emails").select(MAIL_COLUMNS).neq("lead_id", leadId).order("id");
  const lists = await Promise.all([
    ...emails.flatMap((e) => [
      allPages<MailRow>((from, to) => mail().eq("from_email", e).range(from, to)),
      allPages<MailRow>((from, to) => mail().contains("to_emails", [e]).range(from, to)),
      allPages<MailRow>((from, to) => mail().contains("cc_emails", [e]).range(from, to)),
    ]),
    ...searches.flatMap((term) =>
      ["from_name", "subject", "snippet", "body"].map((col) => allPages<MailRow>((from, to) => mail().ilike(col, `%${term}%`).range(from, to))),
    ),
  ]);
  const found = new Map(lists.flat().map((r) => [r.id, r]));
  const address = (a: string) => (emails.includes(a.toLowerCase()) ? REDACTED : a);
  const text = (t: string | null) => (t == null ? t : redact(t));
  let changed = 0;
  for (const r of found.values()) {
    const patch = {
      from_email: r.from_email == null ? null : address(r.from_email),
      from_name: text(r.from_name),
      to_emails: r.to_emails.map(address),
      cc_emails: r.cc_emails.map(address),
      subject: text(r.subject),
      snippet: text(r.snippet),
      body: text(r.body),
    };
    if (Object.entries(patch).every(([k, v]) => JSON.stringify(v) === JSON.stringify(r[k as keyof MailRow]))) continue;
    const { error } = await db().from("lead_emails").update(patch).eq("id", r.id);
    if (error) throw new Error(error.message);
    changed++;
  }
  return changed;
}

async function redactMailEvents(leadId: string, { searches, redact }: Redaction): Promise<number> {
  const events = new Map<string, string>();
  for (const term of searches) {
    const found = await allPages<{ id: string; body: string | null }>((from, to) =>
      db().from("lead_events").select("id, body").eq("type", "email").neq("lead_id", leadId).ilike("body", `%${term}%`).order("id").range(from, to),
    );
    for (const e of found) events.set(e.id, e.body ?? "");
  }
  let changed = 0;
  for (const [id, body] of events) {
    const redacted = redact(body);
    if (redacted === body) continue;
    const { error } = await db().from("lead_events").update({ body: redacted }).eq("id", id);
    if (error) throw new Error(error.message);
    changed++;
  }
  return changed;
}
