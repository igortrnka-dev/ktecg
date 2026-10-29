import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import Services from "@/components/site/Services";
import Trades from "@/components/site/Trades";
import Sectors from "@/components/site/Sectors";
import Process from "@/components/site/Process";
import Why from "@/components/site/Why";
import Faq from "@/components/site/Faq";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";
import RevealObserver from "@/components/site/RevealObserver";

// Bumped on each content release; shown in the footer.
const LAST_UPDATED = "28/10/26";

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <div className="page">
      <RevealObserver />
      <Header nav={t.nav} locale={locale} />
      <main className="main">
        <Hero t={t} />
        <Services t={t} />
        <Trades t={t} />
        <Sectors t={t} />
        <Process t={t} />
        <Why t={t} />
        <Faq t={t} />
        <Contact t={t} locale={locale} />
      </main>
      <Footer t={t} locale={locale} updated={LAST_UPDATED} />
    </div>
  );
}
