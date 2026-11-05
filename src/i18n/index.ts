import type { Locale } from "./config";
import en from "./dictionaries/en";
import de from "./dictionaries/de";
import fr from "./dictionaries/fr";
import sv from "./dictionaries/sv";
import sk from "./dictionaries/sk";
import pl from "./dictionaries/pl";

/** The Slovak dictionary is the source: every other language has exactly its keys. */
export type Dictionary = typeof sk;

const NBSP = "\u00a0";

/** One-letter prepositions and conjunctions stay with the next word, and a dash never starts a line. */
function bindShortWords(letters: string) {
  const word = new RegExp(`(?<=^|[\\s(„"])([${letters}])\\s+`, "giu");
  return (s: string) => s.replace(word, `$1${NBSP}`).replace(/\s+–\s/g, `${NBSP}– `);
}

/**
 * Applies `fix` to every string the page lays out. `meta` (head tags) is skipped, and so are e-mail
 * addresses, URLs, paths and single tokens.
 */
function typeset<T>(value: T, fix: (s: string) => string): T {
  if (typeof value === "string") {
    return (/\s/.test(value) && !/@|:\/\/|^[/#]/.test(value) ? fix(value) : value) as T;
  }
  if (Array.isArray(value)) return value.map((v) => typeset(v, fix)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, k === "meta" ? v : typeset(v, fix)]),
    ) as T;
  }
  return value;
}

// Typeset once at module load, not per request.
const dictionaries: Record<Locale, Dictionary> = {
  en,
  de,
  fr,
  sv,
  sk: typeset(sk, bindShortWords("aiouvskz")),
  pl: typeset(pl, bindShortWords("aiouwz")),
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
