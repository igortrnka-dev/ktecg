import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";
import { fromRow, type ProjectRow } from "@/lib/project-rows";
import Icon from "@/components/admin/Icon";
import PageNotice from "@/components/admin/PageNotice";
import { moveProject, toggleProjectFlag } from "../../project-actions";

const FLAGS = [
  { flag: "published", label: "Zverejnený" },
  { flag: "parties_approved", label: "Zákazník" },
  { flag: "team_approved", label: "Počet ľudí" },
  { flag: "photos_approved", label: "Fotky" },
] as const;

/** One switch of the list: shows the state and flips it. */
function Flag({ id, flag, on, label }: { id: string; flag: string; on: boolean; label: string }) {
  return (
    <form action={toggleProjectFlag}>
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="flag" value={flag} />
      {!on && <input type="hidden" name="value" value="on" />}
      <button className={`chip ${on ? "chip--ok" : "chip--plain"} chip--btn`} title={on ? `${label}: áno – kliknutím vypnúť` : `${label}: nie – kliknutím schváliť`}>
        {label}
      </button>
    </form>
  );
}

export default async function Projects({ searchParams }: { searchParams: Promise<{ deleted?: string }> }) {
  await requireAdmin();
  const { deleted } = await searchParams;
  const { data, error } = await db().from("projects").select("*").order("position", { ascending: true });
  const missing = error && ["42P01", "PGRST205"].includes(error.code ?? "");
  const projects = ((data ?? []) as ProjectRow[]).map(fromRow);

  return (
    <>
      <header className="page-head">
        <div className="page-head__text">
          <h1>Projekty na webe</h1>
          <p className="page-sub">
            Referencie v sekcii Projekty. Poradie tu je poradie a číslo kariet na webe. Názvy zákazníkov, počet ľudí a
            vlastné fotky projektu sa na webe zobrazia, až keď ich schválite – dovtedy karta ukazuje ilustračnú fotku.
          </p>
        </div>
        {!missing && <Link className="abtn abtn--primary" href="/admin/projects/new"><Icon name="plus" />Nový projekt</Link>}
      </header>

      {deleted !== undefined && <PageNotice param="deleted">Projekt je zmazaný a z webu zmizol.</PageNotice>}

      {missing ? (
        <p className="notice notice--error">
          V databáze ešte nie je tabuľka projektov. Spustite v Supabase (SQL Editor) súbor
          <code> supabase/migrations/0005_projects.sql</code>. Dovtedy web ukazuje projekty uložené v kóde.
        </p>
      ) : error ? (
        <p className="notice notice--error">Projekty sa nepodarilo načítať: {error.message}</p>
      ) : (
        <div className="card">
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr><th>#</th><th>Projekt</th><th>Obdobie</th><th>Jazyky</th><th>Na webe a schválenie</th><th><span className="sr-only">Poradie</span></th></tr>
              </thead>
              <tbody>
                {projects.map((p, i) => {
                  const sk = p.text.sk;
                  const langs = Object.entries(p.text).filter(([, t]) => t?.title).map(([l]) => l.toUpperCase());
                  return (
                    <tr key={p.id}>
                      <td className="mono">{String(i + 1).padStart(2, "0")}</td>
                      <td className="wrap">
                        <Link href={`/admin/projects/${p.id}`} className="strong">{sk?.title ?? p.slug}</Link>
                        <span className="sub">{sk?.location}{p.parties[0] ? ` · ${p.parties[0].name}` : ""}</span>
                      </td>
                      <td className="nowrap">{p.periodTo ? `${p.periodFrom} – ${p.periodTo}` : p.periodFrom}</td>
                      <td className="muted small">{langs.join(" ")}</td>
                      <td>
                        <div className="flags">
                          {FLAGS.map((f) => (
                            <Flag key={f.flag} id={p.id!} flag={f.flag} label={f.label}
                              on={f.flag === "published" ? p.published : p.approved[f.flag === "parties_approved" ? "parties" : f.flag === "team_approved" ? "team" : "photos"]} />
                          ))}
                        </div>
                      </td>
                      <td className="nowrap">
                        {(["up", "down"] as const).map((dir) => (
                          <form key={dir} action={moveProject} className="inline">
                            <input type="hidden" name="id" value={p.id} />
                            <input type="hidden" name="dir" value={dir} />
                            <button className="abtn abtn--small abtn--ghost" value={dir} disabled={dir === "up" ? i === 0 : i === projects.length - 1}
                              aria-label={dir === "up" ? "Posunúť vyššie" : "Posunúť nižšie"} title={dir === "up" ? "Posunúť vyššie" : "Posunúť nižšie"}>
                              <Icon name={dir} />
                            </button>
                          </form>
                        ))}
                      </td>
                    </tr>
                  );
                })}
                {projects.length === 0 && (
                  <tr><td colSpan={6} className="muted center">Zatiaľ žiadne projekty. <Link className="link" href="/admin/projects/new">Pridať prvý</Link></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
