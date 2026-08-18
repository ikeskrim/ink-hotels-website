import { Container, Heading, Section, SectionHead } from "@/components/ui/section";
import { RoomGroupCard } from "@/components/rooms/room-group-card";
import { InkLink } from "@/components/ui/ink-link";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { rooms } from "@/content/rooms";
import { getHouses } from "@/lib/sanity/content";
import { EVEXIA_IMAGES } from "@/content/generated/suite-images";
import { getMessages } from "@/i18n";
import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * The most important decision on the site, so it is the least abstract thing
 * on it: three large photographs, three names, three promises.
 *
 * Each building leads with the single photograph that carries it — the hot tub
 * above the water for House of Europe, because that is the strongest thing the
 * property owns and it is in the first building; the terrace door for Phos;
 * the residence itself.
 */
const PROMISES: Record<string, { image: string; promiseKey: keyof PromiseCopy }> = {
  "house-of-europe": {
    image: EVEXIA_IMAGES[0] ?? "/media/49291c0e544d7171652f05c68d4ba229.webp",
    promiseKey: "houseOfEurope",
  },
  phos: {
    image: "/media/1e70b5d1cffdc9245f3c5529df47596c.webp",
    promiseKey: "phos",
  },
  residence: {
    image: "/media/5b1c0f22c2104b9fc147b95ca2a58b45.webp",
    promiseKey: "residence",
  },
};

interface PromiseCopy {
  houseOfEurope: string;
  phos: string;
  residence: string;
}

export async function WhereYouSleep({ locale = defaultLocale }: { locale?: Locale }) {
  const m = getMessages(locale);
  /* Through the content layer, not the local module: the house subtitles
     ("The first building · reception") live in the overlay, and reading the
     raw data here printed them in English on all four other locales. */
  const ordered = (await getHouses(locale)).slice().sort((a, b) => a.order - b.order);
  const promises: PromiseCopy = {
    houseOfEurope: m.home.promiseHouseOfEurope,
    phos: m.home.promisePhos,
    residence: m.home.promiseResidence,
  };

  return (
    <Section id="rooms" ground="shade" size="lg" plaster chapter="01">
      <Container>
        <SectionHead
          index={1}
          eyebrow={m.home.roomsEyebrow}
          className="mb-[clamp(3rem,6vw,5rem)]"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <Heading split size="d2" className="max-w-[16ch]">
              {m.home.roomsTitle}
            </Heading>
            <p className="measure text-[color:var(--fg-2)]">{m.home.roomsLede}</p>
          </div>
        </SectionHead>

        <RevealGroup className="grid gap-x-[clamp(1.5rem,3vw,3rem)] gap-y-[clamp(3rem,5vw,4.5rem)] sm:grid-cols-2">
          {ordered.map((house) => {
            const meta = PROMISES[house.id];
            if (!meta) return null;
            return (
              <RevealItem key={house.id}>
                {/* Nothing here is `priority`. This section is six movements
                    below the fold, and preloading its first plate put a 41 kB
                    image on the critical path against the hero — the LCP paid
                    for a photograph nobody had scrolled to yet. */}
                <RoomGroupCard
                  house={house}
                  image={meta.image}
                  promise={promises[meta.promiseKey]}
                  sizes="(min-width: 640px) 46vw, 100vw"
                />
              </RevealItem>
            );
          })}
        </RevealGroup>

        <Reveal className="mt-[clamp(3rem,5vw,4.5rem)] flex items-baseline justify-between gap-6 border-t border-[color:var(--hairline)] pt-8">
          <InkLink href="/rooms" className="label">
            {m.actions.allRooms.replace("{count}", String(rooms.length))} →
          </InkLink>
          <p className="spec hidden text-[color:var(--fg-3)] sm:block">
            {m.home.roomsRenovated}
          </p>
        </Reveal>
      </Container>
    </Section>
  );
}
