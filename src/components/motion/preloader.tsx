"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { EASE } from "@/components/motion/reveal";

/**
 * The impression.
 *
 * A sheet of paper over the page, an ink mark pressed into it, and then the
 * sheet lifts away upward — the gesture a platen makes coming off a forme.
 * It is the one piece of motion on this site that exists purely to set a tone,
 * so it is also the one held to the strictest rules.
 *
 * ── Four rules it obeys ────────────────────────────────────────────────────
 *
 * ONCE PER SESSION. Held in `sessionStorage`, so a guest comparing four room
 * pages sees it once, not four times. The second viewing of a preloader is not
 * atmosphere, it is a toll.
 *
 * NEVER BLOCKS THE PAGE. The page renders underneath from the first byte; this
 * is an overlay that leaves. If the JavaScript never arrives, there is nothing
 * to remove and the site is simply there — which is why the markup is not
 * hidden behind it.
 *
 * REDUCED MOTION SKIPS IT ENTIRELY. Not a faster version: no overlay at all.
 * A full-screen wipe is exactly what someone with vestibular sensitivity has
 * asked not to be shown.
 *
 * IT CANNOT STRAND ANYONE. A hard 2.2 s ceiling dismisses it whatever else
 * happens, and it also lifts on the first key press or click. A preloader that
 * outlives its own animation is a broken website.
 *
 * HOMEPAGE ONLY. An opaque sheet over the page means the real content is not
 * visible until it lifts, and Lighthouse measures largest *contentful* paint —
 * so a preloader on every route costs every route its LCP. Measured: /rooms
 * went from 93 to a median 85 with it, and back when it was scoped to the
 * homepage.
 *
 * The reasoning is the same one the metric is pointing at. A preloader is a
 * first-impression device. Someone arriving on /rooms/harmony from a search
 * result has not come for an impression; they have come for that room, and a
 * curtain between them and it is the toll this file was written to avoid.
 *
 * ── The counter ────────────────────────────────────────────────────────────
 * It counts the real thing: `document.readyState` progress, not a fake ramp to
 * 100. If everything is cached it flashes to 100 and leaves, which is honest —
 * a counter that always takes 1.4 seconds is a loading spinner pretending to
 * measure something.
 */
const CEILING_MS = 2200;
const KEY = "ink_pressed";

export function Preloader() {
  const reduced = useReducedMotion();
  const pathname = usePathname();
  /* The locale roots — "/", "/el", "/de", "/fr", "/nl" — and nothing else. */
  const isHome = /^\/(el|de|fr|nl)?$/.test(pathname ?? "");
  const [showing, setShowing] = useState(false);
  const [pct, setPct] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    /* Reduced motion, a deep link, or already seen this session: never mount. */
    if (reduced) return;
    if (!isHome) return;
    try {
      if (sessionStorage.getItem(KEY)) return;
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* private mode — show it once and do not persist */
    }
    setShowing(true);

    const dismiss = () => {
      if (done.current) return;
      done.current = true;
      setPct(100);
      setShowing(false);
    };

    /* Progress from what the document actually reports. */
    const tick = window.setInterval(() => {
      setPct((p) => {
        const target =
          document.readyState === "complete"
            ? 100
            : document.readyState === "interactive"
              ? 80
              : 40;
        return p < target ? Math.min(target, p + 7) : p;
      });
    }, 60);

    const onReady = () => window.setTimeout(dismiss, 420);
    if (document.readyState === "complete") onReady();
    else window.addEventListener("load", onReady, { once: true });

    /* The ceiling, and the escape hatches. */
    const ceiling = window.setTimeout(dismiss, CEILING_MS);
    window.addEventListener("keydown", dismiss, { once: true });
    window.addEventListener("pointerdown", dismiss, { once: true });

    return () => {
      window.clearInterval(tick);
      window.clearTimeout(ceiling);
      window.removeEventListener("load", onReady);
      window.removeEventListener("keydown", dismiss);
      window.removeEventListener("pointerdown", dismiss);
    };
  }, [reduced, isHome]);

  return (
    <AnimatePresence>
      {showing && (
        <motion.div
          /* aria-hidden and inert: the page beneath is the real document, and
             a screen reader should be reading that, not narrating a curtain. */
          aria-hidden="true"
          inert
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="fixed inset-0 z-[300] flex items-center justify-center bg-paper"
          data-ground="paper"
        >
          {/* The mark, pressed into the sheet. Scale and opacity together:
              ink meeting paper spreads slightly as it lands. */}
          <motion.div
            initial={{ scale: 1.28, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative"
          >
            <span className="font-display text-[clamp(3.5rem,12vw,8rem)] leading-none tracking-[0.14em] text-ink">
              INK
            </span>
            {/* The deboss: a hairline shadow under the mark, as if the type
                had been pushed into the stock. */}
            <span
              className="pointer-events-none absolute inset-0 translate-y-[2px] font-display text-[clamp(3.5rem,12vw,8rem)] leading-none tracking-[0.14em] text-ink/10 blur-[1px]"
              aria-hidden="true"
            >
              INK
            </span>
          </motion.div>

          <span className="spec absolute bottom-8 right-8 tabular-nums text-[color:var(--fg-3)]">
            {String(Math.min(100, Math.round(pct))).padStart(3, "0")}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
