import type { MetadataRoute } from "next";
import { defaultLocale, locales } from "@/i18n/config";

// Fixed at build time, like the canonical links in the site layout. Without it there are no absolute URLs to list.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

/** The six locale homepages, each with the same hreflang alternates as its <head>. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];
  const url = (path: string) => new URL(path, siteUrl).href;
  const languages = {
    ...Object.fromEntries(locales.map((l) => [l, url(`/${l}`)])),
    "x-default": url(`/${defaultLocale}`),
  };
  return locales.map((l) => ({ url: url(`/${l}`), alternates: { languages } }));
}
