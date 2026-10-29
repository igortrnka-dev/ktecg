import type { Dictionary } from "@/i18n";
import Art from "./Art";
import Photo from "./Photo";
import SectionHead from "./SectionHead";

/**
 * Photo slugs: drop public/img/sector-<slug>.jpg in to replace the art. null shows the brushed-pipe art until
 * there is an energy photo of our own (the stock one showed a nuclear plant, which implies work we don't claim).
 */
const slugs = ["automotive", "metalworking", null, "shipbuilding", "electrical", "logistics"];
const PIPE_ART = 3;

export default function Sectors({ t }: { t: Dictionary }) {
  return (
    <section className="block" id="sectors">
      <SectionHead label={t.sectors.label} title={t.sectors.title} />
      <div className="grid grid--3">
        {t.sectors.items.map((item, i) => (
          <a key={item.name} href="#contact" className="card" data-reveal style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
            <div className="card__media">
              {slugs[i] ? <Photo slug={`sector-${slugs[i]}`} variant={i} /> : <Art variant={PIPE_ART} />}
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
