import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { EB_Garamond, Commissioner, IBM_Plex_Mono } from "next/font/google";
import "../globals.css";

import {
  defaultLocale,
  isLocale,
  localePath,
  localeTags,
  locales,
} from "@/i18n/config";
import { getMessages } from "@/i18n";
import { I18nProvider } from "@/i18n/provider";
import { SITE_URL, site } from "@/content/site";
import { Preloader } from "@/components/motion/preloader";
import { RouteTransition } from "@/components/motion/route-transition";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { InkCursor } from "@/components/motion/ink-cursor";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { BookingDock } from "@/components/booking/booking-dock";
import { Analytics } from "@/components/seo/analytics";
import { JsonLd } from "@/components/seo/json-ld";
import { hotelSchema } from "@/lib/schema";

/* Display + editorial body. A garalde — the class of book face a compositor in
   an 18th-century printing shop would have had in the case. Loaded with the
   Greek subsets so ΑΓΩΝ, Φως, Πάθος, Αρμονία, Αγάπη and Ελπίδα set in family
   and take the same colour on the page as the English around them. */
/* Modern Greek only — greek-ext carries polytonic accents this site never
   sets, and it is a whole extra file on the critical path.
   NO latin-ext either. It covers Central European and Turkish letterforms
   (ā ă ą ć č ğ ł ş ż) and this site sets none of them: English, French,
   German and Dutch all live inside Latin-1, which `latin` already carries.
   Two families × one unused subset was ~50 kB on the critical path of every
   page — more than the hero photograph itself.

   Latin and Greek are NOT split into separate declarations with the Greek cut
   stacked second. That was tried and measured: it changed the bytes downloaded
   on /en by exactly zero, because there is no page on this site that sets no
   Greek. Φως is the name of the second building, ΑΓΩΝ is the masthead on the
   story page, and every suite carries its Greek name. `unicode-range` only
   saves a request when a locale never reaches the cut, and here every locale
   reaches it on the first screen.

   Each family names a metrically close system face first. next/font derives a
   size-adjusted fallback from that first entry, so the text it renders before
   the webfont arrives occupies nearly the same width — which is what stops a
   paragraph re-wrapping, and the page shifting, at swap time. */
const garamond = EB_Garamond({
  subsets: ["latin", "greek"],
  display: "swap",
  variable: "--font-garamond",
  style: ["normal", "italic"],
  fallback: ["Georgia", "Times New Roman", "serif"],
  adjustFontFallback: true,
});

/* Interface and running body. Designed by Kostas Bartsokas with a native Greek
   design rather than Greek glyphs bolted onto a Latin skeleton. */
const commissioner = Commissioner({
  subsets: ["latin", "greek"],
  display: "swap",
  variable: "--font-commissioner",
  fallback: ["Helvetica Neue", "Arial", "sans-serif"],
  adjustFontFallback: true,
});

/* Specifications only — room sizes, coordinates, licence numbers, dates.
   IBM Plex Mono ships no Greek subset, so it is never used for Greek text. */
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  /* One weight: labels and specs are set at 400 throughout. */
  weight: ["400"],
  display: "swap",
  /* Not preloaded. The LCP element on every measured route is a line of body
     text, and 155 kB of font sat in front of it — more than the hero
     photograph. The mono face sets only specs and small labels, none of which
     is the largest paint on any page, so it is fetched rather than preloaded
     and stops competing with the type that actually is. */
  preload: false,
  variable: "--font-plex-mono",
  fallback: ["Courier New", "ui-monospace", "monospace"],
  adjustFontFallback: true,
});

/* All five locales are prerendered. */
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Ink Hotels — A small hotel in the old town of Rethymno, Crete",
      template: "%s — Ink Hotels Rethymno",
    },
    description: site.shortDescription,
    applicationName: site.name,
    authors: [{ name: site.legalName }],
    keywords: [
      "Ink Hotels",
      "Rethymno hotel",
      "Crete boutique hotel",
      "old town Rethymno",
      "House of Europe",
      "Phos",
      "Gateway Suites",
      "Venetian harbour",
      "Fortezza",
    ],
    openGraph: {
      type: "website",
      locale: localeTags[locale].replace("-", "_"),
      url: `${SITE_URL}${localePath(locale, "/")}`,
      siteName: site.name,
      title: "Ink Hotels — Rethymno, Crete",
      description: site.shortDescription,
    },
    twitter: { card: "summary_large_image" },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
    /* No `icons` block: `app/icon.svg` and `app/apple-icon.tsx` are picked up
       by file convention, and declaring them here would override the
       convention with a hand-maintained list — which is how `/apple-icon.png`
       came to be advertised without ever existing. */
    alternates: {
      canonical: `${SITE_URL}${localePath(locale, "/")}`,
      /* Every language points at every other, plus x-default at English —
         without this Google treats the five versions as duplicates. */
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [localeTags[l], `${SITE_URL}${localePath(l, "/")}`]),
        ),
        "x-default": SITE_URL,
      },
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F2EDE3" },
    { media: "(prefers-color-scheme: dark)", color: "#191512" },
  ],
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale = raw;
  const messages = getMessages(locale);

  return (
    <html
      lang={localeTags[locale]}
      className={`${garamond.variable} ${commissioner.variable} ${plexMono.variable}`}
    >
      <head>
        {/* Scroll entrances are inline `opacity: 0` until their observer
            fires. With no script to fire it, that inline style is final and
            the page reads as empty. This is the same rule as the
            `scripting: none` block in globals.css; both are here because
            neither is supported everywhere on its own. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
      </head>
      <body data-ground="paper" className="antialiased">
        <JsonLd data={hotelSchema()} />
        <Analytics />

        <I18nProvider locale={locale} messages={messages}>
          <a
            href="#main"
            className="sr-only-focusable label fixed left-4 top-4 z-[200] bg-ink px-4 py-3 text-paper"
          >
            {messages.common.skipToContent}
          </a>

          <Preloader />
          <RouteTransition />
          <InkCursor />
          <SmoothScroll />
          <SiteHeader />

          <main id="main" className="relative">
            {children}
          </main>

          <SiteFooter locale={locale} />
          <BookingDock />
        </I18nProvider>
      </body>
    </html>
  );
}
