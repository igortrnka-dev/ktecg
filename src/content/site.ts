/**
 * Page structure of the public site, shared by the pages, the middleware (which 404s every other path), the
 * sitemap and the navigation. Plain data only: the middleware runs on the edge runtime.
 */
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

/** URL slugs of the service divisions (/services/<slug>), in the order of `services.divisions` in every dictionary. */
export const divisionSlugs = [
  "electrical-automation",
  "welding-piping",
  "mechanical-maintenance",
  "supervision-qa",
] as const;
export type DivisionSlug = (typeof divisionSlugs)[number];

/**
 * Trade pages of the earlier site version, each sent on to the division that took it over (permanent redirect in the
 * middleware), so links already shared keep working.
 */
export const legacyTradeRedirects: Record<string, DivisionSlug> = {
  welders: "welding-piping",
  "pipe-fitters": "welding-piping",
  "steel-fitters": "mechanical-maintenance",
  "industrial-electricians": "electrical-automation",
  "automation-technicians": "electrical-automation",
  "mechanical-fitters": "mechanical-maintenance",
  "cnc-operators": "mechanical-maintenance",
  "assembly-operators": "mechanical-maintenance",
  "instrumentation-technicians": "electrical-automation",
};

/** Sector keys, in the order of `sectors.items` in every dictionary; also the sector-<key>.jpg photo slugs. */
export const sectorSlugs = [
  "energy",
  "chemical",
  "pharma",
  "food",
  "automotive",
  "shipbuilding",
  "datacenter",
  "manufacturing",
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

/**
 * Every fixed page path under /<locale>, without the locale ("" is the homepage). Project pages come from the
 * database (edited in the admin), so the middleware lets through any well-formed projects/<slug> and the project
 * page itself answers for a slug it does not know.
 */
export const sitePaths: readonly string[] = [
  ...pages.map((p) => p.path),
  ...divisionSlugs.map((s) => `services/${s}`),
];

const known = new Set(sitePaths);
export function isSitePath(path: string): boolean {
  return known.has(path) || /^projects\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path);
}

/** Link to a page path in a locale: href("sk", "services") is "/sk/services", href("sk", "") is "/sk". */
export function href(locale: string, path: string): string {
  return path ? `/${locale}/${path}` : `/${locale}`;
}
