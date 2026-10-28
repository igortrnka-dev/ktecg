import type { Dictionary } from "@/i18n";

const countries = [
  "Germany", "Austria", "Switzerland", "Sweden", "Norway", "Finland", "Denmark",
  "Netherlands", "Belgium", "France", "Poland", "Czechia", "Slovakia", "UAE",
];

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="pill mono">{children}</span>;
}

function ArrowLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="tlink">
      {children}
      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden>
        <rect x="2.5" y="2.5" width="11" height="11" rx="2" stroke="currentColor" fill="none" />
        <path d="M6 10l4-4M7 6h3v3" stroke="currentColor" fill="none" />
      </svg>
    </a>
  );
}

export default function Panels({ t }: { t: Dictionary }) {
  return (
    <section className="split" id="about">
      <div className="split__left">
        <div className="portrait" data-reveal>
          <div className="portrait__light" />
          <div className="portrait__helmet">
            <span className="portrait__visor" />
          </div>
          <span className="portrait__mono">KT</span>
          <div className="grain" />
        </div>
        <div className="strip" data-reveal>
          <div className="strip__track">
            {[...countries, ...countries].map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="split__right">
        <article className="panel" data-reveal>
          <Pill>{t.about.label}</Pill>
          <div className="panel__body">
            <h3 className="h4">{t.about.hi}<br />{t.about.sub}</h3>
            <p className="muted">{t.about.body}</p>
          </div>
          <span className="vline" />
          <ul className="facts mono">
            {t.about.facts.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </article>

        <article className="panel" id="process" data-reveal>
          <Pill>{t.process.label}</Pill>
          <ol className="steps">
            {t.process.steps.map((s, i) => (
              <li key={s.title}>
                {i > 0 && <span className="vline vline--short" />}
                <span className="mono faint">{String(i + 1).padStart(2, "0")} · {s.period}</span>
                <span className="h4">{s.title}</span>
                <span className="muted">{s.body}</span>
              </li>
            ))}
          </ol>
          <ArrowLink href="#contact">{t.about.cta}</ArrowLink>
        </article>

        <article className="panel" id="why" data-reveal>
          <Pill>{t.statements.label}</Pill>
          <ul className="quotes">
            {t.statements.items.map((s, i) => (
              <li key={s.who}>
                <q className="h4">{s.quote}</q>
                <span className="muted">{s.who}</span>
                <span className="mono faint">KTechnology</span>
                <span className="quotes__badge mono">{String(i + 1).padStart(2, "0")}</span>
              </li>
            ))}
          </ul>
          <ArrowLink href="#contact">{t.contact.button}</ArrowLink>
        </article>
      </div>
    </section>
  );
}
