"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { EASE } from "@/components/motion/reveal";

/**
 * A blot.
 *
 * The nib was held too long in one place and the ink went where it wanted:
 * an irregular pool with a few thrown droplets around it, spreading once and
 * stopping. It is drawn rather than photographed so it takes `currentColor`
 * and costs nothing.
 *
 * The edge is deliberately not a circle. A round blot reads as a bullet point;
 * ink meeting paper is pulled about by the fibre, so the outline is a single
 * closed path with uneven lobes, and a turbulence filter roughens it further.
 */
export function InkBlot({
  className,
  animate = true,
}: {
  className?: string;
  animate?: boolean;
}) {
  const reduced = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const filterId = `blot-${uid}`;
  const play = animate && !reduced;

  return (
    <svg
      viewBox="0 0 240 200"
      role="presentation"
      aria-hidden="true"
      className={cn("block overflow-visible", className)}
    >
      <defs>
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.035"
            numOctaves="3"
            seed="9"
            result="n"
          />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="11" />
        </filter>
      </defs>

      <motion.g
        filter={`url(#${filterId})`}
        fill="currentColor"
        initial={play ? { scale: 0.55, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        style={{ transformOrigin: "112px 104px" }}
        transition={{ duration: play ? 1.1 : 0, ease: EASE }}
      >
        {/* The pool. One closed path, lobed rather than round. */}
        <path d="M112 26c26 0 44 12 55 30 12 20 27 26 26 46-1 22-20 34-38 44-19 11-33 24-53 22-22-2-34-20-49-33-14-13-28-24-27-43 1-20 19-30 35-42 16-12 30-24 51-24z" />
        {/* Thrown droplets — the ones that leave the pen before the pool sets. */}
        <circle cx="196" cy="46" r="7" />
        <circle cx="214" cy="72" r="4" />
        <circle cx="34" cy="146" r="6" />
        <circle cx="20" cy="118" r="3.4" />
        <circle cx="158" cy="182" r="4.6" />
      </motion.g>
    </svg>
  );
}

/**
 * A rule drawn by a pen: it grows from the left as if underlined by hand, with
 * a slight rise at the end where the nib leaves the paper.
 */
export function PenUnderline({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();

  return (
    <svg
      viewBox="0 0 320 24"
      role="presentation"
      aria-hidden="true"
      className={cn("block", className)}
      preserveAspectRatio="none"
    >
      <motion.path
        d="M4 16C60 9 132 6 196 8c40 1 78 4 120 1"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        initial={reduced ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: reduced ? 0 : 1.1, delay, ease: EASE }}
      />
    </svg>
  );
}
