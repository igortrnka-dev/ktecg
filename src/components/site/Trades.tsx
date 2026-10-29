import type { Dictionary } from "@/i18n";
import Icon, { type IconName } from "./Icon";
import Photo from "./Photo";
import SectionHead from "./SectionHead";

const icons: IconName[] = ["weld", "pipe", "beam", "bolt", "chip", "gear", "cnc", "assembly", "forklift"];
/** Photo strip above the grid: slug and the trade (index into items) it illustrates. */
const gallery = [
  { slug: "trade-welding", item: 0 },
  { slug: "trade-machining", item: 6 },
  { slug: "trade-electrical", item: 3 },
];

export default function Trades({ t }: { t: Dictionary }) {
  return (
    <section className="block" id="trades">
      <SectionHead label={t.trades.label} title={t.trades.title} lead={t.trades.lead} />
      <div className="gallery">
        {gallery.map((g, i) => (
          <figure key={g.slug} className="gallery__item" data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
            <Photo slug={g.slug} variant={i} alt={t.trades.items[g.item].name} />
            <figcaption className="mono">{t.trades.items[g.item].name}</figcaption>
          </figure>
        ))}
      </div>
      <div className="grid grid--3">
        {t.trades.items.map((trade, i) => (
          <article key={trade.name} className="tile tile--trade" data-reveal style={{ transitionDelay: `${(i % 3) * 70}ms` }}>
            <div className="tile__row">
              <span className="tile__icon"><Icon name={icons[i]} /></span>
              <span className="mono faint">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="tile__title">{trade.name}</h3>
            <ul className="tags">
              {trade.skills.map((s) => <li key={s} className="mono">{s}</li>)}
            </ul>
          </article>
        ))}
      </div>
      <p className="note" data-reveal>
        {t.trades.note} <a href="#contact" className="tlink">{t.nav.cta}<Icon name="arrow" size={16} /></a>
      </p>
    </section>
  );
}
