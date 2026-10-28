import { db } from "@/lib/supabase/admin";
import { fmtDate } from "@/components/admin/ui";
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
      <label className="afield"><span>Názov</span><input name="name" defaultValue={c?.name} placeholder="Zvárači – Nemecko, automotive" required /></label>
      <div className="row2">
        <label className="afield"><span>Krajiny (čiarkou)</span><input name="countries" defaultValue={c?.countries.join(", ")} placeholder="Germany, Austria" /></label>
        <label className="afield"><span>Odvetvia</span><input name="industries" defaultValue={c?.industries.join(", ")} placeholder="automotive suppliers, steel structures" /></label>
      </div>
      <label className="afield"><span>Pozície, ktoré chceme obsadiť</span><input name="roles" defaultValue={c?.roles.join(", ")} placeholder="MIG/MAG welder, TIG welder, pipe fitter" /></label>
      <label className="afield"><span>Ďalšie pokyny pre Claude</span><textarea name="notes" rows={2} defaultValue={c?.notes} placeholder="napr. firmy 100–2000 zamestnancov, vynechaj personálne agentúry" /></label>
      <div className="row3">
        <label className="afield"><span>Jazyk oslovenia</span>
          <select name="outreach_language" defaultValue={c?.outreach_language ?? "auto"}>
            {LANGS.map((l) => <option key={l} value={l}>{l === "auto" ? "Podľa krajiny" : l.toUpperCase()}</option>)}
          </select>
        </label>
        <label className="afield"><span>Leadov na beh</span><input name="leads_per_run" type="number" min={1} max={30} defaultValue={c?.leads_per_run ?? 10} /></label>
        <label className="check"><input type="checkbox" name="active" defaultChecked={c?.active ?? true} /> Automaticky denne</label>
      </div>
      <SubmitButton className="abtn abtn--primary" pending="Ukladám…">{c ? "Uložiť" : "Vytvoriť kampaň"}</SubmitButton>
    </form>
  );
}

export default async function Campaigns() {
  const [{ data: campaigns }, { data: runs }] = await Promise.all([
    db().from("campaigns").select("*").order("created_at", { ascending: false }),
    db().from("lead_runs").select("*, campaigns(name)").order("started_at", { ascending: false }).limit(15),
  ]);
  const running = (runs ?? []).some((r) => r.status === "running");

  return (
    <>
      <AutoRefresh active={running} />
      <header className="page-head">
        <div>
          <h1>AI prospecting</h1>
          <p className="muted">Claude prehľadá web (pracovné inzeráty, expanzie, projekty, odstávky), nájde vhodné firmy, ohodnotí ich a pripraví oslovenie. Aktívne kampane bežia automaticky každý deň.</p>
        </div>
      </header>

      <div className="grid2 grid2--wide">
        <div className="stack">
          {(campaigns as Campaign[] | null ?? []).map((c) => (
            <section key={c.id} className="card">
              <div className="card__head">
                <h2>{c.name} {c.active ? <span className="pill pill--won">denne</span> : <span className="pill">pozastavená</span>}</h2>
                <div className="actions">
                  <form action={runCampaign}>
                    <input type="hidden" name="id" value={c.id} />
                    <SubmitButton className="abtn abtn--primary" pending="Spúšťam…">▶ Spustiť teraz</SubmitButton>
                  </form>
                  <form action={deleteCampaign}>
                    <input type="hidden" name="id" value={c.id} />
                    <SubmitButton className="abtn abtn--ghost">Zmazať</SubmitButton>
                  </form>
                </div>
              </div>
              <p className="muted small">Posledný beh: {fmtDate(c.last_run_at)}</p>
              <details>
                <summary className="linkbtn">Upraviť</summary>
                <CampaignForm c={c} />
              </details>
            </section>
          ))}
          <section className="card">
            <h2>Nová kampaň</h2>
            <CampaignForm />
          </section>
        </div>

        <section className="card">
          <h2>Behy {running && <span className="pill pill--run-running">beží</span>}</h2>
          <ul className="runs">
            {(runs ?? []).map((r) => (
              <li key={r.id}>
                <div className="runs__head">
                  <strong>{r.campaigns?.name ?? "–"}</strong>
                  <span className={`pill pill--run-${r.status}`}>{r.status === "running" ? "beží" : r.status === "done" ? `+${r.created} nových` : "chyba"}</span>
                </div>
                <span className="muted small">{fmtDate(r.started_at)} · {r.trigger === "cron" ? "automaticky" : "ručne"} · {r.usage?.web_searches ?? 0} vyhľadávaní</span>
                {r.log && <pre className="log">{r.log}</pre>}
                {r.error && <p className="error small">{r.error}</p>}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
