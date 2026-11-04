import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { href, tradeSlugs } from "@/content/site";
import { projects } from "@/content/projects";
import { pageMetadata } from "@/lib/site/metadata";
import { hasPhoto } from "@/lib/photo";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import Icon from "@/components/site/Icon";
import PageHead from "@/components/site/PageHead";
import Photo from "@/components/site/Photo";
import { countryName, sectorName } from "@/components/site/Projects";
import SiteShell from "@/components/site/SiteShell";
import { tradeIcons } from "@/components/site/Trades";

type Params = Promise<{ locale: string; slug: string }>;

// Only the projects in content/projects.ts; the middleware sends any other slug to the 404 page.
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!isLocale(locale) || !project) return {};
  const t = getDictionary(locale);
  const text = project.text[locale];
  return pageMetadata(locale, `projects/${slug}`, `${text.title} – ${t.projects.metaSuffix}`, text.summary);
}

/** One project: facts, scope of work, the trades on it (linking to their pages) and its photo. */
export default async function ProjectPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!isLocale(locale) || !project) notFound();
  const t = getDictionary(locale);
  const text = project.text[locale];
  const photo = project.photo ?? `project-${project.slug}`;
  const facts = [
    { k: t.projects.facts.country, v: countryName(locale, project.country) },
    { k: t.projects.facts.sector, v: sectorName(t, project) },
    { k: t.projects.facts.year, v: String(project.year) },
    project.team !== undefined && { k: t.projects.facts.team, v: String(project.team) },
    text.duration && { k: t.projects.facts.duration, v: text.duration },
  ].filter((f): f is { k: string; v: string } => Boolean(f));

  return (
    <SiteShell t={t} locale={locale} path={`projects/${slug}`} current="projects">
      <div className="block">
        <Breadcrumbs
          label={t.nav.breadcrumb}
          items={[{ name: t.nav.projects, href: href(locale, "projects") }, { name: text.title }]}
        />
        <PageHead label={sectorName(t, project)} title={text.title} lead={text.summary} />
        <dl className="pfacts enter enter--up">
          {facts.map((f) => (
            <div key={f.k}>
              <dt className="mono faint">{f.k}</dt>
              <dd>{f.v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className={`project${hasPhoto(photo) ? "" : " project--text"}`}>
        <section className="project__scope" aria-labelledby="project-scope">
          <h2 className="mono faint" id="project-scope">{t.projects.scopeTitle}</h2>
          <ul className="ticks">
            {text.scope.map((item) => (
              <li key={item}><Icon name="check" size={16} />{item}</li>
            ))}
          </ul>
          <h2 className="mono faint" id="project-trades">{t.projects.tradesTitle}</h2>
          <ul className="chips" aria-labelledby="project-trades">
            {project.trades.map((trade) => {
              const i = tradeSlugs.indexOf(trade);
              return (
                <li key={trade}>
                  <a href={href(locale, `services/${trade}`)}>
                    <Icon name={tradeIcons[i]} size={18} />
                    {t.trades.items[i].name}
                  </a>
                </li>
              );
            })}
          </ul>
        </section>
        {hasPhoto(photo) && (
          <div className="project__media" data-reveal>
            <Photo slug={photo} />
          </div>
        )}
      </div>
    </SiteShell>
  );
}
