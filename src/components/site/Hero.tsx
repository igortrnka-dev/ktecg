import { Fragment } from "react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { href } from "@/content/site";
import Icon, { type IconName } from "./Icon";
import Photo from "./Photo";

/** Helmet-and-visor composition used until a hero photo is supplied. */
function HeroArt() {
  return (
    <div className="portrait" aria-hidden>
      <div className="portrait__light" />
      <div className="portrait__helmet">
        <span className="portrait__visor" />
      </div>
      <div className="grain" />
    </div>
  );
}

/** Icons of the four feature cards under the hero, in the order of `hero.features`. */
const featureIcons: IconName[] = ["gear", "globe", "people", "route"];

/** Homepage opening: label, the page's h1 with its accent dot, subtitle, lead, two buttons, photo, four feature cards. */
export default function Hero({ t, locale }: { t: Dictionary; locale: Locale }) {
  const words = t.hero.title.split(" ");
  return (
    <section className="hero">
      <div className="hero__copy">
        <span className="pill mono enter enter--up">{t.hero.eyebrow}</span>
        <h1 className="hero__title">
          {words.map((word, i) => (
            <Fragment key={i}>
              {i > 0 && " "}
              <span className="hero__word" style={{ animationDelay: `${0.3 + i * 0.06}s` }}>
                {word}
                {i === words.length - 1 && <span className="hero__dot">.</span>}
              </span>
            </Fragment>
          ))}
        </h1>
        <p className="hero__subtitle enter enter--up">{t.hero.subtitle}</p>
        <p className="hero__lead enter enter--up">{t.hero.lead}</p>
        <div className="hero__ctas enter enter--up">
          <a href={href(locale, "contact")} className="btn btn--accent btn--lg">
            {t.hero.primary}
            <Icon name="arrow" size={16} />
          </a>
          <a href={href(locale, "services")} className="btn btn--ghost">
            {t.hero.secondary}
          </a>
        </div>
      </div>

      <div className="hero__media enter enter--rise">
        <Photo slug="hero" alt="" fallback={<HeroArt />} eager />
      </div>

      <ul className="features enter enter--rise">
        {t.hero.features.map((f, i) => (
          <li key={f.title} className="feature">
            <span className="tile__icon tile__icon--accent"><Icon name={featureIcons[i]} /></span>
            <div>
              <p className="feature__title">{f.title}</p>
              <p className="muted">{f.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
