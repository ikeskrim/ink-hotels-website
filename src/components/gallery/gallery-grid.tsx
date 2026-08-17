"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { EASE } from "@/components/motion/reveal";

/**
 * The gallery.
 *
 * A CSS-columns masonry — no JavaScript layout pass, so nothing reflows after
 * paint and there is no measurement jank on resize. Images below the first
 * screenful are lazy, and each tile reserves its aspect ratio so the column
 * never collapses and re-shuffles as photographs arrive.
 *
 * The lightbox is a real modal: focus is trapped, Escape closes, arrows move,
 * the page behind is inert, and focus returns to the tile you opened from.
 */

export interface GalleryItem {
  src: string;
  alt: string;
  category: string;
}

export function GalleryGrid({
  items,
  categories,
  label = "Collections",
  countLabel = "{count} photographs",
}: {
  items: GalleryItem[];
  categories: { id: string; label: string }[];
  /** Accessible name for the filter group. */
  label?: string;
  /** `{count} photographs`, already translated. */
  countLabel?: string;
}) {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<number | null>(null);
  const reduced = useReducedMotion();
  const triggerRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.category === filter)),
    [items, filter],
  );

  const close = useCallback(() => {
    const i = open;
    setOpen(null);
    /* Return focus to the tile that opened the lightbox. */
    if (i !== null) requestAnimationFrame(() => triggerRefs.current[i]?.focus());
  }, [open]);

  const step = useCallback(
    (delta: number) => {
      setOpen((cur) =>
        cur === null ? cur : (cur + delta + visible.length) % visible.length,
      );
    },
    [visible.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  const current = open !== null ? visible[open] : undefined;

  return (
    <>
      {/* ── Filters ──────────────────────────────────────────────────────
          The rooms page's chip row, exactly: one line that scrolls rather
          than a block that wraps. These labels are set in the mono face, and
          a wrapping row changes height when the webfont swaps — which moves
          every photograph below it after first paint. A non-wrapping row
          cannot change height, and swiping through collections is the better
          gesture on a phone anyway. */}
      <div className="mb-[clamp(2rem,4vw,3rem)] border-t border-[color:var(--hairline)] pt-8">
        <div className="flex items-baseline gap-6">
          <div
            role="group"
            aria-label={label}
            className="-mx-6 flex flex-1 gap-2 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          >
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setFilter(c.id)}
                aria-pressed={filter === c.id}
                className={cn(
                  "label h-9 shrink-0 whitespace-nowrap border px-4 transition-colors duration-300 ease-state",
                  filter === c.id
                    ? "border-[color:var(--fg)] bg-[color:var(--fg)] text-[color:var(--bg)]"
                    : "border-[color:var(--border)] text-[color:var(--fg-2)] hover:border-[color:var(--fg)] hover:text-[color:var(--fg)]",
                )}
              >
                {c.label}
              </button>
            ))}
          </div>
          <p
            aria-live="polite"
            className="spec hidden shrink-0 text-[color:var(--fg-3)] sm:block"
          >
            {countLabel.replace("{count}", String(visible.length))}
          </p>
        </div>
      </div>

      {/* ── The grid ─────────────────────────────────────────────────────
          One aspect ratio, not a masonry.

          CSS columns fill top-to-bottom then left-to-right, so the reading
          order down the page was not the order in the DOM: filtering to a
          collection reshuffled which photograph sat where, and on a two-column
          phone the sequence a curator chose came out interleaved. A ratio grid
          keeps the order the content file states, gives every collection the
          same rhythm, and reserves each tile's box before the image arrives.

          3:2 because the library is almost entirely landscape — the ratio the
          photographs were actually shot in, so the crop takes the edges rather
          than the subject. */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((item, i) => (
          <li key={item.src}>
            <button
              ref={(el) => {
                triggerRefs.current[i] = el;
              }}
              type="button"
              onClick={() => setOpen(i)}
              aria-label={`Open photograph: ${item.alt}`}
              className="group relative block aspect-[3/2] w-full overflow-hidden bg-[color:var(--bg-lift)] focus-visible:outline-offset-2"
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(min-width: 1024px) 24vw, (min-width: 640px) 32vw, 48vw"
                quality={62}
                /* Four, not eight. The masonry staggered its tiles so eight
                   rarely shared the first screen; a uniform grid puts a whole
                   row of four across it, and eight eager requests then compete
                   for the same pipe. Measured: eight took /gallery to 84, four
                   puts it back. */
                loading={i < 4 ? "eager" : "lazy"}
                className="object-cover transition-transform duration-[1100ms] ease-settle group-hover:scale-[1.04]"
              />
              <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 ease-settle group-hover:bg-ink/15" />

              {/* The caption, on hover and on keyboard focus.
                  `aria-hidden` because the same words are already the tile's
                  accessible name: without it a screen reader reads the alt
                  text twice. The gradient exists so white type stays legible
                  over a pale photograph. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-ink/85 via-ink/45 to-transparent p-3 pt-8 text-left opacity-0 transition-[opacity,transform] duration-500 ease-settle group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 motion-reduce:transition-none motion-reduce:translate-y-0"
              >
                <span className="spec line-clamp-2 text-paper">{item.alt}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* ── Lightbox ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {current && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={current.alt}
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
            className="fixed inset-0 z-[200] flex flex-col bg-ink/97 backdrop-blur-sm"
            onClick={close}
          >
            <div className="flex h-16 shrink-0 items-center justify-between px-5 sm:px-8">
              <p className="spec text-olive">
                {(open ?? 0) + 1} / {visible.length}
              </p>
              <button
                type="button"
                onClick={close}
                autoFocus
                aria-label="Close"
                className="-mr-2 flex h-11 w-11 items-center justify-center text-paper"
              >
                <X className="h-5 w-5" strokeWidth={1.25} />
              </button>
            </div>

            <div
              className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-16"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={current.src}
                initial={reduced ? false : { opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: reduced ? 0 : 0.5, ease: EASE }}
                className="relative h-full w-full"
              >
                <Image
                  src={current.src}
                  alt={current.alt}
                  fill
                  sizes="100vw"
                  quality={88}
                  className="object-contain"
                />
              </motion.div>

              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photograph"
                className="absolute left-1 flex h-12 w-12 items-center justify-center text-paper/70 transition-colors hover:text-paper sm:left-3"
              >
                <ArrowLeft className="h-6 w-6" strokeWidth={1} />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photograph"
                className="absolute right-1 flex h-12 w-12 items-center justify-center text-paper/70 transition-colors hover:text-paper sm:right-3"
              >
                <ArrowRight className="h-6 w-6" strokeWidth={1} />
              </button>
            </div>

            <p className="shrink-0 px-5 pb-6 text-center text-sm text-paper/70 sm:px-8">
              {current.alt}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
