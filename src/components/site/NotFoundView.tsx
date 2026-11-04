import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { href } from "@/content/site";

/** Body of the localized 404 page. */
export default function NotFoundView({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <section className="notfound">
      <span className="pill mono">404</span>
      <h1 className="notfound__title">{t.notFound.title}</h1>
      <p className="notfound__text">{t.notFound.body}</p>
      <a href={href(locale, "")} className="glow-btn">
        <span className="glow-btn__glow" aria-hidden />
        <span className="glow-btn__fill">{t.notFound.home}</span>
      </a>
    </section>
  );
}
