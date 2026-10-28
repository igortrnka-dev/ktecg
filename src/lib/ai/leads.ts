import { db } from "@/lib/supabase/admin";
import { getCompanyProfile, normalizeDomain } from "./client";
import { extract, webResearch, type Usage } from "./research";
import { Enrichment, Outreach, Qualification } from "./schemas";

const newUsage = (): Usage => ({ input_tokens: 0, output_tokens: 0, web_searches: 0 });

const SYSTEM = (profile: string) => `You are the sales assistant of KTechnology s.r.o.

About KTechnology:
${profile}

Be factual and concise. Never invent people, e-mails or phone numbers.`;

async function logEvent(leadId: string, type: string, body: string) {
  await db().from("lead_events").insert({ lead_id: leadId, type, body });
}

/** Turns a website inquiry into a scored inbound lead with a drafted reply. */
export async function qualifyInquiry(inquiryId: string) {
  const { data: q } = await db().from("inquiries").select("*").eq("id", inquiryId).single();
  if (!q) return;
  const profile = await getCompanyProfile();
  const domain = normalizeDomain(q.email?.split("@")[1]);

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
Headcount: ${q.headcount ?? "-"}
Start: ${q.start_date ?? "-"}
Message: ${q.message ?? "-"}
</inquiry>`,
  });

  const { data: lead } = await db()
    .from("leads")
    .insert({
      ...result,
      company_name: q.company,
      domain: domain && !/gmail|outlook|hotmail|yahoo|icloud|gmx|seznam|azet|centrum|wp\.pl|onet/.test(domain) ? domain : null,
      country: q.country,
      contacts: [{ name: q.name, role: "", email: q.email, phone: q.phone ?? "", linkedin: "" }],
      signals: [{ type: "inbound_request", detail: q.positions || q.message || "Website inquiry", url: "" }],
      status: "qualified",
      source: "inbound",
      next_action: "Reply to inquiry",
      next_action_at: new Date().toISOString().slice(0, 10),
    })
    .select("id")
    .single();

  if (lead) {
    await db().from("inquiries").update({ lead_id: lead.id }).eq("id", inquiryId);
    await logEvent(lead.id, "created", `Inbound website inquiry. Score ${result.score}, tier ${result.tier}.`);
  }
}

/** Researches one lead on the web and refreshes its signals, contacts, score and outreach. */
export async function enrichLead(leadId: string) {
  const { data: lead } = await db().from("leads").select("*").eq("id", leadId).single();
  if (!lead) throw new Error("Lead not found");
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

<current_lead>${JSON.stringify({ company: lead.company_name, signals: lead.signals, contacts: lead.contacts, notes: lead.notes })}</current_lead>
<research_notes>
${findings}
</research_notes>`,
  });

  await db().from("leads").update(result).eq("id", leadId);
  await logEvent(leadId, "ai", `Re-researched by Claude (${usage.web_searches} searches). Score ${result.score}, tier ${result.tier}.`);
}

/** Rewrites the outreach e-mail for a lead in the given language and tone. */
export async function writeOutreach(leadId: string, language: string, instructions: string) {
  const { data: lead } = await db().from("leads").select("*").eq("id", leadId).single();
  if (!lead) throw new Error("Lead not found");
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
  await logEvent(leadId, "outreach", `Outreach rewritten (${language}).`);
}
