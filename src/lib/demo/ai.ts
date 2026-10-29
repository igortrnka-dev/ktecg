import { db } from "../supabase/admin";
import { inquirySummary, replacedDraftNote } from "../inquiries";
import { runLog } from "../ai/runlog";
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
    log.push(runLog.researched(12), picks.length ? runLog.saved(created, picks.length) : "Ukážkové firmy sa minuli, ostrý beh by hľadal nové.");
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

/** Mirrors writeOutreach: switches the language and records the instructions. */
export async function simulateOutreach(leadId: string, language: string, instructions: string) {
  await wait(1500);
  await db().from("leads").update({ outreach_language: language }).eq("id", leadId);
  await logEvent(leadId, "outreach", `${NOTE} Claude by prepísal e-mail v jazyku ${language.toUpperCase()}${instructions ? ` podľa pokynov: „${instructions}“` : ""}.`);
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
    outreach_body: `Dear ${q.name},\n\nthank you for your inquiry. We will check availability and send you suitable profiles and a quote.\n\nCould you tell us the exact project location and working hours? A short call would help as well.\n\nBest regards,\nThe KTechnology team`,
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
