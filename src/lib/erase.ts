import { db } from "@/lib/supabase/admin";

/*
 * Personal data deleteLead removes besides the lead row and its history: website inquiries sent from the
 * contacts' addresses, and the contacts' e-mails, names, phone numbers and LinkedIn profiles in the prospecting
 * run logs.
 */

type Contact = { name?: string | null; role?: string | null; email?: string | null; phone?: string | null; linkedin?: string | null };

export const REDACTED = "[vymazané]";

/** Words of a job title or department: a "name" made only of these is a role ("Plant Manager"), not a person. */
const ROLE_WORDS = new Set(
  (
    "manager management managing director head chief lead team department dept office hr human resources " +
    "sales purchasing procurement operations plant production maintenance engineering recruiting recruitment " +
    "contact info support general abteilung personal personalabteilung leitung leiter leiterin einkauf vertrieb " +
    "produktion werk kontakt geschäftsführer geschäftsführerin geschäftsführung betrieb technik " +
    "directeur directrice responsable achats service ressources humaines " +
    "kierownik kierowniczka dyrektor dyrektorka dział działu zakupów produkcji kadr " +
    "chef vd inköp personalavdelning " +
    "oddelenie oddelenia vedúci vedúca riaditeľ riaditeľka nákup nákupu výroba výroby personálne personálneho ľudských zdrojov"
  ).split(" "),
);
/** Joining words inside a title ("Head of Production", "Leiter für Einkauf", "vedúci pre nákup"). */
const CONNECTORS = new Set("of and & for the der die des für fur de du la le pre a i och".split(" "));
/** Compound titles ("Produktionsleiter", "Einkaufsabteilung", "inköpschef"). */
const ROLE_SUFFIX = /(leiter|leiterin|leitung|abteilung|manager|managerin|direktor|direktorin|chef|chefin)$/;
const isRoleWord = (w: string) => ROLE_WORDS.has(w) || CONNECTORS.has(w) || ROLE_SUFFIX.test(w);

const digitsOf = (s: string) => s.replace(/\D/g, "");
/**
 * A phone number as its digits, without the trunk "(0)" and with "+" for an international number:
 * "+49 (0) 375 555-0140" and "0049 375 5550140" → "+493755550140", "0375 5550140" → "03755550140".
 */
const phoneDigits = (phone: string) => {
  const p = phone.replace(/\(\s*0\s*\)/g, "").trim();
  return /^(\+|00)/.test(p) ? `+${digitsOf(p).replace(/^00/, "")}` : digitsOf(p);
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
 * country code. Separators before the number only count after + or 00, so the text around it keeps its spaces;
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
  } else {
    forms.push(`(?:${PREFIX})?${join(phone)}`);
  }
  return new RegExp(`(?<!\\d)(?:${forms.join("|")})(?:[\\-./]\\d{1,5})?(?!\\d)`, "g");
}

/** Replaces the contacts' e-mails, names, phone numbers and LinkedIn profiles with REDACTED in every run log; returns how many logs changed. */
export async function redactRunLogs(contacts: Contact[] | null): Promise<number> {
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
  const logs = new Map<string, string>();
  for (const term of searches) {
    for (const r of rows<{ id: string; log: string | null }>(await db().from("lead_runs").select("id, log").ilike("log", `%${term}%`))) {
      logs.set(r.id, r.log ?? "");
    }
  }
  let changed = 0;
  for (const [id, log] of logs) {
    const redacted = patterns.reduce((text, re) => text.replace(re, REDACTED), log);
    if (redacted === log) continue;
    const { error } = await db().from("lead_runs").update({ log: redacted }).eq("id", id);
    if (error) throw new Error(error.message);
    changed++;
  }
  return changed;
}
