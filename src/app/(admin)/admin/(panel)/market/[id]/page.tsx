import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";
import { closeStaleReports } from "@/lib/ai/market";
import { normalizeDomain } from "@/lib/ai/client";
import { httpUrl, marketTitle, type MarketCompany, type MarketReportRow } from "@/lib/market";
import { MarketStatus, Opportunity, fmtDate } from "@/components/admin/ui";
import Icon from "@/components/admin/Icon";
import SubmitButton from "@/components/admin/SubmitButton";
import AutoRefresh from "@/components/admin/AutoRefresh";
import { plural } from "@/lib/plural";
import { addCompanyAsLead, createCampaignFromReport, deleteMarketReport } from "../../../actions";

/** An outside link, only for http(s) URLs; anything else renders nothing (or the fallback text). */
function Ext({ href, children, fallback }: { href?: string | null; children: React.ReactNode; fallback?: React.ReactNode }) {
  const url = httpUrl(href);
  if (!url) return fallback ?? null;
  return (
    <a className="link" href={url} target="_blank" rel="noopener noreferrer">
      {children}
      <Icon name="external" size={12} />
    </a>
  );
}

const host = (website: string) => {
  const url = httpUrl(website);
  return url ? new URL(url).hostname.replace(/^www\./, "") : null;
};

const searches = (n: number) => `${n} ${plural(n, "vyhľadávanie", "vyhľadávania", "vyhľadávaní")} na webe`;

function Empty() {
  return <p className="empty">Claude k tomu v zdrojoch nič nenašiel.</p>;
}

export default async function MarketReportPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  await closeStaleReports();
  const { data: row } = await db().from("market_reports").select("*").eq("id", id).maybeSingle<MarketReportRow>();
  if (!row) notFound();

  const title = marketTitle(row);
  const report = row.status === "done" ? row.report : null;
  const companies = report?.companies ?? [];

  // A company is in the pipeline when "Pridať ako lead" linked a lead that still exists, or a lead has its domain.
  const domains = [...new Set(companies.map((c) => normalizeDomain(c.website)).filter((d): d is string => Boolean(d)))];
  const linked = companies.map((c) => c.lead_id).filter((l): l is string => Boolean(l));
  const [byDomain, byId] = await Promise.all([
    domains.length ? db().from("leads").select("id, domain").in("domain", domains).then((r) => r.data ?? []) : [],
    linked.length ? db().from("leads").select("id").in("id", linked).then((r) => r.data ?? []) : [],
  ]);
  const leadOf = (c: MarketCompany): string | null => {
    if (c.lead_id && byId.some((l) => l.id === c.lead_id)) return c.lead_id;
    const domain = normalizeDomain(c.website);
    return (domain && byDomain.find((l) => l.domain === domain)?.id) || null;
  };

  // The new-analysis form prefilled with this analysis's input.
  const rerun = { country: row.country, roles: row.roles.join(", "), industries: row.industries.join(", "), question: row.question };
  const rerunHref = `/admin/market?${new URLSearchParams(Object.entries(rerun).filter(([, v]) => v))}#nova-analyza`;

  const deleteConfirm = [
    `Naozaj zmazať analýzu „${title}“?`,
    row.status === "running" ? "Analýza ešte beží: prieskum na pozadí dobehne a spotrebuje kredit, ale výsledok sa neuloží." : "",
    "Leady a kampane vytvorené z nej ostanú. Zmazanie sa nedá vrátiť.",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <AutoRefresh active={row.status === "running"} />
      <header className="page-head">
        <div className="page-head__text">
          <Link href="/admin/market" className="crumb"><Icon name="back" size={14} />Analýzy trhu</Link>
          <h1>{title}</h1>
          <div className="page-meta">
            <MarketStatus status={row.status} />
            {report && <Opportunity level={report.opportunity} />}
            <span>{fmtDate(row.created_at)}</span>
            {row.industries.length > 0 && <span>{row.industries.join(", ")}</span>}
            {(row.status !== "running" || Boolean(row.usage?.web_searches)) && <span>{searches(row.usage?.web_searches ?? 0)}</span>}
          </div>
        </div>
        <div className="head-actions">
          {report && (
            <form action={createCampaignFromReport}>
              <input type="hidden" name="id" value={row.id} />
              <SubmitButton
                className="abtn abtn--primary"
                pending="Vytváram…"
                title="Vytvorí kampaň AI vyhľadávania podľa návrhu z analýzy, len na ručné hľadanie."
              >
                <Icon name="spark" />Vytvoriť kampaň z analýzy
              </SubmitButton>
            </form>
          )}
          <form action={deleteMarketReport}>
            <input type="hidden" name="id" value={row.id} />
            <SubmitButton className="abtn abtn--ghost abtn--danger" pending="Mažem…" confirm={deleteConfirm}>
              <Icon name="trash" />Zmazať analýzu
            </SubmitButton>
          </form>
        </div>
      </header>

      {row.status === "running" && (
        <section className="card">
          <div className="card__body">
            <p className="notice notice--busy" role="status">
              Claude práve skúma trh na webe. Zvyčajne to trvá niekoľko minút, stránka sa obnovuje sama.
            </p>
            {row.question && <p><span className="muted">Otázka:</span> {row.question}</p>}
            {row.log && <pre className="log log--tall">{row.log}</pre>}
          </div>
        </section>
      )}

      {row.status === "failed" && (
        <section className="card">
          <div className="card__body">
            <p className="notice notice--error" role="alert">
              <strong>Analýza zlyhala.</strong> {row.error || "Podrobnosti sú v zázname nižšie."}
            </p>
            {row.question && <p><span className="muted">Otázka:</span> {row.question}</p>}
            <div className="actions">
              <Link className="abtn abtn--primary" href={rerunHref}><Icon name="play" />Spustiť znova</Link>
              <span className="muted small">Otvorí formulár s rovnakým zadaním. Zápis prieskumu ostáva nižšie.</span>
            </div>
            {row.log && <pre className="log log--tall">{row.log}</pre>}
          </div>
        </section>
      )}

      {row.status === "done" && !report && (
        <section className="card"><p className="empty">Analýza nemá uložený výsledok.</p></section>
      )}

      {report && (
        <>
          <div className="grid-detail">
            <div className="stack">
              <section className="card">
                <div className="card__head">
                  <h2>Zhrnutie</h2>
                  <Opportunity level={report.opportunity} />
                </div>
                <div className="card__body">
                  {row.question && <p><span className="muted">Otázka:</span> {row.question}</p>}
                  <p className="prose">{report.summary}</p>
                  {report.opportunity_reason && (
                    <p className="prose"><strong>Príležitosť {report.opportunity}:</strong> {report.opportunity_reason}</p>
                  )}
                </div>
              </section>

              <section className="card">
                <div className="card__head"><h2>Dopyt <span className="count">{report.demand_signals.length}</span></h2></div>
                {report.demand_signals.length === 0 ? <Empty /> : (
                  <ul className="list">
                    {report.demand_signals.map((s, i) => (
                      <li key={i} className="ritem">
                        <strong>{s.title}</strong>
                        {s.detail && <p>{s.detail}</p>}
                        <Ext href={s.url}>Zdroj</Ext>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="card">
                <div className="card__head"><h2>Regióny a odvetvia</h2></div>
                {report.regions.length === 0 && report.industries.length === 0 ? <Empty /> : (
                  [
                    { label: "Regióny", items: report.regions },
                    { label: "Odvetvia", items: report.industries },
                  ].map(({ label, items }) => items.length > 0 && (
                    <div key={label}>
                      <h3 className="rgroup">{label}</h3>
                      <ul className="list">
                        {items.map((item, i) => (
                          <li key={i} className="ritem">
                            <strong>{item.name}</strong>
                            {item.detail && <p>{item.detail}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))
                )}
              </section>

              <section className="card">
                <div className="card__head">
                  <div>
                    <h2>Firmy, ktoré hľadajú ľudí <span className="count">{companies.length}</span></h2>
                    <p>Firmy s konkrétnym signálom. „Pridať ako lead“ ich vloží do leadov, odkiaľ ich oslovíte.</p>
                  </div>
                </div>
                {companies.length === 0 ? <Empty /> : (
                  <ul className="list">
                    {companies.map((c, i) => {
                      const leadId = leadOf(c);
                      const site = host(c.website);
                      return (
                        <li key={i} className="ritem ritem--company">
                          <div className="ritem__main">
                            <strong>{c.name}</strong>
                            {(c.city || c.industry) && <span className="muted small">{[c.city, c.industry].filter(Boolean).join(" · ")}</span>}
                            {c.signal && <p>{c.signal}</p>}
                            <span className="ritem__links">
                              {site && <Ext href={c.website}>{site}</Ext>}
                              <Ext href={c.url}>Zdroj</Ext>
                            </span>
                          </div>
                          {leadId ? (
                            <Link className="abtn abtn--small abtn--ghost" href={`/admin/leads/${leadId}`}>
                              <Icon name="check" size={14} />Už je v leadoch
                            </Link>
                          ) : (
                            <form action={addCompanyAsLead}>
                              <input type="hidden" name="id" value={row.id} />
                              <input type="hidden" name="index" value={i} />
                              <SubmitButton className="abtn abtn--small" pending="Pridávam…">
                                <Icon name="plus" size={14} />Pridať ako lead
                              </SubmitButton>
                            </form>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
            </div>

            <div className="stack">
              <section className="card">
                <div className="card__head"><h2>Konkurencia <span className="count">{report.competitors.length}</span></h2></div>
                {report.competitors.length === 0 ? <Empty /> : (
                  <ul className="list">
                    {report.competitors.map((c, i) => (
                      <li key={i} className="ritem">
                        <strong>{c.name}</strong>
                        {c.detail && <p>{c.detail}</p>}
                        {host(c.website) && <Ext href={c.website}>{host(c.website)}</Ext>}
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="card">
                <div className="card__head">
                  <h2>Mzdy a sadzby</h2>
                  <span className="tag">orientačné</span>
                </div>
                {report.wages.length === 0 ? <Empty /> : (
                  <ul className="list">
                    {report.wages.map((w, i) => (
                      <li key={i} className="ritem">
                        <span><strong>{w.role}</strong>{w.range && <> · {w.range}</>}</span>
                        {w.detail && <p>{w.detail}</p>}
                        <Ext href={w.url}>Zdroj</Ext>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="card">
                <div className="card__head"><h2>Pravidlá a povolenia</h2></div>
                <div className="card__body" style={{ paddingBottom: report.regulations.length ? 0 : undefined }}>
                  <p className="notice notice--demo">Informatívne, overte pred použitím. Nie je to právna rada.</p>
                </div>
                {report.regulations.length === 0 ? <Empty /> : (
                  <ul className="list">
                    {report.regulations.map((r, i) => (
                      <li key={i} className="ritem">
                        <strong>{r.title}</strong>
                        {r.detail && <p>{r.detail}</p>}
                        <Ext href={r.url}>Zdroj</Ext>
                      </li>
                    ))}
                  </ul>
                )}
              </section>

              <section className="card">
                <div className="card__head"><h2>Sezónnosť</h2></div>
                {report.seasonality ? <div className="card__body"><p className="prose">{report.seasonality}</p></div> : <Empty />}
              </section>

              <section className="card">
                <div className="card__head"><h2>Odporúčania</h2></div>
                <div className="card__body">
                  {report.recommendations.length === 0 ? <p className="muted">Bez odporúčaní.</p> : (
                    <ol className="olist">
                      {report.recommendations.map((r, i) => <li key={i}>{r}</li>)}
                    </ol>
                  )}
                  {report.suggested_campaign && (
                    <div className="stack" style={{ gap: 8 }}>
                      <h3>Navrhovaná kampaň</h3>
                      <dl className="facts">
                        <dt>Názov</dt><dd>{report.suggested_campaign.name || "–"}</dd>
                        <dt>Krajiny</dt><dd>{report.suggested_campaign.countries.join(", ") || row.country}</dd>
                        <dt>Odvetvia</dt><dd>{report.suggested_campaign.industries.join(", ") || "–"}</dd>
                        <dt>Pozície</dt><dd>{report.suggested_campaign.roles.join(", ") || row.roles.join(", ") || "–"}</dd>
                      </dl>
                      <p className="muted small">„Vytvoriť kampaň z analýzy“ ju uloží len na ručné hľadanie, aby ste ju pred spustením skontrolovali.</p>
                    </div>
                  )}
                </div>
              </section>

              <section className="card">
                <div className="card__head"><h2>Zdroje <span className="count">{report.sources.length}</span></h2></div>
                {report.sources.length === 0 ? <Empty /> : (
                  <div className="card__body">
                    <ol className="olist">
                      {report.sources.map((s, i) => (
                        <li key={i}>
                          <Ext href={s.url} fallback={s.title || s.url}>{s.title || host(s.url) || s.url}</Ext>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </section>
            </div>
          </div>

          {row.log && (
            <section className="card" style={{ marginTop: 16 }}>
              <div className="card__body">
                <details className="more">
                  <summary>Záznam prieskumu na webe</summary>
                  <pre className="log log--tall">{row.log}</pre>
                </details>
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
