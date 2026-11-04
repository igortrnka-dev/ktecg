import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { EMAIL } from "./email";
import Icon from "./Icon";
import InquiryForm from "./InquiryForm";
import Photo from "./Photo";

const [mailbox, domain] = EMAIL.split("@");

/** Inquiry form with the e-mail address and tips: the contact page, whose h1 is its title. */
export default function Contact({ t, locale }: { t: Dictionary; locale: Locale }) {
  return (
    <section className="contact enter enter--rise" id="contact">
      <div className="contact__bg" aria-hidden>
        <Photo slug="contact" fallback={null} />
      </div>
      <div className="contact__info">
        <span className="pill mono">{t.contact.label}</span>
        <h1 className="contact__title">{t.contact.title}</h1>
        <p className="contact__text">{t.contact.body}</p>

        <a href={`mailto:${EMAIL}`} className="contact__mail">
          <span className="tile__icon tile__icon--accent"><Icon name="mail" /></span>
          <span>
            <span className="mono faint">{t.contact.emailLabel}</span>
            {/* On narrow screens the address may wrap after the @, never inside the domain. */}
            <span className="contact__addr">{mailbox}@<wbr />{domain}</span>
          </span>
        </a>

        <div className="contact__tips">
          <span className="mono faint">{t.contact.tipsTitle}</span>
          <ul className="ticks">
            {t.contact.tips.map((tip) => (
              <li key={tip}><Icon name="check" size={16} />{tip}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="contact__form">
        <InquiryForm t={t.contact.form} locale={locale} />
      </div>
    </section>
  );
}
