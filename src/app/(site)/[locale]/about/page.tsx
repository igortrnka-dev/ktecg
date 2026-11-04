import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { pageMetadata } from "@/lib/site/metadata";
import PageHead from "@/components/site/PageHead";
import SiteShell from "@/components/site/SiteShell";
import Why, { Reach } from "@/components/site/Why";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return pageMetadata(locale, "about", t.pages.about.meta.title, t.pages.about.meta.description);
}

/** About us: a short text without photos for now, why us and where we deploy. */
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <SiteShell t={t} locale={locale} path="about" current="about">
      <div className="about">
        <PageHead label={t.about.label} title={t.about.title} lead={t.about.lead} />
        <div className="about__text" data-reveal>
          {t.about.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
      <Why t={t} />
      <Reach t={t} />
    </SiteShell>
  );
}
