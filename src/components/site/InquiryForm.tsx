"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { EMAIL } from "./email";

type FormText = Dictionary["contact"]["form"];
type Span = "third" | "two-thirds" | "wide";

/** The empty choice carries the "not sure yet" label and is saved as no answer. */
const shifts = ["single", "double", "triple", "rotation"] as const;

/**
 * zod's z.email() regex (the API's check), so the browser names a typo before sending. Every "-" in a class is
 * escaped because browsers compile `pattern` with the v flag, which rejects the unescaped form and drops the pattern.
 */
const EMAIL_PATTERN =
  "(?:[A-Za-z0-9_'+\\-]+\\.)*[A-Za-z0-9_'+\\-]*[A-Za-z0-9_+\\-]@(?:[A-Za-z0-9][A-Za-z0-9\\-]*\\.)+[A-Za-z]{2,}";
/** Rejects text fields filled only with spaces, which the API trims to empty. */
const NOT_BLANK = ".*\\S.*";
const MESSAGE_MAX = 5000;
const STATUS_ID = "inquiry-status";
const MESSAGE_ID = "inquiry-message";
const COUNT_ID = "message-count";

export default function InquiryForm({ t, locale }: { t: FormText; locale: Locale }) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error" | "invalid">("idle");
  // Fields the API rejected; each is marked until the visitor edits it.
  const [invalid, setInvalid] = useState<string[]>([]);
  const [msgLen, setMsgLen] = useState(0);
  const sending = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // The form is replaced by the confirmation, so move focus there instead of losing it. On rejected fields,
  // focus the first one in form order.
  useEffect(() => {
    if (state === "ok") statusRef.current?.focus();
    if (state === "invalid") formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [state]);

  // A message the browser restored (back navigation) is counted too.
  useEffect(() => setMsgLen(messageRef.current?.value.length ?? 0), []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending.current) return;
    sending.current = true;
    // React clears e.currentTarget once the handler awaits.
    const form = e.currentTarget;
    setState("sending");
    setInvalid([]);
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      const fields = res.status === 400 ? rejectedFields(form, await res.json().catch(() => null)) : [];
      if (res.ok) {
        form.reset();
        setMsgLen(0);
        setState("ok");
      } else if (fields.length) {
        setInvalid(fields);
        setState("invalid");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
    sending.current = false;
  }

  /** aria props for a field: marked and pointed at the status line while the API's rejection stands. */
  function fieldProps(name: string, describedBy?: string) {
    const bad = invalid.includes(name);
    const ids = [bad && STATUS_ID, describedBy].filter(Boolean).join(" ");
    return { name, "aria-invalid": bad || undefined, "aria-describedby": ids || undefined };
  }

  return (
    <>
      {state !== "ok" && (
        <form
          ref={formRef}
          className="form"
          onSubmit={onSubmit}
          onInput={(e) => {
            const name = (e.target as HTMLInputElement).name;
            if (invalid.includes(name)) setInvalid(invalid.filter((n) => n !== name));
          }}
        >
          <p className="form__req mono" aria-hidden>{t.required}</p>
          {/* The request comes first, then who is asking. maxLength values match the API's limits. */}
          <div className="form__grid">
            <Field {...fieldProps("positions")} label={t.positions} maxLength={500} span="wide" />
            <Field {...fieldProps("country")} label={t.country} maxLength={100} />
            <Field {...fieldProps("duration")} label={t.duration} maxLength={100} />
            <label className="field">
              <span>{t.shift}</span>
              <select {...fieldProps("shift_pattern")} defaultValue="">
                <option value="">{t.shifts.unsure}</option>
                {shifts.map((s) => (
                  <option key={s} value={s}>{t.shifts[s]}</option>
                ))}
              </select>
            </label>
            <Field {...fieldProps("start_date")} label={t.start} type="date" />
            <Field {...fieldProps("company")} label={t.company} autoComplete="organization" maxLength={200} required pattern={NOT_BLANK} />
            <Field {...fieldProps("name")} label={t.name} autoComplete="name" maxLength={200} required pattern={NOT_BLANK} />
            <Field
              {...fieldProps("email")}
              label={t.email}
              type="email"
              autoComplete="email"
              maxLength={200}
              required
              pattern={EMAIL_PATTERN}
              title={t.emailHint}
            />
            <Field {...fieldProps("phone")} label={t.phone} type="tel" autoComplete="tel" maxLength={60} />
            {/* The counter sits outside the label so it stays out of the field's name. It shows the limit before a
                long paste is cut and is read as the description, not announced per keystroke. */}
            <div className="field field--wide">
              <label htmlFor={MESSAGE_ID}>{t.message}</label>
              <textarea
                {...fieldProps("message", COUNT_ID)}
                ref={messageRef}
                id={MESSAGE_ID}
                rows={4}
                maxLength={MESSAGE_MAX}
                onInput={(e) => setMsgLen(e.currentTarget.value.length)}
              />
              <span id={COUNT_ID} className="field__hint">{msgLen} / {MESSAGE_MAX}</span>
            </div>
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
        id={STATUS_ID}
        className={`form__status${state === "ok" ? " form__done" : state === "error" || state === "invalid" ? " form__error" : ""}`}
        role="status"
        aria-live="polite"
        tabIndex={-1}
      >
        {state === "ok" && t.success}
        {state === "invalid" && t.invalid}
        {/* Any other failure (rate limited, server or network error) keeps the entries and offers the address. */}
        {state === "error" && (
          <>
            {t.error} <a href={`mailto:${EMAIL}`} className="tlink">{EMAIL}</a>
          </>
        )}
      </div>
    </>
  );
}

/** Field names from a 400 `{ error: "invalid", fields }` that exist on this form; the honeypot never counts. */
function rejectedFields(form: HTMLFormElement, body: unknown): string[] {
  const fields = (body as { fields?: unknown } | null)?.fields;
  if (!Array.isArray(fields)) return [];
  return fields.filter(
    (f, i): f is string =>
      typeof f === "string" && f !== "website" && fields.indexOf(f) === i && form.elements.namedItem(f) !== null,
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
