"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { blurFor } from "@/content/generated/blur";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { AvailabilityForm } from "@/components/booking/availability-form";
import { InkSignature } from "@/components/brand/ink-signature";
import { EASE } from "@/components/motion/reveal";
import { contact } from "@/content/site";
import { useI18n } from "@/i18n/provider";
import { localePath } from "@/i18n/config";

/**
 * The first viewport.
 *
 * A slow cross-fade through four photographs, each drifting almost
 * imperceptibly. The first frame is `priority` and is the LCP element; the
 * others do not begin cycling until the page has settled, so nothing competes
 * with it for bandwidth on first paint.
 *
 * The photography is graded — desaturated a little, then laid under a
 * three-part scrim — because the library is mixed in quality and colour, and
 * type must stay legible over any frame in the set. Grading in CSS costs
 * nothing and unifies photographs shot years apart.
 */

/**
 * Every frame is landscape and at least 2300 px wide.
 *
 * Two of the previous four were 1080×1920 portrait — beautiful photographs, but
 * cropped to a landscape viewport and upscaled past their native width they
 * were visibly soft, which is the one thing a hero cannot be. `check-media.mjs`
 * now fails the build if an undersized image is used in a full-bleed slot.
 *
 * The sequence is an argument, not a slideshow: the town at dusk, our own
 * courtyard, the room you would sleep in, the whole place from above.
 */
const FRAMES = [
  {
    src: "/media/1a25f40128eeefbed32d4cf75cb7faf8.webp",
  },
  { src: "/media/1d6eaf712bb53a3d1f6a272907294901.webp" },
  { src: "/media/0f143111b909f0520feed8cf971ef4b8.webp" },
  { src: "/media/181f84a843edadbabe1510574f25768f.webp" },
] as const;

const INTERVAL = 6600;

export function Hero() {
  const [index, setIndex] = useState(0);
  const [cycling, setCycling] = useState(false);
  const reduced = useReducedMotion();
  const { m, locale } = useI18n();

  /* The hero starts static and only begins cycling once the LCP has actually
     been reported.
     This was a flat 1800 ms from mount, then `load` + 1200 ms. Both were
     guesses at when the largest paint had happened; on a throttled connection
     the guess fell inside the measurement window and frame two — 41 kB, a whole
     second full-bleed photograph — competed with the LCP element for the same
     pipe. PerformanceObserver removes the guess: the browser tells us when the
     largest contentful paint landed, and the cycle starts one idle callback
     after that.
     LCP is only *final* at the first user interaction or when the page is
     hidden, so an observer alone would never fire the start on a page nobody
     touches. The entry itself is enough here — we are not measuring, we are
     waiting for the picture to be on screen — so the first entry starts a short
     settle timer, and `load` remains as a fallback for browsers with no
     `largest-contentful-paint` entry type (Safari before 16, and any browser
     where the buffer is empty because the hero came from cache). */
  useEffect(() => {
    if (reduced) return;
    let timer = 0;
    let idle = 0;
    let started = false;
    let observer: PerformanceObserver | undefined;

    const begin = (settle: number) => {
      if (started) return;
      started = true;
      observer?.disconnect();
      timer = window.setTimeout(() => {
        const ric =
          window.requestIdleCallback ??
          ((cb: IdleRequestCallback) => window.setTimeout(cb, 1));
        idle = ric(() => setCycling(true)) as unknown as number;
      }, settle);
    };

    const onLoad = () => begin(1200);

    const supported =
      typeof PerformanceObserver !== "undefined" &&
      PerformanceObserver.supportedEntryTypes?.includes(
        "largest-contentful-paint",
      );

    if (supported) {
      try {
        observer = new PerformanceObserver((list) => {
          /* An entry means the largest element has painted. Half a second of
             quiet after it, then the second frame may load. */
          if (list.getEntries().length) begin(500);
        });
        observer.observe({ type: "largest-contentful-paint", buffered: true });
      } catch {
        observer = undefined;
      }
    }

    /* Fallback, and a ceiling: if no LCP entry ever arrives, the hero must
       still come to life rather than sit on one frame forever. */
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad, { once: true });

    return () => {
      observer?.disconnect();
      window.removeEventListener("load", onLoad);
      window.clearTimeout(timer);
      window.cancelIdleCallback?.(idle);
    };
  }, [reduced]);

  useEffect(() => {
    if (!cycling || reduced) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % FRAMES.length),
      INTERVAL,
    );
    return () => window.clearInterval(id);
  }, [cycling, reduced]);

  /* ── Parallax, static-first ───────────────────────────────────────────
     The photography drifts a little slower than the page leaving it. Nothing
     moves until the reader scrolls, so the first screen — which is the one
     every visitor sees, and the only one Lighthouse ever sees — is a still
     photograph; the layer is composed at its scale and start offset rather
     than animating into place. One property moves, on the compositor, inside a
     section that already clips. Reduced motion holds it still: this is scenery
     sliding under text, which is precisely the motion a vestibular disorder
     cannot tolerate. */
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  /* The layer is scaled 1.12 so it overhangs the section by 6% top and bottom,
     and the drift is ±5% — strictly inside the overhang. A parallax layer at
     `inset-0` with any travel at all pulls its own edge into view and shows the
     ground behind the photograph; the overhang is what stops that, and it has
     to be larger than the travel or the bug is merely rarer. */
  const plateY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  return (
    <section
      ref={heroRef}
      data-section="Hero"
      data-ground="ink"
      /* `min-h`, never a fixed `h`. At a fixed height the content is taller
         than the box on any viewport under ~840px — a 1366×768 laptop, a
         browser with two toolbars — and `justify-end` pushes the overflow up
         behind the fixed header, where the first line collided with the logo.
         Letting the section grow costs a little scroll and cannot overlap. */
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden"
      aria-label="Ink Hotels, Rethymno"
    >
      {/* ── Photography ────────────────────────────────────────────────── */}
      <motion.div
        className="absolute inset-0 -z-10"
        data-decorative
        style={reduced ? undefined : { y: plateY, scale: 1.12 }}
      >
        {FRAMES.map((frame, i) => {
          /* Frames are mounted one ahead of where we are, never all at once.
             They all fill the viewport, so `loading="lazy"` does not hold them
             back — the browser fetches anything in view immediately, and three
             extra full-bleed photographs will happily starve the LCP. Not
             rendering them is the only thing that actually defers them. */
          if (i === 0) {
            /* always mounted */
          } else if (!cycling) {
            return null;
          } else if (i > index + 1 && !(index === FRAMES.length - 1 && i === 0)) {
            return null;
          }

          return (
            <motion.div
              key={frame.src}
              initial={i === 0 ? false : { opacity: 0 }}
              animate={{ opacity: i === index ? 1 : 0 }}
              transition={{ duration: reduced ? 0 : 2, ease: EASE }}
              className="absolute inset-0"
            >
              <div
                className="h-full w-full motion-safe:animate-[heroDrift_26s_ease-out_forwards]"
                style={{ animationPlayState: i === index ? "running" : "paused" }}
              >
                <Image
                  src={frame.src}
                  /* Only the first frame. Frames two to four cross-fade in over a
                     photograph that has already painted, so nobody ever waits
                     on their placeholder — and three unused base64 strings in
                     the HTML of the busiest page is a cost with no return. */
                  placeholder={i === 0 && blurFor(frame.src) ? "blur" : "empty"}
                  blurDataURL={i === 0 ? blurFor(frame.src) : undefined}
                  /* Only the first frame is described. The others are the same
                     view of the same hotel a few seconds later; giving each a
                     description would read four alts to a screen-reader user
                     for one photograph's worth of information. They carried
                     English sentences that nothing ever rendered — those are
                     gone rather than translated. */
                  alt={i === 0 ? m.photoAlt.lighthouseDusk : ""}
                  aria-hidden={i !== 0}
                  fill
                  priority={i === 0}
                  loading={i === 0 ? "eager" : "lazy"}
                  /* These sit under a heavy three-part scrim that removes most
                     of the tonal range anyway; encoding them any finer spends
                     bandwidth on detail the grade throws away. */
                  quality={58}
                  sizes="100vw"
                  className="object-cover [filter:saturate(0.98)_contrast(1.04)_brightness(1.04)]"
                />
              </div>
            </motion.div>
          );
        })}

        {/* Grade. Warm rather than neutral: the floor and the left weight are
            mixed from the ink pigment, which is a warm near-black, and they are
            lighter than a conventional scrim so the Mediterranean colour in the
            photograph survives instead of being crushed to grey. */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/45 to-ink/15" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/78 via-ink/25 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_40%,rgb(26_21_18/0.42)_100%)]" />

        {/* Raking light: a warm bloom thrown across the upper right, screened
            over the photograph. This is the site's thesis made literal — the
            light that makes the mark readable — and it is one static gradient,
            so it costs nothing. */}
        <div
          aria-hidden="true"
          data-decorative
          className="absolute inset-0 mix-blend-screen"
          style={{
            background:
              "radial-gradient(60% 55% at 78% 18%, rgb(245 201 123 / 0.30) 0%, rgb(245 201 123 / 0.10) 42%, transparent 70%)",
          }}
        />
      </motion.div>

      <span className="register-mark left-6 top-24 hidden lg:block" aria-hidden="true" />
      <span className="register-mark right-6 top-24 hidden lg:block" aria-hidden="true" />

      {/* ── Content ────────────────────────────────────────────────────── */}
      {/* The place-line that used to open this block is gone. It repeated what
          the lede says in full a moment later, and on a short viewport it was
          the line that ended up under the header lockup. The logo says where
          we are; it does not need a caption. */}
      <div className="relative mx-auto w-full max-w-[1680px] px-6 pb-9 pt-[max(7rem,calc(env(safe-area-inset-top)+7rem))] sm:px-8 lg:px-12 lg:pb-12">
        {/* The hotel signs its name before it says anything. This stands where
            the place-line used to — one gesture instead of a caption, and the
            only thing on the page that is made rather than set. */}
        <InkSignature
          animate
          delay={0.25}
          className="mb-6 h-[clamp(3.2rem,6vw,4.6rem)] w-auto text-phos [filter:drop-shadow(0_2px_18px_rgb(26_21_18/0.5))] lg:mb-8"
        />

        {/* CSS, not Framer. Everything in this block is the first screen, and
            an entrance that waits for hydration keeps the largest text on the
            page invisible until the JavaScript lands. See `heroRise` and
            `heroLine` in globals.css. */}
        <h1 className="font-display text-[length:var(--text-d1)] leading-[0.95] tracking-[-0.02em] text-paper [text-shadow:0_2px_30px_rgb(25_21_18/0.4)]">
          {[m.home.heroTitleLine1, m.home.heroTitleLine2].map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em]">
              <span
                className="block motion-safe:animate-[heroLine_1.2s_var(--ease-settle)_backwards]"
                style={{ animationDelay: `${0.15 + i * 0.1}s` }}
              >
                {line}
              </span>
              {/* The two lines are separate blocks so the design breaks where
                  it wants to, but a block boundary is not whitespace: the DOM
                  text stream ran them together and the accessible name — and
                  the string Google indexes — read "Seven suitesin the old
                  town." A space between the blocks costs nothing visually and
                  is the only thing that separates the words. */}
              {i === 0 ? " " : null}
            </span>
          ))}
        </h1>

        <p className="measure mt-6 text-paper/85 motion-safe:animate-[heroSettle_1s_var(--ease-settle)_backwards] lg:mt-8 lg:text-lg">
          {m.home.heroLede}
        </p>

        {/* ── Booking ──────────────────────────────────────────────────────
            Desktop gets the full search: three fields is the shortest path
            from wanting to booking, and it is the moment intent is highest.
            Mobile gets one action instead — the thumb bar carries the dates,
            and a five-field form here would push the headline off the fold. */}
        <div className="mt-9 motion-safe:animate-[heroRise_1s_var(--ease-settle)_0.7s_backwards] lg:mt-12">
          <div className="hidden border-t border-paper/25 pt-7 lg:block">
            <AvailabilityForm tone="light" />
          </div>

          <div className="flex flex-col gap-4 lg:hidden">
            <a
              href={contact.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="label group inline-flex h-14 items-center justify-center gap-3 bg-sea px-8 text-paper shadow-[0_4px_22px_-8px_rgb(26_21_18/0.6)]"
            >
              {m.actions.bookNow}
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-500 ease-settle group-hover:translate-x-1"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </a>
            <Link
              href={localePath(locale, "/rooms")}
              className="label inline-flex h-14 items-center justify-center gap-3 border border-paper/40 px-8 text-paper transition-colors duration-500 ease-settle hover:border-paper hover:bg-paper/10"
            >
              {m.actions.seeRooms}
            </Link>
          </div>
        </div>

        {/* ── Frame indicator + scroll cue ─────────────────────────────── */}
        <div className="mt-8 flex items-end justify-between gap-6 lg:mt-9">
          <div className="flex items-center gap-3">
            {FRAMES.map((frame, i) => (
              <button
                key={frame.src}
                type="button"
                aria-label={m.common.photographOf
                  .replace("{n}", String(i + 1))
                  .replace("{total}", String(FRAMES.length))}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className="group py-2"
              >
                <span
                  className={`block h-px w-9 transition-colors duration-700 ease-settle ${
                    i === index
                      ? "bg-paper"
                      : "bg-paper/30 group-hover:bg-paper/70"
                  }`}
                />
              </button>
            ))}
          </div>

          <a
            href="#the-name"
            className="label group hidden items-center gap-3 text-paper/60 transition-colors duration-500 hover:text-paper sm:flex"
          >
            {m.actions.scroll}
            <span
              aria-hidden="true"
              className="relative block h-10 w-px overflow-hidden bg-paper/20"
            >
              <span className="absolute inset-0 block origin-top bg-paper motion-safe:animate-[scrollCue_2.6s_var(--ease-state)_infinite]" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
