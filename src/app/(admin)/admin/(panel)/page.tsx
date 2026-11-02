import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";
import { Due, MarketStatus, Opportunity, RunStatus, Score, Status, STATUSES, fmtDate, percent, sourceLabel } from "@/components/admin/ui";
import Icon from "@/components/admin/Icon";
import { marketTitle } from "@/lib/market";
import { mailConfigured } from "@/lib/mail/config";
import { maybeSyncMail } from "@/lib/mail/sync";
import { newRepliesCount, outreachStats } from "@/lib/mail/stats";
import { simulateMail } from "@/lib/demo/mode";

const HOT_STATUSES = ["new", "qualified"];

export default async function Dashboard() {
  await requireAdmin();
  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString();
  const countLeads = () => db().from("leads").select("id", { count: "exact", head: true });
  const mailOn = mailConfigured() || simulateMail();
  await maybeSyncMail();

  const [byStatusCount, { count: week }, { count: hotCount }, { data: hotRows }, { data: dueRows }, { data: runs }, { count: inquiries }, { count: inquiriesWeek }, { data: market }] =
    await Promise.all([
      Promise.all(STATUSES.map((s) => countLeads().eq("status", s))),
      countLeads().gte("created_at", weekAgo),
      countLeads().eq("tier", "A").in("status", HOT_STATUSES),
      db().from("leads").select("id, company_name, country, score, tier, status, source").eq("tier", "A").in("status", HOT_STATUSES).order("score", { ascending: false, nullsFirst: false }).limit(8),
      // Won leads stay: a repeat inquiry from a customer sets a task on a won lead.
      db().from("leads").select("id, company_name, next_action, next_action_at").lte("next_action_at", today).not("status", "in", "(lost,disqualified)").order("next_action_at"),
      db().from("lead_runs").select("id, status, created, started_at, campaigns(name)").order("started_at", { ascending: false }).limit(5),
      db().from("inquiries").select("id", { count: "exact", head: true }),
      db().from("inquiries").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
      db().from("market_reports").select("id, country, roles, status, opportunity:report->>opportunity, created_at").order("created_at", { ascending: false }).limit(1).maybeSingle(),
    ]);

  const [newReplies, mail] = mailOn ? await Promise.all([newRepliesCount(7), outreachStats(30)]) : [0, null];

  const byStatus = Object.fromEntries(STATUSES.map((s, i) => [s, byStatusCount[i].count ?? 0]));
  const total = Object.values(byStatus).reduce((sum, n) => sum + n, 0);
  const active = total - byStatus.won - byStatus.lost - byStatus.disqualified;
  const hot = hotRows ?? [];
  const due = dueRows ?? [];
  const dateLabel = new Date().toLocaleDateString("sk-SK", { weekday: "long", day: "numeric", month: "long" });

  return (
    <>
      <header className="page-head">
        <div className="page-head__text">
          <h1>Prehľad</h1>
          <p className="page-sub">Dnes je {dateLabel}. Najprv úlohy, potom najlepšie firmy na oslovenie.</p>
        </div>
        <Link className="abtn abtn--primary" href="/admin/campaigns"><Icon name="spark" />Nájsť nové firmy</Link>
      </header>

      <section className="kpis" aria-label="Čísla">
        <Link href="/admin/leads" className="card kpi">
          <span className="kpi__label">Leady v práci</span>
          <span className="kpi__value">{active}</span>
          <span className="kpi__hint">z {total} spolu</span>
        </Link>
        <Link href="/admin/leads?tier=A" className="card kpi">
          <span className="kpi__label">Tier A na oslovenie</span>
          <span className="kpi__value">{hotCount ?? 0}</span>
          <span className="kpi__hint">nové a kvalifikované</span>
        </Link>
        <div className="card kpi">
          <span className="kpi__label">Nové leady</span>
          <span className="kpi__value">{week ?? 0}</span>
          <span className="kpi__hint">za posledných 7 dní</span>
        </div>
        <Link href="/admin/inquiries" className="card kpi">
          <span className="kpi__label">Dopyty z webu</span>
          <span className="kpi__value">{inquiriesWeek ?? 0}</span>
          <span className="kpi__hint">za 7 dní, {inquiries ?? 0} spolu</span>
        </Link>
      </section>

      <div className="grid2">
        <section className="card">
          <div className="card__head">
            <h2>Úlohy na dnes <span className="count">{due.length}</span></h2>
            <span className="muted small">vrátane úloh po termíne</span>
          </div>
          {due.length === 0 ? (
            <p className="empty">Na dnes nie je nič naplánované.</p>
          ) : (
            <ul className="list">
              {due.map((l) => (
                <li key={l.id}>
                  <Link className="list__row" href={`/admin/leads/${l.id}`}>
                    <span className="list__main"><strong>{l.next_action || "Ozvať sa"}</strong><span>{l.company_name}</span></span>
                    <Due date={l.next_action_at} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card">
          <div className="card__head">
            <h2>Najlepšie firmy na oslovenie</h2>
            <Link href="/admin/leads?tier=A" className="link small">Všetky</Link>
          </div>
          {hot.length === 0 ? (
            <p className="empty">Zatiaľ žiadne. Spustite AI vyhľadávanie firiem.</p>
          ) : (
            <ul className="list">
              {hot.map((l) => (
                <li key={l.id}>
                  <Link className="list__row" href={`/admin/leads/${l.id}`}>
                    <Score score={l.score} tier={l.tier} />
                    <span className="list__main"><strong>{l.company_name}</strong><span>{[l.country, sourceLabel(l.source)].filter(Boolean).join(" · ")}</span></span>
                    <Status status={l.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="card" style={{ marginTop: 16 }}>
        <div className="card__head">
          <h2>Pošta</h2>
          <Link href="/admin/mail" className="link small">Priebeh oslovovania</Link>
        </div>
        {mail ? (
          <div className="card__body">
            <div className="stats">
              <Link href="/admin/mail" className="stat"><strong>{newReplies}</strong><span>nové odpovede za 7 dní</span></Link>
              <Link href="/admin/mail" className="stat">
                <strong>{percent(mail.replied, mail.outreached)}</strong>
                <span>miera odpovedí za 30 dní ({mail.replied} z {mail.outreached} oslovených)</span>
              </Link>
            </div>
          </div>
        ) : (
          <p className="empty">
            Schránka nie je pripojená, odpovede firiem sa tu zatiaľ neukazujú. <Link href="/admin/mail" className="link">Pripojiť schránku</Link>
          </p>
        )}
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <div className="card__head">
          <h2>Leady podľa stavu</h2>
          <span className="muted small">kliknutím otvoríte zoznam</span>
        </div>
        <div className="pipeline">
          {STATUSES.map((s) => (
            <Link key={s} href={`/admin/leads?status=${s}`} className="pipeline__step">
              <strong>{byStatus[s]}</strong>
              <Status status={s} />
            </Link>
          ))}
        </div>
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <div className="card__head">
          <h2>Posledné AI vyhľadávania</h2>
          <Link href="/admin/campaigns" className="link small">Kampane</Link>
        </div>
        {(runs ?? []).length === 0 ? (
          <p className="empty">Zatiaľ neprebehlo žiadne vyhľadávanie.</p>
        ) : (
          <ul className="list">
            {(runs ?? []).map((r) => (
              <li key={r.id}>
                <Link className="list__row" href="/admin/campaigns">
                  <span className="list__main"><strong>{(r.campaigns as unknown as { name: string } | null)?.name ?? "Kampaň bola zmazaná"}</strong><span>{fmtDate(r.started_at)}</span></span>
                  <RunStatus status={r.status} created={r.created} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card" style={{ marginTop: 16 }}>
        <div className="card__head">
          <h2>Posledná analýza trhu</h2>
          <Link href="/admin/market" className="link small">Všetky analýzy</Link>
        </div>
        {market ? (
          <ul className="list">
            <li>
              <Link className="list__row" href={`/admin/market/${market.id}`}>
                <span className="list__main"><strong>{marketTitle(market)}</strong><span>{fmtDate(market.created_at)}</span></span>
                {market.status === "done" && market.opportunity ? <Opportunity level={market.opportunity} /> : <MarketStatus status={market.status} />}
              </Link>
            </li>
          </ul>
        ) : (
          <p className="empty">Zatiaľ žiadna analýza. <Link href="/admin/market" className="link">Spustiť analýzu trhu</Link></p>
        )}
      </section>
    </>
  );
}
