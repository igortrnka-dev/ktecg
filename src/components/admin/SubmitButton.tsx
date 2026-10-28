"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({
  children,
  pending,
  className = "abtn",
}: {
  children: React.ReactNode;
  pending?: string;
  className?: string;
}) {
  const status = useFormStatus();
  return (
    <button className={className} disabled={status.pending}>
      {status.pending ? pending ?? "…" : children}
    </button>
  );
}
