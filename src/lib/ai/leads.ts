import type * as z from "zod/v4";
import { db } from "@/lib/supabase/admin";
import { replacedDraftNote, type ShiftPattern } from "@/lib/inquiries";
import { getCompanyProfile } from "./client";
import { AiStepError, aiErrorText } from "./errors";
import { extract, webResearch, type Usage } from "./research";
import { Contact as ContactSchema, Enrichment, Outreach, Qualification, Signal as SignalSchema } from "./schemas";

type Contact = z.infer<typeof ContactSchema>;
type Signal = z.infer<typeof SignalSchema>;

const newUsage = (): Usage => ({ input_tokens: 0, output_tokens: 0, web_searches: 0 });

const SYSTEM = (profile: string) => `You are the sales assistant of KTechnology s.r.o.

About KTechnology:
${profile}

Be factual and concise. Never invent people, e-mails or phone numbers.
About KTechnology, use only the facts in the profile above; never invent certifications, figures, prices, countries or references.
In German texts, avoid construction-site wording (Baustelle, Bau-).`;

async function logEvent(leadId: string, type: string, body: string) {
  await db().from("lead_events").insert({ lead_id: leadId, type, body });
}

const SHIFT_EN: Record<ShiftPattern, string> = {
  unsure: "not decided yet",
  single: "1 shift",
  double: "2 shifts",
  triple: "3 shifts",
  rotation: "12-hour shifts",
};

const sameKey = (a?: string, b?: string) => {
  const key = (s?: string) => (s ?? "").trim().toLowerCase().replace(/\/+$/, "");
  return key(a) !== "" && key(a) === key(b);
};

/** Keeps every known contact, fills their missing details and adds the new people. */
function mergeContacts(current: Contact[], found: Contact[]): Contact[] {
  const out = current.map((c) => ({ ...c }));
  for (const c of found) {
    const match = out.find((e) => sameKey(e.email, c.email) || sameKey(e.linkedin, c.linkedin) || sameKey(e.name, c.name));
    if (!match) out.push(c);
    else for (const k of ["role", "email", "phone", "linkedin"] as const) if (!match[k] && c[k]) match[k] = c[k];
  }
  return out;
}

function mergeSignals(current: Signal[], found: Signal[]): Signal[] {
  const fresh = found.filter((s) => !current.some((e) => (e.type === s.type && sameKey(e.url, s.url)) || sameKey(e.detail, s.detail)));
  return [...current, ...fresh];
}

/**
 * Scores an inbound lead (already created or attached by linkInquiry) and drafts the reply.
 * A failure is recorded on the lead, which stays in the pipeline either way.
 */
export async function qualifyInquiry(inquiryId: string, leadId: string) {
  try {
    const [{ data: q }, { data: lead }] = await Promise.all([
      db().from("inquiries").select("*").eq("id", inquiryId).single(),
      db().from("leads").select("*").eq("id", leadId).single(),
    ]);
    if (!q || !lead) return;
    const profile = await getCompanyProfile();

    const result = await extract({
      system: SYSTEM(profile),
      schema: Qualification,
      usage: newUsage(),
      prompt: `A company sent this request through our website. Qualify it and draft our reply.
Write the reply in the language of the request (website locale: ${q.locale ?? "en"}).
The reply should thank them, confirm what we understood, ask the 2-3 most important missing questions,
and propose a short call.

<inquiry>
Company: ${q.company}
Contact: ${q.name} <${q.email}> ${q.phone ?? ""}
Project country: ${q.country ?? "-"}
Positions: ${q.positions ?? "-"}
Duration: ${q.duration ?? "-"}
Shift pattern: ${SHIFT_EN[q.shift_pattern as ShiftPattern] ?? "-"}${q.headcount ? `\nHeadcount: ${q.headcount}` : ""}
Start: ${q.start_date ?? "-"}
Message: ${q.message ?? "-"}
</inquiry>
<what_we_know_already>${JSON.stringify({ status: lead.status, qualification: lead.qualification, signals: lead.signals })}</what_we_know_already>`,
    });

    // The reply to this inquiry is the e-mail to send now; an earlier draft (e.g. a cold e-mail) is kept in the history.
    const { outreach_language, outreach_subject, outreach_body, ...assessment } = result;
    const { data: before } = await db()
      .from("leads")
      .select("outreach_language, outreach_subject, outreach_body")
      .eq("id", leadId)
      .single();
    await db().from("leads").update({ ...assessment, outreach_language, outreach_subject, outreach_body }).eq("id", leadId);
    if (before?.outreach_subject || before?.outreach_body) await logEvent(leadId, "outreach", replacedDraftNote(before));
    await logEvent(
      leadId,
      "ai",
      `Dopyt vyhodnotený s Claude. Skóre ${result.score}, tier ${result.tier}. ` +
        `Návrh odpovede (${outreach_language.toUpperCase()}) je v časti „E-mail na oslovenie“.`,
    );
  } catch (err) {
    await logEvent(leadId, "ai", `Claude dopyt nevyhodnotil: ${aiErrorText(err)} Odpovedzte ručne alebo skúste „Preskúmať znova s Claude“.`);
    throw err;
  }
}

/** Researches one lead on the web and adds to its signals and contacts, rescores it and drafts outreach if it has none. */
export async function enrichLead(leadId: string) {
  const { data: lead } = await db().from("leads").select("*").eq("id", leadId).single();
  if (!lead) throw new AiStepError("Lead sa nenašiel.");
  const profile = await getCompanyProfile();
  const usage = newUsage();

  const findings = await webResearch({
    system: SYSTEM(profile),
    maxSearches: 8,
    usage,
    prompt: `Research ${lead.company_name} (${lead.website || lead.domain || "website unknown"}, ${lead.country || "country unknown"}).
Find: what they do and their size; current job ads for skilled trades; expansions, new plants or lines, project wins,
outages or shutdowns in the last 6 months; and public decision makers for hiring, operations or procurement
with role and public contact details. Cite source URLs.`,
  });

  const result = await extract({
    system: SYSTEM(profile),
    schema: Enrichment,
    usage,
    prompt: `Update this lead from the research notes. Score fit and timing, and write a first outreach e-mail
in ${lead.outreach_language || "the main business language of the company's country"} that references a concrete signal.
In signals and contacts, list only items that are not already in current_lead.

<current_lead>${JSON.stringify({ company: lead.company_name, signals: lead.signals, contacts: lead.contacts, notes: lead.notes })}</current_lead>
<research_notes>
${findings}
</research_notes>`,
  });

  const { contacts, signals, company_size, description, outreach_language, outreach_subject, outreach_body, ...assessment } = result;
  // Read again: during the research an inquiry may have added a contact, a signal or a reply draft.
  const { data: fresh } = await db()
    .from("leads")
    .select("contacts, signals, outreach_subject, outreach_body")
    .eq("id", leadId)
    .single();
  if (!fresh) throw new AiStepError("Lead bol medzitým zmazaný.");
  const currentContacts: Contact[] = fresh.contacts ?? [];
  const currentSignals: Signal[] = fresh.signals ?? [];
  const mergedContacts = mergeContacts(currentContacts, contacts);
  const mergedSignals = mergeSignals(currentSignals, signals);
  // Outreach is only drafted here when there is none; rewriteOutreach replaces it on request.
  const keepOutreach = Boolean(fresh.outreach_subject || fresh.outreach_body);
  await db()
    .from("leads")
    .update({
      ...assessment,
      company_size: company_size || lead.company_size,
      description: description || lead.description,
      contacts: mergedContacts,
      signals: mergedSignals,
      ...(keepOutreach ? {} : { outreach_language, outreach_subject, outreach_body }),
    })
    .eq("id", leadId);
  await logEvent(
    leadId,
    "ai",
    `Preskúmané s Claude (${usage.web_searches} vyhľadávaní). Skóre ${result.score}, tier ${result.tier}. ` +
      `Nové kontakty: ${mergedContacts.length - currentContacts.length}, nové signály: ${mergedSignals.length - currentSignals.length}.`,
  );
}

/** Rewrites the outreach e-mail for a lead in the given language and tone. */
export async function writeOutreach(leadId: string, language: string, instructions: string) {
  const { data: lead } = await db().from("leads").select("*").eq("id", leadId).single();
  if (!lead) throw new AiStepError("Lead sa nenašiel.");
  const profile = await getCompanyProfile();

  const result = await extract({
    system: SYSTEM(profile),
    schema: Outreach,
    usage: newUsage(),
    prompt: `Write a short, personal first outreach e-mail to this prospect in language "${language}".
Reference their concrete signal, offer the roles we recommend, and end with a simple call to action.
${instructions ? `Extra instructions: ${instructions}` : ""}

<lead>${JSON.stringify({
      company: lead.company_name,
      country: lead.country,
      industry: lead.industry,
      description: lead.description,
      signals: lead.signals,
      contacts: lead.contacts,
      recommended_roles: lead.recommended_roles,
      qualification: lead.qualification,
    })}</lead>`,
  });

  await db().from("leads").update(result).eq("id", leadId);
  await logEvent(leadId, "outreach", `E-mail prepísaný s Claude (${language.toUpperCase()}).`);
}
