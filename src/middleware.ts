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

  // The localized 404 page gets no route params, so it reads the locale from this header.
  const headers = new Headers(request.headers);
  headers.set("x-locale", locale);
  const response = NextResponse.next({ request: { headers } });
  // Remember the language the visitor last used, so the bare domain brings them back to it.
  if (request.cookies.get(LOCALE_COOKIE)?.value !== locale) {
    response.cookies.set(LOCALE_COOKIE, locale, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  }
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
