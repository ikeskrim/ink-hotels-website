"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/**
 * The nib.
 *
 * A wet ink dot that trails the pointer and blooms into a soft blot over
 * anything clickable — the pool that forms when a pen is held still on paper.
 *
 * ── What it refuses to do ─────────────────────────────────────────────────
 *
 * TOUCH AND COARSE POINTERS: never mounts. A custom cursor on a phone is an
 * invisible object chasing a finger that is already touching the thing it
 * wants. Gated on `(pointer: fine)` and `(hover: hover)` together, because a
 * stylus reports fine without hover and would get a dot it can never see.
 *
 * REDUCED MOTION: never mounts. This is a spring-follow that lags the pointer
 * by design; there is no calmer version of it worth shipping.
 *
 * THE NATIVE CURSOR IS ONLY HIDDEN BY SCRIPT. `data-ink-cursor` is set on
 * <html> from this effect, and the `cursor: none` rule is scoped to that
 * attribute. If the JavaScript fails, is blocked, or is still in flight, the
 * real cursor is exactly where it always was. A stylesheet that hides the
 * pointer before its replacement exists is a site nobody can use.
 *
 * FORM FIELDS KEEP THEIRS. The I-beam tells you where the caret will land and
 * the ink dot does not; text controls opt back out in globals.css.
 *
 * ── Cost ──────────────────────────────────────────────────────────────────
 * Two motion values through one spring, written to `transform` only, so it
 * composites and never touches layout. Framer parks its own rAF loop when the
 * spring settles, so a still pointer costs nothing. The listener is passive.
 */
const INTERACTIVE =
  'a, button, [role="button"], [role="link"], input, select, textarea, label, summary, [data-cursor]';

export function InkCursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [over, setOver] = useState(false);
  const [down, setDown] = useState(false);
  /* Mirrors `visible` for the pointermove handler: reading state there would
     capture the value from the render that installed the listener. */
  const visibleRef = useRef(false);

  /* Raw pointer position, then the same values through a spring. The dot is
     the pen; the lag is the ink catching up with it. */
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 900, damping: 60, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 900, damping: 60, mass: 0.35 });

  useEffect(() => {
    if (reduced) return;
    const fine = window.matchMedia("(pointer: fine) and (hover: hover)");
    const apply = () => setEnabled(fine.matches);
    apply();
    fine.addEventListener("change", apply);
    return () => fine.removeEventListener("change", apply);
  }, [reduced]);

  useEffect(() => {
    if (!enabled) return;

    /* The one place the real cursor is hidden — and it is undone on unmount,
       so switching to a touchscreen or to reduced motion gives it straight
       back. */
    document.documentElement.setAttribute("data-ink-cursor", "");

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
      const el = e.target as Element | null;
      setOver(Boolean(el?.closest?.(INTERACTIVE)));
    };
    const leave = () => {
      visibleRef.current = false;
      setVisible(false);
    };
    const enter = () => {
      visibleRef.current = true;
      setVisible(true);
    };
    const onDown = () => setDown(true);
    const onUp = () => setDown(false);

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", leave);
    document.addEventListener("pointerenter", enter);
    /* Leaving for the browser chrome or another window: the dot should not be
       left stranded mid-page. */
    window.addEventListener("blur", leave);

    return () => {
      document.documentElement.removeAttribute("data-ink-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", leave);
      document.removeEventListener("pointerenter", enter);
      window.removeEventListener("blur", leave);
    };
  }, [enabled, x, y]);

  if (reduced || !enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[400] hidden md:block"
      style={{ x: sx, y: sy }}
    >
      <motion.span
        className="block rounded-full bg-ink"
        style={{ translateX: "-50%", translateY: "-50%" }}
        initial={false}
        animate={{
          width: over ? 34 : 9,
          height: over ? 34 : 9,
          opacity: visible ? (over ? 0.22 : 0.85) : 0,
          scale: down ? 0.82 : 1,
        }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.div>
  );
}
