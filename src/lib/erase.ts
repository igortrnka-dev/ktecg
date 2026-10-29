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
    "produktion werk kontakt geschäftsführer geschäftsführung oddelenie vedúci riaditeľ nákup výroba personálne"
  ).split(" "),
);

const digitsOf = (s: string) => s.replace(/\D/g, "");
/** "https://www.linkedin.com/in/thomas-weidner-123/" → "thomas-weidner-123". */
const linkedinSlug = (url: string) => url.match(/linkedin\.com\/in\/([^/?#\s]+)/i)?.[1]?.toLowerCase() ?? "";

/**
 * The contacts' e-mail addresses (lowercased), full names (two words or more, and not a job title: a lone first
 * name or a role would also hit unrelated text), phone numbers (as digits, 7 or more) and LinkedIn profile slugs.
 */
export function erasureTerms(contacts: Contact[] | null) {
  const list = contacts ?? [];
  const emails = list.map((c) => String(c.email ?? "").trim().toLowerCase()).filter((e) => e.includes("@"));
  const names = list
    .filter((c) => {
      const name = String(c.name ?? "").trim();
      const words = name.toLowerCase().split(/\s+/);
      return words.length >= 2 && !words.every((w) => ROLE_WORDS.has(w)) && name.toLowerCase() !== String(c.role ?? "").trim().toLowerCase();
    })
    .map((c) => String(c.name).trim());
  const phones = list.map((c) => digitsOf(String(c.phone ?? ""))).filter((d) => d.length >= 7);
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
export async function otherLeadsWithContacts(leadId: string, contacts: Contact[] | null): Promise<{ id: string; company_name: string }[]> {
  const found = new Map<string, string>();
  for (const email of erasureTerms(contacts).emails) {
    for (const address of new Set([email, ...(contacts ?? []).map((c) => String(c.email ?? "").trim()).filter((e) => e.toLowerCase() === email)])) {
      const list = rows<{ id: string; company_name: string }>(
        await db().from("leads").select("id, company_name").contains("contacts", JSON.stringify([{ email: address }])),
      );
      for (const l of list) if (l.id !== leadId) found.set(l.id, l.company_name);
    }
  }
  return [...found].map(([id, company_name]) => ({ id, company_name }));
}

/** Matches the digits of a phone number with the usual separators between them ("+49 375 555-0140", "0049 (375) 5550140"). */
function phonePattern(digits: string) {
  const sep = "[\\s\\-./()]*";
  // The same number written with 00 instead of + or the other way round.
  const core = digits.replace(/^00/, "");
  return new RegExp(`(?<![\\d])(?:\\+|00)?${sep}${core.split("").join(sep)}(?![\\d])`, "g");
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
    // The last four digits are written together in nearly every format; the regex then checks the whole number.
    ...phones.map((d) => d.slice(-4)),
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
