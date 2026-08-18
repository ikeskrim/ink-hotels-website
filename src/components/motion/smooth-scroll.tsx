"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { usePathname } from "next/navigation";

/**
 * Lenis, and the one scroll position everything else reads from.
 *
 * Disabled outright for reduced motion and for coarse pointers: iOS momentum
 * scrolling is better than anything we can fake, and hijacking it is the
 * fastest way to make a site feel broken on a phone. Everything scroll-driven
 * on this site is built on Framer's `useScroll`, which listens to real scroll
 * events — and Lenis moves the real scroll position rather than transforming a
 * wrapper, so the two stay in step with no bridge between them. That is also
 * why there is no ScrollTrigger here: it would be a second scroll authority
 * for a page that already has one.
 *
 * ── Three things this gets right that the first version did not ────────────
 *
 * IT DOES NOT FIGHT ITSELF ON NAVIGATION. `window.scrollTo(0, 0)` moves the
 * document out from under Lenis without telling it, so Lenis's internal
 * position is stale until the next wheel event — which arrives as a jump back
 * to where the reader was. Route resets go through Lenis.
 *
 * IT LEAVES DEEP LINKS ALONE. The reset also fired on first mount, so arriving
 * at /#book — every link in the footer, and every anchor in the redirect map —
 * scrolled to the top a frame after landing on the right section.
 *
 * IT DOES NOT SWALLOW MODIFIER CLICKS. The handler called preventDefault on
 * every anchor, so ⌘-click and middle-click on an in-page link opened nothing
 * instead of a new tab.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    if (reduced.matches || coarse.matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      /* Gentle exponential ease-out: fast to respond, long to settle. */
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    });
    instance = lenis;

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    const onClick = (e: MouseEvent) => {
      /* A modified click is a request for a new tab or window, not a scroll. */
      if (e.defaultPrevented) return;
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!anchor || anchor.target === "_blank") return;
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;

      let target: Element | null = null;
      try {
        target = document.querySelector(id);
      } catch {
        return; /* not a valid selector — let the browser have it */
      }
      if (!target) return;

      e.preventDefault();
      /* The offset comes from the target's own scroll-margin-top, so the
         header clearance is stated once, in the class on the section, instead
         of being duplicated as a magic number here that silently goes stale
         when the header height changes. */
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      lenis.scrollTo(target as HTMLElement, { offset: -margin });

      /* Keep the address bar honest without letting the browser jump: the
         link stays shareable and Back still walks the anchors. */
      if (window.location.hash !== id) {
        window.history.pushState(null, "", id);
      }
    };
    document.addEventListener("click", onClick);

    /* Back and forward between anchors. */
    const onPop = () => {
      const id = window.location.hash;
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      lenis.scrollTo(target as HTMLElement, { offset: -margin });
    };
    window.addEventListener("popstate", onPop);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("popstate", onPop);
      cancelAnimationFrame(frame);
      lenis.destroy();
      instance = null;
    };
  }, []);

  /* Land at the top of a newly navigated page — but not on the first render,
     and never when the URL is pointing at a section. */
  useEffect(() => {
    if (first) {
      first = false;
      return;
    }
    if (window.location.hash) return;
    if (instance) instance.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  /* Route changes swap the whole document; Lenis's cached page height is from
     the page that just left. Without this, the last screen of a long route is
     unreachable after navigating from a short one. */
  useEffect(() => {
    instance?.resize();
  }, [pathname]);

  return null;
}

/**
 * The live Lenis instance, or null when smooth scrolling is off — which is a
 * supported state, not a failure: reduced motion and every touch device run
 * without it. Anything reading this must work when it is null.
 */
let instance: Lenis | null = null;
let first = true;

export function getLenis() {
  return instance;
}
