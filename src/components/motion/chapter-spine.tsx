"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * The spine of the book, in the margin.
 *
 * A hairline down the outer margin with a folio at each chapter, the current
 * one inked and the rest left grey — where you are in the volume, told the way
 * a book tells you: by thickness, not by a percentage.
 *
 * ── Why it reads the page instead of being handed a list ───────────────────
 * It queries `[data-chapter]` at mount. A hand-maintained array of chapters
 * per route is a second source of truth that goes stale the first time someone
 * reorders a section — and it would have to be threaded through five locales.
 * The sections already know their own numbering; this reads it.
 *
 * ── Why it is not navigation ───────────────────────────────────────────────
 * `aria-hidden`, no links, no focus stops. Every chapter here is already
 * reachable from the header and the in-page anchors, and a screen-reader user
 * does not need a third list of the same sections read out as bare numbers.
 * It is a position indicator, and position is exactly what a reader using a
 * screen reader already has.
 *
 * ── Cost ───────────────────────────────────────────────────────────────────
 * One IntersectionObserver, no scroll listener, no rAF. `hidden xl:block`, so
 * it never exists on a screen without a margin to spare — and it renders
 * nothing at all on a route with no chapters, which is most of them.
 */
export function ChapterSpine() {
  const pathname = usePathname();
  const [marks, setMarks] = useState<string[]>([]);
  const [grounds, setGrounds] = useState<string[]>([]);
  const [active, setActive] = useState(0);
  const ratios = useRef(new Map<Element, number>());

  useEffect(() => {
    const nodes = [...document.querySelectorAll<HTMLElement>("[data-chapter]")];
    if (nodes.length < 2) {
      setMarks([]);
      setGrounds([]);
      return;
    }
    setMarks(nodes.map((n) => n.dataset.chapter ?? ""));
    /* The spine is fixed and the page scrolls behind it, so it has to take the
       colour of whatever it is currently over. Without this it inherits the
       body's paper tokens and goes near-invisible — and fails contrast — the
       moment a night or ink chapter passes underneath. */
    setGrounds(nodes.map((n) => n.dataset.ground ?? "paper"));
    setActive(0);
    ratios.current = new Map();

    /* The chapter that owns the most of the screen wins. Picking "the first one
       intersecting" makes the mark flicker back to the outgoing chapter for
       every pixel of overlap between two long sections. */
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) ratios.current.set(e.target, e.intersectionRatio);
        let best = 0;
        let bestRatio = -1;
        nodes.forEach((n, i) => {
          const r = ratios.current.get(n) ?? 0;
          if (r > bestRatio) {
            bestRatio = r;
            best = i;
          }
        });
        setActive(best);
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.75, 1] },
    );
    for (const n of nodes) io.observe(n);
    return () => io.disconnect();
  }, [pathname]);

  if (marks.length < 2) return null;

  return (
    <div
      aria-hidden="true"
      data-ground={grounds[active] ?? "paper"}
      className="pointer-events-none fixed left-[max(1.25rem,calc((100vw-var(--container-max,80rem))/4))] top-1/2 z-20 hidden -translate-y-1/2 xl:block"
    >
      <div className="flex flex-col items-center gap-3">
        {marks.map((mark, i) => (
          <div key={`${mark}-${i}`} className="flex flex-col items-center gap-3">
            <span
              className={
                "spec tabular-nums transition-[opacity,color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] " +
                (i === active
                  ? "text-[color:var(--fg)]"
                  : "text-[color:var(--fg-3)]")
              }
            >
              {mark}
            </span>
            {i < marks.length - 1 && (
              <span
                className={
                  "block w-px transition-[height,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] " +
                  (i < active ? "h-6 bg-[color:var(--fg-2)]" : "h-6 bg-[color:var(--hairline)]")
                }
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
