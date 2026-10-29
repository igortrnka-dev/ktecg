import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";
import { fmtDate } from "@/components/admin/ui";
import { shiftLabel, type ShiftPattern } from "@/lib/inquiries";

// The route links an inquiry to a lead before it answers, so one still unlinked after this has failed.
const LINK_TIMEOUT_MS = 10 * 60 * 1000;

export default async function Inquiries() {
  await requireAdmin();
  const { data } = await db().from("inquiries").select("*").order("created_at", { ascending: false }).limit(200);
  const now = Date.now();
  return (
    <>
      <header className="page-head"><h1>Dopyty z webu</h1></header>
      <div className="card card--flush">
        <table className="table">
          <thead><tr><th>Dátum</th><th>Firma</th><th>Kontakt</th><th>Pozície</th><th>Trvanie / zmeny</th><th>Krajina</th><th>Jazyk</th><th>Lead</th></tr></thead>
          <tbody>
            {(data ?? []).map((q) => {
              const shift = q.shift_pattern ? (shiftLabel[q.shift_pattern as ShiftPattern] ?? q.shift_pattern) : null;
              const failed = now - new Date(q.created_at).getTime() > LINK_TIMEOUT_MS;
              return (
                <tr key={q.id}>
                  <td className="muted">{fmtDate(q.created_at)}</td>
                  <td className="strong">{q.company}</td>
                  <td>{q.name}<br /><a href={`mailto:${q.email}`} className="muted">{q.email}</a></td>
                  <td>{q.positions || "–"}</td>
                  <td>
                    {q.duration || shift
                      ? <>{q.duration || "–"}{shift && <><br /><span className="muted">{shift}</span></>}</>
                      : q.headcount ? `počet ${q.headcount}` : "–"}
                  </td>
                  <td>{q.country || "–"}</td>
                  <td className="mono">{q.locale}</td>
                  <td>
                    {q.lead_id
                      ? <Link href={`/admin/leads/${q.lead_id}`}>Otvoriť →</Link>
                      : failed
                        ? <span className="error" title="Dopyt nie je priradený k leadu: priradenie zlyhalo (pozrite log servera) alebo bol lead zmazaný.">chyba</span>
                        : <span className="muted">spracúva sa</span>}
                  </td>
                </tr>
              );
            })}
            {(data ?? []).length === 0 && <tr><td colSpan={8} className="muted center">Zatiaľ žiadne dopyty.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
