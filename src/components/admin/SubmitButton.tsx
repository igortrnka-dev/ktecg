"use client";

import { useFormStatus } from "react-dom";

/** Submit button that shows `pending` while the action runs; with `confirm`, it asks first and sends nothing on Cancel. */
export default function SubmitButton({
  children,
  pending,
  className = "abtn",
  confirm,
  title,
  disabled,
}: {
  children: React.ReactNode;
  pending?: string;
  className?: string;
  confirm?: string;
  title?: string;
  disabled?: boolean;
}) {
  const status = useFormStatus();
  return (
    <button
      className={className}
      title={title}
      disabled={disabled || status.pending}
      onClick={confirm ? (e) => !window.confirm(confirm) && e.preventDefault() : undefined}
    >
      {status.pending ? pending ?? "…" : children}
    </button>
  );
}
