import type { Locale } from "@/i18n/config";
import { localeNames, locales } from "@/i18n/config";

export default function TopBar({ locale }: { locale: Locale }) {
  return (
    <div className="topbar">
      <a href={`/${locale}`} className="id enter enter--down">
        <span className="id__avatar">
          <span className="id__ring">KT</span>
          <span className="id__dot" />
        </span>
        <span className="id__text">
          <span className="id__name">KTechnology s.r.o.</span>
          <span className="id__mail mono">office@ktechnology.sk</span>
        </span>
      </a>
      <nav className="langs enter enter--left" aria-label="Language">
        {locales.map((l) => (
          <a key={l} href={`/${l}`} hrefLang={l} title={localeNames[l]} className={`mono ${l === locale ? "is-active" : ""}`}>
            {l.toUpperCase()}
          </a>
        ))}
      </nav>
    </div>
  );
}
