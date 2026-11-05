import { existsSync } from "node:fs";
import path from "node:path";

/** True when a photo has been dropped into public/img/<slug>.jpg. */
export function hasPhoto(slug: string): boolean {
  return existsSync(path.join(process.cwd(), "public", "img", `${slug}.jpg`));
}

/** The first of the slugs whose photo exists, for a slot with a dedicated photo still to come and a stand-in. */
export function firstPhoto(...slugs: string[]): string | undefined {
  return slugs.find(hasPhoto);
}
