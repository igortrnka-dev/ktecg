import { db } from "@/lib/supabase/admin";
import { normalizeDomain } from "@/lib/ai/client";

/** Keys of t.contact.form.shifts on the site form. */
export const SHIFT_PATTERNS = ["unsure", "single", "double", "triple", "rotation"] as const;
export type ShiftPattern = (typeof SHIFT_PATTERNS)[number];

export const shiftLabel: Record<ShiftPattern, string> = {
  unsure: "zatiaľ neviem",
  single: "1 zmena",
  double: "2 zmeny",
  triple: "3 zmeny",
  rotation: "12 h rotácia",
};

export type InquiryRow = {
  id: string;
  company: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  positions: string | null;
  headcount: number | null;
  duration: string | null;
  shift_pattern: string | null;
  start_date: string | null;
  message: string | null;
  locale: string | null;
};

type Contact = { name: string; role: string; email: string; phone: string; linkedin: string };
type Signal = { type: string; detail: string; url: string };
type Lead = {
  id: string;
  status: string;
  country: string | null;
  contacts: Contact[] | null;
  signals: Signal[] | null;
  next_action: string | null;
  next_action_at: string | null;
};

const NEXT_ACTION = "Odpovedať na dopyt";

// Exact matches only: a substring test also catches company domains such as monetti.it or lazetech.sk.
const FREE_MAIL = new Set([
  "gmail.com", "googlemail.com", "icloud.com", "me.com", "mac.com", "msn.com", "ymail.com", "rocketmail.com",
  "proton.me", "protonmail.com", "pm.me", "tutanota.com", "tuta.io", "zohomail.com", "mail.com", "email.com",
  "yandex.com", "yandex.ru", "mail.ru",
  "web.de", "t-online.de", "freenet.de", "mail.de", "posteo.de", "mailbox.org", "arcor.de", "bluewin.ch", "aon.at",
  "orange.fr", "wanadoo.fr", "free.fr", "laposte.net", "sfr.fr", "neuf.fr",
  "spray.se", "bredband.net", "comhem.se",
  "azet.sk", "centrum.sk", "zoznam.sk", "post.sk", "pobox.sk", "atlas.sk",
  "seznam.cz", "email.cz", "post.cz", "centrum.cz", "atlas.cz", "volny.cz",
  "wp.pl", "onet.pl", "onet.eu", "op.pl", "o2.pl", "interia.pl", "interia.eu", "poczta.fm", "gazeta.pl", "tlen.pl", "vp.pl",
  "libero.it", "virgilio.it", "alice.it", "freemail.hu", "citromail.hu", "btinternet.com", "abv.bg",
]);
/** Free-mail brands that run under many country domains (yahoo.de, gmx.at, hotmail.co.uk …). */
const FREE_MAIL_BRANDS = new Set(["yahoo", "hotmail", "outlook", "live", "gmx", "aol"]);

/** The company domain of an e-mail address, or null for free-mail addresses. */
export function companyDomain(email: string): string | null {
  const domain = normalizeDomain(email.split("@").pop());
  if (!domain) return null;
  const [brand, ...rest] = domain.split(".");
  if (FREE_MAIL.has(domain)) return null;
  if (FREE_MAIL_BRANDS.has(brand) && /^((co|com)\.)?[a-z]{2,3}$/.test(rest.join("."))) return null;
  return domain;
}

/** Positions, duration, shifts and start in one line, e.g. "4× TIG · 6 týždňov · 2 zmeny · nástup 2026-12-01". */
export function inquirySummary(q: InquiryRow): string {
  return [
    q.positions,
    q.duration,
    q.shift_pattern && (shiftLabel[q.shift_pattern as ShiftPattern] ?? q.shift_pattern),
    q.headcount && `počet ${q.headcount}`,
    q.start_date && `nástup ${q.start_date}`,
  ]
    .filter(Boolean)
    .join(" · ");
}

function details(q: InquiryRow): string {
  const summary = inquirySummary(q);
  return `${summary ? `: ${summary}` : ""}.${q.message ? ` Správa: „${q.message}“` : ""}`;
}

const today = () => new Date().toISOString().slice(0, 10);

async function logEvent(leadId: string, type: string, body: string) {
  await db().from("lead_events").insert({ lead_id: leadId, type, body });
}

async function leadByDomain(domain: string): Promise<Lead | null> {
  const { data } = await db()
    .from("leads")
    .select("id, status, country, contacts, signals, next_action, next_action_at")
    .eq("domain", domain)
    .maybeSingle();
  return data as Lead | null;
}

/**
 * Puts a website inquiry into the pipeline without AI: attaches it to the lead that already has
 * the sender's company domain, or creates a new inbound lead. Returns the lead id.
 */
export async function linkInquiry(q: InquiryRow): Promise<string> {
  const domain = companyDomain(q.email);
  const contact: Contact = { name: q.name, role: "", email: q.email, phone: q.phone ?? "", linkedin: "" };
  const signal: Signal = { type: "inbound_request", detail: inquirySummary(q) || "Dopyt z webu", url: "" };

  const existing = domain ? await leadByDomain(domain) : null;
  if (existing) return attach(existing, q, contact, signal);

  const { data: lead, error } = await db()
    .from("leads")
    .insert({
      company_name: q.company,
      domain,
      country: q.country,
      contacts: [contact],
      signals: [signal],
      status: "new",
      source: "inbound",
      next_action: NEXT_ACTION,
      next_action_at: today(),
    })
    .select("id")
    .single();
  if (error?.code === "23505" && domain) {
    // A parallel inquiry from the same company created the lead after our lookup.
    const raced = await leadByDomain(domain);
    if (raced) return attach(raced, q, contact, signal);
  }
  if (error || !lead) throw new Error(error?.message ?? "Lead was not created");

  await db().from("inquiries").update({ lead_id: lead.id }).eq("id", q.id);
  await logEvent(lead.id, "created", `Dopyt z webu${details(q)}`);
  return lead.id;
}

async function attach(lead: Lead, q: InquiryRow, contact: Contact, signal: Signal): Promise<string> {
  const contacts = lead.contacts ?? [];
  const known = contacts.some((c) => c.email?.toLowerCase() === q.email.toLowerCase());
  // A closed lead that asks again is a new opportunity, so it goes back into the active pipeline.
  const reopen = lead.status === "lost" || lead.status === "disqualified";
  const { error } = await db()
    .from("leads")
    .update({
      contacts: known ? contacts : [...contacts, contact],
      signals: [...(lead.signals ?? []), signal],
      country: lead.country || q.country,
      ...(reopen ? { status: "new" } : {}),
      next_action: NEXT_ACTION,
      next_action_at: today(),
    })
    .eq("id", lead.id);
  if (error) throw new Error(error.message);

  await db().from("inquiries").update({ lead_id: lead.id }).eq("id", q.id);
  const previous =
    lead.next_action && lead.next_action !== NEXT_ACTION
      ? ` Predchádzajúci ďalší krok: ${lead.next_action}${lead.next_action_at ? ` (${lead.next_action_at})` : ""}.`
      : "";
  await logEvent(lead.id, "inquiry", `Nový dopyt z webu (${q.name}, ${q.email})${details(q)}${previous}`);
  if (reopen) await logEvent(lead.id, "status", `${lead.status} → new`);
  return lead.id;
}
