"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { EMAIL } from "./email";

type FormText = Dictionary["contact"]["form"];
type Span = "third" | "two-thirds" | "wide";

/** The empty choice carries the "not sure yet" label and is saved as no answer. */
const shifts = ["single", "double", "triple", "rotation"] as const;

export default function InquiryForm({ t, locale }: { t: FormText; locale: Locale }) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const sending = useRef(false);
  const statusRef = useRef<HTMLDivElement>(null);

  // The form is replaced by the confirmation, so move focus there instead of losing it.
  useEffect(() => {
    if (state === "ok") statusRef.current?.focus();
  }, [state]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending.current) return;
    sending.current = true;
    // React clears e.currentTarget once the handler awaits.
    const form = e.currentTarget;
    setState("sending");
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      if (res.ok) {
        form.reset();
        setState("ok");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
    sending.current = false;
  }

  return (
    <>
      {state !== "ok" && (
        <form className="form" onSubmit={onSubmit}>
          <p className="form__req mono" aria-hidden>{t.required}</p>
          {/* The request comes first, then who is asking. maxLength values match the API's limits. */}
          <div className="form__grid">
            <Field name="positions" label={t.positions} maxLength={500} span="two-thirds" />
            <Field name="country" label={t.country} maxLength={100} span="third" />
            <Field name="duration" label={t.duration} maxLength={100} span="third" />
            <label className="field field--third">
              <span>{t.shift}</span>
              <select name="shift_pattern" defaultValue="">
                <option value="">{t.shifts.unsure}</option>
                {shifts.map((s) => (
                  <option key={s} value={s}>{t.shifts[s]}</option>
                ))}
              </select>
            </label>
            <Field name="start_date" label={t.start} type="date" span="third" />
            <Field name="company" label={t.company} autoComplete="organization" maxLength={200} required />
            <Field name="name" label={t.name} autoComplete="name" maxLength={200} required />
            <Field name="email" label={t.email} type="email" autoComplete="email" maxLength={200} required />
            <Field name="phone" label={t.phone} type="tel" autoComplete="tel" maxLength={60} />
            <label className="field field--wide">
              <span>{t.message}</span>
              <textarea name="message" rows={4} maxLength={5000} />
            </label>
            {/* Honeypot: real visitors never see or fill this. */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />
          </div>
          <p className="form__consent">{t.consent}</p>
          <button className="glow-btn" aria-disabled={state === "sending"}>
            <span className="glow-btn__glow" aria-hidden />
            <span className="glow-btn__fill">{state === "sending" ? t.sending : t.submit}</span>
          </button>
        </form>
      )}
      <div
        ref={statusRef}
        className={`form__status${state === "ok" ? " form__done" : state === "error" ? " form__error" : ""}`}
        role="status"
        aria-live="polite"
        tabIndex={-1}
      >
        {state === "ok" && t.success}
        {/* Any failure (invalid, rate limited, server or network error) keeps the entries and offers the address. */}
        {state === "error" && (
          <>
            {t.error} <a href={`mailto:${EMAIL}`} className="tlink">{EMAIL}</a>
          </>
        )}
      </div>
    </>
  );
}

function Field({
  label,
  span,
  ...props
}: { label: string; span?: Span } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`field${span ? ` field--${span}` : ""}`}>
      <span>
        {label}
        {props.required && <span className="field__req" aria-hidden> *</span>}
      </span>
      <input {...props} />
    </label>
  );
}
