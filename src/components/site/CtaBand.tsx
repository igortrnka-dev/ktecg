import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { href } from "@/content/site";
import { firstPhoto } from "@/lib/photo";
import Icon from "./Icon";
import Photo from "./Photo";

export type CtaText = { title: string; body: string };

/**
 * Inquiry band, the last section of every page but the contact page. A division or project page passes its own,
 * more specific question; the button is always the same. Background: public/img/cta.jpg, until it is there the
 * energy sector photo (warm-lit pipes).
 */
export default function CtaBand({ t, locale, text }: { t: Dictionary; locale: Locale; text?: CtaText }) {
  const { title, body } = text ?? t.cta;
  const photo = firstPhoto("cta", "sector-energy");
  return (
    <section className="ctaband" aria-labelledby="ctaband-title" data-reveal>
      {photo && (
        <div className="ctaband__bg" aria-hidden>
          <Photo slug={photo} />
        </div>
      )}
      <div className="ctaband__copy">
        <h2 className="ctaband__title" id="ctaband-title">{title}</h2>
        <p className="ctaband__text">{body}</p>
      </div>
      <a href={href(locale, "contact")} className="btn btn--accent btn--lg ctaband__btn">
        {t.cta.button}
        <Icon name="arrow" size={16} />
      </a>
    </section>
  );
}
