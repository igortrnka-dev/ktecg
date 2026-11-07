import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { divisionSlugs, href, type DivisionSlug } from "@/content/site";
import { siteProjects } from "@/lib/projects";
import { pageMetadata } from "@/lib/site/metadata";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import { divisionIcons, divisionPhoto } from "@/components/site/catalog";
import Icon from "@/components/site/Icon";
import Photo from "@/components/site/Photo";
import { ProjectGrid } from "@/components/site/Projects";
import SectionHead from "@/components/site/SectionHead";
import SiteShell from "@/components/site/SiteShell";

type Params = Promise<{ locale: string; division: string }>;

// Only the divisions in content/site.ts; the middleware sends any other slug to the 404 page.
export const dynamicParams = false;
// Its projects come from the database (see lib/projects.ts).
export const revalidate = 300;
export function generateStaticParams() {
  return locales.flatMap((locale) => divisionSlugs.map((division) => ({ locale, division })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, division } = await params;
  const i = divisionSlugs.indexOf(division as DivisionSlug);
  if (!isLocale(locale) || i < 0) return {};
  const t = getDictionary(locale);
  const d = t.services.divisions[i];
  return pageMetadata(locale, `services/${division}`, `${d.name} – ${t.services.metaSuffix}`, `${d.lead} ${d.short}`);
}

/**
 * A service division: photo and lead, its activities, the sectors it serves, up to three of its projects in one row
 * (left out while there are none) and the inquiry band with the division's own question.
 */
export default async function DivisionPage({ params }: { params: Params }) {
  const { locale, division } = await params;
  const i = divisionSlugs.indexOf(division as DivisionSlug);
  if (!isLocale(locale) || i < 0) notFound();
  const t = getDictionary(locale);
  const slug = divisionSlugs[i];
  const d = t.services.divisions[i];
  const photo = divisionPhoto(slug);
  const related = (await siteProjects(locale)).filter((p) => p.divisions.includes(slug)).slice(0, 3);

  return (
    <SiteShell
      t={t}
      locale={locale}
      path={`services/${slug}`}
      current="services"
      cta={{ title: t.cta.divisionTitle, body: t.cta.briefBody }}
    >
      <div className={`dhero${photo ? "" : " dhero--text"}`}>
        <div className="dhero__copy">
          <Breadcrumbs
            label={t.nav.breadcrumb}
            items={[
              { name: t.nav.home, href: href(locale, "") },
              { name: t.nav.services, href: href(locale, "services") },
              { name: d.name },
            ]}
          />
          <header className="phead enter enter--up">
            <span className="pill mono">
              {t.services.label} / {t.services.division} {String(i + 1).padStart(2, "0")}
            </span>
            <h1 className="phead__title">{d.name}</h1>
            <p className="phead__lead">{d.lead}</p>
            <a href={href(locale, "contact")} className="btn btn--accent btn--lg">
              {t.cta.button}
              <Icon name="arrow" size={16} />
            </a>
          </header>
        </div>
        {photo && (
          <div className="dhero__media enter enter--rise">
            <Photo slug={photo} eager />
            <span className="tile__icon tile__icon--accent division__icon"><Icon name={divisionIcons[slug]} /></span>
          </div>
        )}
      </div>

      <section className="block" aria-labelledby="division-activities">
        <h2 className="dsub" id="division-activities">{t.services.activitiesTitle}</h2>
        <ul className="activities" data-reveal>
          {d.activities.map((a) => (
            <li key={a}><Icon name="check" size={18} />{a}</li>
          ))}
        </ul>
      </section>

      <section className="block" aria-labelledby="division-sectors">
        <h2 className="dsub" id="division-sectors">{t.services.sectorsTitle}</h2>
        <ul className="ptags ptags--lg" data-reveal>
          {d.sectors.map((s) => <li key={s} className="mono">{s}</li>)}
        </ul>
      </section>

      {related.length > 0 && (
        <section className="block" aria-labelledby="division-projects">
          <SectionHead label={t.projects.label} title={t.services.projectsTitle} id="division-projects" />
          <ProjectGrid t={t} locale={locale} projects={related} />
        </section>
      )}

      <section className="block" aria-labelledby="division-others">
        <h2 className="mono faint trade__others-title" id="division-others">{t.services.title}</h2>
        <ul className="chips" data-reveal>
          {t.services.divisions.map((other, j) =>
            j === i ? null : (
              <li key={divisionSlugs[j]}>
                <a href={href(locale, `services/${divisionSlugs[j]}`)}>
                  <Icon name={divisionIcons[divisionSlugs[j]]} size={18} />
                  {other.name}
                </a>
              </li>
            ),
          )}
        </ul>
      </section>
    </SiteShell>
  );
}
