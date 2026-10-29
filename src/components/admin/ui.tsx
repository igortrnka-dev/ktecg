import { plural } from "@/lib/plural";

export const STATUSES = ["new", "qualified", "contacted", "replied", "meeting", "won", "lost", "disqualified"] as const;

export const statusLabel: Record<string, string> = {
  new: "Nový",
  qualified: "Kvalifikovaný",
  contacted: "Oslovený",
  replied: "Odpovedal",
  meeting: "Stretnutie",
  won: "Získaný",
  lost: "Stratený",
  disqualified: "Vyradený",
};

export function Score({ score, tier }: { score: number | null; tier?: string | null }) {
  if (score == null) return <span className="score score--none" title="Zatiaľ bez hodnotenia">–</span>;
  const level = score >= 75 ? "hi" : score >= 50 ? "mid" : "lo";
  return (
    <span className={`score score--${level}`} title={`Skóre ${score} zo 100${tier ? `, tier ${tier}` : ""}`}>
      {score}
      {tier ? <small>{tier}</small> : null}
    </span>
  );
}

export function Status({ status }: { status: string }) {
  return <span className={`chip chip--${status}`}>{statusLabel[status] ?? status}</span>;
}

/** "+1 nový", "+3 nové", "+5 nových"; a run that found nothing new says so. */
function newLeads(n: number) {
  return n === 0 ? "žiadne nové" : `+${n} ${plural(n, "nový", "nové", "nových")}`;
}

export function RunStatus({ status, created }: { status: string; created?: number | null }) {
  const label = status === "running" ? "Beží" : status === "done" ? newLeads(created ?? 0) : "Chyba";
  return <span className={`chip chip--run-${status}`}>{label}</span>;
}

/** A YYYY-MM-DD due date as "Dnes", "Zajtra", "Včera" or a short date; overdue dates are marked. */
export function Due({ date }: { date: string | null }) {
  if (!date) return <span className="muted">–</span>;
  const today = new Date().toISOString().slice(0, 10);
  const days = Math.round((Date.parse(date) - Date.parse(today)) / 864e5);
  const label = days === 0 ? "Dnes" : days === 1 ? "Zajtra" : days === -1 ? "Včera" : fmtDay(date);
  const tone = days < 0 ? "late" : days === 0 ? "today" : "later";
  return (
    <span className={`due due--${tone}`} title={days < 0 ? `Po termíne (${fmtDay(date)})` : fmtDay(date)}>
      {label}
    </span>
  );
}

export function sourceLabel(source: string) {
  return source === "ai_prospecting" ? "AI vyhľadávanie" : source === "inbound" ? "Web dopyt" : "Manuálne";
}

export function fmtDate(value: string | null) {
  if (!value) return "–";
  return new Date(value).toLocaleString("sk-SK", { dateStyle: "short", timeStyle: "short" });
}

export function fmtDay(value: string | null) {
  if (!value) return "–";
  return new Date(`${value.slice(0, 10)}T12:00:00Z`).toLocaleDateString("sk-SK", { day: "numeric", month: "numeric", year: "numeric" });
}
