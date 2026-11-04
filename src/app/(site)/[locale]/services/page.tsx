import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { pageMetadata } from "@/lib/site/metadata";
import PageHead from "@/components/site/PageHead";
import Process from "@/components/site/Process";
import { Included, ServiceTiles } from "@/components/site/Services";
import SiteShell from "@/components/site/SiteShell";
import Trades from "@/components/site/Trades";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return pageMetadata(locale, "services", t.pages.services.meta.title, t.pages.services.meta.description);
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <SiteShell t={t} locale={locale} path="services" current="services">
      <div className="block">
        <PageHead label={t.services.label} title={t.services.title} lead={t.services.lead} />
        <ServiceTiles t={t} heading="h2" />
      </div>
      <Included t={t} />
      <Trades t={t} locale={locale} />
      <Process t={t} />
    </SiteShell>
  );
}
