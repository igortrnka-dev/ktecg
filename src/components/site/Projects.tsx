import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { href, sectorSlugs, stats } from "@/content/site";
import type { Project } from "@/content/projects";
import Icon from "./Icon";
import Photo from "./Photo";

/** Country name in the page's language, from an ISO code ("DE" is "Nemecko" on the Slovak site). */
export function countryName(locale: Locale, code: string): string {
  return new Intl.DisplayNames([locale], { type: "region" }).of(code) ?? code;
}

export function sectorName(t: Dictionary, project: Project): string {
  return t.sectors.items[sectorSlugs.indexOf(project.sector)] ?? "";
}

/** "03/2024 – 07/2024" from the project's year-month period; one month is shown once. */
export function periodText(project: Project): string {
  const fmt = (ym: string) => {
    const [y, m] = ym.split("-");
    return `${m}/${y}`;
  };
  const { from, to } = project.period;
  return from === to ? fmt(from) : `${fmt(from)} – ${fmt(to)}`;
}

/** "12 odborníkov": the team size with the unit in the right plural form of the language. */
export function teamText(t: Dictionary, locale: Locale, team: number): string {
  const unit = t.projects.people[new Intl.PluralRules(locale).select(team)] ?? t.projects.people.other;
  return `${team} ${unit}`;
}

/** Project cards, each opening its project page; up to four in a row. */
export function ProjectGrid({
  t,
  locale,
  projects,
  heading: Heading = "h3",
}: {
  t: Dictionary;
  locale: Locale;
  projects: Project[];
  heading?: "h2" | "h3";
}) {
  return (
    <ul className="pgrid">
      {projects.map((p, i) => {
        const text = p.text[locale];
        return (
          <li key={p.slug} data-reveal style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
            <a href={href(locale, `projects/${p.slug}`)} className="card card--link">
              <div className="card__media">
                <Photo slug={p.photo ?? `project-${p.slug}`} variant={i} />
              </div>
              <div className="card__body">
                <ul className="ptags">
                  <li className="mono">{countryName(locale, p.country)}</li>
                  <li className="mono">{sectorName(t, p)}</li>
                </ul>
                <Heading className="card__title">{text.title}</Heading>
                <ul className="pmeta muted">
                  <li><Icon name="calendar" size={16} />{periodText(p)}</li>
                  {p.team !== undefined && <li><Icon name="people" size={16} />{teamText(t, locale, p.team)}</li>}
                </ul>
                <p className="muted card__text">{text.summary}</p>
                <span className="tile__more mono">
                  {t.projects.open}
                  <Icon name="arrow" size={16} />
                </span>
              </div>
            </a>
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
