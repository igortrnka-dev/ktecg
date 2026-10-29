import { headers } from "next/headers";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

export default async function NotFound() {
  // not-found pages get no params, so the middleware passes the locale on as a request header. This file sits in
  // the catch-all segment rather than in [locale], because there it would be rendered with every page and
  // reading headers() would stop the locale pages from being prerendered.
  const value = (await headers()).get("x-locale") ?? "";
  const locale = isLocale(value) ? value : defaultLocale;
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
