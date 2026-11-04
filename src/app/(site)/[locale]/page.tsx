import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { href } from "@/content/site";
import Hero from "@/components/site/Hero";
import Icon from "@/components/site/Icon";
import Process from "@/components/site/Process";
import SectionHead from "@/components/site/SectionHead";
import { ServiceTiles } from "@/components/site/Services";
import SiteShell from "@/components/site/SiteShell";
import Why from "@/components/site/Why";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <SiteShell t={t} locale={locale} path="" current="home">
      <Hero t={t} locale={locale} />
      <section className="block" id="services">
        <SectionHead label={t.services.label} title={t.services.title} lead={t.services.lead} />
        <ServiceTiles t={t} />
        <p className="note" data-reveal>
          <a href={href(locale, "services")} className="tlink">{t.services.more}<Icon name="arrow" size={16} /></a>
        </p>
      </section>
      <Why t={t} />
      <Process t={t} />
    </SiteShell>
  );
}
