import { db } from "@/lib/supabase/admin";
import { MARKET_SEARCHES, marketTitle, type MarketReportRow } from "@/lib/market";
import { getCompanyProfile } from "./client";
import { AiStepError, aiErrorText } from "./errors";
import { extract, webResearch, type Usage } from "./research";
import { marketLog, runLog } from "./runlog";
import { MarketReport } from "./schemas";

const MARKET_SYSTEM = (profile: string) => `You are the market analyst for KTechnology s.r.o.

About KTechnology:
${profile}

You research a country's market for leasing skilled industrial staff and write a sourced market report for the owner.
Only state facts you can support with a source, and give its URL; never invent companies, people, figures, wages,
rates or prices. Give numbers as ranges with their source and date (month/year), and mark your own estimates
clearly as estimates ("odhad"). Notes on law, permits and registration are informative only and must be verified
before use. Name companies only; do not collect names or contact details of individual people.
About KTechnology itself, use only the facts in the profile above; never invent certifications, figures, prices,
countries or references. Write in Slovak, keeping company names and source titles as they are.
In German texts, avoid construction-site wording (Baustelle, Bau-).`;

const STALE_MS = 60 * 60 * 1000;

type NewReport = { country: string; roles: string[]; industries: string[]; question: string };

/** Like closeStaleRuns: an analysis lives only as a promise in this process, so after an hour it was cut off. */
export async function closeStaleReports() {
  await db()
    .from("market_reports")
    .update({ status: "failed", error: marketLog.interrupted, finished_at: new Date().toISOString() })
    .eq("status", "running")
    .lt("created_at", new Date(Date.now() - STALE_MS).toISOString());
}

/** Creates the analysis row, or returns null while another analysis is running (one at a time). */
export async function createMarketReport(input: NewReport): Promise<string | null> {
  await closeStaleReports();
  const { count } = await db()
    .from("market_reports")
    .select("id", { count: "exact", head: true })
    .eq("status", "running");
  if (count) return null;
  const { data, error } = await db().from("market_reports").insert(input).select("id").single();
  // The partial unique index on running rows: another analysis started in the meantime.
  if (error?.code === "23505") return null;
  if (error || !data) throw new Error(error?.message ?? "Could not create the market report");
  return data.id;
}

/** Runs the analysis in the background, like startRun. */
export function startMarketReport(id: string) {
  void executeMarketReport(id).catch(() => {});
}

export async function executeMarketReport(id: string) {
  const usage: Usage = { input_tokens: 0, output_tokens: 0, web_searches: 0 };
  const log: string[] = [];
  const note = async (line: string) => {
    log.push(`${new Date().toISOString().slice(11, 19)}  ${line}`);
    await db().from("market_reports").update({ log: log.join("\n"), usage }).eq("id", id);
  };

  try {
    const { data: row, error } = await db().from("market_reports").select("*").eq("id", id).single<MarketReportRow>();
    if (error || !row) throw new AiStepError("Analýza sa nenašla, možno bola zmazaná.");

    const profile = await getCompanyProfile();
    const roles = row.roles.join(", ") || "the skilled trades in the profile above";
    await note(marketLog.researching(marketTitle(row)));
    const findings = await webResearch({
      system: MARKET_SYSTEM(profile),
      maxSearches: MARKET_SEARCHES,
      usage,
      prompt: `Research the market in ${row.country} for leasing these skilled trades: ${roles}.
Industries to focus on: ${row.industries.join(", ") || "every industry that needs these trades"}
${row.question ? `The owner's question or focus: ${row.question}\n` : ""}Today is ${new Date().toISOString().slice(0, 10)}; prefer sources from the last 12 months and note each source's date.

Cover:
1. Demand for these trades: job-ad volume indicators (open ads on the main job boards, public employment service
   shortage lists), named employers hiring for them now, large projects, investments and new plants,
   shutdown/turnaround seasons, labour-shortage statements by employers or associations.
2. The key regions and industries where the demand is.
3. Up to 15 real companies with a concrete, recent hiring or project signal for these trades: name, website, city,
   industry, the signal and its source URL.
4. Competitors: staffing and staff-leasing agencies active there for these trades (name, website, what they offer).
5. Wage levels for these trades and typical hourly rates for leased staff, as ranges with source and date.
6. Rules for cross-border staff leasing and posting of workers into ${row.country}: licences or permits for the
   leasing company, A1 certificates, registration or notification duties, minimum wage or collective agreements,
   restricted sectors.
7. Seasonality: when demand peaks and drops.
8. Concrete recommended next steps for KTechnology in this market.

Write the findings as notes with the source URL after every fact.`,
    });
    // Saved before extraction so the paid-for research survives a failed or interrupted step.
    await note(`${marketLog.researched(usage.web_searches)}\n\n${findings}\n`);

    const report = await extract({
      system: MARKET_SYSTEM(profile),
      schema: MarketReport,
      usage,
      prompt: `Below are research notes about the market in ${row.country} for these trades: ${roles}.
Industries the owner wants to focus on: ${row.industries.join(", ") || "(any)"}
Turn them into the structured market report, written in Slovak (company names and source titles as they are).
Use only what is in the notes and keep each fact's source URL. Give numbers as ranges with the source date and
mark estimates as "odhad". Companies: up to 15, only real companies from the notes with a concrete hiring or
project signal. Rate the opportunity for KTechnology and say why. The suggested campaign is a KTechnology
prospecting campaign for this market: a Slovak name, and countries, industries and roles as short English search
terms; when the owner named industries, the campaign's industries are those (in English). List every source used under sources. Use empty strings for unknown fields and empty lists where the notes
have nothing.
${row.question ? `\nThe owner's question or focus, which the summary and recommendations must answer: ${row.question}\n` : ""}
<research_notes>
${findings}
</research_notes>`,
    });

    await note(marketLog.saved(report.companies.length, report.sources.length));
    await db()
      .from("market_reports")
      .update({ status: "done", report, finished_at: new Date().toISOString(), usage })
      .eq("id", id);
  } catch (err) {
    console.error("Market analysis failed", id, err);
    const message = aiErrorText(err);
    log.push(`${new Date().toISOString().slice(11, 19)}  ${runLog.failed(message)}`);
    // One write, so the analysis cannot be left "running" by a failed log update.
    await db()
      .from("market_reports")
      .update({ status: "failed", error: message, log: log.join("\n"), finished_at: new Date().toISOString(), usage })
      .eq("id", id);
  }
}
