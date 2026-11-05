import type { Dictionary } from "@/i18n";
import { sectorSlugs } from "@/content/site";
import { sectorIcons, sectorPhoto } from "./catalog";
import Icon from "./Icon";
import Photo from "./Photo";

/**
 * The nine sector cards: photo, icon and name. They are not links: what we do is on the services pages, the projects
 * on their own page.
 */
export default function Sectors({ t, heading: Heading = "h3" }: { t: Dictionary; heading?: "h2" | "h3" }) {
  return (
    <ul className="sectors">
      {t.sectors.items.map((name, i) => {
        const slug = sectorSlugs[i];
        return (
          <li key={slug} className="card sector" data-reveal style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
            <div className="card__media">
              <Photo slug={sectorPhoto(slug)} variant={i} />
            </div>
            <div className="sector__body">
              <span className="tile__icon tile__icon--accent"><Icon name={sectorIcons[slug]} /></span>
              <Heading className="card__title">{name}</Heading>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
