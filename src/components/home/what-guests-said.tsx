import { Container, Heading, Section } from "@/components/ui/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { reviews, reviewsForRoom, type Review } from "@/content/reviews";
import { getMessages } from "@/i18n";
import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * What guests said.
 *
 * Renders nothing while `src/content/reviews.ts` is empty, which it is. The
 * component ships now so that adding a real quote is a data change rather than
 * a build, and so the layout is designed before the pressure of having
 * something to put in it.
 *
 * The quote carries a first name, a country, where it was published and the
 * year — the four things that make a quote checkable. A testimonial without
 * them is indistinguishable from copywriting, and readers know it.
 *
 * No star ratings and no aggregate score. Those have to be real numbers the
 * property can evidence; see the note in content/reviews.ts.
 */
function Quote({ review }: { review: Review }) {
  return (
    <figure className="border-t border-[color:var(--hairline)] pt-6">
      <blockquote className="measure font-display text-[length:var(--text-d4)] leading-snug">
        {review.text}
      </blockquote>
      <figcaption className="spec mt-5 text-[color:var(--fg-3)]">
        {review.name} · {review.country}
        <span aria-hidden="true"> · </span>
        {review.platform === "direct" ? null : `${review.platform} `}
        {review.year}
      </figcaption>
    </figure>
  );
}

export function WhatGuestsSaid({
  locale = defaultLocale,
}: {
  locale?: Locale;
}) {
  if (!reviews.length) return null;
  const m = getMessages(locale);

  return (
    <Section ground="sun" size="md">
      <Container>
        <Heading size="d3" className="mb-10 max-w-[18ch]">
          {m.home.guestsTitle}
        </Heading>
        <RevealGroup className="grid gap-x-[clamp(2rem,4vw,4rem)] gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 6).map((r) => (
            <RevealItem key={`${r.name}-${r.year}-${r.text.slice(0, 12)}`}>
              <Quote review={r} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}

/** One quote on a room page, where the room has one. */
export function RoomQuote({
  slug,
  locale = defaultLocale,
}: {
  slug: string;
  locale?: Locale;
}) {
  const forRoom = reviewsForRoom(slug);
  const first = forRoom[0];
  if (!first) return null;
  const m = getMessages(locale);

  return (
    <Section ground="sun" size="sm">
      <Container>
        <p className="label mb-6 text-[color:var(--fg-3)]">
          {m.home.guestsTitle}
        </p>
        <Quote review={first} />
      </Container>
    </Section>
  );
}
