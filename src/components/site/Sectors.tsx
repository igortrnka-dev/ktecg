import type { Dictionary } from "@/i18n";
import Art from "./Art";
import Photo from "./Photo";
import SectionHead from "./SectionHead";

/**
 * Photo slugs: drop public/img/sector-<slug>.jpg in to replace the art. null shows the art:
 * sector-energy.jpg is a nuclear plant, which implies nuclear-site work we don't claim.
 */
const slugs = ["automotive", "metalworking", null, "shipbuilding", "electrical", "logistics"];

export default function Sectors({ t }: { t: Dictionary }) {
  return (
    <section className="block" id="sectors">
      <SectionHead label={t.sectors.label} title={t.sectors.title} />
      <div className="grid grid--3">
        {t.sectors.items.map((item, i) => (
          <a key={item.name} href="#contact" className="card" data-reveal style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
            <div className="card__media">
              {slugs[i] ? <Photo slug={`sector-${slugs[i]}`} variant={i} /> : <Art variant={i} />}
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
