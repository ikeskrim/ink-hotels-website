import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, isLocale, locales } from "@/i18n/config";

/**
 * Locale routing.
 *
 * Every page lives under `app/[locale]/`, but English is served without a
 * prefix so no existing URL changes and nothing loses its search equity:
 * `/rooms` is rewritten to `/en/rooms` internally while the address bar keeps
 * showing `/rooms`. The other four languages carry their prefix openly.
 *
 * A rewrite rather than a redirect, because a redirect would cost a round trip
 * on every English request — which is most of them.
 *
 * Language is never chosen for the visitor on a first visit. A German browser
 * landing on `/rooms` gets English and a visible switcher; guessing and
 * redirecting strands people who cannot find their way back. The only thing we
 * honour automatically is a choice they made themselves, stored in a cookie.
 */

const PUBLIC_FILE = /\.(?:svg|png|jpg|jpeg|webp|avif|gif|ico|xml|txt|json|webmanifest)$/i;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/media") ||
    /* The CMS is not a page of the website and must never be given a locale
       prefix — Sanity does its own routing under /studio, and rewriting it to
       /en/studio would 404 the whole admin. */
    pathname.startsWith("/studio") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  /* Already prefixed with a real locale — leave it alone. */
  if (first && isLocale(first)) {
    /* `/en/...` is the internal form; surface it as the clean URL instead. */
    if (first === defaultLocale) {
      const url = request.nextUrl.clone();
      url.pathname = "/" + segments.slice(1).join("/");
      return NextResponse.redirect(url, 308);
    }
    return NextResponse.next();
  }

  /* Unprefixed. If the visitor has previously chosen a language, honour it. */
  const remembered = request.cookies.get("ink_locale")?.value;
  const target =
    remembered && isLocale(remembered) && remembered !== defaultLocale
      ? remembered
      : defaultLocale;

  const url = request.nextUrl.clone();

  if (target !== defaultLocale) {
    url.pathname = `/${target}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    /* Everything except Next internals, the API, the Studio, and files with
       an extension. */
    "/((?!_next/static|_next/image|favicon.ico|media|api|studio).*)",
  ],
};

export const runtime = "nodejs";

/** Exported for tests and for the sitemap. */
export { locales };
