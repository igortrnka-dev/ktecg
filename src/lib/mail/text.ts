/** Slovak texts of the mail sync in the lead history, shared by the real sync, the demo and the seed. */

/** The task an incoming reply sets, due today. */
export const MAIL_REPLY = "Odpovedať na e-mail";
/** The task a bounce sets, due today. */
export const CHECK_ADDRESS = "Overiť e-mail kontaktu";

type LoggedEmail = {
  direction: "in" | "out";
  kind: string;
  from_email: string | null;
  from_name: string | null;
  to_emails: string[];
  cc_emails: string[];
  subject: string | null;
};

const day = (date: string) =>
  new Date(`${date.slice(0, 10)}T12:00:00Z`).toLocaleDateString("sk-SK", { day: "numeric", month: "numeric", year: "numeric" });

/** "Thomas Weidner <t.weidner@…>", or the bare address when there is no name. */
export function sender(name: string | null, email: string | null): string {
  if (name && email && name.toLowerCase() !== email.toLowerCase()) return `${name} <${email}>`;
  return email || name || "neznámy odosielateľ";
}

/** "From → To, Cc" of a recorded e-mail; a bounce names the addresses that failed. */
export function mailRoute(e: Pick<LoggedEmail, "kind" | "from_name" | "from_email" | "to_emails" | "cc_emails">): string {
  if (e.kind === "bounce") return `Nedoručené na ${e.to_emails.join(", ") || "–"}`;
  return `${sender(e.from_name, e.from_email)} → ${[...e.to_emails, ...e.cc_emails].join(", ") || "–"}`;
}

export const mailLog = {
  event(e: LoggedEmail): string {
    const subject = e.subject?.trim() || "(bez predmetu)";
    // A lead reached through Cc is named too; a bounce lists the addresses that failed.
    const to = (e.kind === "bounce" ? e.to_emails : [...e.to_emails, ...e.cc_emails]).join(", ") || "neznámu adresu";
    if (e.kind === "bounce") return `E-mail na ${to} sa nepodarilo doručiť: ${subject}`;
    if (e.kind === "auto_reply") {
      return e.direction === "in" ? `Automatická odpoveď od ${sender(e.from_name, e.from_email)}: ${subject}` : `Odoslaná automatická odpoveď na ${to}: ${subject}`;
    }
    return e.direction === "in" ? `Prišiel e-mail od ${sender(e.from_name, e.from_email)}: ${subject}` : `Odoslaný e-mail na ${to}: ${subject}`;
  },
  /** Appended to the e-mail event when the sync changes the lead's next step. */
  task(action: string, at: string, previous: { next_action: string | null; next_action_at: string | null }): string {
    const before =
      previous.next_action && previous.next_action !== action
        ? ` (predtým: ${previous.next_action}${previous.next_action_at ? `, ${day(previous.next_action_at)}` : ""})`
        : "";
    return ` — ďalší krok „${action}“ na ${day(at)}${before}`;
  },
};
