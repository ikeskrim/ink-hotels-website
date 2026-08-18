"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { EASE } from "@/components/motion/reveal";

/**
 * The wash between pages.
 *
 * A sheet of ink sweeps across, the new page is already underneath it, and the
 * sheet leaves. It is the same gesture as the preloader — something laid over
 * the page and lifted — so the two read as one language rather than two
 * effects.
 *
 * ── What it deliberately does not do ───────────────────────────────────────
 *
 * IT DOES NOT DELAY THE NAVIGATION. Next has already rendered the new route by
 * the time this plays; the overlay covers a page that is finished, not one
 * that is loading. A transition that holds the reader while it fetches is a
 * spinner wearing a costume, and on a booking path it costs money.
 *
 * IT DOES NOT ANIMATE THE PAGE ITSELF. No fading the whole document in and
 * out: that would make the LCP element arrive at opacity 0 on every route, and
 * the hero lede on this site has already been the LCP once. The overlay moves;
 * the page never does.
 *
 * IT DOES NOT RUN ON THE FIRST PAINT. `seen` starts false and is set after the
 * first pathname is recorded, so arriving at a page shows nothing — the
 * preloader owns that moment on the homepage and nothing owns it elsewhere.
 *
 * IT DOES NOT RUN FOR A HASH CHANGE. `usePathname` excludes the hash, so
 * jumping to /rethymno#fortezza from the launch redirects does not wipe.
 *
 * Reduced motion gets no overlay at all.
 */
export function RouteTransition() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const previous = useRef<string | null>(null);
  const [key, setKey] = useState<string | null>(null);

  useEffect(() => {
    if (reduced) return;
    /* First render: record where we are and show nothing. */
    if (previous.current === null) {
      previous.current = pathname;
      return;
    }
    if (previous.current === pathname) return;
    previous.current = pathname;
    setKey(pathname);
  }, [pathname, reduced]);

  return (
    <AnimatePresence
      /* The overlay is removed as soon as its exit finishes; nothing waits on
         it, so a fast second navigation simply replaces it. */
      onExitComplete={() => setKey(null)}
    >
      {key && (
        <motion.div
          key={key}
          aria-hidden="true"
          inert
          /* Enters from the left edge, leaves past the right: a wash pulled
             across the sheet in one direction, not a curtain that opens and
             closes on itself. */
          initial={{ scaleX: 0, originX: 0 }}
          animate={{ scaleX: 1, originX: 0 }}
          exit={{ scaleX: 0, originX: 1 }}
          transition={{ duration: 0.42, ease: EASE }}
          className="pointer-events-none fixed inset-0 z-[280] bg-ink"
        />
      )}
    </AnimatePresence>
  );
}
