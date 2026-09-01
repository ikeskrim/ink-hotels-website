"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { EASE } from "@/components/motion/reveal";
import { NoFrame } from "@/components/media/no-frame";
import { amenityFrame } from "@/content/amenity-media";
import { cn } from "@/lib/utils";

/**
 * The amenities of a suite, as a bento grid that answers back.
 *
 * Hovering or focusing a feature grows its cell, dims the rest, and — where a
 * photograph genuinely shows that feature — reveals it inside the cell. It is
 * the "which of these actually matters to me" question, answered without
 * leaving the page or opening a gallery.
 *
 * ── Why focus and not only hover ───────────────────────────────────────────
 *
 * A hover-only reveal is invisible to a keyboard and unreachable on a phone,
 * which between them are most of the people reading a hotel room page. Each
 * cell is therefore a real <button>: it responds identically to hover, to
 * focus, and to tap, and `keyboard-check.mjs` walks it. The button announces
 * the amenity and, when there is one, that there is a photograph of it.
 *
 * Nothing here is a link and nothing navigates — the button's only job is to
 * be reachable and to say what it is showing. That is a deliberate choice over
 * a div with onMouseEnter, which would look identical and be usable by fewer
 * people.
 *
 * ── Why some cells have no picture ─────────────────────────────────────────
 *
 * Only amenities with a frame somebody has actually opened and looked at get
 * one; see content/amenity-media.ts. The rest expand to type on the lifted
 * ground, using the same hairline frame the withdrawn arrangements use, so an
 * absent photograph reads as deliberate rather than as a failed load. Putting
 * the nearest available photograph behind a word it does not depict is the
 * lie this project has already removed once.
 *
 * Under `prefers-reduced-motion` the grid still responds — the cell still
 * expands and the photograph still appears — but instantly, with no spring and
 * no dimming transition. The information is the point; the movement is not.
 */
export function AmenityGrid({
  slug,
  amenities,
  heading,
}: {
  slug: string;
  amenities: readonly string[];
  /** Omitted when the grid sits inside a panel that already has one. */
  heading?: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const reduced = useReducedMotion();

  if (!amenities.length) return null;

  return (
    <div>
      {heading ? (
        <p className="label mb-6 text-[color:var(--fg-3)]">{heading}</p>
      ) : null}

      <ul
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
        /* Leaving the grid clears the selection, so the dimming does not
           persist after the pointer has gone. */
        onMouseLeave={() => setActive(null)}
      >
        {amenities.map((amenity) => {
          const frame = amenityFrame(slug, amenity);
          const isActive = active === amenity;
          const dimmed = active !== null && !isActive;

          return (
            <motion.li
              key={amenity}
              layout={!reduced}
              transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
              className={cn(
                "relative",
                /* The active cell takes two columns and two rows — the bento
                   move. Everything else keeps its place, so the grid does not
                   reflow into a different arrangement under the reader's
                   hand. */
                isActive && "col-span-2 row-span-2",
              )}
            >
              <motion.button
                type="button"
                onMouseEnter={() => setActive(amenity)}
                onFocus={() => setActive(amenity)}
                onBlur={() => setActive(null)}
                /* Tap toggles, so a touch reader can see the photograph and
                   then put it away again. */
                onClick={() => setActive(isActive ? null : amenity)}
                aria-pressed={isActive}
                animate={{ opacity: dimmed && !reduced ? 0.45 : 1 }}
                transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
                className={cn(
                  "group relative flex h-full min-h-[7rem] w-full flex-col justify-end overflow-hidden",
                  "border border-[color:var(--hairline)] bg-[color:var(--bg-lift)]",
                  "p-4 text-left transition-colors duration-500 ease-settle",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
                  isActive && "min-h-[14rem]",
                )}
              >
                {isActive && frame ? (
                  <>
                    <Image
                      src={frame.src}
                      alt={frame.alt}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      quality={78}
                      className="object-cover"
                    />
                    {/* The label has to stay legible on top of a photograph
                        whose brightness is not known in advance. */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/25 to-transparent"
                    />
                  </>
                ) : null}

                {isActive && !frame ? (
                  <NoFrame className="absolute inset-0 border-0" />
                ) : null}

                <span
                  className={cn(
                    "relative font-display text-[length:var(--text-d4)] leading-tight",
                    isActive && frame ? "text-paper" : "",
                  )}
                >
                  {amenity}
                </span>
              </motion.button>
            </motion.li>
          );
        })}
      </ul>
    </div>
  );
}
