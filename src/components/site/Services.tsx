import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { divisionSlugs, href } from "@/content/site";
import { divisionIcons, divisionPhoto } from "./catalog";
import Icon from "./Icon";
import Photo from "./Photo";

/** The four service divisions as photo cards, each opening its division page: on the homepage and the services page. */
export function DivisionCards({
  t,
  locale,
  heading: Heading = "h3",
}: {
  t: Dictionary;
  locale: Locale;
  heading?: "h2" | "h3";
}) {
  return (
    <ul className="divisions">
      {t.services.divisions.map((d, i) => {
        const slug = divisionSlugs[i];
        return (
          <li key={slug} data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
            <a href={href(locale, `services/${slug}`)} className="card card--link division">
              <div className="card__media">
                <Photo slug={divisionPhoto(slug)} variant={i + 2} />
                <span className="tile__icon tile__icon--accent division__icon"><Icon name={divisionIcons[slug]} /></span>
              </div>
              <div className="card__body">
                <span className="mono faint">{t.services.division} {String(i + 1).padStart(2, "0")}</span>
                <Heading className="card__title">{d.name}</Heading>
                <p className="muted card__text">{d.short}</p>
                <span className="tile__more mono">
                  {t.services.open}
                  <Icon name="arrow" size={16} />
                </span>
              </div>
            </a>
          </li>
        );
      })}
    </ul>
  );
}

/** "All included" panel: everything we arrange around the crew. */
export function Included({ t }: { t: Dictionary }) {
  return (
    <section className="included" aria-labelledby="included-title" data-reveal>
      <div className="included__head">
        <span className="pill mono">{t.included.label}</span>
        <h2 className="included__title" id="included-title">{t.included.title}</h2>
        <p className="muted">{t.included.lead}</p>
        <div className="included__media">
          <Photo slug="included" variant={5} />
        </div>
      </div>
      <ul className="included__list">
        {t.included.items.map((item, i) => (
          <li key={item}>
            <span className="mono faint">{String(i + 1).padStart(2, "0")}</span>
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
