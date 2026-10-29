import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { locales } from "@/i18n/config";

export default function Footer({ t, locale, updated }: { t: Dictionary; locale: Locale; updated: string }) {
  return (
    <footer className="footer">
      <div className="footer__brand">
        <span className="footer__name">{t.footer.company}</span>
        <span className="muted">{t.footer.tagline}</span>
        <a href="mailto:office@ktechnology.sk" className="mono faint">office@ktechnology.sk</a>
      </div>
      <nav className="footer__langs" aria-label={t.nav.language}>
        {locales.map((l) => (
          <a key={l} href={`/${l}`} hrefLang={l} className={`mono ${l === locale ? "is-active" : ""}`}>
            {l.toUpperCase()}
          </a>
        ))}
      </nav>
      <div className="footer__meta">
        <span className="muted">© {new Date().getFullYear()} {t.footer.company}. {t.footer.rights}</span>
        <span className="mono faint">{updated}</span>
        <a href="#top" className="mono faint">↑ {t.footer.top}</a>
      </div>
    </footer>
  );
}
