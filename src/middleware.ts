import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, isLocale } from "@/i18n/config";

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
    return NextResponse.next({ request: { headers: withLocale(request, first) } });
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
  return NextResponse.rewrite(url, {
    request: { headers: withLocale(request, defaultLocale) },
  });
}

/**
 * The resolved locale, forwarded to the server components as a header.
 *
 * `not-found.tsx` is the one page that cannot read `params` — Next renders it
 * outside the matched route, so the `[locale]` segment it sits under is not
 * available to it. Without this the 404 has no way to know which of the five
 * languages the reader is in, which is why it shipped hardcoded English on a
 * site that is otherwise translated to the last button.
 */
function withLocale(request: NextRequest, locale: string) {
  const headers = new Headers(request.headers);
  headers.set("x-ink-locale", locale);
  return headers;
}

export const config = {
  matcher: [
    /* Everything except Next internals, the API, the Studio — and the
       file-convention metadata routes.

       Those last ones are the reason this line changed. `app/opengraph-image`
       and `app/apple-icon` are generated routes with no file extension, so
       they matched, got rewritten to `/en/opengraph-image`, and answered 404 —
       while every page on the site advertised
       `https://inkhotels.gr/opengraph-image` as its og:image. Every shared
       link that was not a suite page had a broken preview card, and nothing
       rendered wrong on the site itself to say so. `/icon.svg` escaped only
       because it happens to carry an extension. */
    "/((?!_next/static|_next/image|favicon.ico|media|api|studio|opengraph-image|twitter-image|apple-icon|icon|manifest|robots|sitemap).*)",
  ],
};

/* No `runtime` and no re-exports here.
   A middleware module is not an ordinary module: the bundler treats every
   export as part of the middleware contract, and anything it does not
   recognise ends up in the routing manifest it hands the platform. This file
   used to `export { locales }` for convenience — nothing imported it, and the
   sitemap and tests take `locales` from `@/i18n/config`, which is where it
   lives. Import it from there. */
