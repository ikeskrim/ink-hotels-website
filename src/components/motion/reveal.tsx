"use client";

import { type ReactNode, type RefObject, useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Shared easing — a slow, confident settle. Used everywhere so motion feels of one hand. */
export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

/**
 * How early an entrance fires.
 *
 * A POSITIVE bottom margin grows the observer's root past the fold, so an
 * element begins its entrance while it is still below the screen and has
 * finished by the time it is properly in view. The earlier version shrank the
 * root by 12% top and bottom, which meant a section had to be an eighth of a
 * viewport inside the screen before it would even start — on a tall section
 * that reads as scrolling through empty paper waiting for something to happen.
 */
const ENTRANCE_MARGIN = "0px 0px 14% 0px";

/**
 * Entrance state that cannot get stuck.
 *
 * `useInView` alone is not enough, because IntersectionObserver only delivers
 * while the page is actually rendering. Two ordinary situations produce no
 * callback at all, and in both the content stays at `opacity: 0` forever:
 *
 * - The page is opened in a BACKGROUND tab (cmd-click, "open link in new tab",
 *   a restored session). Nothing renders, so nothing intersects, and switching
 *   to the tab shows blank paper until the reader scrolls.
 * - The reader arrives at an in-page anchor or a restored scroll position, and
 *   the element is ABOVE the viewport. It will never enter from below, so it
 *   will never be reported.
 *
 * So the observer is treated as the fast path, not the only path: anything at
 * or above the fold is shown on mount, and the check runs again whenever the
 * tab becomes visible.
 */
export function useEntrance(ref: RefObject<Element | null>, once = true) {
  const inView = useInView(ref, { once, margin: ENTRANCE_MARGIN });
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      const { top } = el.getBoundingClientRect();
      if (top < window.innerHeight * 1.15) setSettled(true);
    };

    check();
    const onVisible = () => {
      if (!document.hidden) check();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [ref]);

  return inView || settled;
}

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before starting. */
  delay?: number;
  /** How far it travels, in px. */
  distance?: number;
  once?: boolean;
}

/**
 * The base reveal: a short rise and fade as an element enters.
 * Under prefers-reduced-motion it renders statically — no transform, no fade.
 *
 * Always a div. Where semantics matter, wrap this in the semantic element
 * rather than making the motion component polymorphic — that keeps the ref
 * types sane and the markup explicit.
 *
 * `data-reveal` is the hook the no-JavaScript stylesheet uses to force every
 * entrance to its finished state. Without it, a reader with scripting off — or
 * one whose bundle failed — would be served a page of invisible text.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 28,
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useEntrance(ref, once);
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      data-reveal
      className={className}
      initial={{ opacity: 0, y: distance }}
      animate={shown ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Image mask reveal: the photograph is uncovered by a wipe while it settles back
 * from a slight scale. This is the site's signature entrance for photography.
 */
export function MaskReveal({
  children,
  className,
  delay = 0,
  direction = "up",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useEntrance(ref);
  const reduced = useReducedMotion();

  const closed = {
    up: "inset(100% 0% 0% 0%)",
    down: "inset(0% 0% 100% 0%)",
    left: "inset(0% 0% 0% 100%)",
    right: "inset(0% 100% 0% 0%)",
  }[direction];

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <motion.div
        data-reveal
        initial={{ clipPath: closed, scale: 1.12 }}
        animate={
          shown ? { clipPath: "inset(0% 0% 0% 0%)", scale: 1 } : undefined
        }
        transition={{
          clipPath: { duration: 1.05, delay, ease: EASE },
          scale: { duration: 1.5, delay, ease: EASE },
        }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Staggers direct children as a group. Pair with `RevealItem`. */
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const shown = useEntrance(ref);
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={shown || reduced ? "shown" : "hidden"}
      variants={{
        hidden: {},
        shown: {
          transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
  distance = 24,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      data-reveal
      className={className}
      variants={{
        hidden: reduced ? {} : { opacity: 0, y: distance },
        shown: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}
