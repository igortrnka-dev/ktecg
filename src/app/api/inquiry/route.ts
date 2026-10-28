import { NextResponse } from "next/server";
import * as z from "zod/v4";
import { db } from "@/lib/supabase/admin";
import { qualifyInquiry } from "@/lib/ai/leads";

const Inquiry = z.object({
  company: z.string().trim().min(1).max(200),
  name: z.string().trim().min(1).max(200),
  email: z.email().max(200),
  phone: z.string().trim().max(60).optional(),
  country: z.string().trim().max(100).optional(),
  positions: z.string().trim().max(500).optional(),
  headcount: z.coerce.number().int().min(1).max(10000).optional().catch(undefined),
  start_date: z.iso.date().optional().catch(undefined),
  message: z.string().trim().max(5000).optional(),
  locale: z.string().max(5).optional(),
  website: z.string().optional(), // honeypot
});

export async function POST(request: Request) {
  const parsed = Inquiry.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "invalid" }, { status: 400 });
  const { website, ...data } = parsed.data;
  if (website) return NextResponse.json({ ok: true }); // bot

  const clean = Object.fromEntries(Object.entries(data).map(([k, v]) => [k, v === "" ? null : v]));
  const { data: row, error } = await db().from("inquiries").insert(clean).select("id").single();
  if (error || !row) return NextResponse.json({ error: "db" }, { status: 500 });

  if (process.env.ANTHROPIC_API_KEY) {
    void qualifyInquiry(row.id).catch((err) => console.error("qualifyInquiry failed", err));
  }
  return NextResponse.json({ ok: true });
}
