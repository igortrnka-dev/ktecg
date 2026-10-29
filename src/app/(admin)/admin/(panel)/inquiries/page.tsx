import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";
import { fmtDate, fmtDay } from "@/components/admin/ui";
import { shiftLabel, type ShiftPattern } from "@/lib/inquiries";

// The route links an inquiry to a lead before it answers, so one still unlinked after this has failed.
const LINK_TIMEOUT_MS = 10 * 60 * 1000;

export default async function Inquiries() {
  await requireAdmin();
  const { data } = await db().from("inquiries").select("*").order("created_at", { ascending: false }).limit(200);
  const now = Date.now();
  const rows = data ?? [];
  return (
    <>
      <header className="page-head">
        <div className="page-head__text">
          <h1>Dopyty z webu</h1>
          <p className="page-sub">Každý dopyt z formulára na webe sa hneď uloží ako lead s úlohou „Odpovedať na dopyt“ na dnes.</p>
        </div>
      </header>
      <div className="card">
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>Prijaté</th><th>Firma a kontakt</th><th>Koho hľadajú</th><th>Trvanie a zmeny</th><th>Nástup</th><th>Krajina</th><th>Lead</th></tr></thead>
            <tbody>
              {rows.map((q) => {
                const shift = q.shift_pattern ? (shiftLabel[q.shift_pattern as ShiftPattern] ?? q.shift_pattern) : null;
                const failed = now - new Date(q.created_at).getTime() > LINK_TIMEOUT_MS;
                return (
                  <tr key={q.id}>
                    <td className="nowrap">{fmtDate(q.created_at)}<span className="sub">web {String(q.locale ?? "").toUpperCase() || "–"}</span></td>
                    <td className="wrap">
                      <strong>{q.company}</strong>
                      <span className="sub">{q.name} · <a className="link" href={`mailto:${q.email}`}>{q.email}</a>{q.phone ? ` · ${q.phone}` : ""}</span>
                    </td>
                    <td className="wrap">{q.positions || <span className="muted">–</span>}{q.message && <span className="sub" title={q.message}>{q.message.length > 120 ? `${q.message.slice(0, 120)}…` : q.message}</span>}</td>
                    <td>
                      {q.duration || shift
                        ? <>{q.duration || "–"}{shift && <span className="sub">{shift}</span>}</>
                        : q.headcount ? `počet ${q.headcount}` : <span className="muted">–</span>}
                    </td>
                    <td className="nowrap">{q.start_date ? fmtDay(q.start_date) : <span className="muted">–</span>}</td>
                    <td>{q.country || <span className="muted">–</span>}</td>
                    <td className="nowrap">
                      {q.lead_id
                        ? <Link className="link" href={`/admin/leads/${q.lead_id}`}>Otvoriť lead</Link>
                        : failed
                          ? <span className="chip chip--bad" title="Dopyt nie je priradený k leadu: priradenie zlyhalo (pozrite log servera) alebo bol lead zmazaný.">Chyba</span>
                          : <span className="chip chip--run-running">Spracúva sa</span>}
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && <tr><td colSpan={7} className="muted center">Zatiaľ žiadne dopyty.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
