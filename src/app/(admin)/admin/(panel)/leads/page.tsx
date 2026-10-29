import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";
import { Score, Status, STATUSES, statusLabel, sourceLabel, fmtDate } from "@/components/admin/ui";
import { addLead } from "../../actions";
import SubmitButton from "@/components/admin/SubmitButton";

type Search = { status?: string; tier?: string; source?: string; q?: string; page?: string };

const PAGE_SIZE = 50;

export default async function Leads({ searchParams }: { searchParams: Promise<Search> }) {
  await requireAdmin();
  const sp = await searchParams;
  const page = Math.max(1, Math.floor(Number(sp.page)) || 1);
  let query = db()
    .from("leads")
    .select("id, company_name, country, industry, score, tier, status, source, next_action_at, created_at", { count: "exact" })
    .order("score", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false })
    .order("id") // stable order, so rows do not move between pages
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
  if (sp.status) query = query.eq("status", sp.status);
  if (sp.tier) query = query.eq("tier", sp.tier);
  if (sp.source) query = query.eq("source", sp.source);
  if (sp.q) query = query.ilike("company_name", `%${sp.q}%`);
  const { data: leads, count } = await query;
  const pages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  /** Same filters, another page. */
  const pageHref = (n: number) => {
    const params = new URLSearchParams();
    for (const key of ["q", "status", "tier", "source"] as const) if (sp[key]) params.set(key, sp[key]);
    if (n > 1) params.set("page", String(n));
    const qs = params.toString();
    return qs ? `/admin/leads?${qs}` : "/admin/leads";
  };

  return (
    <>
      <header className="page-head">
        <h1>Leady</h1>
        <details className="pop">
          <summary className="abtn">+ Pridať ručne</summary>
          <form action={addLead} className="pop__body">
            <input name="company_name" placeholder="Firma" required />
            <input name="website" placeholder="Web (napr. firma.de)" />
            <input name="country" placeholder="Krajina" />
            <SubmitButton className="abtn abtn--primary">Pridať</SubmitButton>
          </form>
        </details>
      </header>

      <form className="filters">
        <input name="q" defaultValue={sp.q} placeholder="Hľadať firmu…" />
        <select name="status" defaultValue={sp.status ?? ""}>
          <option value="">Všetky stavy</option>
          {STATUSES.map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
        </select>
        <select name="tier" defaultValue={sp.tier ?? ""}>
          <option value="">Všetky tiery</option>
          <option value="A">A</option><option value="B">B</option><option value="C">C</option>
        </select>
        <select name="source" defaultValue={sp.source ?? ""}>
          <option value="">Všetky zdroje</option>
          <option value="ai_prospecting">AI prospecting</option>
          <option value="inbound">Web dopyt</option>
          <option value="manual">Manuálne</option>
        </select>
        <button className="abtn">Filtrovať</button>
      </form>

      <div className="card card--flush">
        <table className="table">
          <thead>
            <tr><th>Skóre</th><th>Firma</th><th>Krajina</th><th>Odvetvie</th><th>Zdroj</th><th>Stav</th><th>Ďalší krok</th><th>Pridané</th></tr>
          </thead>
          <tbody>
            {(leads ?? []).map((l) => (
              <tr key={l.id}>
                <td><Score score={l.score} tier={l.tier} /></td>
                <td><Link href={`/admin/leads/${l.id}`} className="strong">{l.company_name}</Link></td>
                <td>{l.country || "–"}</td>
                <td className="muted">{l.industry || "–"}</td>
                <td className="muted">{sourceLabel(l.source)}</td>
                <td><Status status={l.status} /></td>
                <td className="mono">{l.next_action_at || "–"}</td>
                <td className="muted">{fmtDate(l.created_at)}</td>
              </tr>
            ))}
            {(leads ?? []).length === 0 && (
              <tr>
                <td colSpan={8} className="muted center">
                  {page > 1 ? <>Na tejto strane už nie sú žiadne leady. <Link href={pageHref(1)}>Späť na prvú stranu</Link></> : "Žiadne leady pre tento filter."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pages > 1 && page <= pages && (
        <nav className="pager" aria-label="Stránkovanie">
          {page > 1 ? <Link className="abtn" href={pageHref(page - 1)}>← Predchádzajúca</Link> : <span />}
          <span className="muted small">Strana {page} z {pages}</span>
          {page < pages ? <Link className="abtn" href={pageHref(page + 1)}>Ďalšia →</Link> : <span />}
        </nav>
      )}
    </>
  );
}
