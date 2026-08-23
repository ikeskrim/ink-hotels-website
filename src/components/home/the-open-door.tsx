import Image from "next/image";
import { blurFor } from "@/content/generated/blur";

import { Container, Heading, Section } from "@/components/ui/section";
import { MaskReveal, Reveal } from "@/components/motion/reveal";
import { InkLink } from "@/components/ui/ink-link";
import { Gk } from "@/components/ui/greek";
import { getMessages } from "@/i18n";
import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * Agapi — the open door.
 *
 * A genuinely accessible suite in a medieval old town is rare, and no
 * competitor in Rethymno's old town can match it. Leaving it buried in a room
 * list is both a conversion loss and an inclusion failure, so it gets a
 * section, a page and a filter of its own.
 *
 * The copy is plain and unsentimental. Nothing is claimed for any other room,
 * because accessibility is evidenced for this one and no other.
 */
export function TheOpenDoor({ locale = defaultLocale }: { locale?: Locale }) {
  const m = getMessages(locale);

  return (
    <Section name="TheOpenDoor" ground="paper" size="lg" wash="night">
      <Container>
        <div className="grid items-center gap-[clamp(2.5rem,6vw,5rem)] lg:grid-cols-12">
          <div className="order-2 lg:order-1 lg:col-span-5">
            <Reveal>
              <p className="label mb-6 flex items-baseline gap-2.5 text-[color:var(--fg-3)]">
                Agapi <span aria-hidden="true">·</span> <Gk>Αγάπη</Gk>{" "}
                <span>{m.home.agapiMeaning}</span>
              </p>
              <Heading size="d3" className="mb-8 max-w-[18ch]">
                {m.home.agapiTitle}
              </Heading>
              <div className="prose-ink measure">
                <p>{m.home.agapiP1}</p>
                <p>{m.home.agapiP2}</p>
              </div>

              <ul className="mt-9 grid gap-2.5 sm:grid-cols-2">
                {[
                  m.home.agapiFeatureEntrance,
                  m.home.agapiFeatureShower,
                  m.home.agapiFeatureRails,
                  m.home.agapiFeatureGround,
                ].map((item) => (
                  <li
                    key={item}
                    className="spec flex items-baseline gap-3 text-[color:var(--fg-2)]"
                  >
                    <span
                      aria-hidden="true"
                      className="block h-px w-4 shrink-0 translate-y-[-0.3em] bg-[color:var(--border)]"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-4">
                <InkLink href="/rooms/agapi" className="label">
                  Agapi →
                </InkLink>
                <InkLink
                  href="/accessibility"
                  className="label text-[color:var(--fg-3)]"
                >
                  {m.nav.accessibility} →
                </InkLink>
              </div>
            </Reveal>
          </div>

          <figure className="order-1 lg:order-2 lg:col-span-7">
            <MaskReveal className="aspect-[4/3]">
              <Image
                src="/media/d61ede4f5d00cd6b090beb09df8b5c5c.webp"

                placeholder={blurFor("/media/d61ede4f5d00cd6b090beb09df8b5c5c.webp") ? "blur" : "empty"}

                blurDataURL={blurFor("/media/d61ede4f5d00cd6b090beb09df8b5c5c.webp")}
                alt={m.photoAlt.agapiStepFree}
                width={1400}
                height={1050}
                sizes="(min-width: 1024px) 58vw, 100vw"
                quality={80}
                className="graded h-full w-full object-cover"
              />
            </MaskReveal>
          </figure>
        </div>
      </Container>
    </Section>
  );
}
