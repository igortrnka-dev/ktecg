import Link from "next/link";
import Icon from "@/components/admin/Icon";

/** Unknown admin pages and missing records (a deleted lead, an old link), inside the admin shell. */
export default function PanelNotFound() {
  return (
    <>
      <header className="page-head">
        <div className="page-head__text">
          <h1>Záznam sa nenašiel</h1>
          <p className="page-sub">Chyba 404</p>
        </div>
      </header>
      <section className="card">
        <div className="card__body">
          <p>Stránka alebo záznam neexistuje. Ak ste hľadali lead, mohol byť zmazaný alebo je odkaz neplatný – firmu nájdete v zozname leadov.</p>
        </div>
        <div className="card__foot">
          <Link className="abtn abtn--primary" href="/admin/leads"><Icon name="back" />Späť na leady</Link>
          <Link className="abtn abtn--ghost" href="/admin">Prehľad</Link>
        </div>
      </section>
    </>
  );
}
