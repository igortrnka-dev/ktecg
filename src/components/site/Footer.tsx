import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { localeNames, locales } from "@/i18n/config";
import { EMAIL } from "./email";

export default function Footer({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <footer className="footer">
      <div className="footer__brand">
        <span className="footer__name">{t.footer.company}</span>
        <span className="muted">{t.footer.tagline}</span>
        <a href={`mailto:${EMAIL}`} className="mono faint">{EMAIL}</a>
      </div>
      <nav className="footer__langs" aria-label={t.nav.language}>
        {locales.map((l) => (
          <a
            key={l}
            href={`/${l}`}
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
      <div className="footer__meta">
        <span className="muted">© {new Date().getFullYear()} {t.footer.company} {t.footer.rights}</span>
        <a href="#top" className="mono faint">↑ {t.footer.top}</a>
      </div>
    </footer>
  );
}
