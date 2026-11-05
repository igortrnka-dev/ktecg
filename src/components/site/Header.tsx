"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/i18n";
import type { Locale } from "@/i18n/config";
import { localeNames, locales } from "@/i18n/config";
import { href, pages, type PageKey } from "@/content/site";

type Nav = Dictionary["nav"];

/**
 * Floating pill navbar. Desktop: wordmark, page links with a sliding hover highlight, language
 * dropdown, glowing CTA (the short label up to 1199px). Below 960px the links and languages move
 * into a sheet opened by the burger; the short CTA stays in the bar.
 * `current` is the menu page the visitor is on or under (null on the 404 page), `path` the page
 * itself ("services/welding-piping"): the language links keep it.
 */
export default function Header({
  nav,
  locale,
  path,
  current,
}: {
  nav: Nav;
  locale: Locale;
  path: string;
  current: PageKey | null;
}) {
  const links = pages.map((p) => ({ ...p, label: nav[p.key] }));
  /** "page" on the page itself, "true" on its subpages (a trade under Services). */
  const ariaCurrent = (key: PageKey, linkPath: string) =>
    key !== current ? undefined : linkPath === path ? ("page" as const) : ("true" as const);

  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hl, setHl] = useState<{ x: number; y: number; w: number; on: boolean }>({ x: 0, y: 0, w: 0, on: false });

  const headerRef = useRef<HTMLElement>(null);
  const linksRef = useRef<HTMLElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Tighten the bar once the page has scrolled a little.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the language dropdown on outside click.
  useEffect(() => {
    if (!langOpen) return;
    const onDown = (e: PointerEvent) => {
      if (!langRef.current?.contains(e.target as Node)) setLangOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [langOpen]);

  // Esc closes whatever is open and returns focus to its button; Tab cycles inside the open sheet.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (menuOpen) {
          setMenuOpen(false);
          burgerRef.current?.focus();
        }
        const lang = langRef.current;
        if (lang?.contains(document.activeElement)) lang.querySelector("button")?.focus();
        setLangOpen(false);
        return;
      }
      if (e.key !== "Tab" || !menuOpen || !burgerRef.current || !sheetRef.current) return;
      const items = [burgerRef.current, ...sheetRef.current.querySelectorAll<HTMLElement>("a[href], button")];
      const i = items.indexOf(document.activeElement as HTMLElement);
      let next: number;
      if (i === -1) next = 1;
      else if (e.shiftKey) next = i === 0 ? items.length - 1 : i - 1;
      else next = i === items.length - 1 ? 0 : i + 1;
      e.preventDefault();
      items[next]?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  // The open sheet is modal: the rest of the page goes inert, body scroll locks, focus moves in. No aria-modal,
  // because the burger that closes it sits outside the sheet and VoiceOver would hide it.
  useEffect(() => {
    const sheet = sheetRef.current;
    if (!menuOpen || !sheet) return;
    const outside = Array.from(sheet.parentElement?.children ?? []).filter(
      (el): el is HTMLElement => el instanceof HTMLElement && el !== sheet && el !== headerRef.current,
    );
    outside.forEach((el) => (el.inert = true));
    document.body.style.overflow = "hidden";
    sheet.querySelector<HTMLElement>("a[href]")?.focus();
    return () => {
      outside.forEach((el) => (el.inert = false));
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Close the sheet if the viewport grows past the mobile breakpoint (same as in site.css).
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 960px)");
    const onChange = () => mq.matches && setMenuOpen(false);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const moveHighlight = useCallback((el: HTMLElement | null) => {
    const box = linksRef.current;
    if (!el || !box) return setHl((h) => ({ ...h, on: false }));
    // y is 0 on a single row; it moves the pill onto the right row if the links wrap (user text spacing).
    setHl({ x: el.offsetLeft, y: el.offsetTop + (el.offsetHeight - box.clientHeight) / 2, w: el.offsetWidth, on: true });
  }, []);

  return (
    <>
      <header ref={headerRef} className={`nav${scrolled ? " is-scrolled" : ""}${menuOpen ? " is-open" : ""}`}>
        <a href={`/${locale}`} className="nav__mark" aria-label="KTechnology">
          <span className="nav__k" aria-hidden>K</span>Technology
        </a>

        <nav
          ref={linksRef}
          className="nav__links"
          aria-label={nav.mainNav}
          onMouseLeave={() => moveHighlight(null)}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) moveHighlight(null);
          }}
        >
          <span
            className={`nav__hl${hl.on ? " is-on" : ""}`}
            style={{ transform: `translate(${hl.x}px, ${hl.y}px)`, width: hl.w }}
            aria-hidden
          />
          {links.map((l) => (
            <a
              key={l.key}
              href={href(locale, l.path)}
              className={l.key === current ? "is-active" : undefined}
              aria-current={ariaCurrent(l.key, l.path)}
              onMouseEnter={(e) => moveHighlight(e.currentTarget)}
              onFocus={(e) => moveHighlight(e.currentTarget)}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="nav__end">
          <div
            className="lang"
            ref={langRef}
            onBlur={(e) => {
              // relatedTarget is null for a click inside in Safari (links don't take focus); outside clicks close via pointerdown.
              const next = e.relatedTarget as Node | null;
              if (next && !e.currentTarget.contains(next)) setLangOpen(false);
            }}
          >
            <button
              type="button"
              className="lang__btn mono"
              aria-expanded={langOpen}
              aria-controls="lang-menu"
              aria-label={`${locale.toUpperCase()} – ${nav.language}: ${localeNames[locale]}`}
              onClick={() => setLangOpen((o) => !o)}
            >
              {locale.toUpperCase()}
              <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden className="lang__caret">
                <path d="M2 3.5 5 6.5 8 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
            <ul className="lang__menu" id="lang-menu" hidden={!langOpen}>
              {locales.map((l) => (
                <li key={l}>
                  <a
                    href={href(l, path)}
                    hrefLang={l}
                    lang={l}
                    className={l === locale ? "is-active" : undefined}
                    aria-current={l === locale ? "page" : undefined}
                  >
                    <span className="mono">{l.toUpperCase()}</span>
                    {localeNames[l]}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <a href={href(locale, "contact")} className="glow-btn nav__cta">
            <span className="glow-btn__glow" aria-hidden />
            <span className="glow-btn__fill">
              <span className="nav__cta-long">{nav.cta}</span>
              <span className="nav__cta-short">{nav.ctaShort}</span>
            </span>
          </a>

          <button
            ref={burgerRef}
            type="button"
            className="nav__burger"
            aria-label={nav.menu}
            aria-expanded={menuOpen}
            aria-controls="nav-sheet"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span aria-hidden />
            <span aria-hidden />
          </button>
        </div>
      </header>

      <div
        ref={sheetRef}
        className={`sheet${menuOpen ? " is-open" : ""}`}
        id="nav-sheet"
        role="dialog"
        aria-label={nav.menu}
        hidden={!menuOpen}
      >
        <nav className="sheet__links" aria-label={nav.mainNav}>
          {links.map((l) => (
            <a
              key={l.key}
              href={href(locale, l.path)}
              className={l.key === current ? "is-active" : undefined}
              aria-current={ariaCurrent(l.key, l.path)}
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </nav>
        <ul className="sheet__langs" aria-label={nav.language}>
          {locales.map((l) => (
            <li key={l}>
              <a
                href={href(l, path)}
                hrefLang={l}
                lang={l}
                aria-label={`${l.toUpperCase()} – ${localeNames[l]}`}
                className={`mono${l === locale ? " is-active" : ""}`}
                aria-current={l === locale ? "page" : undefined}
              >
                {l.toUpperCase()}
              </a>
            </li>
          ))}
        </ul>
        <a href={href(locale, "contact")} className="glow-btn sheet__cta" onClick={() => setMenuOpen(false)}>
          <span className="glow-btn__glow" aria-hidden />
          <span className="glow-btn__fill">{nav.cta}</span>
        </a>
      </div>
    </>
  );
}
