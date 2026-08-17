"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { EASE } from "@/components/motion/reveal";

/**
 * The name, written.
 *
 * A nib crosses the page; the word appears behind it; a swash follows and
 * flicks up at the end. It is the building's whole trade in three seconds —
 * type, pressure, an impression left behind — and it is the one place on the
 * site where the mark is made rather than displayed.
 *
 * HOW IT IS BUILT, AND WHY NOT THE OBVIOUS WAY
 *
 * The obvious way is to hand-author a cursive path and stroke it on. Doing
 * that well means drawing a signature by hand in path data, and doing it
 * badly means letterforms that wobble — an amateur hand under a masthead set
 * in a 1592 garalde. So the word itself is REAL TYPE, set in the site's own
 * display italic, and it is revealed by a wipe travelling at the nib's tip.
 * The swash beneath IS a stroked path, drawn with `pathLength`, because a
 * flourish is a gesture and has no letterforms to get wrong.
 *
 * Everything animated is a transform, a clip width or a dash offset. Under
 * `prefers-reduced-motion` it renders finished: the word, the swash, no nib.
 */
export function InkSignature({
  className,
  animate = true,
  delay = 0,
  speed = 1,
  onDone,
}: {
  className?: string;
  /** False renders the finished mark — the footer's static version. */
  animate?: boolean;
  delay?: number;
  /**
   * Time multiplier. Above 1 is slower — the Story page writes at 1.45, where
   * the animation is the thing you came for. Below 1 is faster: a phone gets
   * 0.62 so the whole gesture is over inside two and a half seconds, because
   * a hand writing slowly on a small screen is a hand you scroll past.
   */
  speed?: number;
  /** Fires when the swash lands, so a caller can follow it with something. */
  onDone?: () => void;
}) {
  const reduced = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const clipId = `ink-sig-${uid}`;
  const play = animate && !reduced;

  /* The wipe, the nib and the swash all read from these, so the nib can never
     drift away from the edge it is supposed to be drawing. */
  const WRITE = 1.9 * speed;
  const NIB_FROM = 26;
  const NIB_TO = 250;

  return (
    <svg
      viewBox="0 0 320 176"
      role="img"
      aria-label="Ink"
      className={cn("block overflow-visible", className)}
    >
      <defs>
        <clipPath id={clipId}>
          <motion.rect
            x="0"
            y="0"
            height="176"
            initial={play ? { width: 0 } : false}
            animate={{ width: 320 }}
            transition={{ duration: play ? WRITE : 0, delay, ease: EASE }}
          />
        </clipPath>
      </defs>

      {/* The word, in the site's own italic — real letterforms, revealed. */}
      <g clipPath={`url(#${clipId})`}>
        <text
          x="8"
          y="118"
          fontSize="132"
          fontStyle="italic"
          fill="currentColor"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Ink
        </text>
      </g>

      {/* The swash. A real stroked path, drawn rather than wiped. */}
      <motion.path
        d="M 14 146 C 70 158 150 158 216 140 C 236 134 248 128 254 120"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        opacity={0.75}
        initial={play ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{
          duration: play ? 1.05 * speed : 0,
          delay: delay + (play ? WRITE * 0.72 : 0),
          ease: EASE,
        }}
        onAnimationComplete={onDone}
      />

      {/* The nib. Present only while it is writing. */}
      {play && (
        <motion.g
          aria-hidden="true"
          initial={{ x: NIB_FROM, opacity: 0 }}
          animate={{
            x: [NIB_FROM, NIB_TO, NIB_TO],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: WRITE * 1.15,
            delay,
            ease: EASE,
            times: [0, 0.86, 1],
          }}
        >
          <g transform="translate(0 112) rotate(24)">
            {/* A nib: a slim leaf with a slit and a breather hole. */}
            <path
              d="M 0 0 L 9 -34 L 18 0 L 9 13 Z"
              fill="currentColor"
              opacity={0.9}
            />
            <path d="M 9 -22 L 9 4" stroke="var(--bg, #faf5ea)" strokeWidth="1.6" />
            <circle cx="9" cy="-8" r="2.4" fill="var(--bg, #faf5ea)" />
          </g>
        </motion.g>
      )}
    </svg>
  );
}
