import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { href, stats } from "@/content/site";
import type { PublicProject } from "@/content/projects";
import { hasPhoto } from "@/lib/photo";
import Art from "./Art";
import Icon from "./Icon";
import Photo from "./Photo";

/** "2025 – 2026", or one year. */
export function periodText(p: Pick<PublicProject, "periodFrom" | "periodTo">): string {
  return p.periodTo && p.periodTo !== p.periodFrom ? `${p.periodFrom} – ${p.periodTo}` : String(p.periodFrom);
}

/** "≈ 250 odborníkov": the headcount with the unit in the right plural form of the language. */
export function teamText(t: Dictionary, locale: Locale, team: number, approx = false): string {
  const unit = t.projects.people[new Intl.PluralRules(locale).select(team)] ?? t.projects.people.other;
  return `${approx ? "≈ " : ""}${team} ${unit}`;
}

/** "01" */
export function projectNumber(n: number): string {
  return String(n).padStart(2, "0");
}

/**
 * The project's main photo: its own photo once approved (an uploaded file), otherwise the illustrative photo chosen
 * in the admin, otherwise the CSS art.
 */
export function ProjectPhoto({ project, eager = false, alt = "" }: { project: PublicProject; eager?: boolean; alt?: string }) {
  if (project.photo) return <RemotePhoto src={project.photo} eager={eager} alt={alt} />;
  if (project.stockPhoto && hasPhoto(project.stockPhoto)) return <Photo slug={project.stockPhoto} eager={eager} />;
  return <Art variant={project.number} />;
}

/** A photo from the project photo storage (full URL). */
export function RemotePhoto({ src, eager = false, alt = "" }: { src: string; eager?: boolean; alt?: string }) {
  return (
    <div className="photo">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} loading={eager ? "eager" : "lazy"} decoding="async" />
      <div className="grain" />
    </div>
  );
}

/** The first party on the card: the customer, or the project partner when that is who we worked for. */
export function mainParty(p: PublicProject) {
  return p.parties.find((x) => x.role === "client") ?? p.parties.find((x) => x.role === "partner") ?? p.parties[0];
}

/**
 * Project cards, three in a row on wide screens, each opening its project page: number and period on the photo,
 * then title, place, industry and customer, headcount and status when known, the short text and "Detail projektu".
 */
export function ProjectGrid({
  t,
  locale,
  projects,
  heading: Heading = "h3",
}: {
  t: Dictionary;
  locale: Locale;
  projects: PublicProject[];
  heading?: "h2" | "h3";
}) {
  return (
    <ul className="pgrid">
      {projects.map((p, i) => {
        const party = mainParty(p);
        const link = href(locale, `projects/${p.slug}`);
        return (
          <li key={p.slug} data-reveal style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
            <article className="pcard">
              <a href={link} className="pcard__media" tabIndex={-1} aria-hidden>
                <ProjectPhoto project={p} />
                <span className="pcard__num mono">{projectNumber(p.number)}</span>
                <span className="pcard__period mono">{periodText(p)}</span>
              </a>
              <div className="pcard__body">
                <Heading className="pcard__title">
                  <a href={link}>{p.text.title}</a>
                </Heading>
                <ul className="pinfo">
                  <li><Icon name="pin" size={16} />{p.text.location}</li>
                  <li><Icon name="factory" size={16} />{p.text.industry}</li>
                  {party && <li><Icon name="user" size={16} />{party.name}</li>}
                </ul>
                {(p.team !== null || p.status) && (
                  <ul className="pinfo">
                    {p.team !== null && <li><Icon name="people" size={16} />{teamText(t, locale, p.team, p.teamApprox)}</li>}
                    {p.status && (
                      <li className={`pstatus pstatus--${p.status}`}>
                        <Icon name="check" size={16} />{t.projects.status[p.status]}
                      </li>
                    )}
                  </ul>
                )}
                <p className="pcard__text">{p.text.summary}</p>
                <a href={link} className="pcard__more" aria-label={`${t.projects.open}: ${p.text.title}`}>
                  {t.projects.open}
                  <Icon name="arrow" size={16} />
                </a>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}

/** "KTechnology v číslach" bar at the bottom of the projects page. A figure not known yet is left out (see `stats`). */
export function Stats({ t }: { t: Dictionary }) {
  const figures = [
    stats.projects !== null && { value: String(stats.projects), label: t.projects.stats.projects },
    { value: String(stats.countries), label: t.projects.stats.countries },
    { value: stats.workers, label: t.projects.stats.workers },
  ].filter((f): f is { value: string; label: string } => Boolean(f));
  return (
    <section className="statsbar" aria-labelledby="stats-title" data-reveal>
      <h2 className="mono statsbar__label" id="stats-title">{t.projects.stats.label}</h2>
      <dl className="stats">
        {figures.map((f) => (
          <div key={f.label}>
            <dt>{f.label}</dt>
            <dd>{f.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
