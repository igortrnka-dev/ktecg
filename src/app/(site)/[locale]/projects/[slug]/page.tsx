import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { href } from "@/content/site";
import { projects } from "@/content/projects";
import { pageMetadata } from "@/lib/site/metadata";
import { hasPhoto } from "@/lib/photo";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import Icon from "@/components/site/Icon";
import Photo from "@/components/site/Photo";
import { ProjectGrid, countryName, periodText, sectorName, teamText } from "@/components/site/Projects";
import SectionHead from "@/components/site/SectionHead";
import SiteShell from "@/components/site/SiteShell";

type Params = Promise<{ locale: string; slug: string }>;

/** Photos shown in the documentation strip; the rest are counted on the last tile. */
const GALLERY_SHOWN = 4;

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

/**
 * A reference project: facts and photo, scope and main activities, photo documentation, results, then other projects
 * and the inquiry band with its own question. Sections without content (no gallery, no results) are left out.
 */
export default async function ProjectPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!isLocale(locale) || !project) notFound();
  const t = getDictionary(locale);
  const text = project.text[locale];
  const photo = project.photo ?? `project-${project.slug}`;
  const country = countryName(locale, project.country);
  const sector = sectorName(t, project);
  const facts = [
    { k: t.projects.facts.period, v: periodText(project), icon: "calendar" as const },
    project.team !== undefined && { k: t.projects.facts.team, v: teamText(t, locale, project.team), icon: "people" as const },
    { k: t.projects.facts.country, v: country, icon: "pin" as const },
    { k: t.projects.facts.sector, v: sector, icon: "factory" as const },
  ].filter((f) => f !== false);
  const gallery = (project.gallery ?? []).filter(hasPhoto);
  const hidden = gallery.length - GALLERY_SHOWN;
  const others = projects.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <SiteShell
      t={t}
      locale={locale}
      path={`projects/${slug}`}
      current="projects"
      cta={{ title: t.cta.projectTitle, body: t.cta.briefBody }}
    >
      <div className={`dhero${hasPhoto(photo) ? "" : " dhero--text"}`}>
        <div className="dhero__copy">
          <Breadcrumbs
            label={t.nav.breadcrumb}
            items={[
              { name: t.nav.home, href: href(locale, "") },
              { name: t.nav.projects, href: href(locale, "projects") },
              { name: text.title },
            ]}
          />
          <header className="phead enter enter--up">
            <span className="pill mono">{t.projects.badge}</span>
            <h1 className="phead__title">{text.title}</h1>
            <p className="phead__lead">{text.summary}</p>
          </header>
          <dl className="pfacts enter enter--up">
            {facts.map((f) => (
              <div key={f.k}>
                <dt className="mono faint"><Icon name={f.icon} size={16} />{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
        {hasPhoto(photo) && (
          <div className="dhero__media enter enter--rise">
            <Photo slug={photo} eager />
          </div>
        )}
      </div>

      <div className="project">
        <section aria-labelledby="project-scope">
          <h2 className="dsub" id="project-scope">{t.projects.scopeTitle}</h2>
          <p className="project__text">{text.scope}</p>
        </section>
        <section aria-labelledby="project-activities">
          <h2 className="dsub" id="project-activities">{t.projects.activitiesTitle}</h2>
          <ul className="activities activities--one">
            {text.activities.map((a) => (
              <li key={a}><Icon name="check" size={18} />{a}</li>
            ))}
          </ul>
        </section>
      </div>

      {gallery.length > 0 && (
        <section className="block" aria-labelledby="project-gallery">
          <h2 className="dsub" id="project-gallery">{t.projects.galleryTitle}</h2>
          <ul className="pgallery">
            {gallery.slice(0, GALLERY_SHOWN).map((g, i) => (
              <li key={g} data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
                <Photo slug={g} />
                {i === GALLERY_SHOWN - 1 && hidden > 0 && (
                  <span className="pgallery__more">+{hidden} {t.projects.morePhotos}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(text.results?.length || text.outcome) && (
        <section className="block" aria-labelledby="project-results">
          <h2 className="dsub" id="project-results">{t.projects.resultsTitle}</h2>
          {text.results && text.results.length > 0 && (
            <ul className="results" data-reveal>
              {text.results.map((r) => (
                <li key={r}>
                  <span className="tile__icon tile__icon--accent"><Icon name="check" /></span>
                  {r}
                </li>
              ))}
            </ul>
          )}
          {text.outcome && (
            <p className="outcome" data-reveal>
              {text.outcome} <span className="mono faint">{sector} · {country}</span>
            </p>
          )}
        </section>
      )}

      {others.length > 0 && (
        <section className="block" aria-labelledby="project-others">
          <SectionHead label={t.projects.label} title={t.projects.othersTitle} id="project-others" />
          <ProjectGrid t={t} locale={locale} projects={others} />
          <p className="note" data-reveal>
            <a href={href(locale, "projects")} className="tlink">{t.projects.more}<Icon name="arrow" size={16} /></a>
          </p>
        </section>
      )}
    </SiteShell>
  );
}
