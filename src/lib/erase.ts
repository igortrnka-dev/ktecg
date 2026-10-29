import { db } from "@/lib/supabase/admin";

/*
 * Personal data deleteLead removes besides the lead row and its history: website inquiries sent from the
 * contacts' addresses, and the contacts' e-mails and full names in the prospecting run logs.
 */

type Contact = { name?: string | null; email?: string | null };

export const REDACTED = "[vymazané]";

/** The contacts' e-mail addresses (lowercased) and full names (two words or more: a lone first name would also hit unrelated text). */
export function erasureTerms(contacts: Contact[] | null): { emails: string[]; names: string[] } {
  const list = contacts ?? [];
  const emails = list.map((c) => String(c.email ?? "").trim().toLowerCase()).filter((e) => e.includes("@"));
  const names = list.map((c) => String(c.name ?? "").trim()).filter((n) => n.split(/\s+/).length >= 2);
  return { emails: [...new Set(emails)], names: [...new Set(names)] };
}

/** A LIKE pattern that matches `s` literally. */
const likeLiteral = (s: string) => s.replace(/[\\%_]/g, "\\$&");
const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function rows<T>(result: { data: T[] | null; error: { message: string } | null }): T[] {
  if (result.error) throw new Error(result.error.message);
  return result.data ?? [];
}

/** Website inquiries linked to the lead or sent from one of its contacts' addresses (in any letter case). */
export async function leadInquiryIds(leadId: string, contacts: Contact[] | null): Promise<string[]> {
  const ids = new Set(rows<{ id: string }>(await db().from("inquiries").select("id").eq("lead_id", leadId)).map((r) => r.id));
  for (const email of erasureTerms(contacts).emails) {
    // ILIKE finds every letter case; the exact comparison drops anything a wildcard (PostgREST reads * as %) let in.
    const found = rows<{ id: string; email: string }>(await db().from("inquiries").select("id, email").ilike("email", likeLiteral(email)));
    for (const r of found) if (String(r.email).trim().toLowerCase() === email) ids.add(r.id);
  }
  return [...ids];
}

/** Replaces the contacts' e-mails (any letter case) and full names (exact words) with REDACTED in every run log; returns how many logs changed. */
export async function redactRunLogs(contacts: Contact[] | null): Promise<number> {
  const { emails, names } = erasureTerms(contacts);
  const words = names.map((n) => n.split(/\s+/));
  const patterns = [
    ...emails.map((e) => new RegExp(escapeRe(e), "gi")),
    // Whole words only, so "Jan Novák" leaves "Jan Nováková" alone.
    ...words.map((w) => new RegExp(`(?<![\\p{L}\\p{N}])${w.map(escapeRe).join("\\s+")}(?![\\p{L}\\p{N}])`, "gu")),
  ];
  const searches = [...emails.map(likeLiteral), ...words.map((w) => w.map(likeLiteral).join("%"))];
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
