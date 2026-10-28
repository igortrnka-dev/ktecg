import Link from "next/link";
import { db } from "@/lib/supabase/admin";
import { Score, Status, STATUSES, statusLabel, fmtDate, sourceLabel } from "@/components/admin/ui";

export default async function Dashboard() {
  const [{ data: leads }, { data: runs }, { count: inquiries }] = await Promise.all([
    db().from("leads").select("id, company_name, country, score, tier, status, source, next_action, next_action_at, created_at").order("created_at", { ascending: false }).limit(500),
    db().from("lead_runs").select("id, status, created, started_at, campaigns(name)").order("started_at", { ascending: false }).limit(5),
    db().from("inquiries").select("id", { count: "exact", head: true }),
  ]);

  const all = leads ?? [];
  const byStatus = Object.fromEntries(STATUSES.map((s) => [s, all.filter((l) => l.status === s).length]));
  const hot = all.filter((l) => l.tier === "A" && ["new", "qualified"].includes(l.status)).slice(0, 8);
  const today = new Date().toISOString().slice(0, 10);
  const due = all.filter((l) => l.next_action_at && l.next_action_at <= today && !["won", "lost", "disqualified"].includes(l.status));
  const week = all.filter((l) => Date.now() - new Date(l.created_at).getTime() < 7 * 864e5).length;

  return (
    <>
      <header className="page-head">
        <h1>Prehľad</h1>
        <Link className="abtn abtn--primary" href="/admin/campaigns">Spustiť AI prospecting</Link>
      </header>

      <section className="kpis">
        <div className="kpi"><span>Leady spolu</span><strong>{all.length}</strong></div>
        <div className="kpi"><span>Nové za 7 dní</span><strong>{week}</strong></div>
        <div className="kpi"><span>Tier A na oslovenie</span><strong>{hot.length}</strong></div>
        <div className="kpi"><span>Dopyty z webu</span><strong>{inquiries ?? 0}</strong></div>
      </section>

      <section className="funnel">
        {STATUSES.map((s) => (
          <Link key={s} href={`/admin/leads?status=${s}`} className="funnel__step">
            <strong>{byStatus[s]}</strong>
            <span>{statusLabel[s]}</span>
          </Link>
        ))}
      </section>

      <div className="grid2">
        <section className="card">
          <h2>Najteplejšie leady</h2>
          {hot.length === 0 && <p className="muted">Zatiaľ žiadne. Spustite kampaň v AI prospectingu.</p>}
          <ul className="rows">
            {hot.map((l) => (
              <li key={l.id}>
                <Link href={`/admin/leads/${l.id}`}>
                  <Score score={l.score} tier={l.tier} />
                  <span className="grow">{l.company_name}<small>{l.country} · {sourceLabel(l.source)}</small></span>
                  <Status status={l.status} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
        <section className="card">
          <h2>Úlohy na dnes</h2>
          {due.length === 0 && <p className="muted">Nič po termíne.</p>}
          <ul className="rows">
            {due.map((l) => (
              <li key={l.id}>
                <Link href={`/admin/leads/${l.id}`}>
                  <span className="grow">{l.next_action || "Follow-up"}<small>{l.company_name}</small></span>
                  <span className="mono muted">{l.next_action_at}</span>
                </Link>
              </li>
            ))}
          </ul>
          <h2 style={{ marginTop: 28 }}>Posledné AI behy</h2>
          <ul className="rows">
            {(runs ?? []).map((r) => (
              <li key={r.id}>
                <Link href="/admin/campaigns">
                  <span className="grow">{(r.campaigns as unknown as { name: string } | null)?.name ?? "–"}<small>{fmtDate(r.started_at)}</small></span>
                  <span className={`pill pill--run-${r.status}`}>{r.status === "running" ? "beží" : r.status === "done" ? `+${r.created}` : "chyba"}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
