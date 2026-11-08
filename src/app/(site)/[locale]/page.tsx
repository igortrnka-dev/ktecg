import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { href } from "@/content/site";
import { siteProjects } from "@/lib/projects";
import Hero from "@/components/site/Hero";
import Icon from "@/components/site/Icon";
import Process from "@/components/site/Process";
import { ProjectGrid } from "@/components/site/Projects";
import SectionHead from "@/components/site/SectionHead";
import Sectors from "@/components/site/Sectors";
import { DivisionCards } from "@/components/site/Services";
import SiteShell from "@/components/site/SiteShell";

/** More link under a homepage section. */
function More({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <p className="note" data-reveal>
      <a href={to} className="tlink">{children}<Icon name="arrow" size={16} /></a>
    </p>
  );
}

// The latest projects come from the database (see lib/projects.ts).
export const revalidate = 300;

/**
 * Homepage: hero with the four feature cards, the service divisions, the sectors, the latest projects (once there
 * are any), a short about passage and how working with us goes. The inquiry band closes it, as every page.
 */
export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);
  const projects = await siteProjects(locale);

  return (
    <SiteShell t={t} locale={locale} path="" current="home">
      <Hero t={t} locale={locale} />
      <section className="block" id="services">
        <SectionHead label={t.services.label} title={t.services.title} lead={t.services.lead} />
        <DivisionCards t={t} locale={locale} />
        <More to={href(locale, "services")}>{t.services.more}</More>
      </section>
      <section className="block" id="sectors">
        <SectionHead label={t.sectors.label} title={t.sectors.title} lead={t.sectors.lead} />
        <Sectors t={t} />
        <More to={href(locale, "sectors")}>{t.sectors.more}</More>
      </section>
      {projects.length > 0 && (
        <section className="block" id="projects">
          <SectionHead label={t.projects.label} title={t.projects.title} />
          <ProjectGrid t={t} locale={locale} projects={projects.slice(0, 3)} />
          <More to={href(locale, "projects")}>{t.projects.more}</More>
        </section>
      )}
      <section className="block about about--teaser" aria-labelledby="about-title">
        <div className="shead" data-reveal>
          <span className="pill mono">{t.about.label}</span>
          <h2 className="shead__title" id="about-title">{t.about.title}</h2>
        </div>
        <div className="about__text" data-reveal>
          {t.about.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <a href={href(locale, "about")} className="btn btn--ghost">
            {t.about.more}
            <Icon name="arrow" size={16} />
          </a>
        </div>
      </section>
      <Process t={t} />
    </SiteShell>
  );
}
