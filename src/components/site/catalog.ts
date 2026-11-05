import { firstPhoto } from "@/lib/photo";
import type { DivisionSlug, SectorSlug } from "@/content/site";
import type { IconName } from "./Icon";

/** Icon of each service division. */
export const divisionIcons: Record<DivisionSlug, IconName> = {
  "electrical-automation": "bolt",
  "welding-piping": "weld",
  "mechanical-maintenance": "wrench",
  "supervision-qa": "shield",
};

/**
 * Photo of each division: public/img/division-<name>.jpg once it is there, until then the closest existing photo.
 * Every photo must show full PPE for the task and no construction site.
 */
export function divisionPhoto(slug: DivisionSlug): string | undefined {
  switch (slug) {
    case "electrical-automation":
      return firstPhoto("division-electrical", "trade-electrical");
    case "welding-piping":
      return firstPhoto("division-welding", "trade-welding");
    case "mechanical-maintenance":
      return firstPhoto("division-mechanical", "service-outages", "trade-machining");
    case "supervision-qa":
      return firstPhoto("division-supervision", "service-mobilisation");
  }
}

/** Icon of each sector. */
export const sectorIcons: Record<SectorSlug, IconName> = {
  energy: "bolt",
  chemical: "flask",
  pharma: "pill",
  food: "food",
  automotive: "car",
  shipbuilding: "ship",
  datacenter: "server",
  manufacturing: "factory",
  buildings: "building",
};

/**
 * Photo of each sector: public/img/sector-<slug>.jpg; manufacturing falls back to the earlier metalworking photo.
 * The energy photo must not show a nuclear site, and no photo may show a construction site.
 */
export function sectorPhoto(slug: SectorSlug): string | undefined {
  return slug === "manufacturing" ? firstPhoto("sector-manufacturing", "sector-metalworking") : firstPhoto(`sector-${slug}`);
}
