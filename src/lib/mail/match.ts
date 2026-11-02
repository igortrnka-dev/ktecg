import { db } from "../supabase/admin";
import { companyDomain } from "../inquiries";
import { ownDomain } from "./config";
import { MailDbError } from "./errors";
import { normAddress } from "./parse";

type LeadRef = { id: string; domain: string | null; contacts: { email?: string | null }[] | null };

/** The ids of the leads that a message to or from these addresses belongs to. */
export type LeadMatcher = (addresses: string[]) => string[];

/** PostgREST returns at most 1000 rows per request. */
const PAGE = 1000;

/**
 * Matches an address to leads: first the leads that list it among their contacts, else the lead whose domain is the
 * address's company domain or a parent of it (mail.firma.de → firma.de). Free-mail addresses only match exactly, and
 * KTechnology's own addresses never match.
 */
export async function leadMatcher(): Promise<LeadMatcher> {
  const byEmail = new Map<string, Set<string>>();
  const byDomain = new Map<string, string>();
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await db().from("leads").select("id, domain, contacts").order("id").range(from, from + PAGE - 1);
    if (error) throw new MailDbError(error.message);
    for (const lead of (data ?? []) as LeadRef[]) {
      if (lead.domain) byDomain.set(lead.domain.toLowerCase(), lead.id);
      for (const c of lead.contacts ?? []) {
        const email = normAddress(c.email);
        if (email.includes("@")) byEmail.set(email, (byEmail.get(email) ?? new Set()).add(lead.id));
      }
    }
    if ((data ?? []).length < PAGE) break;
  }

  const own = ownDomain();
  const isOwn = (domain: string) => Boolean(own && (domain === own || domain.endsWith(`.${own}`)));

  return (addresses) => {
    const found = new Set<string>();
    for (const raw of addresses) {
      const address = normAddress(raw);
      if (!address.includes("@") || isOwn(address.split("@").pop()!)) continue;
      const exact = byEmail.get(address);
      if (exact) {
        exact.forEach((id) => found.add(id));
        continue;
      }
      const domain = companyDomain(address);
      if (!domain || isOwn(domain)) continue;
      const labels = domain.split(".");
      for (let i = 0; i <= labels.length - 2; i++) {
        const id = byDomain.get(labels.slice(i).join("."));
        if (id) {
          found.add(id);
          break;
        }
      }
    }
    return [...found];
  };
}
