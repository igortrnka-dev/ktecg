import type { Dictionary } from "@/i18n";
import SectionHead from "./SectionHead";

export default function Process({ t }: { t: Dictionary }) {
  return (
    <section className="block" id="process">
      <SectionHead label={t.process.label} title={t.process.title} />
      <ol className="steps">
        {t.process.steps.map((s, i) => (
          <li key={s.title} className="step" data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
            <div className="step__top">
              <span className="step__num">{String(i + 1).padStart(2, "0")}</span>
              <span className="mono faint">{s.period}</span>
            </div>
            <h3 className="tile__title">{s.title}</h3>
            <p className="muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
