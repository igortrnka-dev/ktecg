import type { Dictionary } from "@/i18n";
import { sectorSlugs } from "@/content/site";
import Photo from "./Photo";

/**
 * The sector cards of the sectors page. They are not links: what we do is on the services page, the projects on
 * their own page. Photo slugs: public/img/sector-<slug>.jpg replaces the art; a missing file shows the art instead
 * (see Photo). The energy photo must not show a nuclear site, which would imply work we don't claim, and no photo
 * may show a construction site.
 */
export default function Sectors({ t }: { t: Dictionary }) {
  return (
    <div className="grid grid--3">
      {t.sectors.items.map((item, i) => (
        <article key={sectorSlugs[i]} className="card" data-reveal style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
          <div className="card__media">
            <Photo slug={`sector-${sectorSlugs[i]}`} variant={i} />
          </div>
          <div className="card__body">
            <h2 className="card__title">{item.name}</h2>
            <span className="mono faint">{item.tags}</span>
          </div>
        </article>
      ))}
    </div>
  );
}
