import type { MetadataRoute } from "next";

// Fixed at build time, like the canonical links in the site layout.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    ...(siteUrl && { sitemap: new URL("/sitemap.xml", siteUrl).href }),
  };
}
