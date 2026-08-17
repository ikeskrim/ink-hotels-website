import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { RoomsBrowser } from "@/components/rooms/rooms-browser";
import { Section } from "@/components/ui/section";
import { NowTheDates } from "@/components/home/now-the-dates";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { rooms } from "@/content/rooms";
import { getHouses, getRooms } from "@/lib/sanity/content";
import { getMessages } from "@/i18n";
import { defaultLocale, isLocale } from "@/i18n/config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const m = getMessages(locale);

  return pageMetadata({
    title: m.pageMeta.rooms.t,
    description: m.pageMeta.rooms.d,
    path: "/rooms",
    locale,
  });
}

export default async function RoomsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const m = getMessages(locale);

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Rooms", path: "/rooms" },
        ])}
      />

      <PageHero
        eyebrow={m.rooms.eyebrow.replace("{count}", String(rooms.length))}
        title={m.rooms.title}
        lede={m.home.roomsLede}
        image="/media/762654ea8545e8826f8b5902eb8e26e0.webp"
        imageAlt="A suite at Ink Hotels with beamed ceiling and whitewashed walls"
      />

      <Section ground="paper" size="none" className="pt-[clamp(3rem,6vw,5rem)]">
        <RoomsBrowser rooms={await getRooms(locale)} houses={await getHouses(locale)} />
      </Section>

      <NowTheDates locale={locale} />
    </>
  );
}
