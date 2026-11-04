import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DM_Mono, Inter, Inter_Tight } from "next/font/google";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { pageMetadata, siteUrl } from "@/lib/site/metadata";
import "../site.css";

const display = Inter_Tight({ subsets: ["latin", "latin-ext"], weight: ["500"], variable: "--font-display", display: "swap" });
const sans = Inter({ subsets: ["latin", "latin-ext"], axes: ["opsz"], variable: "--font-sans", display: "swap" });
const mono = DM_Mono({ subsets: ["latin", "latin-ext"], weight: ["400"], variable: "--font-mono", display: "swap" });

if (!siteUrl && process.env.RENDER) throw new Error("NEXT_PUBLIC_SITE_URL must be set for the Render build");

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return pageMetadata(locale, "", t.meta.title, t.meta.description);
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
