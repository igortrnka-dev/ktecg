/** A failure of the mail sync whose message is already Slovak and safe to show in the admin. */
export class MailStepError extends Error {}
/** A failed read or write of our own database during the sync. */
export class MailDbError extends Error {}

export const MAIL_ERROR = {
  auth: "Schránka odmietla prihlásenie. Skontrolujte IMAP_USER a IMAP_PASSWORD.",
  host: "Server pošty sa nenašiel. Skontrolujte IMAP_HOST (pre Websupport imap.websupport.sk).",
  network: "Nepodarilo sa spojiť so serverom pošty (sieť alebo časový limit). Skontrolujte IMAP_HOST, IMAP_PORT a pripojenie k sieti.",
  tls: "Šifrované spojenie so serverom pošty zlyhalo (certifikát). Skontrolujte IMAP_HOST a IMAP_PORT (993).",
  db: "E-maily sa nepodarilo uložiť do databázy. Skontrolujte, či bola spustená migrácia supabase/migrations/0004_mail.sql; podrobnosti sú v logu servera.",
  /** Pošta and the overview, when lead_emails cannot be read. */
  read: "E-maily sa nepodarilo načítať z databázy. Ak ešte nebola spustená migrácia supabase/migrations/0004_mail.sql, spustite ju v Supabase (SQL Editor).",
  other: "Synchronizácia pošty zlyhala. Podrobnosti sú v logu servera.",
};

const NETWORK = new Set([
  "ECONNREFUSED", "ECONNRESET", "ETIMEDOUT", "EHOSTUNREACH", "ENETUNREACH", "EPIPE",
  "CONNECT_TIMEOUT", "GREETING_TIMEOUT", "UPGRADE_TIMEOUT", "ETIMEOUT",
  "NoConnection", "EConnectionClosed", "ClosedAfterConnectTLS", "ClosedAfterConnectText",
]);

type ImapLikeError = { code?: string; authenticationFailed?: boolean; serverResponseCode?: string; tlsFailed?: boolean; message?: string };

/** A short Slovak reason for the admin; the raw error belongs in the server log. */
export function mailErrorText(err: unknown): string {
  if (err instanceof MailStepError) return err.message;
  if (err instanceof MailDbError) return MAIL_ERROR.db;
  const e = (err ?? {}) as ImapLikeError;
  const code = e.code ?? "";
  if (e.authenticationFailed || e.serverResponseCode === "AUTHENTICATIONFAILED") return MAIL_ERROR.auth;
  if (code === "ENOTFOUND" || code === "EAI_AGAIN") return MAIL_ERROR.host;
  if (e.tlsFailed || /CERT|SELF_SIGNED|VERIFY|ISSUER|ERR_TLS|ERR_SSL/.test(code)) return MAIL_ERROR.tls;
  if (NETWORK.has(code)) return MAIL_ERROR.network;
  return MAIL_ERROR.other;
}

/** Code and message only: never the request, which for LOGIN would carry the password. */
export function logText(err: unknown): string {
  const e = (err ?? {}) as ImapLikeError;
  return [e.code, e.serverResponseCode, e.message].filter(Boolean).join(" ") || String(err);
}
