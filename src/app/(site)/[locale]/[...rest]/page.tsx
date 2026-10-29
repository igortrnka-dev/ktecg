import { notFound } from "next/navigation";

/** Unmatched paths under a locale render that locale's not-found page instead of the root 404. */
export default function CatchAll() {
  notFound();
}
