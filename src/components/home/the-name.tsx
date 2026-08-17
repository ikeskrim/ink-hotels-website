"use client";

import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { Container, Heading, Section } from "@/components/ui/section";
import { InkLink } from "@/components/ui/ink-link";
import { TheWriting } from "@/components/brand/the-writing";
import { EASE, useEntrance } from "@/components/motion/reveal";
import { useI18n } from "@/i18n/provider";
import { localePath } from "@/i18n/config";

/**
 * The name — set as a title page.
 *
 * The word is INK, at masthead scale, between two rules with a colophon
 * beneath: the composition a printer would have used for the front of a book
 * he was proud of.
 *
 * The letters arrive one at a time, each rising a few pixels and settling —
 * the motion of type being locked into a forme, not of a logo animating. The
 * rules draw outward from the centre first, because that is the order the
 * furniture goes in around the type.
 *
 * The newspaper's own name is deliberately not set at display scale. It is a
 * true and good detail, but four Greek capitals as the largest thing on an
 * international hotel's homepage asks the reader to decode rather than to
 * feel. It belongs in the prose, where it reads as provenance.
 */

const LETTERS = ["I", "N", "K"];

/**
 * Two ways of making the same mark.
 *
 * `masthead` is the homepage: the letters rise into a forme, one at a time,
 * between two rules. It is quick, it is type being locked up, and it does not
 * hold the reader.
 *
 * `written` is the Story page, where the reader has come for the story: a nib
 * crosses the page and writes the word by hand, then the press answers with
 * the thumbprint beside it. Pen, ink, press — the argument the whole hotel is
 * named after, performed once, slowly, in the place that explains it.
 */
export function TheName({ mode = "masthead" }: { mode?: "masthead" | "written" }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useEntrance(ref);
  const reduced = useReducedMotion();
  const { m, locale } = useI18n();

  return (
    <Section id="the-name" ground="ink" size="lg" className="relative overflow-hidden">
      {/* A single sheet of light falling across the upper page, so the dark
          ground is lit rather than merely dark. */}
      <div
        aria-hidden="true"
        data-decorative
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(70% 45% at 50% 0%, rgb(245 201 123 / 0.16) 0%, transparent 68%)",
        }}
      />

      <Container className="relative">
        <div className="mx-auto max-w-3xl text-center">
          <motion.p
            data-reveal
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="label mb-9 text-olive"
          >
            {m.home.pressEyebrow}
          </motion.p>

          <Heading size="d3" className="mb-8 text-balance text-paper">
            {m.home.pressTitle}
          </Heading>

          <p className="font-display text-[length:var(--text-d4)] italic text-phos">
            {m.home.pressLede}
          </p>
        </div>

        {/* ── The writing, on the page that explains it ─────────────────── */}
        {mode === "written" && <TheWriting />}

        {/* ── The title page ───────────────────────────────────────────── */}
        {mode === "masthead" && (
        <div ref={ref} className="mx-auto mt-[clamp(3.5rem,9vh,7rem)] max-w-4xl">
          <motion.div
            aria-hidden="true"
            data-reveal
            initial={reduced ? false : { scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : undefined}
            transition={{ duration: 1.2, ease: EASE }}
            className="h-px w-full origin-center bg-paper/25"
          />

          <h3 className="flex justify-center py-[clamp(0.5rem,2.5vh,2rem)]">
            <span className="sr-only">Ink</span>
            <span
              aria-hidden="true"
              className="font-display flex text-[length:var(--text-masthead)] leading-[0.9] tracking-[0.14em] text-phos"
            >
              {LETTERS.map((letter, i) => (
                <span
                  key={letter}
                  className="block overflow-hidden pb-[0.06em]"
                >
                  <motion.span
                    className="block"
                    data-reveal
                    initial={reduced ? false : { y: "115%" }}
                    animate={inView ? { y: "0%" } : undefined}
                    transition={{
                      duration: 1.1,
                      delay: reduced ? 0 : 0.15 + i * 0.13,
                      ease: EASE,
                    }}
                  >
                    {letter}
                  </motion.span>
                </span>
              ))}
            </span>
          </h3>

          <motion.div
            aria-hidden="true"
            data-reveal
            initial={reduced ? false : { scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : undefined}
            transition={{ duration: 1.2, delay: reduced ? 0 : 0.12, ease: EASE }}
            className="h-px w-full origin-center bg-paper/25"
          />

          <motion.p
            data-reveal
            initial={reduced ? false : { opacity: 0 }}
            animate={inView ? { opacity: 1 } : undefined}
            transition={{ duration: 0.9, delay: reduced ? 0 : 0.9, ease: EASE }}
            className="spec mt-6 text-center text-olive"
          >
            {m.home.pressImprint}
          </motion.p>
        </div>
        )}

        {/* ── The provenance ───────────────────────────────────────────── */}
        <motion.div
          data-reveal
          initial={reduced ? false : { opacity: 0, y: 22 }}
          animate={inView || mode === "written" ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1, delay: reduced ? 0 : 0.75, ease: EASE }}
          className="mx-auto mt-[clamp(3rem,7vh,5rem)] max-w-5xl"
        >
          {/* Two columns with a rule between them, as a broadsheet would set
              them — the first drop-capped, because this is where the story
              actually begins. */}
          <div className="prose-ink grid gap-x-[clamp(2rem,5vw,4rem)] gap-y-7 md:grid-cols-2 md:divide-x md:divide-paper/12">
            <p className="[&::first-letter]:float-left [&::first-letter]:mr-2.5 [&::first-letter]:mt-1 [&::first-letter]:font-display [&::first-letter]:text-[3.1em] [&::first-letter]:leading-[0.78] [&::first-letter]:text-phos">
              {m.home.pressBody1}
            </p>
            <p className="md:pl-[clamp(2rem,5vw,4rem)]">{m.home.pressBody2}</p>
          </div>

          <p className="measure-wide mx-auto mt-14 text-center font-display text-[length:var(--text-d3)] leading-[1.08] text-paper">
            {m.home.pressPull}
          </p>

          <p className="mt-11 text-center">
            <InkLink
              href={localePath(locale, "/story")}
              className="label text-[color:var(--link)]"
            >
              {m.actions.readStory} →
            </InkLink>
          </p>
        </motion.div>
      </Container>
    </Section>
  );
}
