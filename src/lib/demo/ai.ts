import { db } from "../supabase/admin";
import { inquirySummary, replacedDraftNote } from "../inquiries";
import { marketLog, runLog } from "../ai/runlog";
import type { MarketReportData } from "../ai/schemas";
import { MARKET_SEARCHES, marketTitle } from "../market";
import { PROSPECT_POOL } from "./seed";

/*
 * Stand-ins for the Claude steps in the local preview when no ANTHROPIC_API_KEY is set.
 * They write the same kind of rows as src/lib/ai, so the admin behaves as it will for real.
 */

const NOTE = "Ukážkový režim: bez ANTHROPIC_API_KEY Claude nebeží, výsledok je simulovaný.";
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const now = () => new Date().toISOString();

async function logEvent(leadId: string, type: string, body: string) {
  await db().from("lead_events").insert({ lead_id: leadId, type, body });
}

/** Mirrors startRun: a run that "finds" two sample prospects after a few seconds. */
export async function simulateRun(campaignId: string) {
  const { data: campaign } = await db().from("campaigns").select("*").eq("id", campaignId).single();
  if (!campaign) throw new Error("Campaign not found");
  const log = [runLog.researching(campaign.name), NOTE];
  const { data: run } = await db()
    .from("lead_runs")
    .insert({ campaign_id: campaignId, trigger: "manual", log: log.join("\n") })
    .select("id")
    .single();
  if (!run) throw new Error("Could not create run");

  void (async () => {
    await wait(7000);
    const { data: known } = await db().from("leads").select("domain").not("domain", "is", null);
    const taken = new Set((known ?? []).map((r) => r.domain));
    const fresh = PROSPECT_POOL.filter((p) => !taken.has(p.domain));
    const picks = [
      ...fresh.filter((p) => campaign.countries.includes(p.country)),
      ...fresh.filter((p) => !campaign.countries.includes(p.country)),
    ].slice(0, 2);

    let created = 0;
    for (const p of picks) {
      const { data: row } = await db()
        .from("leads")
        .insert({ ...p, status: p.tier === "C" ? "new" : "qualified", source: "ai_prospecting", campaign_id: campaignId, run_id: run.id })
        .select("id")
        .single();
      if (!row) continue;
      created++;
      await logEvent(row.id, "created", runLog.foundEvent(campaign.name, p.score, p.tier));
    }
    // Like the real run, the log keeps the research notes with the people found.
    const notes = picks
      .map((p, i) => `${i + 1}. ${p.company_name} (${p.domain}), ${p.city}, ${p.country}. Kontakty: ${p.contacts.map((c: { name: string; role: string; email: string }) => `${c.name}, ${c.role}, ${c.email}`).join("; ")}.`)
      .join("\n");
    log.push(
      notes ? `${runLog.researched(12)}\n\n${notes}\n` : runLog.researched(12),
      picks.length ? runLog.saved(created, picks.length) : "Ukážkové firmy sa minuli, ostrý beh by hľadal nové.",
    );
    await db()
      .from("lead_runs")
      .update({ status: "done", found: picks.length, created, log: log.join("\n"), usage: { web_searches: 12 }, finished_at: now() })
      .eq("id", run.id);
    await db().from("campaigns").update({ last_run_at: now() }).eq("id", campaignId);
  })();
}

/** Mirrors enrichLead: leaves the data as is and records what would have happened. */
export async function simulateEnrich(leadId: string) {
  await wait(1500);
  await logEvent(leadId, "ai", `${NOTE} Claude by teraz prehľadal web, doplnil signály a kontakty a nanovo ohodnotil firmu.`);
}

/**
 * Mirrors writeOutreach: a reply to an inquiry stays a reply (the plain placeholder reply, in Slovak for SK and
 * otherwise in English), any other draft keeps its text; the language switches and a replaced draft goes to the history.
 */
export async function simulateOutreach(leadId: string, language: string, instructions: string) {
  await wait(1500);
  const { data: lead } = await db()
    .from("leads")
    .select("outreach_language, outreach_subject, outreach_body")
    .eq("id", leadId)
    .single();
  if (!lead) throw new Error("Lead not found");
  const { data: q } = await db().from("inquiries").select("*").eq("lead_id", leadId).order("created_at", { ascending: false }).limit(1).maybeSingle();
  const reply = q ? placeholderReply({ ...q, locale: language }) : null;
  if (reply && (lead.outreach_subject || lead.outreach_body)) await logEvent(leadId, "outreach", replacedDraftNote(lead, "rewrite"));
  await db()
    .from("leads")
    .update(reply ? { outreach_subject: reply.outreach_subject, outreach_body: reply.outreach_body, outreach_language: language } : { outreach_language: language })
    .eq("id", leadId);
  await logEvent(leadId, "outreach", `${NOTE} Claude by prepísal e-mail v jazyku ${language.toUpperCase()}${instructions ? ` podľa pokynov: „${instructions}“` : ""}${reply ? " a ponechal by ho ako odpoveď na dopyt" : ""}.`);
}

/** A plain reply in Slovak for the Slovak site, otherwise in English; Claude writes it in the visitor's language. */
function placeholderReply(q: { name: string; positions: string | null; locale: string | null }) {
  if (q.locale === "sk") {
    return {
      outreach_language: "sk",
      outreach_subject: `Váš dopyt: ${q.positions || "pracovníci na váš projekt"}`,
      outreach_body: `Dobrý deň,\n\nďakujeme za váš dopyt. Preveríme dostupnosť ľudí a pošleme vám vhodné profily a cenovú ponuku.\n\nNapíšete nám ešte presné miesto projektu a pracovný čas? Pomohol by aj krátky telefonát.\n\nS pozdravom\ntím KTechnology`,
    };
  }
  return {
    outreach_language: "en",
    outreach_subject: `Your inquiry: ${q.positions || "staff for your project"}`,
    outreach_body: `Dear ${q.name},\n\nThank you for your inquiry. We will check availability and send you suitable profiles and a quote.\n\nCould you tell us the exact project location and working hours? A short call would help as well.\n\nBest regards,\nThe KTechnology team`,
  };
}

/** Mirrors qualifyInquiry: the route has already created or linked the lead, this adds the AI step. */
export async function simulateInquiry(inquiryId: string, leadId: string) {
  await wait(1500);
  const [{ data: q }, { data: lead }] = await Promise.all([
    db().from("inquiries").select("*").eq("id", inquiryId).single(),
    db().from("leads").select("qualification, outreach_language, outreach_subject, outreach_body").eq("id", leadId).single(),
  ]);
  if (!q || !lead) return;
  // Like the real step: the reply becomes the e-mail to send, an earlier draft stays in the history.
  const reply = placeholderReply(q);
  await db()
    .from("leads")
    .update({ ...reply, ...(lead.qualification ? {} : { qualification: `Dopyt z webu: ${inquirySummary(q) || q.company}. ${NOTE}` }) })
    .eq("id", leadId);
  if (lead.outreach_subject || lead.outreach_body) await logEvent(leadId, "outreach", replacedDraftNote(lead));
  await logEvent(
    leadId,
    "ai",
    `${NOTE} Claude by teraz dopyt ohodnotil. Jednoduchý návrh odpovede (${reply.outreach_language.toUpperCase()}) je v časti „E-mail na oslovenie“.`,
  );
}

/** A plausible finished report for any country and trades, with fictional companies (.example domains). */
function sampleMarketReport(country: string, roles: string[], industries: string[]): MarketReportData {
  const trades = roles.join(", ") || "kvalifikované profesie";
  const sectors = industries.length ? industries : ["strojárstvo", "energetika"];
  const company = (name: string, slug: string, industry: string, signal: string) => ({
    name, website: `https://${slug}.example`, city: "", industry, signal, url: `https://${slug}.example/karriere`,
  });
  return {
    summary: `${NOTE} Ostrá analýza by prehľadala web a opísala dopyt po profesiách ${trades} v krajine ${country}: počty inzerátov, firmy, ktoré práve hľadajú ľudí, veľké projekty a odstávky. Firmy, čísla a zdroje nižšie sú vymyslené, aby bolo vidieť, ako analýza vyzerá. Pri každom údaji by bol zdroj s dátumom a odhady by boli označené. Pravidlá prenájmu pracovníkov by boli len informatívne.`,
    opportunity: "stredná",
    opportunity_reason: "Ukážkové hodnotenie: dopyt existuje, ale bez ostrého prieskumu ho nemožno overiť.",
    demand_signals: [
      { title: "Otvorené inzeráty (ukážka)", detail: `Ukážkový údaj: stovky aktívnych inzerátov na profesie ${trades}.`, url: "https://jobportal-prehlad.example/ukazka" },
      { title: "Nové investície (ukážka)", detail: "Ukážkový údaj: dve firmy ohlásili novú linku s náborom na 1. polrok.", url: "https://priemysel-spravy.example/ukazka" },
    ],
    regions: [{ name: "Priemyselné centrum (ukážka)", detail: "Ostrá analýza by uviedla regióny s najväčším dopytom." }],
    industries: sectors.map((name) => ({ name, detail: "Ukážkový popis dopytu v odvetví." })),
    companies: [
      company("Arcwell Industrial", "arcwell-industrial", sectors[0], "Ukážkový signál: 6 otvorených pozícií pre tieto profesie."),
      company("Meridian Process Services", "meridian-process", "Údržba a odstávky", "Ukážkový signál: jarná odstávka, hľadajú subdodávateľov."),
      company("Kestrel Machine Works", "kestrel-machine", "Strojárstvo", "Ukážkový signál: nová montážna linka s nábehom o 4 mesiace."),
    ],
    competitors: [{ name: "Sample Staffing Group", website: "https://sample-staffing.example", detail: "Ukážková personálna agentúra." }],
    wages: (roles.length ? roles : ["Zvárač"]).slice(0, 3).map((role) => ({
      role,
      range: "ukážkový údaj, ostrá analýza uvedie rozpätie so zdrojom a dátumom",
      detail: "",
      url: "",
    })),
    regulations: [
      { title: "Prenájom a vysielanie pracovníkov (ukážka)", detail: "Ostrá analýza by zhrnula povolenia, formulár A1 a nahlasovanie vyslania.", url: "" },
    ],
    seasonality: "Ukážka: ostrá analýza by opísala, kedy dopyt vrcholí (odstávky, nábehy výroby) a kedy slabne.",
    recommendations: [
      "Doplniť ANTHROPIC_API_KEY, aby Claude spravil ostrý prieskum trhu.",
      "Z analýzy vytvoriť kampaň AI vyhľadávania a firmy so signálom pridať do leadov.",
    ],
    suggested_campaign: { name: `Kampaň – ${marketTitle({ country, roles })}`, countries: [country], industries: sectors, roles },
    sources: [{ title: "Ukážkový zdroj", url: "https://jobportal-prehlad.example/ukazka" }],
  };
}

/** Mirrors startMarketReport: the analysis "finishes" with a fictional sample report after a few seconds. */
export async function simulateMarketReport(id: string) {
  const { data: row } = await db().from("market_reports").select("*").eq("id", id).single();
  if (!row) throw new Error("Market report not found");
  const log = [marketLog.researching(marketTitle(row)), NOTE];
  await db().from("market_reports").update({ log: log.join("\n") }).eq("id", id);

  void (async () => {
    await wait(7000);
    const report = sampleMarketReport(row.country, row.roles, row.industries);
    log.push(marketLog.researched(MARKET_SEARCHES), marketLog.saved(report.companies.length, report.sources.length));
    await db()
      .from("market_reports")
      .update({ status: "done", report, log: log.join("\n"), usage: { web_searches: MARKET_SEARCHES }, finished_at: now() })
      .eq("id", id);
  })();
}
