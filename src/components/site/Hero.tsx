import { Fragment } from "react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { href } from "@/content/site";
import Icon from "./Icon";
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
              </span>
            </Fragment>
          ))}
        </h1>
        <p className="hero__lead enter enter--up">{t.hero.lead}</p>
        <div className="hero__ctas enter enter--up">
          <a href={href(locale, "contact")} className="glow-btn">
            <span className="glow-btn__glow" aria-hidden />
            <span className="glow-btn__fill">{t.hero.primary}</span>
          </a>
          <a href={`${href(locale, "services")}#trades`} className="btn btn--ghost">
            {t.hero.secondary}
            <Icon name="arrow" size={16} />
          </a>
        </div>
      </div>

      <div className="hero__media enter enter--rise">
        <Photo slug="hero" alt="" fallback={<HeroArt />} eager />
        <div className="req">
          <div className="req__head">
            <span className="mono faint">{t.hero.card.label}</span>
            <span className="req__status mono"><span className="req__dot" />{t.hero.card.status}</span>
          </div>
          <ul className="req__rows">
            {t.hero.card.rows.map((r) => (
              <li key={r.role}>
                <span>{r.role}</span>
                <span className="mono">{r.count}</span>
              </li>
            ))}
          </ul>
          <div className="req__meta">
            {t.hero.card.meta.map((m) => (
              <span key={m.k}><span className="mono faint">{m.k}</span> {m.v}</span>
            ))}
          </div>
        </div>
      </div>

      <dl className="facts-bar enter enter--rise">
        {t.hero.facts.map((f) => (
          <div key={f.k}>
            <dt className="mono faint">{f.k}</dt>
            <dd>{f.v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
