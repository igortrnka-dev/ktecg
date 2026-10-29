import { NextResponse } from "next/server";
import { db } from "@/lib/supabase/admin";
import { missingSupabaseEnv } from "@/lib/supabase/config";
import { closeStaleRuns, createRun, executeRun } from "@/lib/ai/prospect";

/** Called by the Render cron job. Runs every active campaign one after another. */
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const missing = [...missingSupabaseEnv(), ...(process.env.ANTHROPIC_API_KEY ? [] : ["ANTHROPIC_API_KEY"])];
  if (missing.length) return NextResponse.json({ error: "not_configured", missing }, { status: 503 });

  await closeStaleRuns();
  const { data: campaigns } = await db().from("campaigns").select("id").eq("active", true);
  const ids = (campaigns ?? []).map((c) => c.id as string);

  void (async () => {
    for (const id of ids) {
      // Checked just before each run, so a manual run or a second cron call is not duplicated.
      const runId = await createRun(id, "cron").catch(() => null);
      if (runId) await executeRun(runId, id).catch(() => {});
    }
  })();

  return NextResponse.json({ started: ids.length }, { status: 202 });
}
