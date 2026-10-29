import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

/**
 * Localized 404 for every unmatched path under a locale. It renders as a normal page because notFound() from a page
 * only reaches the browser as Next's empty error shell (the not-found boundary renders on the client). The 404
 * status comes from the middleware.
 */
export default async function NotFoundPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <div className="page">
      <a href="#main" className="skip">{t.nav.skip}</a>
      <Header nav={t.nav} locale={locale} hrefBase={`/${locale}`} />
      <main id="main" className="main" tabIndex={-1}>
        <section className="notfound" id="top">
          <span className="pill mono">404</span>
          <h1 className="notfound__title">{t.notFound.title}</h1>
          <p className="notfound__text">{t.notFound.body}</p>
          <a href={`/${locale}`} className="glow-btn">
            <span className="glow-btn__glow" aria-hidden />
            <span className="glow-btn__fill">{t.notFound.home}</span>
          </a>
        </section>
      </main>
      <Footer t={t} locale={locale} />
    </div>
  );
}
