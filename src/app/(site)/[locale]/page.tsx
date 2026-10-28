import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import TopBar from "@/components/site/TopBar";
import Hero from "@/components/site/Hero";
import WorkGrid from "@/components/site/WorkGrid";
import Panels from "@/components/site/Panels";
import ContactPanel from "@/components/site/ContactPanel";
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
      <header className="head">
        <TopBar locale={locale} />
        <Hero t={t} />
      </header>
      <main className="main">
        <WorkGrid t={t} />
        <Panels t={t} />
        <ContactPanel t={t} locale={locale} />
      </main>
      <Footer t={t} updated={LAST_UPDATED} />
    </div>
  );
}
