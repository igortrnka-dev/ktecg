import type { Locale } from "./config";
import en from "./dictionaries/en";
import de from "./dictionaries/de";
import fr from "./dictionaries/fr";
import sv from "./dictionaries/sv";
import sk from "./dictionaries/sk";
import pl from "./dictionaries/pl";

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, de, fr, sv, sk, pl };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
