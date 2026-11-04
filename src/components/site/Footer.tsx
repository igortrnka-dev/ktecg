import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { localeNames, locales } from "@/i18n/config";
import { href, pages, tradeSlugs, type PageKey } from "@/content/site";
import { EMAIL } from "./email";

/**
 * Site footer: company, the menu pages, the trade pages, languages (keeping the page), copyright. `current` is null
 * on the 404 page, whose path "" would otherwise mark Home as the current page.
 */
export default function Footer({
  t,
  locale,
  path,
  current,
}: {
  t: Dictionary;
  locale: Locale;
  path: string;
  current: PageKey | null;
}) {
  const isCurrent = (linkPath: string) => (current !== null && linkPath === path ? ("page" as const) : undefined);
  return (
    <footer className="footer">
      <div className="footer__brand">
        <span className="footer__name">{t.footer.company}</span>
        <span className="muted">{t.footer.tagline}</span>
        <a href={`mailto:${EMAIL}`} className="mono faint">{EMAIL}</a>
      </div>
      <nav className="footer__col" aria-labelledby="footer-pages">
        <span className="mono faint" id="footer-pages">{t.footer.pages}</span>
        <ul>
          {pages.map((p) => (
            <li key={p.key}>
              <a href={href(locale, p.path)} aria-current={isCurrent(p.path)}>{t.nav[p.key]}</a>
            </li>
          ))}
        </ul>
      </nav>
      <nav className="footer__col" aria-labelledby="footer-trades">
        <span className="mono faint" id="footer-trades">{t.trades.label}</span>
        <ul>
          {t.trades.items.map((trade, i) => {
            const tradePath = `services/${tradeSlugs[i]}`;
            return (
              <li key={tradeSlugs[i]}>
                <a href={href(locale, tradePath)} aria-current={isCurrent(tradePath)}>{trade.name}</a>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="footer__col footer__col--langs">
        <span className="mono faint" id="footer-langs">{t.nav.language}</span>
        <nav className="footer__langs" aria-labelledby="footer-langs">
          {locales.map((l) => (
            <a
              key={l}
              href={href(l, path)}
              hrefLang={l}
              lang={l}
              aria-label={`${l.toUpperCase()} – ${localeNames[l]}`}
              aria-current={l === locale ? "page" : undefined}
              className={`mono ${l === locale ? "is-active" : ""}`}
            >
              {l.toUpperCase()}
            </a>
          ))}
        </nav>
      </div>
      <div className="footer__meta">
        <span className="muted">© {new Date().getFullYear()} {t.footer.company} {t.footer.rights}</span>
        <a href="#top" className="mono faint">↑ {t.footer.top}</a>
      </div>
    </footer>
  );
}
