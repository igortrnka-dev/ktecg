import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { pageMetadata } from "@/lib/site/metadata";
import Contact from "@/components/site/Contact";
import Faq from "@/components/site/Faq";
import SiteShell from "@/components/site/SiteShell";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return pageMetadata(locale, "contact", t.pages.contact.meta.title, t.pages.contact.meta.description);
}

/** The inquiry form, then the questions people ask before sending one. No inquiry band: the form is the page. */
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale);

  return (
    <SiteShell t={t} locale={locale} path="contact" current="contact" cta={false}>
      <Contact t={t} locale={locale} />
      <Faq t={t} />
    </SiteShell>
  );
}
