import type { Dictionary } from "@/i18n";
import Icon, { type IconName } from "./Icon";
import Photo from "./Photo";
import SectionHead from "./SectionHead";

const icons: IconName[] = ["people", "chart", "route"];
const photos = ["service-leasing", "service-outages", "service-mobilisation"];

export default function Services({ t }: { t: Dictionary }) {
  return (
    <section className="block" id="services">
      <SectionHead label={t.services.label} title={t.services.title} lead={t.services.lead} />
      <div className="grid grid--3">
        {t.services.items.map((s, i) => (
          <article key={s.title} className="tile tile--service" data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
            <div className="tile__media">
              <Photo slug={photos[i]} variant={i + 2} />
              <span className="tile__icon tile__icon--accent"><Icon name={icons[i]} /></span>
            </div>
            <h3 className="tile__title">{s.title}</h3>
            <p className="muted">{s.body}</p>
            <ul className="ticks">
              {s.points.map((p) => (
                <li key={p}><Icon name="check" size={16} />{p}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div className="included" data-reveal>
        <div className="included__head">
          <span className="pill mono">{t.included.label}</span>
          <h3 className="included__title">{t.included.title}</h3>
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
      </div>
    </section>
  );
}
