import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { updateSession } from "@/lib/supabase/middleware";

const LOCALE_COOKIE = "NEXT_LOCALE";

function preferredLocale(request: NextRequest): Locale {
  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookie && isLocale(cookie)) return cookie;

  const header = request.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const code = part.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (isLocale(code)) return code;
  }
  return defaultLocale;
}

/** Maps "en", "EN" and "de-AT" to a locale, anything else to null. */
function localeOf(segment: string): Locale | null {
  const code = segment.match(/^([a-z]{2})(?:[-_][a-z]{2,4})?$/i)?.[1].toLowerCase();
  return code && isLocale(code) ? code : null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return updateSession(request);
  }

  const [, first = "", ...rest] = pathname.split("/");
  const locale = localeOf(first);
  const url = request.nextUrl.clone();

  // Dotted paths outside a locale are files and metadata routes (/icon.svg, /robots.txt, /.well-known/…) and are
  // left to Next. Page-like ones such as old-site links (/kontakt.html, /index.php) go on to the localized 404 like
  // any unprefixed path; a page-like file added to public/ (e.g. a verification .html) would need an exception here.
  if (!locale && pathname.includes(".") && !/\.(?:html?|php\d?|aspx?|jsp|cfm)$/i.test(pathname)) {
    return NextResponse.next();
  }

  if (!locale) {
    url.pathname = `/${preferredLocale(request)}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }
  if (first !== locale) {
    url.pathname = ["", locale, ...rest].join("/");
    return NextResponse.redirect(url, 308);
  }

  // The locale homepage is the only page under /<locale>; anything deeper renders the localized 404 page in
  // [locale]/[...rest], which cannot set its own status.
  const response = NextResponse.next(rest.some(Boolean) ? { status: 404 } : undefined);
  // Remember the language the visitor last used, so the bare domain brings them back to it.
  if (request.cookies.get(LOCALE_COOKIE)?.value !== locale) {
    response.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  }
  return response;
}

export const config = {
  // Everything but API routes, Next assets and the images in public/img. Other dotted paths are sorted out above.
  matcher: ["/((?!api|_next|img/).*)"],
};
