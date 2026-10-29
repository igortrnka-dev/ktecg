import { NextResponse } from "next/server";
import * as z from "zod/v4";
import { db } from "@/lib/supabase/admin";
import { supabaseConfigured } from "@/lib/supabase/config";
import { qualifyInquiry } from "@/lib/ai/leads";
import { linkInquiry, SHIFT_PATTERNS, type InquiryRow } from "@/lib/inquiries";
import { isDemo, simulateAi } from "@/lib/demo/mode";
import { simulateInquiry } from "@/lib/demo/ai";
import { floodReached, ipLimited, readBody, senderLimited } from "./guard";

const MAX_BODY = 20 * 1024;

const Inquiry = z.object({
  company: z.string().trim().min(1).max(200),
  name: z.string().trim().min(1).max(200),
  email: z.email().max(200),
  phone: z.string().trim().max(60).optional(),
  country: z.string().trim().max(100).optional(),
  positions: z.string().trim().max(500).optional(),
  headcount: z.coerce.number().int().min(1).max(10000).optional().catch(undefined), // no longer on the form
  duration: z.string().trim().max(100).optional(),
  shift_pattern: z.enum(SHIFT_PATTERNS).or(z.literal("")).optional(),
  start_date: z.iso.date().optional().catch(undefined),
  message: z.string().trim().max(5000).optional(),
  locale: z.string().max(5).optional(),
  website: z.string().optional(), // honeypot
});

/** Top-level form fields that failed validation, for the form to mark; never the submitted values. */
function invalidFields(error: z.ZodError): string[] {
  const known = new Set(Object.keys(Inquiry.shape).filter((key) => key !== "website"));
  return [...new Set(error.issues.map((issue) => String(issue.path[0] ?? "")))].filter((key) => known.has(key));
}

function parseJson(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

/** Daily cap on Claude calls for inquiries; over it inquiries are still saved and linked. */
function aiDailyCap(): number {
  const raw = Number(process.env.INQUIRY_AI_DAILY_CAP);
  return process.env.INQUIRY_AI_DAILY_CAP && Number.isFinite(raw) ? raw : 50;
}

async function inquiriesToday(): Promise<number> {
  const midnight = new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString();
  const { count } = await db().from("inquiries").select("id", { count: "exact", head: true }).gte("created_at", midnight);
  return count ?? 0;
}

export async function POST(request: Request) {
  const tooLarge = () => NextResponse.json({ error: "too_large" }, { status: 413 });
  const tooMany = () => NextResponse.json({ error: "rate_limited" }, { status: 429, headers: { "retry-after": "600" } });
  if (Number(request.headers.get("content-length")) > MAX_BODY) return tooLarge();
  if (ipLimited(request)) return tooMany();
  const body = await readBody(request, MAX_BODY);
  if (body === null) return tooLarge();

  const parsed = Inquiry.safeParse(parseJson(body));
  if (!parsed.success) return NextResponse.json({ error: "invalid", fields: invalidFields(parsed.error) }, { status: 400 });
  const { website, ...data } = parsed.data;
  if (website) return NextResponse.json({ ok: true }); // bot
  // Counted only for inquiries that would be saved, so typos and bots do not use up a sender's quota.
  if (senderLimited(data.email)) return tooMany();

  if (!supabaseConfigured() && !isDemo()) return NextResponse.json({ error: "not_configured" }, { status: 503 });
  const flood = floodReached();

  const clean = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v === "" ? null : v]));
  const { data: row, error } = await db().from("inquiries").insert(clean).select("*").single<InquiryRow>();
  if (error || !row) return NextResponse.json({ error: "db" }, { status: 500 });

  // The inquiry is saved, so the visitor gets ok; an unlinked inquiry shows as "chyba" in the admin.
  let leadId: string;
  try {
    leadId = await linkInquiry(row);
  } catch (err) {
    console.error("linkInquiry failed", err);
    return NextResponse.json({ ok: true });
  }

  if (flood && (simulateAi() || process.env.ANTHROPIC_API_KEY)) {
    await db().from("lead_events").insert({
      lead_id: leadId,
      type: "ai",
      body: "Veľa dopytov naraz – Claude tento dopyt nevyhodnotil. Odpovedzte ručne alebo použite „Preskúmať znova s Claude“.",
    });
  } else if (simulateAi()) {
    void simulateInquiry(row.id, leadId).catch((err) => console.error("simulateInquiry failed", err));
  } else if (process.env.ANTHROPIC_API_KEY) {
    const cap = aiDailyCap();
    if ((await inquiriesToday()) <= cap) {
      void qualifyInquiry(row.id, leadId).catch((err) => console.error("qualifyInquiry failed", err));
    } else {
      await db().from("lead_events").insert({
        lead_id: leadId,
        type: "ai",
        body: `Denný limit AI pre dopyty (${cap}) je vyčerpaný, Claude tento dopyt nevyhodnotil. Odpovedzte ručne alebo použite „Preskúmať znova s Claude“.`,
      });
    }
  }
  return NextResponse.json({ ok: true });
}
