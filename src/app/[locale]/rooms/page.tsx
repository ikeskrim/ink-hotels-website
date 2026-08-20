import type { Metadata } from "next";

import { PageHero } from "@/components/layout/page-hero";
import { RoomsBrowser } from "@/components/rooms/rooms-browser";
import { Container, Section } from "@/components/ui/section";
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

  /* Fetched once and reused: the browser below and the diptych at the foot
     both need the localised house names, and calling getHouses twice would ask
     the content layer for the same thing on the same render. */
  const allHouses = await getHouses(locale);
  const houseName = (id: string) =>
    allHouses.find((h) => h.id === id)?.name ?? id;

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
        imageAlt={m.photoAlt.suiteBeams}
      />

      <Section ground="paper" size="none" className="pt-[clamp(3rem,6vw,5rem)]">
        <RoomsBrowser rooms={await getRooms(locale)} houses={allHouses} />
      </Section>

      {/* ── Light and ink ─────────────────────────────────────
          A diptych, because the two houses are a pair and the question a
          reader actually has — which building am I in, and what is the
          difference — is a comparison. It is the most-asked question on /faq,
          answered here where the choice is being made rather than four pages
          away.

          The panels are the two grounds of the site: ink for the first house,
          where the press was, and paper-light for the one named after light. */}
      <Section ground="paper" size="lg" wash="paper">
        <Container>
          <h2 className="label mb-[clamp(2rem,4vw,3rem)] text-[color:var(--fg-3)]">
            {m.voice.diptychTitle}
          </h2>

          <div className="grid gap-px overflow-hidden border border-[color:var(--border)] bg-[color:var(--border)] lg:grid-cols-2">
            <div data-ground="ink" className="grain p-[clamp(2rem,4vw,3.5rem)]">
              <h3 className="font-display text-[length:var(--text-d3)] leading-tight text-paper">
                {houseName("house-of-europe")}
              </h3>
              <p className="measure mt-6 text-paper/80">{m.voice.diptychInkBody}</p>
            </div>

            <div data-ground="sun" className="grain lit p-[clamp(2rem,4vw,3.5rem)]">
              <h3 className="relative font-display text-[length:var(--text-d3)] leading-tight">
                {houseName("phos")}
              </h3>
              <p className="measure relative mt-6 text-[color:var(--fg-2)]">
                {m.voice.diptychLightBody}
              </p>
              <p className="measure relative mt-5 text-[color:var(--fg-2)]">
                {m.voice.standoutPhos}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <NowTheDates locale={locale} />
    </>
  );
}
