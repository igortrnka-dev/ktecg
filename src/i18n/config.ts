export const locales = ["en", "de", "fr", "sv", "sk", "pl"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  de: "Deutsch",
  fr: "Français",
  sv: "Svenska",
  sk: "Slovenčina",
  pl: "Polski",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
