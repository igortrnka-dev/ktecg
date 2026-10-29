"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { allowedEmails, isAdminUser, requireAdmin } from "@/lib/auth";
import { createAuthClient } from "@/lib/supabase/server";
import { missingSupabaseEnv } from "@/lib/supabase/config";
import { db } from "@/lib/supabase/admin";
import { runInProgress, startRun } from "@/lib/ai/prospect";
import { normalizeDomain } from "@/lib/ai/client";
import { enrichLead, writeOutreach } from "@/lib/ai/leads";
import { isDemo, simulateAi } from "@/lib/demo/mode";
import { demoSignIn, demoSignOut } from "@/lib/demo/session";
import { simulateEnrich, simulateOutreach, simulateRun } from "@/lib/demo/ai";

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
    name: String(form.get("name") || "Untitled campaign"),
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
  const status = String(form.get("status"));
  check(
    await db()
      .from("leads")
      .update({
        status,
        next_action: String(form.get("next_action") ?? "") || null,
        next_action_at: String(form.get("next_action_at") ?? "") || null,
        notes: String(form.get("notes") ?? ""),
        outreach_subject: String(form.get("outreach_subject") ?? ""),
        outreach_body: String(form.get("outreach_body") ?? ""),
      })
      .eq("id", id),
  );
  if (before && before.status !== status) {
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
  // The domain is unique: open the lead we already have instead of failing.
  if (error?.code === "23505" && domain) {
    const { data: existing } = await db().from("leads").select("id").eq("domain", domain).maybeSingle();
    if (existing) redirect(`/admin/leads/${existing.id}`);
  }
  if (error || !data) throw new Error(error?.message ?? "Lead sa nepodarilo uložiť.");
  redirect(`/admin/leads/${data.id}`);
}

export async function enrich(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id"));
  if (simulateAi()) await simulateEnrich(id);
  else await enrichLead(id);
  revalidatePath(`/admin/leads/${id}`);
}

export async function rewriteOutreach(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id"));
  const language = String(form.get("language") || "en");
  const instructions = String(form.get("instructions") ?? "");
  if (simulateAi()) await simulateOutreach(id, language, instructions);
  else await writeOutreach(id, language, instructions);
  revalidatePath(`/admin/leads/${id}`);
}

export async function logContacted(form: FormData) {
  await requireAdmin();
  const id = String(form.get("id"));
  check(await db().from("leads").update({ status: "contacted" }).eq("id", id));
  check(await db().from("lead_events").insert({ lead_id: id, type: "outreach", body: "Outreach e-mail sent." }));
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
