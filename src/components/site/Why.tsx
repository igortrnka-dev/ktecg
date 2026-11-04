import type { Dictionary } from "@/i18n";
import Icon from "./Icon";
import SectionHead from "./SectionHead";

/** "Why KTechnology": on the homepage and the about page. */
export default function Why({ t }: { t: Dictionary }) {
  return (
    <section className="block" id="why">
      <SectionHead label={t.why.label} title={t.why.title} />
      <div className="grid grid--4">
        {t.why.items.map((item, i) => (
          <article key={item.title} className="tile" data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
            <span className="tile__icon tile__icon--accent"><Icon name="check" /></span>
            <h3 className="tile__title">{item.title}</h3>
            <p className="muted">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

/** The countries we deploy to. */
export function Reach({ t }: { t: Dictionary }) {
  return (
    <div className="reach" data-reveal>
      <div className="reach__head">
        <span className="tile__icon"><Icon name="globe" /></span>
        <div>
          <span className="mono faint">{t.reach.label}</span>
          <p className="reach__title">{t.reach.title}</p>
        </div>
      </div>
      <ul className="reach__list" aria-label={t.reach.label}>
        {t.reach.countries.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </div>
  );
}
