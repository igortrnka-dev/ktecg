import type { Dictionary } from "@/i18n";
import Icon, { type IconName } from "./Icon";
import Photo from "./Photo";

const icons: IconName[] = ["people", "chart", "route"];
/**
 * A missing file shows the art instead (see Photo). Photos here, and in the "All included" panel, must show every
 * worker in full PPE for the task: they sit next to "PPE included".
 */
const photos = ["service-leasing", "service-outages", "service-mobilisation"];

/** The three services as photo tiles: on the homepage and the services page. */
export function ServiceTiles({ t, heading: Heading = "h3" }: { t: Dictionary; heading?: "h2" | "h3" }) {
  return (
    <div className="grid grid--3">
      {t.services.items.map((s, i) => (
        <article key={s.title} className="tile tile--service" data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
          <div className="tile__media">
            <Photo slug={photos[i]} variant={i + 2} />
            <span className="tile__icon tile__icon--accent"><Icon name={icons[i]} /></span>
          </div>
          <Heading className="tile__title">{s.title}</Heading>
          <p className="muted">{s.body}</p>
          <ul className="ticks">
            {s.points.map((p) => (
              <li key={p}><Icon name="check" size={16} />{p}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
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
