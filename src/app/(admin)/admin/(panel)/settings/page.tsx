import { requireAdmin } from "@/lib/auth";
import { getCompanyProfile } from "@/lib/ai/client";
import SubmitButton from "@/components/admin/SubmitButton";
import { saveSettings } from "../../actions";

export default async function Settings() {
  await requireAdmin();
  const profile = await getCompanyProfile();
  const ready = {
    supabase: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    anthropic: Boolean(process.env.ANTHROPIC_API_KEY),
    cron: Boolean(process.env.CRON_SECRET),
  };
  return (
    <>
      <header className="page-head"><h1>Nastavenia</h1></header>
      <div className="grid2 grid2--wide">
        <form action={saveSettings} className="card stack">
          <h2>Profil firmy a ideálny zákazník</h2>
          <p className="muted small">Claude podľa tohto textu hľadá, hodnotí a oslovuje firmy. Čím presnejší, tým lepšie leady.</p>
          <textarea name="company_profile" rows={18} defaultValue={profile} />
          <SubmitButton className="abtn abtn--primary" pending="Ukladám…">Uložiť</SubmitButton>
        </form>
        <section className="card stack">
          <h2>Pripojenia</h2>
          <ul className="rows">
            <li><span className="grow">Supabase</span>{ready.supabase ? "✓" : "chýba"}</li>
            <li><span className="grow">Anthropic API (Claude)</span>{ready.anthropic ? "✓" : "chýba"}</li>
            <li><span className="grow">Denný automatický beh (cron)</span>{ready.cron ? "✓" : "chýba"}</li>
          </ul>
        </section>
      </div>
    </>
  );
}
