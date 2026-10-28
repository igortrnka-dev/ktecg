import type { Dictionary } from "@/i18n";
import Art from "./Art";

export default function WorkGrid({ t }: { t: Dictionary }) {
  return (
    <section className="works enter enter--rise" id="sectors" aria-label={t.sectors.title}>
      {t.sectors.items.map((item, i) => (
        <a key={item.name} href="#contact" className="card" data-reveal>
          <div className="card__media">
            <Art variant={i} />
          </div>
          <div className="card__tab mono" aria-hidden>
            <div className="card__ticker">
              {[0, 1].map((k) => (
                <span key={k}>
                  {String(i + 1).padStart(2, "0")} · {item.category} ·{" "}
                </span>
              ))}
            </div>
          </div>
          <h2 className="card__title">{item.name}</h2>
        </a>
      ))}
    </section>
  );
}
