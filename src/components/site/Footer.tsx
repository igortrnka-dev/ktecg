import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { localeNames, locales } from "@/i18n/config";
import { divisionSlugs, href, pages, type PageKey } from "@/content/site";
import { EMAIL } from "./email";

/**
 * Site footer: brand and tagline, quick links, the service divisions, the sectors, contact, then languages (keeping
 * the page) and copyright. Company address, registration numbers, phone, LinkedIn and the legal pages are added once
 * the owner supplies them; nothing is shown from the mockup's sample data. `current` is null on the 404 page, whose
 * path "" would otherwise mark Home as the current page.
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
  const [mailbox, domain] = EMAIL.split("@");
  return (
    <footer className="footer">
      <div className="footer__brand">
        <a href={href(locale, "")} className="footer__logo" aria-label={`${t.footer.company} – ${t.nav.home}`}>
          <span className="footer__k" aria-hidden>K</span>Technology
        </a>
        <span className="muted">{t.footer.tagline}</span>
      </div>
      <nav className="footer__col" aria-labelledby="footer-pages">
        <span className="mono faint" id="footer-pages">{t.footer.links}</span>
        <ul>
          {pages.map((p) => (
            <li key={p.key}>
              <a href={href(locale, p.path)} aria-current={isCurrent(p.path)}>{t.nav[p.key]}</a>
            </li>
          ))}
        </ul>
      </nav>
      <nav className="footer__col" aria-labelledby="footer-services">
        <span className="mono faint" id="footer-services">{t.nav.services}</span>
        <ul>
          {t.services.divisions.map((d, i) => {
            const divisionPath = `services/${divisionSlugs[i]}`;
            return (
              <li key={divisionSlugs[i]}>
                <a href={href(locale, divisionPath)} aria-current={isCurrent(divisionPath)}>{d.name}</a>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="footer__col">
        <span className="mono faint" id="footer-sectors">{t.nav.sectors}</span>
        <ul aria-labelledby="footer-sectors">
          {t.sectors.items.map((name) => (
            <li key={name}>
              <a href={href(locale, "sectors")}>{name}</a>
            </li>
          ))}
        </ul>
      </div>
      <div className="footer__col">
        <span className="mono faint">{t.footer.contact}</span>
        <ul>
          <li>{t.footer.company}</li>
          <li>
            <a href={`mailto:${EMAIL}`}>{mailbox}@<wbr />{domain}</a>
          </li>
          <li>
            <a href={href(locale, "contact")} aria-current={isCurrent("contact")}>{t.nav.cta}</a>
          </li>
        </ul>
      </div>
      <div className="footer__meta">
        <span className="muted">© {new Date().getFullYear()} {t.footer.company} {t.footer.rights}</span>
        <nav className="footer__langs" aria-label={t.nav.language}>
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
        <a href="#top" className="mono faint">↑ {t.footer.top}</a>
      </div>
    </footer>
  );
}
