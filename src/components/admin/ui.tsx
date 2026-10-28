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
  if (score == null) return <span className="score score--none">–</span>;
  const level = score >= 75 ? "hi" : score >= 50 ? "mid" : "lo";
  return (
    <span className={`score score--${level}`}>
      {score}
      {tier ? <small>{tier}</small> : null}
    </span>
  );
}

export function Status({ status }: { status: string }) {
  return <span className={`pill pill--${status}`}>{statusLabel[status] ?? status}</span>;
}

export function sourceLabel(source: string) {
  return source === "ai_prospecting" ? "AI prospecting" : source === "inbound" ? "Web dopyt" : "Manuálne";
}

export function fmtDate(value: string | null) {
  if (!value) return "–";
  return new Date(value).toLocaleString("sk-SK", { dateStyle: "short", timeStyle: "short" });
}
