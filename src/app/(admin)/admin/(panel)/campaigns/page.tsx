import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";
import { closeStaleRuns } from "@/lib/ai/prospect";
import { RunStatus, fmtDate } from "@/components/admin/ui";
import Icon from "@/components/admin/Icon";
import SubmitButton from "@/components/admin/SubmitButton";
import AutoRefresh from "@/components/admin/AutoRefresh";
import { deleteCampaign, runCampaign, saveCampaign } from "../../actions";

type Campaign = {
  id: string; name: string; active: boolean; countries: string[]; industries: string[]; roles: string[];
  notes: string; outreach_language: string; leads_per_run: number; last_run_at: string | null;
};

const LANGS = ["auto", "en", "de", "fr", "sv", "sk", "cs", "pl", "nl", "da", "no", "fi"];

function CampaignForm({ c }: { c?: Campaign }) {
  return (
    <form action={saveCampaign} className="stack">
      {c && <input type="hidden" name="id" value={c.id} />}
      <label className="afield"><span>Názov kampane</span><input name="name" defaultValue={c?.name} placeholder="napr. Zvárači – Nemecko, automotive" required /></label>
      <div className="row2">
        <label className="afield"><span>Krajiny</span><input name="countries" defaultValue={c?.countries.join(", ")} placeholder="Germany, Austria" /><small>oddeľte čiarkou</small></label>
        <label className="afield"><span>Odvetvia</span><input name="industries" defaultValue={c?.industries.join(", ")} placeholder="automotive suppliers, steel structures" /><small>oddeľte čiarkou</small></label>
      </div>
      <label className="afield"><span>Pozície, ktoré chceme obsadiť</span><input name="roles" defaultValue={c?.roles.join(", ")} placeholder="MIG/MAG welder, TIG welder, pipe fitter" /></label>
      <label className="afield"><span>Ďalšie pokyny pre Claude (nepovinné)</span><textarea name="notes" rows={2} defaultValue={c?.notes} placeholder="napr. firmy so 100–2000 zamestnancami, vynechaj personálne agentúry" /></label>
      <div className="row3">
        <label className="afield"><span>Jazyk e-mailov</span>
          <select name="outreach_language" defaultValue={c?.outreach_language ?? "auto"}>
            {LANGS.map((l) => <option key={l} value={l}>{l === "auto" ? "Podľa krajiny" : l.toUpperCase()}</option>)}
          </select>
        </label>
        <label className="afield"><span>Firiem na jedno hľadanie</span><input name="leads_per_run" type="number" min={1} max={30} defaultValue={c?.leads_per_run ?? 10} /></label>
        <label className="check"><input type="checkbox" name="active" defaultChecked={c?.active ?? true} /> Hľadať automaticky každý deň</label>
      </div>
      <div className="actions">
        <SubmitButton className="abtn abtn--primary" pending="Ukladám…">{c ? "Uložiť zmeny" : "Vytvoriť kampaň"}</SubmitButton>
      </div>
    </form>
  );
}

const list = (items: string[]) => (items.length ? items.join(", ") : <span className="muted">neuvedené</span>);

export default async function Campaigns({ searchParams }: { searchParams: Promise<{ busy?: string }> }) {
  await requireAdmin();
  const { busy } = await searchParams;
  // Otherwise a run cut off by a restart would keep this page polling until the next run starts.
  await closeStaleRuns();
  const [{ data: campaigns }, { data: runs }] = await Promise.all([
    db().from("campaigns").select("*").order("created_at", { ascending: false }),
    db().from("lead_runs").select("*, campaigns(name)").order("started_at", { ascending: false }).limit(15),
  ]);
  const running = (runs ?? []).some((r) => r.status === "running");
  const isRunning = (campaignId: string) => (runs ?? []).some((r) => r.campaign_id === campaignId && r.status === "running");

  return (
    <>
      <AutoRefresh active={running} />
      <header className="page-head">
        <div className="page-head__text">
          <h1>AI vyhľadávanie firiem</h1>
          <p className="page-sub">Claude prehľadá web (pracovné inzeráty, rozširovanie výroby, nové projekty, odstávky), nájde vhodné firmy, ohodnotí ich a pripraví e-mail na oslovenie. Kampane s denným hľadaním bežia automaticky každé ráno.</p>
        </div>
        <a className="abtn" href="#nova-kampan"><Icon name="plus" />Nová kampaň</a>
      </header>

      <div className="grid-detail">
        <div className="stack">
          {(campaigns as Campaign[] | null ?? []).length === 0 && (
            <section className="card"><p className="empty">Zatiaľ nemáte žiadnu kampaň. Vytvorte prvú nižšie.</p></section>
          )}
          {(campaigns as Campaign[] | null ?? []).map((c) => (
            <section key={c.id} className="card">
              <div className="card__head">
                <div className="stack" style={{ gap: 6 }}>
                  <h2>{c.name}</h2>
                  <div className="actions">
                    {c.active ? <span className="chip chip--ok">Každý deň automaticky</span> : <span className="chip">Len ručne</span>}
                    {isRunning(c.id) && <span className="chip chip--run-running">Práve hľadá</span>}
                  </div>
                </div>
                <form action={runCampaign}>
                  <input type="hidden" name="id" value={c.id} />
                  <SubmitButton className="abtn abtn--primary" pending="Spúšťam…"><Icon name="play" />Hľadať teraz</SubmitButton>
                </form>
              </div>
              <div className="card__body">
                {busy === c.id && isRunning(c.id) && (
                  <p className="notice notice--busy" role="status">Táto kampaň už hľadá. Nové hľadanie môžete spustiť, keď sa aktuálne dokončí.</p>
                )}
                <dl className="campaign__meta">
                  <dt>Krajiny</dt><dd>{list(c.countries)}</dd>
                  <dt>Odvetvia</dt><dd>{list(c.industries)}</dd>
                  <dt>Pozície</dt><dd>{list(c.roles)}</dd>
                  <dt>Jazyk e-mailov</dt><dd>{c.outreach_language === "auto" ? "podľa krajiny" : c.outreach_language.toUpperCase()}</dd>
                  <dt>Firiem na hľadanie</dt><dd>{c.leads_per_run}</dd>
                  <dt>Naposledy</dt><dd>{c.last_run_at ? fmtDate(c.last_run_at) : "ešte nehľadala"}</dd>
                </dl>
                <details className="more">
                  <summary>Upraviť kampaň</summary>
                  <CampaignForm c={c} />
                </details>
              </div>
              <div className="card__foot">
                <form action={deleteCampaign}>
                  <input type="hidden" name="id" value={c.id} />
                  <SubmitButton className="abtn abtn--ghost abtn--small abtn--danger" pending="Mažem…"><Icon name="trash" size={14} />Zmazať kampaň</SubmitButton>
                </form>
              </div>
            </section>
          ))}
          <section className="card" id="nova-kampan">
            <div className="card__head">
              <div>
                <h2>Nová kampaň</h2>
                <p>Opíšte, aké firmy má Claude hľadať.</p>
              </div>
            </div>
            <div className="card__body"><CampaignForm /></div>
          </section>
        </div>

        <section className="card">
          <div className="card__head">
            <h2>História hľadaní</h2>
            {running && <span className="chip chip--run-running">Prebieha</span>}
          </div>
          {(runs ?? []).length === 0 ? (
            <p className="empty">Zatiaľ neprebehlo žiadne hľadanie.</p>
          ) : (
            <ul className="runs">
              {(runs ?? []).map((r) => (
                <li key={r.id}>
                  <div className="runs__head">
                    <strong>{r.campaigns?.name ?? "Kampaň bola zmazaná"}</strong>
                    <RunStatus status={r.status} created={r.created} />
                  </div>
                  <span className="muted small">{fmtDate(r.started_at)} · {r.trigger === "cron" ? "automaticky" : "ručne"} · {r.usage?.web_searches ?? 0} vyhľadávaní na webe</span>
                  {r.error && <p className="error small">{r.error}</p>}
                  {r.log && (
                    <details className="more">
                      <summary>Záznam</summary>
                      <pre className="log">{r.log}</pre>
                    </details>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
