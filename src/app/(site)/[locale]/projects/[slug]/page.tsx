import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { href } from "@/content/site";
import type { PublicProject } from "@/content/projects";
import { allProjects, publicProject, siteProjects } from "@/lib/projects";
import { notFoundMetadata, pageMetadata } from "@/lib/site/metadata";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import Icon from "@/components/site/Icon";
import NotFoundView from "@/components/site/NotFoundView";
import {
  ProjectGrid,
  ProjectPhoto,
  RemotePhoto,
  periodText,
  projectNumber,
  teamText,
} from "@/components/site/Projects";
import SectionHead from "@/components/site/SectionHead";
import SiteShell from "@/components/site/SiteShell";

type Params = Promise<{ locale: string; slug: string }>;

// Projects are edited in the admin, which refreshes these pages on save; a project added there gets its page on
// the first visit.
export const revalidate = 300;
export const dynamicParams = true;
export async function generateStaticParams() {
  const projects = await allProjects();
  return locales.flatMap((locale) =>
    projects.filter((p) => publicProject(p, locale, 0)).map((p) => ({ locale, slug: p.slug })),
  );
}

/** The project in the page's language with its number on the projects page, and the languages it exists in. */
async function load(locale: Locale, slug: string) {
  const list = await siteProjects(locale);
  const project = list.find((p) => p.slug === slug);
  if (!project) return null;
  const record = (await allProjects()).find((p) => p.slug === slug)!;
  const langs = locales.filter((l) => publicProject(record, l, 0));
  return { project, list, langs };
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  const found = await load(locale, slug);
  if (!found) return { ...notFoundMetadata(t.notFound.title, t.notFound.body), robots: { index: false } };
  const { project, langs } = found;
  return pageMetadata(locale, `projects/${slug}`, `${project.text.title} – ${t.projects.metaSuffix}`, project.text.summary, {
    langs,
    image: project.photo ?? (project.stockPhoto ? `/img/${project.stockPhoto}.jpg` : undefined),
  });
}

/** The facts beside the description: place, industry, the companies (once approved), period, staff, status. */
type Fact = { k: string; v: string; icon: "pin" | "factory" | "user" | "building" | "gear" | "calendar" | "people" | "check" };
function facts(t: ReturnType<typeof getDictionary>, locale: Locale, p: PublicProject): Fact[] {
  const f = t.projects.facts;
  const all: (Fact | false | null | undefined | "")[] = [
    { k: f.location, v: p.text.location, icon: "pin" as const },
    { k: f.industry, v: p.text.industry, icon: "factory" as const },
    ...p.parties.map((party) => ({ k: t.projects.parties[party.role], v: party.name, icon: "user" as const })),
    p.text.site && { k: f.site, v: p.text.site, icon: "building" as const },
    p.text.name && { k: f.name, v: p.text.name, icon: "gear" as const },
    { k: f.period, v: periodText(p), icon: "calendar" as const },
    p.team !== null && { k: f.team, v: teamText(t, locale, p.team, p.teamApprox), icon: "people" as const },
    p.status && { k: f.status, v: t.projects.status[p.status], icon: "check" as const },
  ];
  return all.filter((x): x is Fact => Boolean(x));
}

/**
 * A reference project, one template for all: back link, a wide main photo with the number and title, the key facts
 * beside the description and the scope of work, the project's own photos when approved, the back link again, other
 * projects and the inquiry band. On phones everything stacks.
 */
export default async function ProjectPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const found = await load(locale, slug);
  // An unknown, unpublished or untranslated project: the middleware cannot know the slugs in the database, so the
  // 404 view is rendered here (noindex in the metadata above).
  if (!found) {
    return (
      <SiteShell t={t} locale={locale} path="" current={null} cta={false}>
        <NotFoundView t={t} locale={locale} />
      </SiteShell>
    );
  }
  const { project: p, list } = found;
  const others = list.filter((x) => x.slug !== slug).slice(0, 3);
  const projectsHref = href(locale, "projects");

  return (
    <SiteShell
      t={t}
      locale={locale}
      path={`projects/${slug}`}
      current="projects"
      cta={{ title: t.cta.projectTitle, body: t.cta.briefBody }}
    >
      <div className="pdetail">
        <div className="pdetail__top enter enter--up">
          <a href={projectsHref} className="pback">
            <Icon name="back" size={16} />
            {t.projects.back}
          </a>
          <Breadcrumbs
            label={t.nav.breadcrumb}
            items={[
              { name: t.nav.home, href: href(locale, "") },
              { name: t.nav.projects, href: projectsHref },
              { name: p.text.title },
            ]}
          />
        </div>

        <header className="phero enter enter--rise">
          <div className="phero__media">
            <ProjectPhoto project={p} eager />
          </div>
          <div className="phero__copy">
            <div className="phero__badges">
              <span className="pcard__num mono">{projectNumber(p.number)}</span>
              <span className="pcard__period mono">{periodText(p)}</span>
              {p.status && (
                <span className={`pstatus pstatus--${p.status} pstatus--pill`}>
                  <Icon name="check" size={16} />
                  {t.projects.status[p.status]}
                </span>
              )}
            </div>
            <h1 className="phero__title">{p.text.title}</h1>
            <p className="phero__place">
              <span><Icon name="pin" size={18} />{p.text.location}</span>
              <span><Icon name="factory" size={18} />{p.text.industry}</span>
            </p>
          </div>
          {!p.photo && <span className="phero__caption mono">{t.projects.illustrative}</span>}
        </header>

        <div className="pbody">
          <div className="pbody__main">
            <section aria-labelledby="project-description" data-reveal>
              <h2 className="dsub" id="project-description">{t.projects.descriptionTitle}</h2>
              <p className="project__text">{p.text.description}</p>
            </section>
            {p.text.scope.length > 0 && (
              <section aria-labelledby="project-scope" data-reveal>
                <h2 className="dsub" id="project-scope">{t.projects.scopeTitle}</h2>
                <ul className="activities activities--one">
                  {p.text.scope.map((a) => (
                    <li key={a}><Icon name="check" size={18} />{a}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
          <aside className="pbody__side" aria-labelledby="project-facts" data-reveal>
            <h2 className="mono pside__title" id="project-facts">{t.projects.infoTitle}</h2>
            <dl className="pside">
              {facts(t, locale, p).map((f) => (
                <div key={`${f.k}-${f.v}`}>
                  <dt className="mono faint"><Icon name={f.icon} size={16} />{f.k}</dt>
                  <dd>{f.v}</dd>
                </div>
              ))}
            </dl>
            <a href={href(locale, "contact")} className="btn btn--accent btn--lg pside__btn">
              {t.cta.button}
              <Icon name="arrow" size={16} />
            </a>
          </aside>
        </div>

        {p.gallery.length > 0 && (
          <section className="block" aria-labelledby="project-gallery">
            <h2 className="dsub" id="project-gallery">{t.projects.galleryTitle}</h2>
            <ul className="pgallery pgallery--wide">
              {p.gallery.map((src, i) => (
                <li key={src} data-reveal style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
                  <a href={src} target="_blank" rel="noreferrer" aria-label={`${t.projects.galleryTitle} ${i + 1}`}>
                    <RemotePhoto src={src} />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <p className="pdetail__actions" data-reveal>
          <a href={projectsHref} className="pback">
            <Icon name="back" size={16} />
            {t.projects.back}
          </a>
        </p>
      </div>

      {others.length > 0 && (
        <section className="block" aria-labelledby="project-others">
          <SectionHead label={t.projects.label} title={t.projects.othersTitle} id="project-others" />
          <ProjectGrid t={t} locale={locale} projects={others} />
        </section>
      )}
    </SiteShell>
  );
}
