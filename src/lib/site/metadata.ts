import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "@/i18n/config";
import { href } from "@/content/site";

// Pages are prerendered, so this is fixed at build time. Without it, canonical and hreflang links are left out
// rather than pointing at localhost.
export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

/**
 * Title, description, canonical link and hreflang alternates of the page at `path` ("" is the homepage). A page
 * that exists only in some languages (a project) passes them as `langs`; `image` is its share picture.
 */
export function pageMetadata(
  locale: Locale,
  path: string,
  title: string,
  description: string,
  { langs = locales, image }: { langs?: readonly Locale[]; image?: string } = {},
): Metadata {
  const fallback = langs.includes(defaultLocale) ? defaultLocale : (langs[0] ?? defaultLocale);
  return {
    title,
    description,
    openGraph: { title, description, type: "website", locale, ...(image && { images: [image] }) },
    ...(siteUrl && {
      metadataBase: new URL(siteUrl),
      alternates: {
        canonical: href(locale, path),
        languages: {
          ...Object.fromEntries(langs.map((l) => [l, href(l, path)])),
          "x-default": href(fallback, path),
        },
      },
    }),
  };
}

/** Head tags of a localized 404: its own title, no canonical or hreflang links (Next adds the noindex tag). */
export function notFoundMetadata(title: string, description: string): Metadata {
  return { title: `${title} – KTechnology`, description, alternates: null, openGraph: null };
}
