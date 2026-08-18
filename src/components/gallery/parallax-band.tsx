"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * A band of frames that drifts sideways as the page comes down.
 *
 * Atmosphere, not an index. These are not links, they do not open the
 * lightbox, and they are `aria-hidden` — the gallery proper is directly below
 * with every one of these photographs in it, captioned and reachable. A
 * decorative strip that also happens to be a second, worse way to browse the
 * same pictures helps nobody and gives a screen reader a list of alts to read
 * twice.
 *
 * ── The two things a horizontal band gets wrong ────────────────────────────
 *
 * IT ESCAPES ITS SECTION. Translating a wide strip sideways is the classic way
 * to give a whole site a horizontal scrollbar and a broken viewport on a
 * phone. The band clips itself — `overflow-hidden` on the outer element, and
 * the travel expressed as a percentage of the strip so it cannot outrun it.
 *
 * IT COSTS THE PAGE ITS LCP. These frames are decoration, so: lazy, low
 * quality, and sized for the band's own height rather than the viewport.
 * Nothing here is `priority` and nothing here is the largest paint.
 *
 * There is a second cost that only shows on a cold cache, and it is the one
 * that actually bit. Every distinct rendered width is a separate on-demand
 * resize; nine frames at a fluid `sizes` meant nine new variants for the image
 * optimizer to produce before /gallery's network went quiet, and CI's
 * reveal-check — which waits for `networkidle` — timed out at 60s on a page
 * that had been fine the commit before. So the band is five frames at one
 * fixed width: five variants, generated once, reused across the strip. The
 * fix is fewer and cheaper images, not a check taught to wait longer.
 *
 * Reduced motion holds it still. The strip is composed and legible standing
 * still; it simply stops drifting.
 */
export function ParallaxBand({
  images,
}: {
  images: { src: string; alt: string }[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  /* One transform, on the composited axis, and bounded: the strip is wider
     than the viewport by design and this moves it across a fraction of its
     own width, so it can never travel further than it has to give. */
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-14%"]);

  if (!images.length) return null;

  return (
    <div ref={ref} aria-hidden="true" className="relative w-full overflow-hidden py-2">
      <motion.div
        className="flex w-max gap-[clamp(0.5rem,1.2vw,1rem)] will-change-transform"
        style={reduced ? undefined : { x }}
      >
        {images.map((img) => (
          <div
            key={img.src}
            className="relative h-[clamp(9rem,22vh,15rem)] w-[17rem] shrink-0 overflow-hidden sm:w-[20rem]"
          >
            <Image
              src={img.src}
              alt=""
              fill
              loading="lazy"
              quality={58}
              sizes="320px"
              className="graded object-cover"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
