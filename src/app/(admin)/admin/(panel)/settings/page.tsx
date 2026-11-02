import { requireAdmin } from "@/lib/auth";
import { getCompanyProfile } from "@/lib/ai/client";
import SubmitButton from "@/components/admin/SubmitButton";
import { mailConfigured } from "@/lib/mail/config";
import { saveSettings } from "../../actions";

export default async function Settings() {
  await requireAdmin();
  const profile = await getCompanyProfile();
  const ready = {
    supabase: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
    cron: Boolean(process.env.CRON_SECRET),
    mail: mailConfigured(),
  };
  const connections = [
    { name: "Databáza (Supabase)", ok: ready.supabase, hint: "ukladá leady, kampane a dopyty" },
    { name: "Claude (Anthropic API)", ok: ready.anthropic, hint: "hľadá firmy, hodnotí ich a píše e-maily" },
    { name: "Denné automatické hľadanie", ok: ready.cron, hint: "spúšťa kampane každé ráno" },
    { name: "Pošta (IMAP)", ok: ready.mail, hint: "číta e-maily s firmami z leadov, nastavenie je v časti Pošta" },
  ];
  return (
    <>
      <header className="page-head">
        <div className="page-head__text">
          <h1>Nastavenia</h1>
          <p className="page-sub">Popis firmy, podľa ktorého Claude hľadá a oslovuje zákazníkov, a stav pripojení.</p>
        </div>
      </header>
      <div className="grid-detail">
        <form action={saveSettings} className="card">
          <div className="card__head">
            <div>
              <h2>Profil firmy a ideálny zákazník</h2>
              <p>Claude podľa tohto textu hľadá, hodnotí a oslovuje firmy. Čím presnejší, tým lepšie leady.</p>
            </div>
          </div>
          <div className="card__body">
            <label className="afield"><span className="sr-only">Profil firmy</span><textarea name="company_profile" rows={18} defaultValue={profile} /></label>
          </div>
          <div className="card__foot">
            <SubmitButton className="abtn abtn--primary" pending="Ukladám…">Uložiť</SubmitButton>
          </div>
        </form>
        <section className="card">
          <div className="card__head"><h2>Pripojenia</h2></div>
          <ul className="list">
            {connections.map((c) => (
              <li key={c.name} className="list__row">
                <span className="list__main"><strong>{c.name}</strong><span>{c.hint}</span></span>
                {c.ok ? <span className="chip chip--ok">Pripojené</span> : <span className="chip chip--bad">Chýba</span>}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
