import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";
import { Due, Score, Status, STATUSES, statusLabel, sourceLabel, fmtDay } from "@/components/admin/ui";
import Icon from "@/components/admin/Icon";
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
    .select("id, company_name, country, industry, score, tier, status, source, next_action, next_action_at, created_at", { count: "exact" })
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

  const filtered = Boolean(sp.q || sp.status || sp.tier || sp.source);

  return (
    <>
      <header className="page-head">
        <div className="page-head__text">
          <h1>Leady</h1>
          <p className="page-sub">Firmy, ktoré môžeme osloviť. Najlepšie hodnotené sú hore.</p>
        </div>
        <details className="pop">
          <summary className="abtn abtn--primary"><Icon name="plus" />Pridať firmu</summary>
          <form action={addLead} className="pop__body">
            <h3>Pridať firmu ručne</h3>
            <label className="afield"><span>Názov firmy</span><input name="company_name" required /></label>
            <label className="afield"><span>Web</span><input name="website" placeholder="napr. firma.de" /></label>
            <label className="afield"><span>Krajina</span><input name="country" placeholder="napr. Germany" /></label>
            <SubmitButton className="abtn abtn--primary">Pridať</SubmitButton>
          </form>
        </details>
      </header>

      <div className="card">
        <form className="toolbar" role="search">
          <label className="search">
            <span className="sr-only">Hľadať firmu</span>
            <Icon name="search" />
            <input name="q" type="search" defaultValue={sp.q} placeholder="Hľadať firmu…" />
          </label>
          <label>
            <span className="sr-only">Stav</span>
            <select name="status" defaultValue={sp.status ?? ""}>
              <option value="">Všetky stavy</option>
              {STATUSES.map((s) => <option key={s} value={s}>{statusLabel[s]}</option>)}
            </select>
          </label>
          <label>
            <span className="sr-only">Tier</span>
            <select name="tier" defaultValue={sp.tier ?? ""}>
              <option value="">Všetky tiery</option>
              <option value="A">Tier A</option><option value="B">Tier B</option><option value="C">Tier C</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Zdroj</span>
            <select name="source" defaultValue={sp.source ?? ""}>
              <option value="">Všetky zdroje</option>
              <option value="ai_prospecting">AI vyhľadávanie</option>
              <option value="inbound">Web dopyt</option>
              <option value="manual">Manuálne</option>
            </select>
          </label>
          <button className="abtn">Filtrovať</button>
          {filtered && <Link className="abtn abtn--ghost" href="/admin/leads">Zrušiť filter</Link>}
          <span className="toolbar__count">{count ?? 0} {count === 1 ? "firma" : count && count >= 2 && count <= 4 ? "firmy" : "firiem"}</span>
        </form>

        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Skóre</th><th>Firma</th><th>Krajina</th><th>Stav</th><th>Ďalší krok</th><th>Zdroj</th><th>Pridané</th></tr>
            </thead>
            <tbody>
              {(leads ?? []).map((l) => (
                <tr key={l.id}>
                  <td><Score score={l.score} tier={l.tier} /></td>
                  <td className="wrap">
                    <Link href={`/admin/leads/${l.id}`} className="strong">{l.company_name}</Link>
                    {l.industry && <span className="sub">{l.industry}</span>}
                  </td>
                  <td>{l.country || "–"}</td>
                  <td><Status status={l.status} /></td>
                  <td className="wrap">
                    {l.next_action || l.next_action_at ? <>{l.next_action || "Ozvať sa"}<span className="sub"><Due date={l.next_action_at} /></span></> : <span className="muted">–</span>}
                  </td>
                  <td className="muted nowrap">{sourceLabel(l.source)}</td>
                  <td className="muted nowrap">{fmtDay(l.created_at)}</td>
                </tr>
              ))}
              {(leads ?? []).length === 0 && (
                <tr>
                  <td colSpan={7} className="muted center">
                    {page > 1 ? <>Na tejto strane už nie sú žiadne leady. <Link className="link" href={pageHref(1)}>Späť na prvú stranu</Link></> : "Žiadne leady pre tento filter."}
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
      </div>
    </>
  );
}
