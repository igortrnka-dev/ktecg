import { existsSync } from "node:fs";
import path from "node:path";

/** True when a photo has been dropped into public/img/<slug>.jpg. */
export function hasPhoto(slug: string): boolean {
  return existsSync(path.join(process.cwd(), "public", "img", `${slug}.jpg`));
}
