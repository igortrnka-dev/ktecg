import Anthropic from "@anthropic-ai/sdk";
import { db } from "@/lib/supabase/admin";
import { AiStepError } from "./errors";

export const MODEL = "claude-opus-5-5";
/** Server-side refusal fallback: a declined request is re-run on Anthropic's recommended model. */
export const FALLBACK = { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const };

let client: Anthropic | null = null;
export function anthropic(): Anthropic {
  if (!client) {
    if (!process.env.ANTHROPIC_API_KEY) throw new AiStepError("Chýba ANTHROPIC_API_KEY, Claude nie je pripojený.");
    client = new Anthropic({ timeout: 15 * 60 * 1000 });
  }
  return client;
}

export async function getCompanyProfile(): Promise<string> {
  const { data } = await db().from("settings").select("value").eq("key", "company_profile").maybeSingle();
  return typeof data?.value === "string"
    ? data.value
    : "KTechnology s.r.o. (Slovakia): industrial staff leasing for projects across Europe and worldwide.";
}

/** "HTTPS://www.Firma.de:8080/kontakt" and "firma.de." both become "firma.de". */
export function normalizeDomain(input?: string | null): string | null {
  if (!input?.trim()) return null;
  try {
    const url = new URL(input.includes("://") ? input.trim() : `https://${input.trim()}`);
    return url.hostname.toLowerCase().replace(/\.+$/, "").replace(/^www\./, "") || null;
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
