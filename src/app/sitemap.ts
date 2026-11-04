import type { MetadataRoute } from "next";
import { defaultLocale, locales } from "@/i18n/config";
import { href, sitePaths } from "@/content/site";
import { siteUrl } from "@/lib/site/metadata";

/** Every page in every locale, each with the same hreflang alternates as its <head>. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl) return [];
  const url = (path: string) => new URL(path, siteUrl).href;
  return sitePaths.flatMap((path) => {
    const languages = {
      ...Object.fromEntries(locales.map((l) => [l, url(href(l, path))])),
      "x-default": url(href(defaultLocale, path)),
    };
    return locales.map((l) => ({ url: url(href(l, path)), alternates: { languages } }));
  });
}
