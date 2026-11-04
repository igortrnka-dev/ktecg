import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { href } from "@/content/site";
import { EMAIL } from "./email";

const [mailbox, domain] = EMAIL.split("@");

/** Inquiry band, the last section of every page but the contact page. */
export default function CtaBand({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <section className="ctaband" aria-labelledby="ctaband-title" data-reveal>
      <div className="ctaband__copy">
        <h2 className="ctaband__title" id="ctaband-title">{t.cta.title}</h2>
        <p className="ctaband__text">{t.cta.body}</p>
      </div>
      <div className="ctaband__actions">
        <a href={href(locale, "contact")} className="glow-btn">
          <span className="glow-btn__glow" aria-hidden />
          <span className="glow-btn__fill">{t.nav.cta}</span>
        </a>
        <a href={`mailto:${EMAIL}`} className="ctaband__mail">
          <span className="mono faint">{t.cta.email}</span>
          <span>{mailbox}@<wbr />{domain}</span>
        </a>
      </div>
    </section>
  );
}
