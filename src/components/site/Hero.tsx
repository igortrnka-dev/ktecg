import type { Dictionary } from "@/i18n";

export default function Hero({ t }: { t: Dictionary }) {
  let n = 0;
  return (
    <section className="hero" id="top">
      <h1 className="hero__title" aria-label={t.hero.headline}>
        {t.hero.headline.split(" ").map((word, wi) => (
          <span className="hero__word" key={wi} aria-hidden>
            {[...word].map((ch) => (
              <span key={n} className="hero__char" style={{ animationDelay: `${0.35 + n++ * 0.035}s` }}>
                {ch}
              </span>
            ))}
          </span>
        ))}
      </h1>
      <div className="hero__row">
        <p className="hero__intro enter enter--up">{t.hero.tagline}</p>
        <a href="#sectors" className="scroll enter enter--up">
          <span className="mono">{t.hero.scroll}</span>
          <span className="scroll__btn" aria-hidden>
            <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 5.5l4 4 4-4" stroke="currentColor" strokeWidth="1.3" fill="none" /></svg>
          </span>
        </a>
      </div>
    </section>
  );
}
