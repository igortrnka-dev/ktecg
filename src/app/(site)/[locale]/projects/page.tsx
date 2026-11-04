import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { projects } from "@/content/projects";
import { pageMetadata } from "@/lib/site/metadata";
import PageHead from "@/components/site/PageHead";
import { ProjectGrid, Stats } from "@/components/site/Projects";
import SiteShell from "@/components/site/SiteShell";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return pageMetadata(locale, "projects", t.pages.projects.meta.title, t.pages.projects.meta.description);
}

/** Projects and references, then the stats passage. Until projects are added, a short note stands in for the list. */
export default async function ProjectsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <SiteShell t={t} locale={locale} path="projects" current="projects">
      <div className="block">
        <PageHead label={t.projects.label} title={t.projects.title} lead={t.projects.lead} />
        {projects.length > 0 ? (
          <ProjectGrid t={t} locale={locale} projects={projects} heading="h2" />
        ) : (
          <p className="empty" data-reveal>{t.projects.empty}</p>
        )}
      </div>
      <Stats t={t} />
    </SiteShell>
  );
}
