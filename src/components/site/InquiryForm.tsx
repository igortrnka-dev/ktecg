"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";

type FormText = Dictionary["contact"]["form"];
type Span = "third" | "two-thirds" | "wide";

const shifts = ["unsure", "single", "double", "triple", "rotation"] as const;

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
          <div className="form__grid">
            <Field name="company" label={t.company} autoComplete="organization" required />
            <Field name="name" label={t.name} autoComplete="name" required />
            <Field name="email" label={t.email} type="email" autoComplete="email" required />
            <Field name="phone" label={t.phone} type="tel" autoComplete="tel" />
            <Field name="country" label={t.country} span="third" />
            <Field name="positions" label={t.positions} span="two-thirds" />
            <Field name="duration" label={t.duration} maxLength={100} span="third" />
            <label className="field field--third">
              <span>{t.shift}</span>
              <select name="shift_pattern" defaultValue="">
                <option value="" />
                {shifts.map((s) => (
                  <option key={s} value={s}>{t.shifts[s]}</option>
                ))}
              </select>
            </label>
            <Field name="start_date" label={t.start} type="date" span="third" />
            <label className="field field--wide">
              <span>{t.message}</span>
              <textarea name="message" rows={4} />
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
        {state === "ok" ? t.success : state === "error" ? t.error : null}
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
