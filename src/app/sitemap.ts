import type { MetadataRoute } from "next";
import { defaultLocale, locales } from "@/i18n/config";
import { href, sitePaths } from "@/content/site";
import { siteUrl } from "@/lib/site/metadata";
import { allProjects, publicProject } from "@/lib/projects";

export const revalidate = 3600;

/**
 * Every page in every locale, each with the same hreflang alternates as its <head>. A project page is listed in the
 * languages it is published in.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!siteUrl) return [];
  const url = (path: string) => new URL(path, siteUrl).href;
  const projectEntries = (await allProjects()).flatMap((p) => {
    const path = `projects/${p.slug}`;
    const langs = locales.filter((l) => publicProject(p, l, 0));
    if (!langs.length) return [];
    const x = langs.includes(defaultLocale) ? defaultLocale : langs[0];
    const languages = {
      ...Object.fromEntries(langs.map((l) => [l, url(href(l, path))])),
      "x-default": url(href(x, path)),
    };
    return langs.map((l) => ({ url: url(href(l, path)), alternates: { languages } }));
  });
  const pageEntries = sitePaths.flatMap((path) => {
    const languages = {
      ...Object.fromEntries(locales.map((l) => [l, url(href(l, path))])),
      "x-default": url(href(defaultLocale, path)),
    };
    return locales.map((l) => ({ url: url(href(l, path)), alternates: { languages } }));
  });
  return [...pageEntries, ...projectEntries];
}
