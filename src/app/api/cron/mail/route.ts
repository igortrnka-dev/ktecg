import { NextResponse } from "next/server";
import { missingSupabaseEnv } from "@/lib/supabase/config";
import { missingMailEnv } from "@/lib/mail/config";
import { syncMail } from "@/lib/mail/sync";

/** Called by the Render cron job every 15 minutes: reads new mail and records what belongs to leads. */
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const missing = [...missingSupabaseEnv(), ...missingMailEnv()];
  if (missing.length) return NextResponse.json({ error: "not_configured", missing }, { status: 503 });

  // A sync reads at most a few hundred messages, so the job waits for it and fails visibly on an error.
  const result = await syncMail();
  return NextResponse.json(result, { status: result.status === "error" ? 502 : 200 });
}
