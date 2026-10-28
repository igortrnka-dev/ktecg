import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/supabase/admin";

export const MODEL = "claude-opus-5-5";
/** Server-side refusal fallback: a declined request is re-run on Anthropic's recommended model. */
export const FALLBACK = { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const };

let client: Anthropic | null = null;
export function anthropic(): Anthropic {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY is not set.");
    client = new Anthropic({ timeout: 15 * 60 * 1000 });
  }
  return client;
}

export async function getCompanyProfile(): Promise<string> {
  const { data } = await db().from("settings").select("value").eq("key", "company_profile").maybeSingle();
  return typeof data?.value === "string" ? data.value : "KTechnology s.r.o. — industrial staff leasing worldwide.";
}

export function normalizeDomain(input?: string | null): string | null {
  if (!input) return null;
  try {
    const url = new URL(input.includes("://") ? input : `https://${input}`);
    return url.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return null;
  }
}

/** Plain text of a response, skipping tool blocks and thinking. */
export function textOf(content: Anthropic.Beta.BetaContentBlock[]): string {
  return content
    .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
    .map((b) => {
      const urls = (b.citations ?? [])
        .map((c) => ("url" in c ? c.url : null))
        .filter(Boolean);
      return urls.length ? `${b.text} [sources: ${[...new Set(urls)].join(", ")}]` : b.text;
    })
    .join("");
}
