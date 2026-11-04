import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { pageMetadata } from "@/lib/site/metadata";
import PageHead from "@/components/site/PageHead";
import Sectors from "@/components/site/Sectors";
import SiteShell from "@/components/site/SiteShell";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return pageMetadata(locale, "sectors", t.pages.sectors.meta.title, t.pages.sectors.meta.description);
}

export default async function SectorsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <SiteShell t={t} locale={locale} path="sectors" current="sectors">
      <div className="block">
        <PageHead label={t.sectors.label} title={t.sectors.title} lead={t.sectors.lead} />
        <Sectors t={t} />
      </div>
    </SiteShell>
  );
}
