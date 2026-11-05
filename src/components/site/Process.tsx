import type { Dictionary } from "@/i18n";
import SectionHead from "./SectionHead";

/** "Od dopytu k realizácii": the five steps of working with us, on the homepage and the about page. */
export default function Process({ t }: { t: Dictionary }) {
  return (
    <section className="block" id="process">
      <SectionHead label={t.process.label} title={t.process.title} />
      <ol className="flow">
        {t.process.steps.map((step, i) => (
          <li key={step} className="flow__step" data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
            <span className="flow__num" aria-hidden>{i + 1}</span>
            <span className="flow__name">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
