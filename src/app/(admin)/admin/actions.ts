"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import { allowedEmails, isAdminUser, requireAdmin } from "@/lib/auth";
import { createAuthClient } from "@/lib/supabase/server";
import { missingSupabaseEnv } from "@/lib/supabase/config";
import { db } from "@/lib/supabase/admin";
import { runInProgress, startRun } from "@/lib/ai/prospect";
import { normalizeDomain } from "@/lib/ai/client";
import { aiErrorText } from "@/lib/ai/errors";
import { enrichLead, writeOutreach } from "@/lib/ai/leads";
import { FOLLOW_UP, NEXT_ACTION } from "@/lib/inquiries";
import { leadInquiryIds, redactRunLogs } from "@/lib/erase";
import { fmtDay, PRE_CONTACT } from "@/components/admin/ui";
import { isDemo, simulateAi } from "@/lib/demo/mode";
import { demoSignIn, demoSignOut } from "@/lib/demo/session";
import { simulateEnrich, simulateMarketReport, simulateOutreach, simulateRun } from "@/lib/demo/ai";
import { createMarketReport, startMarketReport } from "@/lib/ai/market";
import { marketLog } from "@/lib/ai/runlog";
import { httpUrl, marketTitle, type MarketReportRow } from "@/lib/market";

const list = (v: FormDataEntryValue | null) =>
  String(v ?? "")
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

/** supabase-js reports a failed write in `error` instead of throwing; throw so the panel's error page shows it. */
function check<R extends { error: { message: string } | null }>(result: R): R {
  if (result.error) throw new Error(result.error.message);
  return result;
}

export async function signIn(_: string | null, form: FormData): Promise<string | null> {
  if (isDemo()) {
    if (!process.env.DEMO_ADMIN_PASSWORD) return "Ukážkový režim: v .env.local chýba DEMO_ADMIN_PASSWORD.";
    const email = String(form.get("email")).trim().toLowerCase();
    const ok = allowedEmails().includes(email) && (await demoSignIn(email, String(form.get("password"))));
    if (!ok) return "Nesprávny e-mail alebo heslo.";
    redirect("/admin");
  }
  const missing = missingSupabaseEnv();
  if (missing.length) return `Admin ešte nie je nastavený – v .env.local chýba ${missing.join(", ")}.`;
  const supabase = await createAuthClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: String(form.get("email")),
    password: String(form.get("password")),
  });
  if (error) return "Nesprávny e-mail alebo heslo.";
  if (!isAdminUser(data.user)) {
    await supabase.auth.signOut();
    return "Tento účet nemá prístup.";
  }
  redirect("/admin");
}

export async function signOut() {
  if (isDemo()) {
    await demoSignOut();
    redirect("/admin/login");
  }
  if (missingSupabaseEnv().length) redirect("/admin/login");
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function saveCampaign(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id") ?? "");
  const row = {
    name: String(form.get("name") || "Kampaň bez názvu"),
    countries: list(form.get("countries")),
    industries: list(form.get("industries")),
    roles: list(form.get("roles")),
    notes: String(form.get("notes") ?? ""),
    outreach_language: String(form.get("outreach_language") || "auto"),
    leads_per_run: Math.min(30, Math.max(1, Number(form.get("leads_per_run")) || 10)),
    active: form.get("active") === "on",
  };
  if (id) check(await db().from("campaigns").update(row).eq("id", id));
  else check(await db().from("campaigns").insert(row));
  revalidatePath("/admin/campaigns");
}

export async function deleteCampaign(form: FormData) {
  await requireAdmin();
  check(await db().from("campaigns").delete().eq("id", String(form.get("id"))));
  revalidatePath("/admin/campaigns");
}

export async function runCampaign(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id"));
  let started: boolean;
  if (simulateAi()) {
    started = !(await runInProgress(id));
    if (started) await simulateRun(id);
  } else {
    started = (await startRun(id, "manual")) !== null;
  }
  revalidatePath("/admin/campaigns");
  redirect(started ? "/admin/campaigns" : `/admin/campaigns?busy=${id}`);
}

export async function updateLead(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id"));
  const { data: before } = await db().from("leads").select("status").eq("id", id).single();
  // The lead page saves the pipeline and the e-mail draft from separate forms, so only fields that were sent change.
  const sent = (key: string) => (form.has(key) ? String(form.get(key) ?? "") : undefined);
  const status = sent("status");
  const patch = {
    status,
    next_action: sent("next_action") === undefined ? undefined : sent("next_action") || null,
    next_action_at: sent("next_action_at") === undefined ? undefined : sent("next_action_at") || null,
    notes: sent("notes"),
    outreach_subject: sent("outreach_subject"),
    outreach_body: sent("outreach_body"),
  };
  const changes = Object.fromEntries(Object.entries(patch).filter(([, value]) => value !== undefined));
  if (Object.keys(changes).length) check(await db().from("leads").update(changes).eq("id", id));
  if (before && status && before.status !== status) {
    check(await db().from("lead_events").insert({ lead_id: id, type: "status", body: `${before.status} → ${status}` }));
  }
  revalidatePath(`/admin/leads/${id}`);
}

export async function addLead(form: FormData) {
  await requireAdmin();
  const website = String(form.get("website") ?? "").trim();
  const domain = normalizeDomain(website);
  const { data, error } = await db()
    .from("leads")
    .insert({
      company_name: String(form.get("company_name")),
      website,
      domain,
      country: String(form.get("country") ?? ""),
      source: "manual",
    })
    .select("id")
    .single();
  // The domain is unique: open the lead we already have (the page says so) instead of failing.
  if (error?.code === "23505" && domain) {
    const { data: existing } = await db().from("leads").select("id").eq("domain", domain).maybeSingle();
    if (existing) redirect(`/admin/leads/${existing.id}?existing=1`);
  }
  if (error || !data) throw new Error(error?.message ?? "Lead sa nepodarilo uložiť.");
  redirect(`/admin/leads/${data.id}`);
}

/**
 * Deletes a lead with its history (spam, test records, erasure requests), the website inquiries linked to it
 * or sent from its contacts' addresses, and the contacts' e-mails and full names in the prospecting run logs.
 */
export async function deleteLead(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id"));
  const { data: lead } = await db().from("leads").select("company_name, contacts").eq("id", id).maybeSingle();
  if (!lead) redirect("/admin/leads");
  const inquiryIds = await leadInquiryIds(id, lead.contacts);
  if (inquiryIds.length) check(await db().from("inquiries").delete().in("id", inquiryIds));
  await redactRunLogs(lead.contacts);
  check(await db().from("lead_events").delete().eq("lead_id", id));
  check(await db().from("leads").delete().eq("id", id));
  revalidatePath("/admin", "layout");
  redirect(`/admin/leads?deleted=${encodeURIComponent(lead.company_name)}`);
}

/** Records a failed Claude step in the lead's history, where the admin sees the reason, instead of the generic error page. */
async function logAiFailure(leadId: string, what: string, err: unknown) {
  unstable_rethrow(err); // redirect() and notFound() are not failures
  console.error(`${what}:`, err);
  const { error } = await db().from("lead_events").insert({ lead_id: leadId, type: "ai", body: `${what}: ${aiErrorText(err)}` });
  if (error) console.error("Could not log the AI failure", error);
}

export async function enrich(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id"));
  try {
    if (simulateAi()) await simulateEnrich(id);
    else await enrichLead(id);
  } catch (err) {
    await logAiFailure(id, "Claude lead nepreskúmal", err);
  }
  revalidatePath(`/admin/leads/${id}`);
}

export async function rewriteOutreach(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id"));
  const language = String(form.get("language") || "en");
  const instructions = String(form.get("instructions") ?? "");
  try {
    if (simulateAi()) await simulateOutreach(id, language, instructions);
    else await writeOutreach(id, language, instructions);
  } catch (err) {
    await logAiFailure(id, "Claude e-mail neprepísal", err);
  }
  revalidatePath(`/admin/leads/${id}`);
}

/** `days` from today (UTC, like the inquiry task), moved to Monday when it falls on a weekend. */
function workdayIn(days: number): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  const weekday = date.getUTCDay();
  if (weekday === 6 || weekday === 0) date.setUTCDate(date.getUTCDate() + (weekday === 6 ? 2 : 1));
  return date.toISOString().slice(0, 10);
}

/**
 * "Označiť ako oslovený" / "E-mail odoslaný": records the sent e-mail. Only a new or qualified lead moves to
 * contacted (a won customer or a meeting keeps its status), and an answered inquiry task becomes a follow-up.
 */
export async function logContacted(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id"));
  const { data: before } = await db().from("leads").select("status, next_action").eq("id", id).maybeSingle();
  if (!before) {
    revalidatePath(`/admin/leads/${id}`);
    return;
  }
  const promote = PRE_CONTACT.includes(before.status);
  const followUp = before.next_action === NEXT_ACTION ? { next_action: FOLLOW_UP, next_action_at: workdayIn(3) } : null;
  if (promote || followUp) check(await db().from("leads").update({ ...(promote ? { status: "contacted" } : {}), ...followUp }).eq("id", id));
  if (promote) check(await db().from("lead_events").insert({ lead_id: id, type: "status", body: `${before.status} → contacted` }));
  const next = followUp ? ` Ďalší krok „${NEXT_ACTION}“ sa zmenil na „${FOLLOW_UP}“ s termínom ${fmtDay(followUp.next_action_at)}.` : "";
  check(await db().from("lead_events").insert({ lead_id: id, type: "outreach", body: `E-mail odoslaný.${next}` }));
  revalidatePath(`/admin/leads/${id}`);
}

export async function saveSettings(form: FormData) {
  await requireAdmin();
  check(
    await db()
      .from("settings")
      .upsert({ key: "company_profile", value: String(form.get("company_profile") ?? ""), updated_at: new Date().toISOString() }),
  );
  revalidatePath("/admin/settings");
}

/** A form list of at most 10 items of at most 80 characters each, or null when it is longer. */
function shortList(v: FormDataEntryValue | null): string[] | null {
  const items = list(v);
  return items.length <= 10 && items.every((item) => item.length <= 80) ? items : null;
}

const MARKET_FIELDS = ["country", "roles", "industries", "question"] as const;

/** Back to the form with a notice; what was typed comes along, so the form shows it again. */
function backToMarketForm(form: FormData, notice: Record<string, string>): never {
  const params = new URLSearchParams(notice);
  for (const key of MARKET_FIELDS) {
    const value = String(form.get(key) ?? "").trim();
    if (value) params.set(key, value.slice(0, 1200));
  }
  redirect(`/admin/market?${params}`);
}

export async function startMarketAnalysis(form: FormData) {
  await requireAdmin();
  const country = String(form.get("country") ?? "").trim();
  const roles = shortList(form.get("roles"));
  const industries = shortList(form.get("industries"));
  // Browsers send textarea line breaks as CRLF but count them as one character against maxLength.
  const question = String(form.get("question") ?? "").replace(/\r\n?/g, "\n").trim();
  if (!country || country.length > 100) backToMarketForm(form, { error: "country" });
  if (!roles) backToMarketForm(form, { error: "roles" });
  if (!industries) backToMarketForm(form, { error: "industries" });
  if (question.length > 1000) backToMarketForm(form, { error: "question" });

  const id = await createMarketReport({ country, roles, industries, question });
  if (!id) backToMarketForm(form, { busy: "1" });
  if (simulateAi()) await simulateMarketReport(id);
  else startMarketReport(id);
  revalidatePath("/admin", "layout");
  redirect(`/admin/market/${id}`);
}

export async function deleteMarketReport(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id"));
  const { data: row } = await db().from("market_reports").select("country, roles").eq("id", id).maybeSingle();
  if (row) check(await db().from("market_reports").delete().eq("id", id));
  revalidatePath("/admin", "layout");
  redirect(row ? `/admin/market?deleted=${encodeURIComponent(marketTitle(row))}` : "/admin/market");
}

async function leadIdByDomain(domain: string): Promise<string | null> {
  const { data } = await db().from("leads").select("id").eq("domain", domain).maybeSingle();
  return data?.id ?? null;
}

/**
 * "Pridať ako lead" on a company of a market analysis: a new lead, or the lead that already has the company's
 * domain. The report remembers the lead, so the page links to it, also for a company without a website.
 */
export async function addCompanyAsLead(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id"));
  const index = Number(form.get("index"));
  const { data: row } = await db().from("market_reports").select("*").eq("id", id).maybeSingle<MarketReportRow>();
  const company = row?.report && Number.isInteger(index) ? row.report.companies[index] : undefined;
  if (!row?.report || !company) redirect(`/admin/market/${id}`);

  const domain = normalizeDomain(company.website);
  let leadId: string | null = null;
  if (company.lead_id) {
    const { data } = await db().from("leads").select("id").eq("id", company.lead_id).maybeSingle();
    leadId = data?.id ?? null;
  }
  if (!leadId && domain) leadId = await leadIdByDomain(domain);
  if (!leadId) {
    const { data: lead, error } = await db()
      .from("leads")
      .insert({
        company_name: company.name.trim() || domain || "Firma z analýzy trhu",
        website: httpUrl(company.website),
        domain,
        country: row.country,
        city: company.city.trim() || null,
        industry: company.industry.trim() || null,
        signals: company.signal.trim() ? [{ type: "market_report", detail: company.signal.trim(), url: httpUrl(company.url) ?? "" }] : [],
        status: "new",
        source: "ai_prospecting",
      })
      .select("id")
      .single();
    // The domain is unique: a lead with it was added after our lookup.
    if (error?.code === "23505" && domain) leadId = await leadIdByDomain(domain);
    else if (error || !lead) throw new Error(error?.message ?? "Lead sa nepodarilo uložiť.");
    else {
      leadId = lead.id;
      check(await db().from("lead_events").insert({ lead_id: lead.id, type: "created", body: marketLog.addedEvent(marketTitle(row), fmtDay(row.created_at)) }));
    }
  }
  if (!leadId) throw new Error("Lead sa nepodarilo uložiť.");

  const companies = row.report.companies.map((c, i) => (i === index ? { ...c, lead_id: leadId } : c));
  check(await db().from("market_reports").update({ report: { ...row.report, companies } }).eq("id", id));
  revalidatePath("/admin", "layout");
}

/** An inactive campaign from the analysis' suggested campaign, to check and start by hand. */
export async function createCampaignFromReport(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id"));
  const { data: row } = await db().from("market_reports").select("*").eq("id", id).maybeSingle<MarketReportRow>();
  if (!row?.report) redirect(`/admin/market/${id}`);

  const suggested = row.report.suggested_campaign;
  const clean = (items: string[] | undefined, fallback: string[]) => {
    const kept = (items ?? []).map((item) => item.trim()).filter(Boolean).slice(0, 10);
    return kept.length ? kept : fallback;
  };
  const title = marketTitle(row);
  const name = suggested?.name?.trim() || `Kampaň z analýzy ${title}`;
  const regions = row.report.regions.map((r) => r.name.trim()).filter(Boolean).slice(0, 5).join(", ");
  check(
    await db().from("campaigns").insert({
      name,
      countries: clean(suggested?.countries, [row.country]),
      industries: clean(suggested?.industries, row.industries),
      roles: clean(suggested?.roles, row.roles),
      notes: `Z analýzy trhu ${title} (${fmtDay(row.created_at)}).${regions ? ` Zameraj sa najmä na regióny: ${regions}.` : ""}`,
      outreach_language: "auto",
      leads_per_run: 10,
      active: false,
    }),
  );
  revalidatePath("/admin/campaigns");
  redirect(`/admin/campaigns?created=${encodeURIComponent(name)}`);
}
