import { Container, Heading, Section, SectionHead } from "@/components/ui/section";
import { InkLink } from "@/components/ui/ink-link";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { experiences } from "@/content/experiences";
import { getExperienceGroups, getExperiences } from "@/lib/sanity/content";
import { folio } from "@/lib/utils";
import { getMessages } from "@/i18n";
import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * A classified list rather than a card grid.
 *
 * There is exactly one photograph per experience in the library, so an image
 * grid here would be thin and repetitive — twenty-one near-identical tiles.
 * Set as classifieds, the list reads as a concierge's index, which is what it
 * actually is, and the Greek headings are set in the display face because it
 * carries real Greek.
 */
export async function WhatWeArrange({ locale = defaultLocale }: { locale?: Locale }) {
  const m = getMessages(locale);
  /* Through the content layer, not the local module. The group titles and
     blurbs are translated in the overlay; reading the raw array here printed
     four English paragraphs into the middle of every non-English homepage. */
  const groups = await getExperienceGroups(locale);
  const all = await getExperiences(locale);

  return (
    <Section id="experiences" ground="shade" size="lg" chapter="02">
      <Container>
        <SectionHead
          index={2}
          eyebrow={m.home.arrangeEyebrow}
          className="mb-[clamp(3rem,6vw,5rem)]"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <Heading split size="d2" className="max-w-[15ch]">
              {m.home.arrangeTitle}
            </Heading>
            <p className="measure text-[color:var(--fg-2)]">
              {m.home.arrangeLede}
            </p>
          </div>
        </SectionHead>

        <RevealGroup className="grid gap-x-[clamp(2rem,5vw,5rem)] lg:grid-cols-2">
          {groups.map((group, i) => {
            const items = all.filter((e) => e.category === group.id);
            return (
              <RevealItem key={group.id}>
                <div className="border-t border-[color:var(--border)] py-8 lg:py-10">
                  <div className="flex items-baseline gap-5">
                    <span className="spec text-[color:var(--fg-3)]" aria-hidden="true">
                      {folio(i + 1)}
                    </span>
                    <div className="flex-1">
                      <h3 className="font-display text-[length:var(--text-d4)] leading-tight">
                        {group.title}
                        <span className="ml-3 align-baseline text-[0.5em] text-[color:var(--fg-3)]">
                          {group.greek}
                        </span>
                      </h3>
                      <p className="measure mt-3 text-[color:var(--fg-2)]">
                        {group.blurb}
                      </p>
                      <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                        {items.map((item) => (
                          <li key={item.slug}>
                            <InkLink
                              href={`/experiences/${item.slug}`}
                              className="spec text-[color:var(--fg-3)] hover:text-[color:var(--fg)]"
                            >
                              {item.title}
                            </InkLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </RevealGroup>

        <div className="mt-4 flex items-baseline justify-between gap-6 border-t border-[color:var(--hairline)] pt-8">
          <InkLink href="/experiences" className="label">
            {m.actions.allExperiences.replace("{count}", String(experiences.length))} →
          </InkLink>
        </div>
      </Container>
    </Section>
  );
}
