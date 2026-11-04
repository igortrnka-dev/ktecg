import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/config";
import { getDictionary } from "@/i18n";
import { href, tradeSlugs, type TradeSlug } from "@/content/site";
import { projects } from "@/content/projects";
import { pageMetadata } from "@/lib/site/metadata";
import Breadcrumbs from "@/components/site/Breadcrumbs";
import Icon from "@/components/site/Icon";
import PageHead from "@/components/site/PageHead";
import Photo from "@/components/site/Photo";
import { ProjectGrid } from "@/components/site/Projects";
import SectionHead from "@/components/site/SectionHead";
import SiteShell from "@/components/site/SiteShell";
import { tradeIcons, tradePhotos } from "@/components/site/Trades";

type Params = Promise<{ locale: string; trade: string }>;

// Only the trades in content/site.ts; the middleware sends any other slug to the 404 page.
export const dynamicParams = false;
export function generateStaticParams() {
  return locales.flatMap((locale) => tradeSlugs.map((trade) => ({ locale, trade })));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, trade } = await params;
  const i = tradeSlugs.indexOf(trade as TradeSlug);
  if (!isLocale(locale) || i < 0) return {};
  const t = getDictionary(locale);
  const item = t.trades.items[i];
  return pageMetadata(locale, `services/${trade}`, `${item.name} – ${t.trades.metaSuffix}`, item.body);
}

/** A trade: what the people do, their skills and up to four projects they worked on. */
export default async function TradePage({ params }: { params: Params }) {
  const { locale, trade } = await params;
  const i = tradeSlugs.indexOf(trade as TradeSlug);
  if (!isLocale(locale) || i < 0) notFound();
  const t = getDictionary(locale);
  const item = t.trades.items[i];
  const photo = tradePhotos[i];
  const related = projects.filter((p) => p.trades.includes(tradeSlugs[i])).slice(0, 4);

  return (
    <SiteShell t={t} locale={locale} path={`services/${trade}`} current="services">
      <div className={`trade${photo ? "" : " trade--text"}`}>
        <div className="trade__copy">
          <Breadcrumbs
            label={t.nav.breadcrumb}
            items={[{ name: t.nav.services, href: href(locale, "services") }, { name: item.name }]}
          />
          <PageHead label={t.trades.label} title={item.name} lead={item.body}>
            <span className="tile__icon tile__icon--accent phead__icon"><Icon name={tradeIcons[i]} /></span>
          </PageHead>
          <div className="trade__skills enter enter--up">
            <span className="mono faint">{t.trades.skillsTitle}</span>
            <ul className="tags">
              {item.skills.map((s) => <li key={s} className="mono">{s}</li>)}
            </ul>
            <p className="muted">{t.trades.vetting}</p>
          </div>
        </div>
        {photo && (
          <div className="trade__media enter enter--rise">
            <Photo slug={photo} />
          </div>
        )}
      </div>

      {related.length > 0 && (
        <section className="block" aria-labelledby="trade-projects">
          <SectionHead label={t.projects.label} title={t.trades.projectsTitle} id="trade-projects" />
          <ProjectGrid t={t} locale={locale} projects={related} />
        </section>
      )}

      <section className="block" aria-labelledby="trade-others">
        <h2 className="mono faint trade__others-title" id="trade-others">{t.trades.others}</h2>
        <ul className="chips" data-reveal>
          {t.trades.items.map((other, j) =>
            j === i ? null : (
              <li key={tradeSlugs[j]}>
                <a href={href(locale, `services/${tradeSlugs[j]}`)}>
                  <Icon name={tradeIcons[j]} size={18} />
                  {other.name}
                </a>
              </li>
            ),
          )}
        </ul>
      </section>
    </SiteShell>
  );
}
