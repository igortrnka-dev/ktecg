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
  // Everything but API routes, Next assets and files (paths with a dot), plus every path under a locale, so that
  // /de/kontakt.html still gets the 404 status. Keep the locale list in sync with src/i18n/config.ts.
  matcher: ["/((?!api|_next|.*\\..*).*)", "/(en|de|fr|sv|sk|pl)/:path*"],
};
