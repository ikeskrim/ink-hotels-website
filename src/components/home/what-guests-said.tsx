import { Container, Heading, Section } from "@/components/ui/section";
import { RevealGroup, RevealItem } from "@/components/motion/reveal";
import { hasReviews, STRIP_MAX } from "@/content/reviews";
import { localiseReviews, type LocalisedReview } from "@/i18n/content";
import { getMessages } from "@/i18n";
import type { Messages } from "@/i18n/messages/en";
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
/**
 * The sentence that goes under a gloss, chosen by what the guest wrote in.
 *
 * Whole sentences rather than a language name dropped into a template: French
 * contracts "de" and "le" into "du", so "Traduit de {language}" cannot be made
 * to produce "Traduit du grec". A language this map does not know produces no
 * line at all, which is the safe failure — silence rather than a claim about a
 * language nobody has written the sentence for.
 */
const TRANSLATION_NOTE: Record<string, (m: Messages) => string> = {
  en: (m) => m.common.translatedFromEnglish,
  el: (m) => m.common.translatedFromGreek,
};

function Quote({
  review,
  locale,
}: {
  review: LocalisedReview;
  locale: Locale;
}) {
  const m = getMessages(locale);
  const note = TRANSLATION_NOTE[review.originalLanguage]?.(m);

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
        {/* Said plainly, under the quote it applies to. A reader who wants the
            guest's own words knows to look at the source, and a reader who
            does not at least knows these are not quite them. Only shown when a
            gloss was actually used — a quote with no translation available is
            the English original and does not claim otherwise. */}
        {review.translated && note ? (
          <>
            <br />
            <span className="italic">{note}</span>
          </>
        ) : null}
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
  const shown = localiseReviews(locale).slice(0, STRIP_MAX);

  return (
    <Section name="WhatGuestsSaid" ground="sun" size="md">
      <Container>
        <Heading size="d3" className="mb-10 max-w-[18ch]">
          {m.home.guestsTitle}
        </Heading>
        <RevealGroup className="grid gap-x-[clamp(2rem,4vw,4rem)] gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((r) => (
            <RevealItem key={`${r.name}-${r.year}`}>
              <Quote review={r} locale={locale} />
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
  const forRoom = localiseReviews(locale)
    .filter((r) => r.roomSlug === slug)
    .slice(0, 3);
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
              <Quote review={r} locale={locale} />
            </RevealItem>
          ))}
        </RevealGroup>
      </Container>
    </Section>
  );
}
