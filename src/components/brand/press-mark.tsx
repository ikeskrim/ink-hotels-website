"use client";

import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { EASE } from "@/components/motion/reveal";

/**
 * The mark, pressed.
 *
 * The pen finishes the word and then the press answers it: the thumbprint's
 * rings arrive from slightly above and settle, spreading outward from the
 * centre the way an impression spreads into damp paper — the innermost first,
 * because that is the point of contact.
 *
 * This is the whole argument of the hotel in two seconds. A pen makes a mark
 * by hand; a press makes the same mark a thousand times. The building did the
 * second for a living, and the site is named after the ink both of them use.
 *
 * One transform and one opacity per ring, staggered. Nothing loops: a press
 * strikes once.
 */

const RINGS = [3.6, 8.4, 13.4, 18.6, 24.0, 29.6, 35.4, 41.4];

export function PressMark({
  className,
  delay = 0,
  speed = 1,
  animate = true,
}: {
  className?: string;
  delay?: number;
  speed?: number;
  animate?: boolean;
}) {
  const reduced = useReducedMotion();
  const play = animate && !reduced;

  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label="The Ink mark"
      fill="none"
      className={cn("block overflow-visible", className)}
    >
      <g stroke="currentColor" strokeWidth="3.4">
        {RINGS.map((r, i) => (
          <motion.circle
            key={r}
            cx={54 - i * 1.1}
            cy={54 - i * 0.7}
            r={r}
            initial={
              play
                ? { scale: 0.7, opacity: 0, y: -7 }
                : false
            }
            animate={{ scale: 1, opacity: i === 0 ? 1 : 0.9 - i * 0.055, y: 0 }}
            style={{ transformOrigin: "54px 54px" }}
            transition={{
              duration: play ? 0.72 * speed : 0,
              /* Inner ring first. An impression spreads from where the
                 pressure was, not from the edge inwards. */
              delay: delay + (play ? i * 0.075 * speed : 0),
              ease: EASE,
            }}
          />
        ))}
      </g>
    </svg>
  );
}
