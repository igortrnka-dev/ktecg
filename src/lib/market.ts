import type { MarketReportData } from "./ai/schemas";

/** A company of a report; lead_id is set once "Pridať ako lead" has put it into the pipeline. */
export type MarketCompany = MarketReportData["companies"][number] & { lead_id?: string };

export type MarketReportRow = {
  id: string;
  country: string;
  roles: string[];
  industries: string[];
  question: string;
  status: "running" | "done" | "failed";
  report: (Omit<MarketReportData, "companies"> & { companies: MarketCompany[] }) | null;
  log: string | null;
  error: string | null;
  usage: { web_searches?: number } | null;
  created_at: string;
  finished_at: string | null;
};

/** Web searches one analysis may use. */
export const MARKET_SEARCHES = 20;

/** "Nemecko · zvárači, elektrikári" */
export function marketTitle(r: { country: string; roles: string[] }): string {
  return [r.country, r.roles.join(", ")].filter(Boolean).join(" · ");
}

/**
 * The link for an http(s) URL or a bare domain ("firma.de"), else null, so a report never renders
 * javascript: or other schemes, nor turns a word like "neuvedené" into a link.
 */
export function httpUrl(value?: string | null): string | null {
  const text = value?.trim();
  if (!text) return null;
  const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(text);
  if (!hasScheme && !/^[\p{L}\d-]+(\.[\p{L}\d-]+)+([/?#:]|$)/u.test(text)) return null;
  try {
    const url = new URL(hasScheme ? text : `https://${text}`);
    return (url.protocol === "http:" || url.protocol === "https:") && url.hostname ? url.href : null;
  } catch {
    return null;
  }
}
