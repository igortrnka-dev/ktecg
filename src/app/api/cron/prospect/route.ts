import { NextResponse } from "next/server";
import { db } from "@/lib/supabase/admin";
import { executeRun } from "@/lib/ai/prospect";

/** Called by the Render cron job. Runs every active campaign one after another. */
export async function POST(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: campaigns } = await db().from("campaigns").select("id").eq("active", true);
  const ids = (campaigns ?? []).map((c) => c.id as string);

  void (async () => {
    for (const id of ids) {
      const { data: run } = await db().from("lead_runs").insert({ campaign_id: id, trigger: "cron" }).select("id").single();
      if (run) await executeRun(run.id, id);
    }
  })();

  return NextResponse.json({ started: ids.length }, { status: 202 });
}
