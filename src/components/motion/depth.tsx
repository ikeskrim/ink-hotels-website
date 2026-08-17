"use client";

import { type ReactNode, useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

import { cn } from "@/lib/utils";

/**
 * Depth primitives.
 *
 * The immersive sites this was measured against get their "3D" from layered
 * looping video, not WebGL. We have no video of this property, so depth is
 * built the other way it is actually done: separate layers moving at different
 * rates against each other, on the compositor.
 *
 * Everything here writes transform and opacity only — never width, height, top
 * or background-position — so no layer can cause a layout or paint pass. All of
 * it stops dead under prefers-reduced-motion.
 */

/**
 * A photograph that drifts slower than the page, and settles as it centres.
 * The image is over-scaled by exactly the travel distance, so no edge is ever
 * exposed at either end of the range.
 */
export function DepthImage({
  src,
  alt,
  className,
  /** How far the image travels, as a percentage of its own height. */
  travel = 14,
  /** Scale it settles to as it passes the middle of the viewport. */
  settle = true,
  priority = false,
  sizes = "100vw",
  quality = 74,
  graded = true,
}: {
  src: string;
  alt: string;
  className?: string;
  travel?: number;
  settle?: boolean;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  graded?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(
    scrollYProgress,
    [0, 1],
    [`${-travel / 2}%`, `${travel / 2}%`],
  );
  const y = useSpring(rawY, { stiffness: 110, damping: 30, mass: 0.35 });

  /* A shallow push-in as the frame crosses the middle — the camera settling,
     not a zoom. Peaks at 1 and eases off either side. */
  const rawScale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    settle ? [1.09, 1.02, 1.09] : [1, 1, 1],
  );
  const scale = useSpring(rawScale, { stiffness: 90, damping: 28, mass: 0.4 });

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0"
        style={
          reduced
            ? undefined
            : {
                y,
                scale,
                height: `${100 + travel}%`,
                top: `${-travel / 2}%`,
              }
        }
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          quality={quality}
          priority={priority}
          className={cn("object-cover", graded && "graded")}
        />
      </motion.div>
    </div>
  );
}

/**
 * Content that rises against a background moving the other way. Used for type
 * set over full-bleed photography — the separation is what reads as depth.
 */
export function DepthLayer({
  children,
  className,
  /** Positive drifts down, negative up. Percentage of the element's height. */
  drift = -8,
  fade = true,
}: {
  children: ReactNode;
  className?: string;
  drift?: number;
  fade?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const rawY = useTransform(scrollYProgress, [0, 1], ["0%", `${drift}%`]);
  const y = useSpring(rawY, { stiffness: 120, damping: 32, mass: 0.3 });
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.12, 0.85, 1],
    fade ? [0.4, 1, 1, 0.55] : [1, 1, 1, 1],
  );

  return (
    <motion.div
      ref={ref}
      className={className}
      style={reduced ? undefined : { y, opacity }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A full-bleed frame that the page scrolls *through*: the photograph is pinned
 * while its caption passes over it, then released. This is the closest thing to
 * a camera move that costs nothing — position: sticky does the pinning, and the
 * only animated properties are opacity and transform on the overlay.
 */
export function CinematicFrame({
  src,
  alt,
  children,
  className,
  /* 180vh was most of a screen of photograph with nothing on it once the copy
     had faded. A pinned frame earns its length from the travel, not from the
     dwell: 140vh is still four tenths of a viewport of camera move, and there
     is no point in it where the reader is looking at an empty picture. */
  height = "140vh",
  priority = false,
}: {
  src: string;
  alt: string;
  children?: ReactNode;
  className?: string;
  /** Total scroll distance the frame occupies. */
  height?: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1.16, 1.0]);
  const smoothScale = useSpring(scale, {
    stiffness: 80,
    damping: 26,
    mass: 0.4,
  });
  const veil = useTransform(scrollYProgress, [0, 0.55, 1], [0.55, 0.3, 0.62]);

  return (
    <div
      ref={ref}
      data-ground="ink"
      className={cn("relative", className)}
      style={{ height: reduced ? "100svh" : height }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={reduced ? undefined : { scale: smoothScale }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes="100vw"
            quality={70}
            priority={priority}
            className="object-cover [filter:saturate(0.98)_contrast(1.04)]"
          />
        </motion.div>

        <motion.div
          aria-hidden="true"
          data-decorative
          className="absolute inset-0 bg-ink"
          style={{ opacity: reduced ? 0.45 : veil }}
        />
        <div
          aria-hidden="true"
          data-decorative
          className="absolute inset-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(55% 50% at 72% 22%, rgb(245 201 123 / 0.26) 0%, transparent 68%)",
          }}
        />

        {children && (
          <div className="relative z-[2] flex h-full items-center">
            <div className="mx-auto w-full max-w-[1680px] px-6 sm:px-8 lg:px-12">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
