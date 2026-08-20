import Image from "next/image";
import { blurFor } from "@/content/generated/blur";

import { Container, Heading, Section } from "@/components/ui/section";
import { MaskReveal, Reveal } from "@/components/motion/reveal";
import { InkAnchor } from "@/components/ui/ink-link";
import { contact } from "@/content/site";
import { getMessages } from "@/i18n";
import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * Crete Holiday Home — the family behind the hotel.
 *
 * This is a trust section, not a corporate one. A small hotel in a foreign old
 * town is a leap of faith; knowing it is run by a family who have been letting
 * houses on this coast for years, with offices a guest can call from London or
 * Amsterdam, is what converts a browser into a booking.
 *
 * Their own words are used where they have them, and nothing is added that
 * creteholidayhome.com does not itself claim.
 */

export function TheFamily({ locale = defaultLocale }: { locale?: Locale }) {
  const m = getMessages(locale);
  const proof = [
    { figure: m.home.familyProofVillasTerm, detail: m.home.familyProofVillasBody },
    { figure: m.home.familyProofOfficesTerm, detail: m.home.familyProofOfficesBody },
    { figure: m.home.familyProofLocalTerm, detail: m.home.familyProofLocalBody },
  ];

  return (
    <Section ground="sun" size="lg">
      <Container>
        <div className="grid items-center gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-12">
          <figure className="lg:col-span-6">
            <MaskReveal className="aspect-[4/3]">
              <Image
                src="/media/5c8561282159b358b4e7a2270cc972d9.webp"

                placeholder={blurFor("/media/5c8561282159b358b4e7a2270cc972d9.webp") ? "blur" : "empty"}

                blurDataURL={blurFor("/media/5c8561282159b358b4e7a2270cc972d9.webp")}
                alt={m.photoAlt.family}
                width={1200}
                height={900}
                sizes="(min-width: 1024px) 48vw, 100vw"
                quality={78}
                className="graded h-full w-full object-cover"
              />
            </MaskReveal>
          </figure>

          <div className="lg:col-span-6">
            <Reveal>
              <p className="label mb-6 text-[color:var(--fg-3)]">
                Crete Holiday Home
              </p>
              <Heading size="d2" className="mb-8 max-w-[16ch]">
                {m.home.familyTitle}
              </Heading>

              <div className="prose-ink measure">
                <p>{m.home.familyP1}</p>
                <p>{m.home.familyP2}</p>
              </div>

              <dl className="mt-10 border-t border-[color:var(--hairline)]">
                {proof.map((p) => (
                  <div
                    key={p.figure}
                    className="grid gap-2 border-b border-[color:var(--hairline)] py-5 sm:grid-cols-[11rem_1fr] sm:gap-6"
                  >
                    <dt className="label pt-1 text-[color:var(--fg-3)]">
                      {p.figure}
                    </dt>
                    <dd className="measure text-[color:var(--fg-2)]">
                      {p.detail}
                    </dd>
                  </div>
                ))}
              </dl>

              <InkAnchor
                href={contact.group.url}
                target="_blank"
                rel="noopener noreferrer"
                className="label mt-9 inline-block"
              >
                {m.actions.seeCollection} →
              </InkAnchor>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
