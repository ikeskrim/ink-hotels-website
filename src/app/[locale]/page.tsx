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
import { PlainFacts } from "@/components/home/plain-facts";
import { NowTheDates } from "@/components/home/now-the-dates";
import { JsonLd } from "@/components/seo/json-ld";
import { faqSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n";

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
      <PlainFacts locale={locale} />
      <NowTheDates locale={locale} />
    </>
  );
}
