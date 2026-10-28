"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import InquiryForm from "./InquiryForm";

export default function ContactPanel({ t, locale }: { t: Dictionary; locale: Locale }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="contact" id="contact" data-reveal>
      <span className="pill mono">{t.contact.label}</span>
      <h2 className="contact__title">{t.contact.title}</h2>
      <p className="contact__text">{t.contact.body}</p>
      {!open && (
        <button className="glow-btn" onClick={() => setOpen(true)}>
          <span className="glow-btn__glow" aria-hidden />
          <span className="glow-btn__fill">{t.contact.button}</span>
        </button>
      )}
      <div className={`contact__form ${open ? "is-open" : ""}`}>
        {open && <InquiryForm t={t.contact.form} locale={locale} />}
      </div>
    </section>
  );
}
