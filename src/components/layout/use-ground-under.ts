"use client";

import { useEffect, useState } from "react";

/**
 * Which ground is under the header right now.
 *
 * Every section on this site already declares what it is standing on —
 * `data-ground="paper" | "shade" | "sun" | "ink" | "night"` — and the page
 * heroes declare `ink`, because a full-bleed photograph is a dark ground. So
 * the header does not need to guess, and until now it did: it carried a
 * hand-maintained list of routes that "open with a full-bleed hero", with a
 * comment warning the next person to keep it honest. A list like that is wrong
 * the first time somebody adds a page and does not read the comment, and it
 * can only ever describe the TOP of a page — it has nothing to say about
 * scrolling from a paper section onto an ink one.
 *
 * This reads the answer instead. An IntersectionObserver with a one-pixel
 * detection band at the header's lower edge: whichever section is crossing
 * that line is the section the header is over.
 *
 * Why a band rather than `elementsFromPoint` on scroll: elementsFromPoint is a
 * direct answer but forces layout on every call, and the header would be
 * asking on every frame of every scroll. The observer costs nothing between
 * crossings — the browser only calls back when a boundary actually passes the
 * line, which on a long page is a handful of times.
 *
 * Returns undefined until the first callback, which is the honest answer for
 * "not measured yet" and lets the caller keep its server-rendered appearance
 * rather than flashing.
 */
export function useGroundUnder(
  headerHeight: number,
  /** Re-measure when this changes — pass the pathname. */
  key: string,
): string | undefined {
  const [ground, setGround] = useState<string>();

  useEffect(() => {
    const sections = () => [...document.querySelectorAll<HTMLElement>("[data-ground]")];

    let observer: IntersectionObserver | undefined;

    /* Grounds nest. The page is wrapped in a paper-ground element that spans
       every section inside it, so at any scroll position at least two elements
       cross the band: the wrapper, and the section actually being looked at.
       Taking whichever the callback happened to report last gave the wrapper
       about half the time, which is why the first version of this reported
       "paper" over a black hero.

       So the intersecting set is tracked, and the answer is the DEEPEST of
       them — the one that contains none of the others. That is the most
       specific statement about what is under the bar, and it is what a reader
       sees. */
    const crossing = new Set<HTMLElement>();

    /**
     * Which of the crossing sections is actually being drawn at the bar's edge.
     *
     * Two tie-breaks, and both were found the hard way.
     *
     * The band is one pixel tall, so AT A SECTION BOUNDARY two siblings can be
     * in it at once — one covering the top of the band, one the bottom. The
     * containment rule below separates a wrapper from its child but says
     * nothing about siblings, so the answer at every boundary was whichever
     * the Set happened to yield last. On the homepage that showed as the bar
     * staying transparent for one section past the hero.
     *
     * So candidates are narrowed first to whatever covers the exact line the
     * bar's lower edge sits on — the pixel a reader actually sees beneath it.
     * Only then does the containment rule pick the innermost of them.
     */
    const deepest = () => {
      const live = [...crossing].filter((el) => {
        if (!el.isConnected) {
          crossing.delete(el);
          return false;
        }
        return true;
      });

      const onTheLine = live.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.top <= headerHeight && r.bottom > headerHeight;
      });
      const candidates = onTheLine.length ? onTheLine : live;

      let winner: HTMLElement | undefined;
      for (const el of candidates) {
        if (!candidates.some((other) => other !== el && el.contains(other))) {
          winner = el;
        }
      }
      return winner;
    };

    const attach = () => {
      observer?.disconnect();
      crossing.clear();

      /* A 1px-tall band across the viewport, sitting at the header's lower
         edge. Anything intersecting it is directly beneath the bar. */
      const below = Math.max(0, window.innerHeight - headerHeight - 1);

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const el = entry.target as HTMLElement;
            /* A zero-height element can technically cross the line and tells
               us nothing about what is being drawn there. */
            if (entry.isIntersecting && entry.boundingClientRect.height > 0) {
              crossing.add(el);
            } else {
              crossing.delete(el);
            }
          }
          const el = deepest();
          const value = el?.getAttribute("data-ground");
          if (value) setGround(value);
        },
        { rootMargin: `-${headerHeight}px 0px -${below}px 0px`, threshold: 0 },
      );

      for (const el of sections()) observer.observe(el);
    };

    attach();

    /* The band is defined in pixels against the viewport, so it has to be
       rebuilt when the viewport changes. Debounced, because a phone rotating
       or a desktop window being dragged fires this continuously. */
    let timer: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(attach, 150);
    };
    window.addEventListener("resize", onResize);

    /* Re-measured on navigation through the `key` dependency rather than by
       watching the DOM.

       A MutationObserver on <main> was the first approach, and it was wrong in
       a way that took two flaky check runs to see: React swaps section nodes
       constantly — every entrance animation mounts and unmounts children — so
       it fired during ordinary scrolling, and each firing cleared the
       intersecting set. IntersectionObserver's initial callbacks are async, so
       between the clear and the next frame the header had no idea what it was
       over and kept its previous answer. On a real page that is a bar that
       flips a frame late; in a check run twice it is two different results.

       Navigation is the only moment the set of sections genuinely changes, and
       the caller already knows when that happens. */
    return () => {
      observer?.disconnect();
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
    };
  }, [headerHeight, key]);

  return ground;
}

/**
 * Grounds a white lockup belongs on.
 *
 * `ink` and `night` are the dark ones; `paper`, `shade` and `sun` are all
 * light. Stated as a list rather than inferred from a colour, because the
 * ground names are the design system's vocabulary and a new one should have to
 * be classified deliberately — an unknown ground falls through to light, which
 * is the safe default: dark type on a light bar is legible over almost
 * anything, and white type on a light bar is not.
 */
export function isDarkGround(ground: string | undefined): boolean {
  return ground === "ink" || ground === "night";
}
