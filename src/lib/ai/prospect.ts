import { db } from "@/lib/supabase/admin";
import { getCompanyProfile, normalizeDomain } from "./client";
import { extract, webResearch, type Usage } from "./research";
import { ProspectBatch } from "./schemas";

export type Campaign = {
  id: string;
  name: string;
  countries: string[];
  industries: string[];
  roles: string[];
  notes: string;
  outreach_language: string;
  leads_per_run: number;
};

const SALES_SYSTEM = (profile: string) => `You are the business-development researcher for KTechnology s.r.o.

About KTechnology:
${profile}

You find and qualify B2B prospects that are likely to lease skilled industrial staff from KTechnology.
Only use facts you can support with a source; never invent companies, people, e-mails or phone numbers.
Prefer companies with fresh (last 6 months) buying signals.`;

const STALE_RUN_MS = 60 * 60 * 1000;

/**
 * Runs live only as a promise in this process, so a run still "running" after an hour was cut off
 * by a restart or deploy. Closing it keeps the campaign startable and stops the page polling.
 */
export async function closeStaleRuns() {
  await db()
    .from("lead_runs")
    .update({ status: "failed", error: "interrupted", finished_at: new Date().toISOString() })
    .eq("status", "running")
    .lt("started_at", new Date(Date.now() - STALE_RUN_MS).toISOString());
}

export async function runInProgress(campaignId: string): Promise<boolean> {
  await closeStaleRuns();
  const { count } = await db()
    .from("lead_runs")
    .select("id", { count: "exact", head: true })
    .eq("campaign_id", campaignId)
    .eq("status", "running");
  return Boolean(count);
}

/** Creates the run row, or returns null when the campaign already has a run going. */
export async function createRun(campaignId: string, trigger: "manual" | "cron"): Promise<string | null> {
  if (await runInProgress(campaignId)) return null;
  const { data: run, error } = await db()
    .from("lead_runs")
    .insert({ campaign_id: campaignId, trigger })
    .select("id")
    .single();
  if (error || !run) throw new Error(error?.message ?? "Could not create run");
  return run.id;
}

/** Starts a prospecting run in the background and returns its id, or null if one is already running. */
export async function startRun(campaignId: string, trigger: "manual" | "cron"): Promise<string | null> {
  const runId = await createRun(campaignId, trigger);
  // Render runs a long-lived Node server, so the promise keeps going after the response.
  if (runId) void executeRun(runId, campaignId).catch(() => {});
  return runId;
}

export async function executeRun(runId: string, campaignId: string) {
  const usage: Usage = { input_tokens: 0, output_tokens: 0, web_searches: 0 };
  const log: string[] = [];
  const note = async (line: string) => {
    log.push(`${new Date().toISOString().slice(11, 19)}  ${line}`);
    await db().from("lead_runs").update({ log: log.join("\n"), usage }).eq("id", runId);
  };

  try {
    const { data: campaign, error } = await db().from("campaigns").select("*").eq("id", campaignId).single<Campaign>();
    if (error || !campaign) throw new Error("Campaign not found");

    const profile = await getCompanyProfile();
    const { data: existing } = await db().from("leads").select("domain").not("domain", "is", null);
    const known = (existing ?? []).map((r) => r.domain as string);

    await note(`Researching: ${campaign.name}`);
    const findings = await webResearch({
      system: SALES_SYSTEM(profile),
      maxSearches: Math.min(25, campaign.leads_per_run * 2 + 5),
      usage,
      prompt: `Find ${campaign.leads_per_run} companies that are good prospects for KTechnology right now.

Target countries: ${campaign.countries.join(", ") || "any (EU/EEA, Switzerland, UK, Nordics, Middle East)"}
Target industries: ${campaign.industries.join(", ") || "any industrial sector"}
Roles we want to place: ${campaign.roles.join(", ") || "skilled trades (welders, fitters, electricians, mechanics, operators)"}
${campaign.notes ? `Extra instructions: ${campaign.notes}` : ""}

Skip these domains, we already have them: ${known.slice(0, 400).join(", ") || "(none)"}

For each company, report: name, website, country and city, industry, approximate size, what they do,
the concrete buying signals with source URLs (job ads for the roles above, expansions, new plants or lines,
large project wins, outages/shutdowns, labour-shortage statements), and publicly listed decision makers
(HR/recruiting, plant or project managers, procurement) with their role and any public contact details.`,
    });
    // Saved before extraction so the paid-for research survives a failed or interrupted step.
    await note(`Research done (${usage.web_searches} searches). Qualifying…\n\n${findings}\n`);

    const lang = campaign.outreach_language === "auto"
      ? "the main business language of the company's country"
      : `language code "${campaign.outreach_language}"`;

    const batch = await extract({
      system: SALES_SYSTEM(profile),
      schema: ProspectBatch,
      usage,
      prompt: `Below are research notes about potential prospects. Turn every company in them into a structured lead.
Score each one 0-100 for fit and timing, assign a tier, explain the qualification, recommend roles,
and write a short, specific first outreach e-mail in ${lang} that references their concrete signal.
Use empty strings for unknown fields. Do not add companies that are not in the notes.

<research_notes>
${findings}
</research_notes>`,
    });

    let created = 0;
    for (const lead of batch.leads) {
      const domain = normalizeDomain(lead.website);
      if (domain && known.includes(domain)) continue;
      const { data: row, error: insertError } = await db()
        .from("leads")
        .insert({
          ...lead,
          domain,
          status: lead.tier === "C" ? "new" : "qualified",
          source: "ai_prospecting",
          campaign_id: campaignId,
          run_id: runId,
        })
        .select("id")
        .single();
      if (insertError || !row) {
        await note(`Skipped ${lead.company_name}: ${insertError?.message}`);
        continue;
      }
      if (domain) known.push(domain);
      created++;
      await db().from("lead_events").insert({
        lead_id: row.id,
        type: "created",
        body: `Found by AI prospecting (${campaign.name}). Score ${lead.score}, tier ${lead.tier}.`,
      });
    }

    await note(`Saved ${created} new leads of ${batch.leads.length} found.`);
    await db()
      .from("lead_runs")
      .update({ status: "done", found: batch.leads.length, created, finished_at: new Date().toISOString(), usage })
      .eq("id", runId);
    await db().from("campaigns").update({ last_run_at: new Date().toISOString() }).eq("id", campaignId);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    log.push(`${new Date().toISOString().slice(11, 19)}  Failed: ${message}`);
    // One write, so the run cannot be left "running" by a failed log update.
    await db()
      .from("lead_runs")
      .update({ status: "failed", error: message, log: log.join("\n"), finished_at: new Date().toISOString(), usage })
      .eq("id", runId);
  }
}
