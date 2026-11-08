import { readdirSync } from "node:fs";
import path from "node:path";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";
import { locales, localeNames } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { divisionSlugs, sectorSlugs } from "@/content/site";
import { divisionPhoto, sectorPhoto } from "@/components/site/catalog";
import { partyRoles, type ProjectRecord } from "@/content/projects";
import { fromRow, type ProjectRow } from "@/lib/project-rows";
import Icon from "@/components/admin/Icon";
import PageNotice from "@/components/admin/PageNotice";
import SubmitButton from "@/components/admin/SubmitButton";
import { deleteProject, saveProject } from "../../../project-actions";

const sk = getDictionary("sk");
const ROLE_LABEL: Record<string, string> = sk.projects.parties;

/** Photos the site already shows elsewhere: the hero, contact, call-to-action, "all included", service and sector cards. */
function reservedPhotos(): Set<string> {
  const slots = [
    "hero",
    "contact",
    "cta",
    "included",
    ...divisionSlugs.map(divisionPhoto),
    ...sectorSlugs.map(sectorPhoto),
  ];
  return new Set(slots.filter((s): s is string => !!s));
}

/**
 * Photos in public/img that can stand in for a project's own photos: every photo appears on the site only once, so
 * the list leaves out the photos of the other sections and of the other projects (the project's own choice stays).
 */
function stockPhotos(current: string | null, takenByProjects: string[]): string[] {
  const taken = new Set([...reservedPhotos(), ...takenByProjects]);
  try {
    return readdirSync(path.join(process.cwd(), "public", "img"))
      .filter((f) => f.endsWith(".jpg"))
      .map((f) => f.replace(/\.jpg$/, ""))
      .filter((s) => s === current || !taken.has(s))
      .sort();
  } catch {
    return [];
  }
}

const EMPTY: ProjectRecord = {
  slug: "",
  position: 0,
  published: false,
  sector: "manufacturing",
  divisions: [],
  periodFrom: new Date().getFullYear(),
  periodTo: null,
  status: null,
  team: null,
  teamApprox: false,
  parties: [],
  photo: null,
  gallery: [],
  stockPhoto: null,
  approved: { parties: false, team: false, photos: false },
  text: {},
};

export default async function ProjectEdit({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { saved, error } = await searchParams;
  let p = EMPTY;
  if (id !== "new") {
    if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
    const { data } = await db().from("projects").select("*").eq("id", id).maybeSingle();
    if (!data) notFound();
    p = fromRow(data as ProjectRow);
  }
  const isNew = !p.id;
  const { data: others } = await db().from("projects").select("id, stock_photo");
  const takenByProjects = ((others ?? []) as { id: string; stock_photo: string | null }[])
    .filter((o) => o.id !== p.id && o.stock_photo)
    .map((o) => o.stock_photo as string);
  const parties = [...p.parties, ...Array(Math.max(0, 4 - p.parties.length)).fill(null)].slice(0, 4);
  // Fields are keyed by the saved project so a save shows the stored values, not the ones from page load.
  const k = `${p.id ?? "new"}-${p.slug}-${p.position}-${String(saved)}`;

  return (
    <>
      <p className="crumb"><Link href="/admin/projects"><Icon name="back" />Projekty na webe</Link></p>
      <header className="page-head">
        <div className="page-head__text">
          <h1>{isNew ? "Nový projekt" : p.text.sk?.title ?? p.slug}</h1>
          <p className="page-sub">
            Všetky projekty používajú rovnakú šablónu na webe. Jazyk bez vyplneného názvu sa na webe nezobrazí.
          </p>
        </div>
        {!isNew && p.published && (
          <a className="abtn" href={`/sk/projects/${p.slug}`} target="_blank" rel="noreferrer"><Icon name="external" />Otvoriť na webe</a>
        )}
      </header>

      {saved !== undefined && <PageNotice param="saved">Uložené. Web sa aktualizoval.</PageNotice>}
      {error && <p className="notice notice--error" role="alert">{error}</p>}

      <form action={saveProject} className="stack" key={k}>
        {p.id && <input type="hidden" name="id" value={p.id} />}

        <section className="card">
          <div className="card__head"><div><h2>Zverejnenie a schválenie</h2><p>Údaje, ktoré ešte nie sú overené, sa na webe nezobrazia, aj keď sú vyplnené nižšie.</p></div></div>
          <div className="card__body stack">
            <label className="check"><input type="checkbox" name="published" defaultChecked={p.published} /> Projekt je zverejnený na webe</label>
            <div className="row3">
              <label className="check"><input type="checkbox" name="parties_approved" defaultChecked={p.approved.parties} /> Názvy zákazníkov schválené</label>
              <label className="check"><input type="checkbox" name="team_approved" defaultChecked={p.approved.team} /> Počet pracovníkov schválený</label>
              <label className="check"><input type="checkbox" name="photos_approved" defaultChecked={p.approved.photos} /> Fotky projektu schválené</label>
            </div>
            <label className="afield">
              <span>Adresa stránky</span>
              <input name="slug" defaultValue={p.slug} required pattern="[a-z0-9]+(-[a-z0-9]+)*" placeholder="napr. ineos-project-one-antwerp" />
              <small>/jazyk/projects/<strong>{p.slug || "adresa"}</strong> · malé písmená bez diakritiky, číslice a pomlčky. Po zmene prestane fungovať stará adresa.</small>
            </label>
          </div>
        </section>

        <section className="card">
          <div className="card__head"><h2>Technické údaje</h2></div>
          <div className="card__body stack">
            <div className="row3">
              <label className="afield"><span>Rok začiatku</span><input name="period_from" type="number" min={1990} max={2100} defaultValue={p.periodFrom} required /></label>
              <label className="afield"><span>Rok konca (nepovinné)</span><input name="period_to" type="number" min={1990} max={2100} defaultValue={p.periodTo ?? ""} /></label>
              <label className="afield"><span>Stav</span>
                <select name="status" defaultValue={p.status ?? ""}>
                  <option value="">Nezobrazovať</option>
                  <option value="ongoing">Prebieha</option>
                  <option value="completed">Ukončené</option>
                </select>
              </label>
            </div>
            <div className="row3">
              <label className="afield"><span>Počet pracovníkov</span><input name="team" type="number" min={1} defaultValue={p.team ?? ""} /></label>
              <label className="check"><input type="checkbox" name="team_approx" defaultChecked={p.teamApprox} /> Približný počet (≈)</label>
              <label className="afield"><span>Kategória odvetvia</span>
                <select name="sector" defaultValue={p.sector}>
                  {sectorSlugs.map((s, i) => <option key={s} value={s}>{sk.sectors.items[i]}</option>)}
                </select>
              </label>
            </div>
            <fieldset className="afield">
              <span>Zobraziť aj na stránkach divízií</span>
              <div className="row2">
                {divisionSlugs.map((d, i) => (
                  <label key={d} className="check"><input type="checkbox" name="divisions" value={d} defaultChecked={p.divisions.includes(d)} /> {sk.services.divisions[i].name}</label>
                ))}
              </div>
            </fieldset>
            <fieldset className="afield">
              <span>Firmy na projekte (zobrazia sa až po schválení názvov)</span>
              {parties.map((party, i) => (
                <div className="row2" key={i}>
                  <select name={`party_role_${i}`} defaultValue={party?.role ?? "client"} aria-label={`Rola firmy ${i + 1}`}>
                    {partyRoles.map((r) => <option key={r} value={r}>{ROLE_LABEL[r]}</option>)}
                  </select>
                  <input name={`party_name_${i}`} defaultValue={party?.name ?? ""} placeholder="Názov firmy" aria-label={`Názov firmy ${i + 1}`} />
                </div>
              ))}
            </fieldset>
          </div>
        </section>

        <section className="card">
          <div className="card__head"><div><h2>Fotky</h2><p>JPG, PNG alebo WebP do 10 MB. Najlepšie široké fotky na šírku (aspoň 1600 px).</p></div></div>
          <div className="card__body stack">
            <div className="row2">
              <div className="afield">
                <span>Hlavná fotka projektu</span>
                {p.photo ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img className="pthumb pthumb--wide" src={p.photo} alt="" />
                    <label className="check"><input type="checkbox" name="photo_remove" /> Odstrániť hlavnú fotku</label>
                  </>
                ) : (
                  <small>Zatiaľ žiadna – na webe je ilustračná fotka.</small>
                )}
                <input type="file" name="photo_file" accept="image/jpeg,image/png,image/webp" />
              </div>
              <label className="afield">
                <span>Ilustračná fotka (kým nie sú schválené vlastné)</span>
                <select name="stock_photo" defaultValue={p.stockPhoto ?? ""}>
                  <option value="">Bez fotky</option>
                  {stockPhotos(p.stockPhoto, takenByProjects).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {p.stockPhoto && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="pthumb pthumb--wide" src={`/img/${p.stockPhoto}.jpg`} alt="" />
                )}
              </label>
            </div>
            <div className="afield">
              <span>Galéria fotiek z realizácie</span>
              {p.gallery.length > 0 && (
                <ul className="pthumbs">
                  {p.gallery.map((src) => (
                    <li key={src}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="pthumb" src={src} alt="" />
                      <label className="check"><input type="checkbox" name="gallery_keep" value={src} defaultChecked /> Ponechať</label>
                    </li>
                  ))}
                </ul>
              )}
              <input type="file" name="gallery_files" accept="image/jpeg,image/png,image/webp" multiple />
              <small>Pridať môžete viac fotiek naraz. Odškrtnutím „Ponechať“ a uložením sa fotka odstráni.</small>
            </div>
          </div>
        </section>

        <section className="card">
          <div className="card__head"><div><h2>Texty</h2><p>Každý jazyk samostatne. Rozsah prác: jedna položka na riadok.</p></div></div>
          <div className="card__body stack">
            {locales.map((l) => {
              const t = p.text[l];
              return (
                <details key={l} className="langbox" open={l === "sk"}>
                  <summary>
                    <strong>{localeNames[l]}</strong>
                    {t?.title ? <span className="chip chip--ok">vyplnené</span> : <span className="chip chip--plain">na webe sa nezobrazí</span>}
                  </summary>
                  <div className="stack">
                    <label className="afield"><span>Názov projektu</span><input name={`${l}_title`} defaultValue={t?.title ?? ""} required={l === "sk"} /></label>
                    <div className="row2">
                      <label className="afield"><span>Krajina – miesto</span><input name={`${l}_location`} defaultValue={t?.location ?? ""} placeholder="Nemecko – Papenburg" /></label>
                      <label className="afield"><span>Odvetvie</span><input name={`${l}_industry`} defaultValue={t?.industry ?? ""} placeholder="Lodný priemysel" /></label>
                    </div>
                    <div className="row2">
                      <label className="afield"><span>Miesto realizácie (nepovinné)</span><input name={`${l}_site`} defaultValue={t?.site ?? ""} /></label>
                      <label className="afield"><span>Projekt zákazníka (nepovinné)</span><input name={`${l}_name`} defaultValue={t?.name ?? ""} /></label>
                    </div>
                    <label className="afield"><span>Krátky text na kartu</span><textarea name={`${l}_summary`} rows={3} defaultValue={t?.summary ?? ""} /></label>
                    <label className="afield"><span>Popis projektu</span><textarea name={`${l}_description`} rows={6} defaultValue={t?.description ?? ""} /></label>
                    <label className="afield"><span>Rozsah vykonaných prác</span><textarea name={`${l}_scope`} rows={6} defaultValue={(t?.scope ?? []).join("\n")} /></label>
                  </div>
                </details>
              );
            })}
          </div>
          <div className="card__foot">
            <SubmitButton className="abtn abtn--primary" pending="Ukladám…">{isNew ? "Vytvoriť projekt" : "Uložiť zmeny"}</SubmitButton>
          </div>
        </section>
      </form>

      {!isNew && (
        <form action={deleteProject} className="card card--danger">
          <input type="hidden" name="id" value={p.id} />
          <div className="card__head"><div><h2>Zmazať projekt</h2><p>Projekt aj jeho nahraté fotky sa natrvalo odstránia. Ak ho chcete len skryť, vypnite „Projekt je zverejnený na webe“.</p></div></div>
          <div className="card__foot">
            <SubmitButton className="abtn abtn--danger" pending="Mažem…" confirm="Naozaj natrvalo zmazať tento projekt aj s fotkami?"><Icon name="trash" />Zmazať projekt</SubmitButton>
          </div>
        </form>
      )}
    </>
  );
}
