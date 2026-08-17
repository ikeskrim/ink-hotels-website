"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { useReducedMotion } from "framer-motion";

import { Container, Heading, Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { useI18n } from "@/i18n/provider";

/**
 * Φως — light.
 *
 * The only scroll-linked animation on the site, in the one place it is earned:
 * the house named Light. A single soft-light gradient layer is translated
 * across a dark photograph as the section passes, tracing the arc morning
 * light makes on a wall.
 *
 * One element, one transform, no masks, no filters, no canvas. It rests at its
 * midpoint under reduced motion, where the section still reads as a photograph
 * of a sunlit wall, and disappears entirely in forced-colors.
 */
export function TheLight() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { m } = useI18n();

  useEffect(() => {
    const section = sectionRef.current;
    const light = lightRef.current;
    if (!section || !light || reduced) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const span = rect.height + window.innerHeight;
      // 0 as the section enters the bottom, 1 as it leaves the top.
      const p = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / span));
      // A shallow arc: across, and up then down a little.
      const x = -26 + p * 92;
      const y = 24 - Math.sin(p * Math.PI) * 30;
      light.style.transform = `translate3d(${x}%, ${y}%, 0)`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [reduced]);

  return (
    <Section ground="shade" size="lg">
      <Container>
        <div className="grid items-center gap-[clamp(2.5rem,6vw,6rem)] lg:grid-cols-12">
          {/* ── The photograph, and the light crossing it ─────────────── */}
          <div ref={sectionRef} className="lg:col-span-7">
            <div className="relative aspect-[4/5] overflow-hidden sm:aspect-[3/2] lg:aspect-[4/5]">
              <Image
                src="/media/8d17d9f0ddc6feb2df2d63ba84ea4c35.webp"
                alt="Morning light across a whitewashed wall and beamed ceiling inside Ink"
                fill
                sizes="(min-width: 1024px) 58vw, 100vw"
                quality={80}
                className="object-cover [filter:saturate(0.85)]"
              />
              <div
                ref={lightRef}
                data-decorative
                aria-hidden="true"
                className="pointer-events-none absolute left-0 top-0 aspect-square w-[160%] mix-blend-soft-light will-change-transform"
                style={{
                  background:
                    "radial-gradient(circle, rgb(240 194 122 / 0.42) 0%, transparent 62%)",
                  transform: "translate3d(20%, 9%, 0)",
                }}
              />
            </div>
          </div>

          {/* ── The thesis, as content ───────────────────────────────── */}
          <div className="lg:col-span-5">
            <Reveal>
              <p className="label mb-6 text-[color:var(--fg-3)]">
                {m.home.lightEyebrow}
              </p>
              <Heading size="d2" className="mb-8">
                Φως
              </Heading>
              <div className="prose-ink measure">
                <p>{m.home.lightBody1}</p>
                <p>{m.home.lightBody2}</p>
              </div>
              <p className="spec mt-9 text-[color:var(--fg-3)]">
                {m.home.lightSpec}
              </p>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
