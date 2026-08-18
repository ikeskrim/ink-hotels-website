"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ElementType } from "react";

import { EASE } from "@/components/motion/reveal";

/**
 * A heading that arrives a word at a time, each rising out of its own mask.
 *
 * ── Why this is not GSAP SplitText ─────────────────────────────────────────
 * The plan names SplitText, and it is the right reference for the effect. It
 * is not the right dependency here. GSAP core plus ScrollTrigger plus
 * SplitText is roughly 45 kB gzipped on every page of a site whose homepage
 * already measures 83, and the performance budget is a hard rule where the
 * stack list is a suggestion. Framer Motion is already bundled and does this
 * natively. The effect is identical; the cost is nothing.
 *
 * ── Why words rather than measured lines ───────────────────────────────────
 * A true line split has to render, measure `offsetTop`, group, then re-wrap —
 * and redo all of it on resize, on font swap, and on every locale, because
 * German and Greek break in different places than English. That is a
 * measurement pass on the critical path plus a resize observer, to produce a
 * result a small stagger already implies. Words rise in reading order, so at
 * this stagger the eye reads it as lines anyway.
 *
 * ── The accessible name ────────────────────────────────────────────────────
 * Splitting text into spans destroys the accessible name: a screen reader gets
 * a stream of fragments instead of a heading. So the element carries
 * `aria-label` with the whole string and every fragment is `aria-hidden`. The
 * spaces are real text nodes, not gaps between inline-blocks — without them
 * `textContent` reads "Sevensuitesinthe", which is the exact bug the hero h1
 * had, and `npm run headings` fails the build for it.
 *
 * Reduced motion renders the plain string with no split at all — not a faster
 * animation, no animation and no wrapper spans.
 */
export function SplitReveal({
  text,
  as: Tag = "h2",
  className,
  delay = 0,
  stagger = 0.045,
  once = true,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  /** Seconds between words. Small: this should read as one gesture. */
  stagger?: number;
  once?: boolean;
}) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Tag className={className} aria-label={text}>
      {/* `data-reveal` so the noscript rule in the layout forces it visible:
          with no JavaScript these spans keep their initial transform and the
          heading would sit permanently below its own mask. */}
      <span data-reveal aria-hidden="true">
        {words.map((word, i) => (
          <span key={`${word}-${i}`}>
            <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
              <motion.span
                className="inline-block"
                initial={{ y: "110%" }}
                whileInView={{ y: "0%" }}
                viewport={{ once, margin: "0px 0px -12% 0px" }}
                transition={{
                  duration: 0.85,
                  ease: EASE,
                  delay: delay + i * stagger,
                }}
              >
                {word}
              </motion.span>
            </span>
            {/* A real space in the text stream, outside the mask and between
                the words — not a gap between inline-blocks. */}
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </span>
    </Tag>
  );
}
