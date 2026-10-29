import Anthropic from "@anthropic-ai/sdk";

/** A failure of our own AI step whose message is already Slovak and safe to show in the admin. */
export class AiStepError extends Error {}

export const AI_ERROR = {
  timeout: "Claude neodpovedal včas. Skúste to znova.",
  network: "Nepodarilo sa spojiť s Anthropic API (sieť). Skúste to znova o chvíľu.",
  overloaded: "Claude je momentálne preťažený. Skúste to znova o pár minút.",
  rateLimit: "Prekročený limit požiadaviek na Anthropic API. Skúste to znova o pár minút.",
  auth: "Anthropic API odmietlo kľúč. Skontrolujte ANTHROPIC_API_KEY.",
  permission: "Kľúč Anthropic API nemá na túto požiadavku oprávnenie.",
  billing: "Na účte Anthropic chýba kredit.",
  server: "Chyba na strane Anthropic. Skúste to znova neskôr.",
  other: "Krok s Claude zlyhal. Podrobnosti sú v logu servera.",
};

/** A short Slovak reason for a failed Claude step, for the admin; the raw error belongs in the server log. */
export function aiErrorText(err: unknown): string {
  if (err instanceof AiStepError) return err.message;
  if (err instanceof Anthropic.APIConnectionTimeoutError) return AI_ERROR.timeout;
  if (err instanceof Anthropic.APIConnectionError) return AI_ERROR.network;
  if (err instanceof Anthropic.APIError) {
    const { status, type } = err;
    if (status === 529 || type === "overloaded_error") return AI_ERROR.overloaded;
    if (status === 429 || type === "rate_limit_error") return AI_ERROR.rateLimit;
    if (status === 401 || type === "authentication_error") return AI_ERROR.auth;
    if (status === 403 || type === "permission_error") return AI_ERROR.permission;
    if (type === "billing_error" || /credit balance/i.test(err.message)) return AI_ERROR.billing;
    if (type === "timeout_error") return AI_ERROR.timeout;
    if ((status ?? 0) >= 500 || type === "api_error") return AI_ERROR.server;
  }
  return AI_ERROR.other;
}
