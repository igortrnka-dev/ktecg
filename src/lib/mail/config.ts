import { companyDomain } from "../inquiries";

/** The env vars mail sync needs; IMAP_PORT (default 993) and IMAP_SENT_FOLDER are optional. */
export const MAIL_ENV = ["IMAP_HOST", "IMAP_USER", "IMAP_PASSWORD"] as const;

/** Shown in the setup hint and used as the mailbox of the local preview. */
export const COMPANY_MAILBOX = "office@ktechnology.sk";

export type MailConfig = { host: string; port: number; user: string; password: string; sentFolder: string | null };

/** Names (never values) of the mail env vars that are empty. */
export function missingMailEnv(): string[] {
  return MAIL_ENV.filter((name) => !process.env[name]?.trim());
}

export function mailConfigured(): boolean {
  return missingMailEnv().length === 0;
}

export function mailConfig(): MailConfig | null {
  if (!mailConfigured()) return null;
  return {
    host: process.env.IMAP_HOST!.trim(),
    port: Number(process.env.IMAP_PORT) || 993,
    user: process.env.IMAP_USER!.trim(),
    password: process.env.IMAP_PASSWORD!,
    sentFolder: process.env.IMAP_SENT_FOLDER?.trim() || null,
  };
}

/** The company's own address (lowercased); mail from it counts as sent. */
export function ownAddress(): string {
  return (process.env.IMAP_USER?.trim() || COMPANY_MAILBOX).toLowerCase();
}

/** KTechnology's own domain: its addresses never match a lead. */
export function ownDomain(): string | null {
  return companyDomain(ownAddress());
}
