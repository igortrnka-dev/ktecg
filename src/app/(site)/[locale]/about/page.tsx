import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { pageMetadata } from "@/lib/site/metadata";
import PageHead from "@/components/site/PageHead";
import Process from "@/components/site/Process";
import SiteShell from "@/components/site/SiteShell";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return pageMetadata(locale, "about", t.pages.about.meta.title, t.pages.about.meta.description);
}

/**
 * About us: a short description without photos for now, then how working with us goes. The leadership cards of the
 * mockup come once the owner confirms names, roles and contacts.
 */
export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <SiteShell t={t} locale={locale} path="about" current="about">
      <div className="about">
        <PageHead label={t.about.label} title={t.about.title} />
        <div className="about__text" data-reveal>
          {t.about.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
      <Process t={t} />
    </SiteShell>
  );
}
