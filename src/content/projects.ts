import type { Locale } from "@/i18n/config";
import type { DivisionSlug, SectorSlug } from "./site";

/** The text of a project in one language. */
export type ProjectText = {
  title: string;
  /** One or two sentences: the card text and the lead of the project page. */
  summary: string;
  /** "Rozsah projektu": a short paragraph on the job. */
  scope: string;
  /** "Hlavné činnosti": what our people did, one item per line. */
  activities: string[];
  /** "Výsledok a prínos pre zákazníka": short outcomes, up to four; left out when the owner gives none. */
  results?: string[];
  /** One sentence closing the results, e.g. delivered in the agreed scope, quality and time. */
  outcome?: string;
};

export type Project = {
  /** URL slug: /<locale>/projects/<slug>. Lowercase letters, digits and dashes. */
  slug: string;
  /** ISO 3166-1 alpha-2 code; the name is shown in the visitor's language. */
  country: string;
  /** Period of the work as year-month: { from: "2024-03", to: "2024-07" }. */
  period: { from: string; to: string };
  sector: SectorSlug;
  /** Service divisions the project belongs to; it is listed on their pages. */
  divisions: DivisionSlug[];
  /** Number of our people on the project. */
  team?: number;
  /** Main photo slug in public/img; default "project-<slug>". */
  photo?: string;
  /** Further photo slugs in public/img for the photo documentation strip. */
  gallery?: string[];
  text: Record<Locale, ProjectText>;
};

/**
 * Projects and references, newest first. Only real projects confirmed by the owner go here, with what the client
 * allows to be published; nothing is made up (the mockups' sample projects are not real). Until the first one is
 * added, the projects page shows a short note instead of the list and the other pages leave their project rows out.
 */
export const projects: Project[] = [];
