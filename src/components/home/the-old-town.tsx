import Image from "next/image";
import { blurFor } from "@/content/generated/blur";

import { Container, Heading, Section } from "@/components/ui/section";
import { MaskReveal, Reveal } from "@/components/motion/reveal";
import { InkLink } from "@/components/ui/ink-link";
import { getMessages } from "@/i18n";
import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * A spread: two photographs on different baselines with the text set between
 * them, so the composition reads as facing pages rather than a banded row.
 */
export function TheOldTown({ locale = defaultLocale }: { locale?: Locale }) {
  const m = getMessages(locale);

  return (
    /* Paper again after the dark of the mark section, so the ink bleeds down
       into it rather than stopping at a ruled edge. */
    <Section ground="paper" size="lg" plaster wash="ink">
      <Container>
        <div className="grid gap-[clamp(2rem,5vw,4rem)] lg:grid-cols-12">
          {/* Tall plate, offset down */}
          <figure className="lg:col-span-4 lg:mt-24">
            <MaskReveal className="aspect-[3/4]">
              <Image
                src="/media/0dc83ffb4bd879a312c00e50c8bda2fc.webp"

                placeholder={blurFor("/media/0dc83ffb4bd879a312c00e50c8bda2fc.webp") ? "blur" : "empty"}

                blurDataURL={blurFor("/media/0dc83ffb4bd879a312c00e50c8bda2fc.webp")}
                alt="A narrow lane of the old town, wooden Venetian balconies overhead"
                width={900}
                height={1200}
                sizes="(min-width: 1024px) 32vw, 100vw"
                quality={78}
                className="graded h-full w-full object-cover"
              />
            </MaskReveal>
            <figcaption className="label mt-4 text-[color:var(--fg-3)]">
              {m.home.settingCaptionLanes}
            </figcaption>
          </figure>

          {/* The measure, between the plates */}
          <div className="flex flex-col justify-center lg:col-span-4 lg:px-2">
            <Reveal>
              <p className="label mb-6 text-[color:var(--fg-3)]">
                {m.home.settingEyebrow}
              </p>
              <Heading size="d3" className="mb-8">
                {m.home.settingTitle}
              </Heading>
              <div className="prose-ink">
                <p>{m.home.settingP1}</p>
                <p>{m.home.settingP2}</p>
              </div>
              <InkLink href="/rethymno" className="label mt-9 inline-block">
                {m.nav.rethymno} →
              </InkLink>
            </Reveal>
          </div>

          {/* Wide plate, on the top baseline */}
          <figure className="lg:col-span-4">
            <MaskReveal className="aspect-[4/5]" delay={0.12}>
              <Image
                src="/media/05c09d32efa814812ba4598083de9b4c.webp"

                placeholder={blurFor("/media/05c09d32efa814812ba4598083de9b4c.webp") ? "blur" : "empty"}

                blurDataURL={blurFor("/media/05c09d32efa814812ba4598083de9b4c.webp")}
                alt="The Venetian harbour of Rethymno with its Egyptian lighthouse"
                width={900}
                height={1125}
                sizes="(min-width: 1024px) 32vw, 100vw"
                quality={78}
                className="graded h-full w-full object-cover"
              />
            </MaskReveal>
            <figcaption className="label mt-4 text-[color:var(--fg-3)]">
              {m.home.settingCaptionHarbour}
            </figcaption>
          </figure>
        </div>
      </Container>
    </Section>
  );
}
