import type { Metadata } from "next";
import Image from "next/image";

import { Container, Heading, Section } from "@/components/ui/section";
import { MaskReveal, Reveal } from "@/components/motion/reveal";
import { InkAnchor, InkLink } from "@/components/ui/ink-link";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { defaultLocale, isLocale } from "@/i18n/config";
import { getMessages } from "@/i18n";
import { contact } from "@/content/site";
import { roomsBySlug } from "@/content/rooms";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const m = getMessages(locale);

  return pageMetadata({
    title: m.pageMeta.accessibility.t,
    description: m.pageMeta.accessibility.d,
    path: "/accessibility",
    locale,
  });
}

/* Takes its params now. It never did — rendered under `[locale]` but with no
   way to know which locale, so every string on it was English in all five
   languages. Wiring the photograph's description was what surfaced that; the
   rest of the page is a wider job than this batch. */
export default async function AccessibilityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : defaultLocale;
  const m = getMessages(locale);

  const agapi = roomsBySlug.get("agapi");

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Accessibility", path: "/accessibility" },
        ])}
      />

      <Section ground="paper" size="none" className="pt-[clamp(8rem,14vh,11rem)]">
        <Container>
          <p className="label mb-6 text-[color:var(--fg-3)]">Accessibility</p>
          <Heading level={1} size="d1" className="max-w-[16ch]">
            Plainly, what we can and cannot do
          </Heading>
          <p className="measure-wide mt-7 text-lg text-[color:var(--fg-2)]">
            A medieval old town is not an easy place to make accessible. One
            suite here was built for it properly. The rest of the hotel was not,
            and we would rather say so before you book than after you arrive.
          </p>
        </Container>
      </Section>

      <Section ground="paper" size="md">
        <Container>
          <div className="grid items-start gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-12">
            <figure className="lg:col-span-6">
              <MaskReveal className="aspect-[4/3]">
                <Image
                  src="/media/d61ede4f5d00cd6b090beb09df8b5c5c.webp"
                  alt={m.photoAlt.agapiAccess}
                  width={1200}
                  height={900}
                  sizes="(min-width: 1024px) 48vw, 100vw"
                  quality={80}
                  priority
                  className="graded h-full w-full object-cover"
                />
              </MaskReveal>
            </figure>

            <div className="lg:col-span-6">
              <Reveal>
                <Heading size="d3" className="mb-7 max-w-[16ch]">
                  Agapi
                </Heading>
                <div className="prose-ink measure">
                  <p>
                    Agapi is named for the care invested in its design,
                    particularly for people with special needs. It sits on the
                    ground floor with a private entrance and exit onto the hotel
                    side street, so there is no lobby, no stair and no lift
                    between the street and the room.
                  </p>
                  <p>
                    The bathroom complies with the standards of safe and
                    comfortable hygiene care, and was specially designed for
                    wheelchair users.
                  </p>
                </div>

                <ul className="mt-9 border-t border-[color:var(--hairline)]">
                  {[
                    ["Entrance", "Private, step-free, from the side street"],
                    ["Level", "Ground floor throughout"],
                    ["Bathroom", "Walk-in shower, toilet with grab rails"],
                    ["Floor", "Marble, level"],
                    ["Bed", "King, Coco-Mat mattress"],
                    ["Size", "30 m²"],
                    ["Outside", "Private inner courtyard with the old well"],
                  ].map(([term, def]) => (
                    <li
                      key={term}
                      className="flex items-baseline justify-between gap-6 border-b border-[color:var(--hairline)] py-3.5"
                    >
                      <span className="label text-[color:var(--fg-3)]">
                        {term}
                      </span>
                      <span className="spec text-right">{def}</span>
                    </li>
                  ))}
                </ul>

                {agapi && (
                  <InkLink
                    href={`/rooms/${agapi.slug}`}
                    className="label mt-8 inline-block"
                  >
                    See the suite →
                  </InkLink>
                )}
              </Reveal>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── What we cannot claim ───────────────────────────────────────── */}
      <Section ground="shade" size="md">
        <Container>
          <div className="grid gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Heading size="d3" className="max-w-[16ch]">
                What we do not claim
              </Heading>
            </div>
            <div className="lg:col-span-7">
              <div className="prose-ink measure-wide">
                <p>
                  Agapi is the only room at Ink built for wheelchair users. The
                  other sixteen are in historic buildings of the 1700s, reached
                  by stairs, and we do not describe any of them as accessible.
                </p>
                <p>
                  The old town itself is cobbled and its lanes are narrow. Some
                  routes to our buildings are easier than others. Before you
                  book, please write or call and tell us what you need — we will
                  tell you honestly whether the route into the building works
                  for you, and we would rather lose a booking than have you
                  arrive to a door you cannot get through.
                </p>
              </div>

              <div className="mt-9 flex flex-wrap gap-x-10 gap-y-4">
                <InkAnchor
                  href={contact.phones[0].href}
                  className="label"
                >
                  {contact.phones[0].value}
                </InkAnchor>
                <InkAnchor
                  href={`mailto:${contact.emails.general}`}
                  className="label"
                >
                  {contact.emails.general}
                </InkAnchor>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* ── This website ───────────────────────────────────────────────── */}
      <Section ground="paper" size="md">
        <Container>
          <div className="grid gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Heading size="d3" className="max-w-[16ch]">
                This website
              </Heading>
            </div>
            <div className="lg:col-span-7">
              <div className="prose-ink measure-wide">
                <p>
                  This site is built to WCAG 2.1 AA. Every colour pairing was
                  measured rather than eyeballed, every control is reachable and
                  operable from the keyboard with a visible focus ring, and
                  every photograph carries alt text.
                </p>
                <p>
                  If you have asked your device for reduced motion, nothing here
                  moves: no parallax, no drifting photographs, no scroll-linked
                  light. If something on this site gets in your way, tell us and
                  we will fix it.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
