import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { href, tradeSlugs } from "@/content/site";
import Icon, { type IconName } from "./Icon";
import Photo from "./Photo";
import SectionHead from "./SectionHead";

/** Icon of each trade, in the order of `trades.items` (and `tradeSlugs`). */
export const tradeIcons: IconName[] = ["weld", "pipe", "beam", "bolt", "chip", "gear", "cnc", "assembly", "gauge"];
/** Trade photos in public/img, by index into `trades.items`: the gallery and the trade pages use them. */
export const tradePhotos: Partial<Record<number, string>> = { 0: "trade-welding", 3: "trade-electrical", 6: "trade-machining" };
/** Photo strip above the grid: index into `trades.items` of the trade each photo illustrates. */
const gallery = [0, 6, 3];

/** The trades on the services page: a photo strip and one card per trade, each opening its trade page. */
export default function Trades({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <section className="block" id="trades">
      <SectionHead label={t.trades.label} title={t.trades.title} lead={t.trades.lead} />
      <div className="gallery">
        {gallery.map((item, i) => (
          <figure key={item} className="gallery__item" data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
            <Photo slug={tradePhotos[item]!} variant={i} />
            <figcaption className="mono">{t.trades.items[item].name}</figcaption>
          </figure>
        ))}
      </div>
      <div className="grid grid--3">
        {t.trades.items.map((trade, i) => (
          <a
            key={tradeSlugs[i]}
            href={href(locale, `services/${tradeSlugs[i]}`)}
            className="tile tile--trade tile--link"
            data-reveal
            style={{ transitionDelay: `${(i % 3) * 70}ms` }}
          >
            <div className="tile__row">
              <span className="tile__icon"><Icon name={tradeIcons[i]} /></span>
              <span className="mono faint">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="tile__title">{trade.name}</h3>
            <ul className="tags">
              {trade.skills.map((s) => <li key={s} className="mono">{s}</li>)}
            </ul>
            <span className="tile__more mono">
              {t.trades.open}
              <Icon name="arrow" size={16} />
            </span>
          </a>
        ))}
      </div>
      <p className="note" data-reveal>
        {t.trades.note} <a href={href(locale, "contact")} className="tlink">{t.nav.cta}<Icon name="arrow" size={16} /></a>
      </p>
    </section>
  );
}
