import type { Metadata } from "next";

import { Hero } from "@/components/home/hero";
import { TheName } from "@/components/home/the-name";
import { TheImpression } from "@/components/home/the-impression";
import { TheLight } from "@/components/home/the-light";
import { TheOldTown } from "@/components/home/the-old-town";
import { WhereYouSleep } from "@/components/home/where-you-sleep";
import { TheWater } from "@/components/home/the-water";
import { TheArrival } from "@/components/home/the-arrival";
import { TheOpenDoor } from "@/components/home/the-open-door";
import { WhatWeArrange } from "@/components/home/what-we-arrange";
import { TheFamily } from "@/components/home/the-family";
import { TheFeed } from "@/components/home/the-feed";
import { WhatGuestsSaid } from "@/components/home/what-guests-said";
import { PlainFacts } from "@/components/home/plain-facts";
import { NowTheDates } from "@/components/home/now-the-dates";
import { JsonLd } from "@/components/seo/json-ld";
import { faqSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n";

/* ── A homepage JS diet was tried and measured, and did not pay ────────────
   The three below-fold client sections — TheName, TheImpression, TheLight —
   were moved to `next/dynamic` with `ssr: true`, splitting their hydration
   chunks out of the initial bundle. Same machine, fresh build, "Ready in"
   confirmed, three runs each:

     before   80/ 85/ 85   LCP 3.84s   FCP 2.56s   TBT 39ms   First Load 213 kB
     after    80/ 83/ 85   LCP 4.07s   FCP 2.56s   TBT 37ms   First Load 214 kB

   The bundle got a kilobyte *bigger* — the dynamic wrappers cost more than the
   split saves at this size — and FCP did not move by a millisecond, which is
   the tell: this page is bound by bytes and main-thread rendering, not by
   script execution. TBT was already 39ms; there was nothing there to win.

   Reverted. Recorded here so the next person does not spend the evening
   rediscovering it, the same way the per-locale font subsetting and the
   `inlineCss` experiment are recorded where they were tried. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;

  const m = getMessages(locale);

  return pageMetadata({
    title: m.pageMeta.home.t,
    description: m.pageMeta.home.d,
    path: "/",
    locale,
  });
}

/**
 * The homepage, as twelve movements.
 *
 * The order is a sales argument, not a menu: what this place is (1–4), where
 * you sleep (5–7), how you arrive (8), how the days go (9), who is behind it
 * (10), what you would otherwise go and check (11), and only then the dates.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;

  return (
    <>
      <JsonLd data={faqSchema()} />
      <Hero />
      <TheName />
      <TheImpression />
      <TheLight />
      <TheOldTown locale={locale} />
      <WhereYouSleep locale={locale} />
      <TheWater locale={locale} />
      <TheOpenDoor locale={locale} />
      <TheArrival locale={locale} />
      <WhatWeArrange locale={locale} />
      <TheFamily locale={locale} />
      <WhatGuestsSaid locale={locale} />
      <TheFeed locale={locale} />
      <PlainFacts locale={locale} />
      <NowTheDates locale={locale} />
    </>
  );
}
