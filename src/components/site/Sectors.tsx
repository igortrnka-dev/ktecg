import type { Dictionary } from "@/i18n";
import Photo from "./Photo";
import SectionHead from "./SectionHead";

/**
 * Photo slugs: public/img/sector-<slug>.jpg replaces the art; a missing file shows the art instead (see Photo).
 * The energy photo must not show a nuclear site, which would imply work we don't claim.
 */
const slugs = ["automotive", "metalworking", "energy", "shipbuilding", "electrical", "logistics"];

export default function Sectors({ t }: { t: Dictionary }) {
  return (
    <section className="block" id="sectors">
      <SectionHead label={t.sectors.label} title={t.sectors.title} />
      <div className="grid grid--3">
        {t.sectors.items.map((item, i) => (
          <a key={item.name} href="#contact" className="card" data-reveal style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
            <div className="card__media">
              <Photo slug={`sector-${slugs[i]}`} variant={i} />
            </div>
            <div className="card__body">
              <h3 className="card__title">{item.name}</h3>
              <span className="mono faint">{item.tags}</span>
              <span className="sr-only"> – {t.nav.cta}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
