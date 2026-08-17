import Image from "next/image";
import { blurFor } from "@/content/generated/blur";

import { Heading, Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { InkLink } from "@/components/ui/ink-link";
import { Gk } from "@/components/ui/greek";
import { EVEXIA_IMAGES } from "@/content/generated/suite-images";
import { getMessages } from "@/i18n";
import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * The water.
 *
 * One section where the heritage system steps entirely out of the way. No
 * press mechanic, no light mechanic: the two suites that come with their own
 * water, photographed, and a line that is exactly true.
 *
 * It is a diptych rather than a single full-bleed plate because there are now
 * two of them, and because a pair of half-width plates asks each photograph
 * for half the pixels a full-bleed hero does — which is what lets the property's
 * own 1920px library carry it without softening.
 */
const PLATES = [
  {
    src: EVEXIA_IMAGES[0]!,
    alt: "The private hot tub on the Evexia terrace, painted Cretan tiles behind it and the sea beyond",
    name: "Evexia",
    href: "/rooms/evexia",
  },
  {
    src: "/media/9053c1c0aa924fb16769460a7c06ae29.webp",
    alt: "The heated private plunge pool in the interior courtyard of the Harmony suite",
    name: "Harmony",
    href: "/rooms/harmony",
  },
] as const;

export function TheWater({ locale = defaultLocale }: { locale?: Locale }) {
  const m = getMessages(locale);

  return (
    <Section
      ground="night"
      size="none"
      grain={false}
      className="relative overflow-hidden"
    >
      <div className="grid sm:grid-cols-2">
        {PLATES.map((plate, i) => (
          <div key={plate.name} className="relative aspect-[4/5] sm:aspect-[3/4]">
            <Image
              src={plate.src}
              placeholder={blurFor(plate.src) ? "blur" : "empty"}
              blurDataURL={blurFor(plate.src)}
              alt={plate.alt}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              quality={78}
              className={
                i === 0
                  ? "object-cover motion-safe:animate-[heroDrift_22s_ease-out_forwards] [filter:saturate(0.9)]"
                  : "object-cover motion-safe:animate-[heroDriftAlt_26s_ease-out_forwards] [filter:saturate(0.86)]"
              }
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/15 to-transparent" />
            <p className="label absolute bottom-5 left-5 text-paper/85">
              {plate.name}
            </p>
          </div>
        ))}
      </div>

      <div className="relative z-[2] mx-auto w-full max-w-[1680px] px-6 py-[clamp(3rem,6vw,5rem)] sm:px-8 lg:px-12">
        <Reveal>
          <p className="label mb-6 flex items-baseline gap-2.5 text-phos">
            {m.home.waterEyebrow} <span aria-hidden="true">·</span>{" "}
            <Gk>Ευεξία · Αρμονία</Gk>
          </p>
          <Heading size="d2" className="measure-wide mb-8 text-paper">
            {m.home.waterTitle}
          </Heading>
          <p className="measure-wide text-paper/80">{m.home.waterBody}</p>
          <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
            {PLATES.map((plate) => (
              <InkLink
                key={plate.name}
                href={plate.href}
                className="label text-[color:var(--link)]"
              >
                {plate.name} →
              </InkLink>
            ))}
            <p className="spec text-olive">{m.home.waterSpec}</p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
