"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

import { InkSignature } from "@/components/brand/ink-signature";
import { PressMark } from "@/components/brand/press-mark";
import { EASE } from "@/components/motion/reveal";
import { useI18n } from "@/i18n/provider";

/**
 * Pen, ink, press.
 *
 * The Story page's centrepiece. A nib crosses the page and writes the word by
 * hand; the swash lands; and then the press answers it — the thumbprint's
 * rings strike the paper beside the word, spreading from the point of contact.
 * The two gestures are the same act three hundred years apart, and this is the
 * only place on the site that says so without words.
 *
 * IT REPLAYS. `once: false` on the observer, and a run counter that remounts
 * the two marks by key: React restarts an animation when the key changes, so
 * scrolling away and back writes it again. A performance you can only ever see
 * once is a performance most readers miss.
 *
 * Timing is not fixed. A phone runs at 0.62× so the whole thing — nib, wipe,
 * swash, press — is over inside about two and a half seconds; a desktop runs
 * at 1.45×, slow enough to watch. Under `prefers-reduced-motion` nothing moves:
 * the finished word and the finished mark are simply there.
 *
 * ── `scrub`: the reader holds the pen ──────────────────────────────────────
 * On the Story page the hand is driven by scroll position rather than a clock.
 * The block pins for a screen and a half while the nib crosses, so the word is
 * written at the reader's own pace — and unwritten if they scroll back up,
 * which is the whole argument for scrubbing over playing: the gesture belongs
 * to the reader, not to a timer they happened to arrive in the middle of.
 *
 * The press still answers rather than scrubs. An impression is instantaneous —
 * a platen either has struck the paper or has not — so it fires once when the
 * hand passes 72% and does not run backwards with the scroll.
 */
export function TheWriting({ scrub = false }: { scrub?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  /* Not `once`. The whole point is that it can be watched twice. */
  const inView = useInView(ref, { margin: "0px 0px -30% 0px" });
  const reduced = useReducedMotion();
  const { m } = useI18n();

  const [run, setRun] = useState(0);
  const [small, setSmall] = useState(false);
  const [struck, setStruck] = useState(false);

  /* The track is always mounted so this hook is never conditional; when the
     block is not scrubbing the track is a plain wrapper of its own height and
     the progress it reports goes unread. */
  const { scrollYProgress } = useScroll({
    target: track,
    offset: ["start start", "end end"],
  });
  /* The hand uses the first 78% of the pin, leaving the last fifth as a beat
     to look at the finished mark before the block releases. */
  const hand = useTransform(scrollYProgress, [0, 0.78], [0, 1], { clamp: true });

  useMotionValueEvent(hand, "change", (v) => {
    /* Latched, not toggled: crossing back under 72% must not un-strike a
       press that has already landed. It resets only when the reader leaves
       the block entirely, which the entrance observer below handles. */
    if (v > 0.72 && !struck) setStruck(true);
  });

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const sync = () => setSmall(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (inView) setRun((r) => r + 1);
  }, [inView]);

  const speed = small ? 0.62 : 1.45;
  /* The press waits for the hand to finish. `WRITE` inside the signature is
     1.9 × speed and the swash starts at 72% of it and runs 1.05 × speed. */
  const pressDelay = 1.9 * speed * 0.72 + 1.05 * speed * 0.55;

  const playing = run > 0 && !reduced;
  /* Reduced motion gets neither a clock nor a scroll-driven hand. */
  const scrubbing = scrub && !reduced;

  return (
    <div
      ref={track}
      className={
        scrubbing
          ? "relative mt-[clamp(3rem,8vh,6rem)] h-[240vh]"
          : "mt-[clamp(3rem,8vh,6rem)]"
      }
    >
    <div
      ref={ref}
      className={
        scrubbing
          ? "sticky top-0 mx-auto flex h-screen max-w-4xl flex-col items-center justify-center"
          : "mx-auto flex max-w-4xl flex-col items-center"
      }
    >
      <div className="flex w-full items-end justify-center gap-[clamp(1.5rem,5vw,4rem)]">
        <InkSignature
          key={scrubbing ? "sig-scrub" : `sig-${run}`}
          animate={playing}
          speed={speed}
          delay={0.2}
          progress={scrubbing ? hand : undefined}
          className="h-[clamp(5rem,17vw,11rem)] w-auto shrink-0 text-phos"
        />

        {/* The press, answering. Decorative: the word beside it already names
            the hotel, and a screen reader that meets "Ink" twice in a row has
            been told nothing the second time. */}
        <PressMark
          key={scrubbing ? `press-strike-${struck}` : `press-${run}`}
          animate={scrubbing ? struck : playing}
          speed={scrubbing ? 1 : speed}
          delay={scrubbing ? 0 : pressDelay}
          aria-hidden="true"
          className="h-[clamp(3rem,9vw,6rem)] w-auto shrink-0 text-paper/70"
        />
      </div>

      {/* The colophon fades in once and then stays.
          It used to be remounted by the run key like the two marks above it,
          which meant every re-entry put it back to `opacity: 0` and started
          another three-and-a-half-second wait — so a reader scrolling up and
          back down watched the imprint vanish. The marks replay because the
          performance is the point; a line of type does not. */}
      <motion.p
        data-reveal
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: run > 0 || reduced ? 1 : 0 }}
        transition={{
          duration: 0.9,
          /* Only the first run waits for the press to land. */
          delay: run === 1 && !reduced ? pressDelay + 0.7 : 0,
          ease: EASE,
        }}
        className="spec mt-[clamp(1.5rem,4vh,2.5rem)] text-center text-olive"
      >
        {m.home.pressImprint}
      </motion.p>
    </div>
    </div>
  );
}
