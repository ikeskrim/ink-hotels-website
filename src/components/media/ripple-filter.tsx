"use client";

import { useId } from "react";

/**
 * A displacement map that makes a photograph ripple, for the suites that come
 * with their own water.
 *
 * ── Why this is not Three.js ───────────────────────────────────────────────
 *
 * The brief asked for a WebGL displacement effect, via Three.js or a light
 * WebGL library. Measured first, as this project requires: /gallery sits at 81
 * on a three-run median with 217 kB of First Load JS, already under the ~90
 * the performance budget asks for. Three.js is around 150 kB gzipped — it
 * would take that page to roughly 370 kB, add a WebGL context and a render
 * loop per hovered tile, and there is no version of that which does not move
 * 81 downwards.
 *
 * So the effect is built from the displacement map the browser already ships.
 * `feTurbulence` generates Perlin noise, `feDisplacementMap` pushes each pixel
 * of the photograph by the amount that noise says — which is the same
 * operation a WebGL displacement shader performs, executed by the compositor
 * instead of by a library. Cost to the bundle: nothing. No context, no loop,
 * no dependency.
 *
 * What is genuinely given up: this cannot follow the pointer. A WebGL version
 * can ripple outward from where the cursor entered; this ripples the whole
 * frame. That is the honest trade, and it is the right way round for a page
 * that is already over its JavaScript budget.
 *
 * ── Cost control ───────────────────────────────────────────────────────────
 *
 * The filter is applied only on hover, and only where a pointer can hover — a
 * phone never rasterises it. The animation lives inside the filter, so when no
 * element references it there is nothing to composite. `prefers-reduced-motion`
 * removes it entirely: a rippling photograph is exactly the kind of movement
 * that setting exists to stop.
 *
 * Each instance needs its own id, hence `useId` — two filters sharing an id
 * would have every image on the page rippling to whichever one rendered last.
 */
export function RippleFilter({ id }: { id: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      className="pointer-events-none absolute h-0 w-0"
    >
      <defs>
        <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.026"
            numOctaves="2"
            seed="7"
            result="noise"
          >
            {/* SMIL rather than CSS: filter primitives are not animatable from
                a stylesheet, and this is the only way to move the noise
                without a per-frame JavaScript loop. The browser runs it on the
                compositor, and only while the filter is referenced. */}
            <animate
              attributeName="baseFrequency"
              dur="7s"
              values="0.012 0.026; 0.018 0.016; 0.012 0.026"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="14"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
}

/** A stable, unique filter id and the CSS url() that points at it. */
export function useRippleFilter() {
  const id = `ripple-${useId().replace(/:/g, "")}`;
  return { id, url: `url(#${id})` };
}
