import type { Metadata } from "next";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";

/**
 * Title of the localized 404, without the homepage canonical and hreflang links inherited from [locale]. It lives in
 * a layout because Next resolves only layout metadata for a 404 response; Next adds the noindex tag itself.
 */
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    title: `${t.notFound.title} – KTechnology`,
    description: t.notFound.body,
    alternates: null,
    openGraph: null,
  };
}

export default function NotFoundLayout({ children }: { children: React.ReactNode }) {
  return children;
}
