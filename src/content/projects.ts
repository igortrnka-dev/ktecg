import type { Locale } from "@/i18n/config";
import type { SectorSlug, TradeSlug } from "./site";

/** The text of a project in one language. */
export type ProjectText = {
  title: string;
  /** One or two sentences, shown on the card and as the lead of the detail page. */
  summary: string;
  /** What our people did, one item per line. */
  scope: string[];
  /** Free text such as "6 weeks" or "2024–2025"; left out when unknown. */
  duration?: string;
};

export type Project = {
  /** URL slug: /<locale>/projects/<slug>. Lowercase letters, digits and dashes. */
  slug: string;
  /** ISO 3166-1 alpha-2 code; the name is shown in the visitor's language. */
  country: string;
  year: number;
  sector: SectorSlug;
  /** Trades on the project; the project is listed on these trade pages. */
  trades: TradeSlug[];
  /** Number of our workers on the project. */
  team?: number;
  /** Photo slug in public/img, e.g. "project-<slug>" for public/img/project-<slug>.jpg. */
  photo?: string;
  text: Record<Locale, ProjectText>;
};

/**
 * Projects and references, newest first. Only real projects confirmed by the owner go here, with what the client
 * allows to be published; nothing is made up. Until the first one is added the projects page shows a short note
 * instead of the list, and the trade pages leave out their project row.
 */
export const projects: Project[] = [];
