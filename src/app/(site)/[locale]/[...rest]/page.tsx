import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import NotFoundView from "@/components/site/NotFoundView";
import SiteShell from "@/components/site/SiteShell";

/**
 * Localized 404 for every path under a locale that is not a page; the middleware rewrites them all to /<locale>/404.
 * It renders as a normal page because notFound() from a page only reaches the browser as Next's empty error shell
 * (the not-found boundary renders on the client). The 404 status comes from the middleware.
 */
export default async function NotFoundPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <SiteShell t={t} locale={locale} path="" current={null} cta={false}>
      <NotFoundView t={t} locale={locale} />
    </SiteShell>
  );
}
