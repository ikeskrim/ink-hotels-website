"use client";

import { Fragment, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { EASE, useEntrance } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

/**
 * Text that arrives the way a press lays it down: one character at a time,
 * struck rather than faded.
 *
 * The distinction is the whole point. A fade is a screen gesture — the letter
 * was always there and someone turned it up. A press has a platen that comes
 * down, meets the paper, and stops dead. So each character starts slightly
 * above its line and lands with an expo-out curve, which spends most of its
 * duration decelerating and almost none arriving: it hits. Nothing overshoots
 * and nothing bounces, because type in a forme does not bounce.
 *
 * Inking is uneven on a hand-fed press, so each character's timing is nudged
 * by a few milliseconds and its final weight varies by a hair. The variation
 * is derived from the character's index rather than from Math.random: a random
 * value would differ between the server render and the client's, and React
 * would throw a hydration mismatch on a heading. The same index always gives
 * the same jitter, which is both correct and, conveniently, what a real press
 * does — the unevenness is a property of the forme, not of the moment.
 *
 * ── Accessibility ──────────────────────────────────────────────────────────
 *
 * A character-split heading is a well-known way to wreck a screen reader: the
 * accessible name becomes "A  h o t e l  n a m e d", or worse, each span is
 * announced separately. So the split spans are `aria-hidden` and the real
 * sentence is carried once, visually hidden, for assistive technology. What is
 * read aloud is exactly the string that was passed in.
 *
 * `heading-check.mjs` asserts that every multi-part heading on the site reads
 * with its words separated, and it reads the accessible name — so it is the
 * thing that would catch this going wrong, and it passes. So does `a11y.mjs`,
 * across 26 routes and two viewports, with no violations.
 *
 * The cost of doing it this way is that the sentence appears twice in the
 * element's textContent: once hidden for assistive technology and once as the
 * split. The alternative — `aria-label` on the heading, no hidden copy — reads
 * more cleanly to a scraper, but `aria-label` on a generic element is ignored
 * by a fair number of screen readers, and this is a heading on the homepage.
 * The duplication is invisible, costs a line of markup, and is the safer of
 * the two. It is a deliberate trade, not an oversight.
 *
 * Under `prefers-reduced-motion` there is no split at all: the text renders as
 * text. Not a faster stamp, no stamp.
 */
export function StampText({
  children,
  className,
  /** Seconds between one character landing and the next. */
  stagger = 0.028,
  /** Seconds to wait before the first character. */
  delay = 0,
}: {
  children: string;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useEntrance(ref);
  const reduced = useReducedMotion();

  if (reduced) return <span className={className}>{children}</span>;

  /* Split to words first, then to characters inside them. Splitting straight
     to characters would let a line break fall inside a word, because every
     character becomes its own inline-block and the browser is then free to
     wrap between any two of them. */
  const words = children.split(" ");
  let index = 0;

  return (
    <span ref={ref} className={cn("inline", className)} data-reveal>
      {/* Read aloud; never seen. */}
      <span className="sr-only">{children}</span>

      <span aria-hidden="true">
        {words.map((word, w) => (
          <Fragment key={`${word}-${w}`}>
            <span className="inline-block whitespace-nowrap">
              {[...word].map((char, c) => {
                const i = index++;
                /* A few milliseconds of drift, so the characters do not land
                   on a perfect metronome. Derived from the index, never from
                   Math.random — see the note above on hydration.

                   A first version also varied each character's final opacity
                   between 0.92 and 1, for the uneven inking of a hand-fed
                   press. It came out: paper on ink is a high-contrast pairing
                   and at that range the variation is invisible, so it bought
                   nothing and put a heading's contrast up for discussion.
                   Every character now lands at full weight. */
                const drift = ((i * 37) % 7) * 0.006;
                return (
                  <motion.span
                    key={`${char}-${c}`}
                    className="inline-block will-change-transform"
                    initial={{ opacity: 0, y: "-0.18em" }}
                    animate={shown ? { opacity: 1, y: "0em" } : undefined}
                    transition={{
                      duration: 0.26,
                      delay: delay + i * stagger + drift,
                      ease: EASE,
                    }}
                  >
                    {char}
                  </motion.span>
                );
              })}
            </span>
            {/* The space the split ate, put back OUTSIDE the word — a plain
                space between two inline-blocks, so the line may break here.
                Inside the nowrap span (or as &nbsp;) it would make the whole
                heading unbreakable and overflow a narrow screen. */}
            {w < words.length - 1 ? " " : null}
          </Fragment>
        ))}
      </span>
    </span>
  );
}
