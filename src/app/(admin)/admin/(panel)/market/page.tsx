import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";
import { closeStaleReports } from "@/lib/ai/market";
import { MARKET_SEARCHES, marketTitle } from "@/lib/market";
import { MarketStatus, Opportunity, fmtDate } from "@/components/admin/ui";
import Icon from "@/components/admin/Icon";
import SubmitButton from "@/components/admin/SubmitButton";
import AutoRefresh from "@/components/admin/AutoRefresh";
import PageNotice from "@/components/admin/PageNotice";
import { startMarketAnalysis } from "../../actions";

type Search = {
  error?: string; busy?: string; deleted?: string;
  country?: string; roles?: string; industries?: string; question?: string;
};

type Row = {
  id: string; country: string; roles: string[]; industries: string[]; question: string;
  status: string; opportunity: string | null; created_at: string;
};

const ERRORS: Record<string, string> = {
  country: "Zadajte krajinu (najviac 100 znakov).",
  roles: "Profesie: najviac 10 položiek oddelených čiarkou, každá najviac 80 znakov.",
  industries: "Odvetvia: najviac 10 položiek oddelených čiarkou, každá najviac 80 znakov.",
  question: "Otázka alebo zameranie môže mať najviac 1000 znakov.",
};

export default async function Market({ searchParams }: { searchParams: Promise<Search> }) {
  await requireAdmin();
  const sp = await searchParams;
  // Otherwise an analysis cut off by a restart would keep this page polling.
  await closeStaleReports();
  const { data } = await db()
    .from("market_reports")
    .select("id, country, roles, industries, question, status, opportunity:report->>opportunity, created_at")
    .order("created_at", { ascending: false })
    .limit(100);
  const reports = (data ?? []) as Row[];
  const running = reports.find((r) => r.status === "running");

  return (
    <>
      <AutoRefresh active={Boolean(running)} />
      <header className="page-head">
        <div className="page-head__text">
          <h1>Analýzy trhu</h1>
          <p className="page-sub">
            Claude preskúma trh v krajine pre zvolené profesie: dopyt, firmy, ktoré hľadajú ľudí, konkurenciu, mzdy,
            pravidlá prenájmu pracovníkov a sezónnosť. Výsledok je analýza so zdrojmi, z ktorej pridáte firmy do leadov
            alebo vytvoríte kampaň.
          </p>
        </div>
        <a className="abtn" href="#nova-analyza"><Icon name="plus" />Nová analýza</a>
      </header>

      {sp.error ? (
        <PageNotice param="error">{ERRORS[sp.error] ?? "Skontrolujte formulár."}</PageNotice>
      ) : sp.busy ? (
        <PageNotice param="busy">Práve beží iná analýza. Novú spustíte, keď sa dokončí.</PageNotice>
      ) : sp.deleted !== undefined ? (
        <PageNotice param="deleted">
          Analýza {sp.deleted ? `„${sp.deleted}“ ` : ""}bola zmazaná. Leady a kampane vytvorené z nej ostávajú.
        </PageNotice>
      ) : null}

      <div className="grid-detail">
        <section className="card">
          <div className="card__head">
            <h2>Analýzy <span className="count">{reports.length}</span></h2>
            {running && <span className="chip chip--run-running">Prebieha</span>}
          </div>
          {reports.length === 0 ? (
            <p className="empty">Zatiaľ žiadna analýza. Spustite prvú vo formulári.</p>
          ) : (
            <ul className="list">
              {reports.map((r) => (
                <li key={r.id}>
                  <Link className="list__row" href={`/admin/market/${r.id}`}>
                    <span className="list__main">
                      <strong>{marketTitle(r)}</strong>
                      <span>{[fmtDate(r.created_at), r.industries.join(", ")].filter(Boolean).join(" · ")}</span>
                      {r.question && <span className="clamp">{r.question}</span>}
                    </span>
                    {r.status === "done" && r.opportunity ? <Opportunity level={r.opportunity} /> : <MarketStatus status={r.status} />}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card" id="nova-analyza">
          <div className="card__head">
            <div>
              <h2>Nová analýza</h2>
              <p>Zadajte krajinu a profesie, ktoré chceme prenajímať.</p>
            </div>
          </div>
          {/* Keyed by the values sent back after a refused start, so the form shows them again. */}
          <form
            key={[sp.country, sp.roles, sp.industries, sp.question].join("\u0000")}
            action={startMarketAnalysis}
            className="card__body"
          >
            <label className="afield">
              <span>Krajina</span>
              <input name="country" required maxLength={100} defaultValue={sp.country} placeholder="napr. Nemecko" />
            </label>
            <label className="afield">
              <span>Profesie</span>
              <input name="roles" required defaultValue={sp.roles} placeholder="napr. zvárači, elektrikári" />
              <small>oddeľte čiarkou, najviac 10</small>
            </label>
            <label className="afield">
              <span>Odvetvia (nepovinné)</span>
              <input name="industries" defaultValue={sp.industries} placeholder="napr. strojárstvo, energetika" />
              <small>oddeľte čiarkou</small>
            </label>
            <label className="afield">
              <span>Otázka alebo zameranie (nepovinné)</span>
              <textarea
                name="question"
                rows={3}
                maxLength={1000}
                defaultValue={sp.question}
                placeholder="napr. Kde sú odstávky v 1. polroku a aké sú sadzby za prenajatých zváračov?"
              />
            </label>
            <p className="muted small">
              Jedna analýza použije približne {MARKET_SEARCHES} vyhľadávaní na webe a trvá niekoľko minút. Naraz beží len jedna.
            </p>
            {running && (
              <p className="notice notice--busy" role="status">
                Práve beží analýza <Link className="link" href={`/admin/market/${running.id}`}>{marketTitle(running)}</Link>.
                Novú spustíte, keď sa dokončí.
              </p>
            )}
            <div className="actions">
              <SubmitButton className="abtn abtn--primary" pending="Spúšťam…" disabled={Boolean(running)}>
                <Icon name="play" />Spustiť analýzu
              </SubmitButton>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}
