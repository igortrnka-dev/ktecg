import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { href, sectorSlugs, stats } from "@/content/site";
import type { Project } from "@/content/projects";
import Icon from "./Icon";
import Photo from "./Photo";
import SectionHead from "./SectionHead";

/** Country name in the page's language, from an ISO code ("DE" is "Nemecko" on the Slovak site). */
export function countryName(locale: Locale, code: string): string {
  return new Intl.DisplayNames([locale], { type: "region" }).of(code) ?? code;
}

export function sectorName(t: Dictionary, project: Project): string {
  return t.sectors.items[sectorSlugs.indexOf(project.sector)]?.name ?? "";
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
                <span className="mono faint">{countryName(locale, p.country)} · {p.year}</span>
                <Heading className="card__title">{text.title}</Heading>
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

/** Stats passage at the bottom of the projects page. A figure that is not known yet is left out (see `stats`). */
export function Stats({ t }: { t: Dictionary }) {
  const figures = [
    stats.projects !== null && { value: String(stats.projects), label: t.projects.stats.projects },
    { value: String(stats.countries), label: t.projects.stats.countries },
    { value: stats.workers, label: t.projects.stats.workers },
  ].filter((f): f is { value: string; label: string } => Boolean(f));
  return (
    <section className="block" aria-labelledby="stats-title">
      <SectionHead label={t.projects.stats.label} title={t.projects.stats.title} id="stats-title" />
      <dl className="stats" data-reveal>
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
