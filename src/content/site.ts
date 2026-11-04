/**
 * Page structure of the public site, shared by the pages, the middleware (which 404s every other path), the
 * sitemap and the navigation. Plain data only: the middleware runs on the edge runtime.
 */
import { projects } from "./projects";

/** The pages behind the main menu, in menu order. "" is the locale homepage. */
export const pages = [
  { key: "home", path: "" },
  { key: "services", path: "services" },
  { key: "sectors", path: "sectors" },
  { key: "projects", path: "projects" },
  { key: "about", path: "about" },
  { key: "contact", path: "contact" },
] as const;
export type PageKey = (typeof pages)[number]["key"];

/** URL slugs of the trade detail pages, in the order of `trades.items` in every dictionary. */
export const tradeSlugs = [
  "welders",
  "pipe-fitters",
  "steel-fitters",
  "industrial-electricians",
  "automation-technicians",
  "mechanical-fitters",
  "cnc-operators",
  "assembly-operators",
  "instrumentation-technicians",
] as const;
export type TradeSlug = (typeof tradeSlugs)[number];

/** Sector keys, in the order of `sectors.items` in every dictionary; also the sector-<key>.jpg photo slugs. */
export const sectorSlugs = [
  "automotive",
  "metalworking",
  "energy",
  "shipbuilding",
  "electrical",
  "logistics",
  "buildings",
] as const;
export type SectorSlug = (typeof sectorSlugs)[number];

/**
 * Figures in the stats passage at the bottom of the projects page, as agreed with the owner. A null figure is left
 * out until it is known; never put in a number the owner has not confirmed.
 */
export const stats: { projects: number | null; countries: number; workers: string } = {
  projects: null,
  countries: 8,
  workers: "200+",
};

/** Every page path under /<locale>, without the locale ("" is the homepage). */
export const sitePaths: readonly string[] = [
  ...pages.map((p) => p.path),
  ...tradeSlugs.map((s) => `services/${s}`),
  ...projects.map((p) => `projects/${p.slug}`),
];

const known = new Set(sitePaths);
export function isSitePath(path: string): boolean {
  return known.has(path);
}

/** Link to a page path in a locale: href("sk", "services") is "/sk/services", href("sk", "") is "/sk". */
export function href(locale: string, path: string): string {
  return path ? `/${locale}/${path}` : `/${locale}`;
}
