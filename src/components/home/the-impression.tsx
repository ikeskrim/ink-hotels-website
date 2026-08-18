"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { Container, Heading, Section } from "@/components/ui/section";
import { Reveal } from "@/components/motion/reveal";
import { useI18n } from "@/i18n/provider";

/**
 * The impression — the one interactive object on the site.
 *
 * The hotel's mark is a thumbprint: concentric rings pressed into a surface.
 * Here those rings are separated in Z and given a real perspective, so the mark
 * stops being a logo and becomes an object — a die, seen at an angle, that
 * turns to follow the reader's pointer and settles back when they leave.
 *
 * Deliberately not WebGL. Twelve absolutely-positioned rings under one
 * `perspective` and one parent transform is indistinguishable from a 3D scene
 * at this scale, and it costs no library, no shader compile, no canvas, and no
 * second paint path. The whole thing is ~1 kB of markup and stays on the
 * compositor: the pointer writes two numbers, the parent rotates, and the
 * children never re-layout.
 *
 * On touch it does not track a finger — there is no hover on a phone, and a
 * thing that only moves when you poke it reads as broken. It gets a slow
 * autonomous drift instead. Under reduced motion it is simply a still object.
 */

const RINGS = Array.from({ length: 12 }, (_, i) => {
  const t = i / 11;
  return {
    /* Radius grows with an ease so the inner rings crowd, as a fingerprint does. */
    size: 8 + Math.pow(t, 0.82) * 92,
    /* Each ring stands further off the surface than the last. */
    z: i * 9,
    /* The centre drifts, which is what makes it a print and not a target. */
    dx: t * 9,
    dy: t * 5.5,
    /* Inner rings are nearly solid, outer ones fade — depth read as weight,
       the way a real print is darkest where the finger pressed hardest. */
    opacity: 1 - t * 0.4,
  };
});

export function TheImpression() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [engaged, setEngaged] = useState(false);
  const reduced = useReducedMotion();
  const frame = useRef(0);
  const stage = useRef<HTMLDivElement>(null);
  const { m } = useI18n();

  useEffect(() => {
    if (reduced) return;
    const fine = window.matchMedia("(pointer: fine)");
    if (!fine.matches) {
      /* No pointer: breathe slowly on its own rather than sit dead. */
      let t = 0;
      let raf = 0;
      const loop = () => {
        t += 0.006;
        setTilt({ x: Math.sin(t) * 9, y: Math.cos(t * 0.8) * 12 });
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      return () => cancelAnimationFrame(raf);
    }

    const onMove = (e: PointerEvent) => {
      if (frame.current) return;
      frame.current = requestAnimationFrame(() => {
        frame.current = 0;
        const el = stage.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        /* -0.5 … 0.5 from the centre of the object, not the viewport. */
        const px = (e.clientX - (r.left + r.width / 2)) / r.width;
        const py = (e.clientY - (r.top + r.height / 2)) / r.height;
        const near = Math.abs(px) < 1.6 && Math.abs(py) < 1.6;
        setEngaged(near);
        if (near) setTilt({ x: -py * 26, y: px * 34 });
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [reduced]);

  return (
    <Section ground="sun" size="lg" wash="ink" className="lit limewash overflow-hidden">
      <Container>
        <div className="grid items-center gap-[clamp(3rem,7vw,6rem)] lg:grid-cols-12">
          {/* ── The object ───────────────────────────────────────────── */}
          <div className="lg:col-span-6">
            <div
              ref={stage}
              className="relative mx-auto aspect-square w-full max-w-[30rem]"
              style={{ perspective: "1100px" }}
              aria-hidden="true"
              data-decorative
            >
              <motion.div
                className="absolute inset-0"
                animate={
                  reduced
                    ? { rotateX: 12, rotateY: -16 }
                    : { rotateX: 12 + tilt.x, rotateY: -16 + tilt.y }
                }
                transition={{
                  type: "spring",
                  stiffness: 60,
                  damping: 18,
                  mass: 0.7,
                }}
                style={{ transformStyle: "preserve-3d" }}
              >
                {RINGS.map((ring, i) => (
                  <div
                    key={i}
                    className="absolute left-1/2 top-1/2 rounded-full border"
                    style={{
                      width: `${ring.size}%`,
                      height: `${ring.size}%`,
                      marginLeft: `${-ring.size / 2 + ring.dx}%`,
                      marginTop: `${-ring.size / 2 + ring.dy}%`,
                      transform: `translateZ(${ring.z}px)`,
                      borderColor: `color-mix(in oklab, var(--color-sea) ${Math.round(ring.opacity * 100)}%, transparent)`,
                      borderWidth: i < 4 ? "2px" : "1.5px",
                      /* The outer rings catch the raking light. */
                      boxShadow:
                        i > 7
                          ? "0 0 24px -8px color-mix(in oklab, var(--color-sea) 40%, transparent)"
                          : undefined,
                    }}
                  />
                ))}

                {/* The point of contact — the tip of the print. */}
                <div
                  className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sea"
                  style={{ transform: "translate(-50%, -50%) translateZ(112px)" }}
                />
              </motion.div>

              {/* The shadow it casts, shortening as it turns toward the light. */}
              <motion.div
                className="pointer-events-none absolute inset-x-[18%] bottom-[6%] h-6 rounded-[50%] bg-shadow/25 blur-xl"
                animate={{
                  scaleX: engaged ? 0.82 : 1,
                  opacity: engaged ? 0.5 : 0.32,
                }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </div>

          {/* ── What it is ───────────────────────────────────────────── */}
          <div className="lg:col-span-6">
            <Reveal>
              <p className="label mb-6 text-[color:var(--fg-3)]">
                {m.home.markEyebrow}
              </p>
              <Heading size="d2" className="mb-8 max-w-[15ch]">
                {m.home.markTitle}
              </Heading>
              <div className="prose-ink measure">
                <p>{m.home.markBody1}</p>
                <p>{m.home.markBody2}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </Section>
  );
}
