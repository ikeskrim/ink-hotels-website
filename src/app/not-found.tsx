import type { Metadata } from "next";
import Link from "next/link";
import { EB_Garamond, Commissioner, IBM_Plex_Mono } from "next/font/google";

import "./globals.css";
import { nav } from "@/content/site";
import { getMessages } from "@/i18n";
import { defaultLocale, localePath, localeTags } from "@/i18n/config";
import { Wordmark } from "@/components/layout/wordmark";
import { InkBlot, PenUnderline } from "@/components/brand/ink-blot";

/**
 * The global 404.
 *
 * Next only ever renders the *root* `not-found` for a URL that matches no route
 * at all, so it never passes through the locale segment and has to supply its
 * own `<html>`, `<body>` and fonts. It answers in English, because a URL that
 * matched nothing carries no locale to honour.
 *
 * `app/[locale]/not-found.tsx` still exists and still handles `notFound()`
 * thrown from inside a real locale — an unknown room slug, say — where the
 * language *is* known and the page can answer in it.
 */

const garamond = EB_Garamond({
  subsets: ["latin", "greek"],
  display: "swap",
  variable: "--font-garamond",
  style: ["normal", "italic"],
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: true,
});

const commissioner = Commissioner({
  subsets: ["latin", "greek"],
  display: "swap",
  variable: "--font-commissioner",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: true,
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-plex-mono",
  fallback: ["Courier New", "ui-monospace", "monospace"],
  adjustFontFallback: true,
});

/* This page supplies its own <html>, so it also has to supply its own <head>
   metadata — there is no layout above it to inherit a title from. */
export const metadata: Metadata = {
  title: "Page not found — Ink Hotels Rethymno",
  description:
    "The page you asked for does not exist. Ink Hotels — a small hotel in the medieval old town of Rethymno, Crete.",
  robots: { index: false, follow: true },
};

export default function GlobalNotFound() {
  const m = getMessages(defaultLocale);
  const L = (path: string) => localePath(defaultLocale, path);

  return (
    <html
      lang={localeTags[defaultLocale]}
      className={`${garamond.variable} ${commissioner.variable} ${plexMono.variable}`}
    >
      {/* Paper, not a darkened photograph. A 404 is a small failure, and
          giving it a cinematic full-bleed hero is a lie about how much it
          matters. A sheet with a blot on it is the right register — and it
          costs nothing to load, which is what a page nobody meant to reach
          should cost. */}
      <body data-ground="paper" className="antialiased">
        <main className="grain plaster relative flex min-h-[100svh] items-center overflow-hidden">
          <div className="relative z-[2] mx-auto w-full max-w-[1680px] px-6 py-[clamp(5rem,12vh,9rem)] sm:px-8 lg:px-12">
            <Link
              href={L("/")}
              aria-label="Ink Hotels"
              className="mb-14 inline-block"
            >
              <Wordmark compact className="h-6 w-auto" />
            </Link>

            <div className="grid items-center gap-[clamp(2.5rem,7vw,6rem)] lg:grid-cols-12">
              <div className="lg:col-span-7">
                <p className="label mb-8 text-[color:var(--fg-3)]">
                  {m.common.error404}
                </p>

                <h1 className="font-display max-w-[13ch] text-[length:var(--text-d1)] leading-[0.96] tracking-[-0.02em]">
                  {m.common.notFoundTitle}
                </h1>
                <PenUnderline
                  className="mt-3 h-4 w-[min(20rem,80%)] text-[color:var(--link)]"
                  delay={0.45}
                />

                <p className="measure mt-8 text-[color:var(--fg-2)]">
                  {m.common.notFoundBody}
                </p>

                <nav aria-label="Site" className="mt-12">
                  <p className="label mb-5 text-[color:var(--fg-3)]">
                    {m.common.tryInstead}
                  </p>
                  <ul className="flex flex-wrap gap-x-8 gap-y-3">
                    <li>
                      <Link
                        href={L("/")}
                        className="font-display text-[length:var(--text-d4)] underline-offset-4 hover:underline"
                      >
                        {m.nav.home}
                      </Link>
                    </li>
                    {nav.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={L(item.href)}
                          className="font-display text-[length:var(--text-d4)] underline-offset-4 hover:underline"
                        >
                          {m.nav[item.key]}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              <div className="lg:col-span-5">
                <InkBlot className="mx-auto h-auto w-[min(22rem,70%)] text-ink/85" />
              </div>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
