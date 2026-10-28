import Link from "next/link";
import { db } from "@/lib/supabase/admin";
import { fmtDate } from "@/components/admin/ui";

export default async function Inquiries() {
  const { data } = await db().from("inquiries").select("*").order("created_at", { ascending: false }).limit(200);
  return (
    <>
      <header className="page-head"><h1>Dopyty z webu</h1></header>
      <div className="card card--flush">
        <table className="table">
          <thead><tr><th>Dátum</th><th>Firma</th><th>Kontakt</th><th>Pozície</th><th>Počet</th><th>Krajina</th><th>Jazyk</th><th>Lead</th></tr></thead>
          <tbody>
            {(data ?? []).map((q) => (
              <tr key={q.id}>
                <td className="muted">{fmtDate(q.created_at)}</td>
                <td className="strong">{q.company}</td>
                <td>{q.name}<br /><a href={`mailto:${q.email}`} className="muted">{q.email}</a></td>
                <td>{q.positions || "–"}</td>
                <td>{q.headcount ?? "–"}</td>
                <td>{q.country || "–"}</td>
                <td className="mono">{q.locale}</td>
                <td>{q.lead_id ? <Link href={`/admin/leads/${q.lead_id}`}>Otvoriť →</Link> : <span className="muted">spracúva sa</span>}</td>
              </tr>
            ))}
            {(data ?? []).length === 0 && <tr><td colSpan={8} className="muted center">Zatiaľ žiadne dopyty.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
