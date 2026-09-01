import { Container, Heading, Section } from "@/components/ui/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import {
  hasReviews,
  MINIMUM_TO_SHOW,
  reviews,
  reviewsForRoom,
  type Review,
} from "@/content/reviews";
import { getMessages } from "@/i18n";
import { defaultLocale, type Locale } from "@/i18n/config";

/**
 * What guests said.
 *
 * Renders nothing until `src/content/reviews.ts` holds at least six quotes,
 * which it does not yet. The component ships ahead of them so that adding a
 * real quote is a data change rather than a build, and so the layout is
 * designed before the pressure of having something to put in it.
 *
 * The threshold is the owner's and lives in the content file, not here: three
 * quotes in a grid built for six reads as a section that lost something.
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
  if (!hasReviews) return null;
  const m = getMessages(locale);

  return (
    <Section name="WhatGuestsSaid" ground="sun" size="md">
      <Container>
        <Heading size="d3" className="mb-10 max-w-[18ch]">
          {m.home.guestsTitle}
        </Heading>
        <RevealGroup className="grid gap-x-[clamp(2rem,4vw,4rem)] gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, MINIMUM_TO_SHOW).map((r) => (
            <RevealItem key={`${r.name}-${r.year}-${r.text.slice(0, 12)}`}>
              <Quote review={r} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}

/**
 * The quotes on one room's page.
 *
 * All of them, up to three, rather than one at a time. The owner asked for the
 * three Harmony quotes to rotate, and a statically rendered page has nothing
 * to rotate on: no request, no clock, no seed. Anything that looked like
 * rotation would either break static generation or be a random pick that
 * changes on redeploy for no reason a reader could perceive. Three quotes
 * about the same suite, all visible, is the stronger page anyway — one
 * testimonial reads as the one they had, three read as a pattern.
 *
 * If genuine one-at-a-time rotation is wanted later it needs a client
 * component or per-request rendering, and that is a trade worth stating
 * before making.
 */
export function RoomQuote({
  slug,
  locale = defaultLocale,
}: {
  slug: string;
  locale?: Locale;
}) {
  const forRoom = reviewsForRoom(slug).slice(0, 3);
  if (!forRoom.length) return null;
  const m = getMessages(locale);

  return (
    <Section ground="sun" size="sm">
      <Container>
        <p className="label mb-6 text-[color:var(--fg-3)]">
          {m.home.guestsTitle}
        </p>
        <RevealGroup
          className={
            forRoom.length > 1
              ? "grid gap-x-[clamp(2rem,4vw,4rem)] gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
              : undefined
          }
        >
          {forRoom.map((r) => (
            <RevealItem key={`${r.name}-${r.year}`}>
              <Quote review={r} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
