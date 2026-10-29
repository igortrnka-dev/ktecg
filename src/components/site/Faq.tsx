import type { Dictionary } from "@/i18n";
import Icon from "./Icon";
import SectionHead from "./SectionHead";

export default function Faq({ t }: { t: Dictionary }) {
  return (
    <section className="block block--faq" id="faq">
      <SectionHead label={t.faq.label} title={t.faq.title} />
      <div className="faq">
        {t.faq.items.map((item, i) => (
          <details key={item.q} className="faq__item" data-reveal open={i === 0}>
            <summary>
              <span>{item.q}</span>
              <span className="faq__icon"><Icon name="chevron" size={18} /></span>
            </summary>
            <p className="muted">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
