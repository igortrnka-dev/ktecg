import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import type { PageKey } from "@/content/site";
import CtaBand, { type CtaText } from "./CtaBand";
import Footer from "./Footer";
import Header from "./Header";
import RevealObserver from "./RevealObserver";

/**
 * The frame every page of the site shares: skip link, header, main and footer. `path` is the page ("" for the
 * homepage, "services/welding-piping"), `current` the menu page it belongs to. The inquiry band closes every page but the
 * contact page, which has the form instead (`cta={false}`); a division or project page passes its own question.
 */
export default function SiteShell({
  t,
  locale,
  path,
  current,
  cta = true,
  children,
}: {
  t: Dictionary;
  locale: Locale;
  path: string;
  current: PageKey | null;
  cta?: boolean | CtaText;
  children: React.ReactNode;
}) {
  return (
    <div className="page" id="top">
      <a href="#main" className="skip">{t.nav.skip}</a>
      <RevealObserver />
      <Header nav={t.nav} locale={locale} path={path} current={current} />
      <main id="main" className="main" tabIndex={-1}>
        {children}
        {cta !== false && <CtaBand t={t} locale={locale} text={cta === true ? undefined : cta} />}
      </main>
      <Footer t={t} locale={locale} path={path} current={current} />
    </div>
  );
}
