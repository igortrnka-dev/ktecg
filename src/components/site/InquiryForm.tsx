"use client";

import { useState } from "react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";

type FormText = Dictionary["contact"]["form"];

export default function InquiryForm({ t, locale }: { t: FormText; locale: Locale }) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      setState(res.ok ? "ok" : "error");
      if (res.ok) e.currentTarget.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "ok") {
    return <p className="form__done" role="status">{t.success}</p>;
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="form__grid">
        <Field name="company" label={t.company} required />
        <Field name="name" label={t.name} required />
        <Field name="email" label={t.email} type="email" required />
        <Field name="phone" label={t.phone} type="tel" />
        <Field name="country" label={t.country} />
        <Field name="headcount" label={t.headcount} type="number" min={1} />
        <Field name="positions" label={t.positions} wide />
        <Field name="start_date" label={t.start} type="date" />
        <label className="field field--wide">
          <span>{t.message}</span>
          <textarea name="message" rows={4} />
        </label>
        {/* Honeypot: real visitors never see or fill this. */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />
      </div>
      <p className="form__consent">{t.consent}</p>
      <button className="glow-btn" disabled={state === "sending"}>
        <span className="glow-btn__glow" aria-hidden />
        <span className="glow-btn__fill">{state === "sending" ? t.sending : t.submit}</span>
      </button>
      {state === "error" && <p className="form__error" role="alert">{t.error}</p>}
    </form>
  );
}

function Field({ label, wide, ...props }: { label: string; wide?: boolean } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={`field ${wide ? "field--wide" : ""}`}>
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}
