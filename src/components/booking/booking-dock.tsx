"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { contact } from "@/content/site";
import { Concierge, ConciergeButton, useConcierge } from "./concierge";
import { EASE } from "@/components/motion/reveal";

/**
 * The persistent booking affordance.
 *
 * Two actions, never more: book, or ask. They sit together so the page has one
 * place to look rather than a booking bar in one corner and a chat bubble in
 * the other.
 *
 * It waits until the reader has seen something worth booking — 70% of a
 * viewport — and stands down once the page's own booking section is in view,
 * because a floating CTA on top of the real CTA is just noise.
 */
export function BookingDock() {
  const [visible, setVisible] = useState(false);
  const [atBookingSection, setAtBookingSection] = useState(false);
  const { open, setOpen } = useConcierge();
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.7);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const target = document.getElementById("book");
    if (!target) return;
    const io = new IntersectionObserver(
      ([entry]) => setAtBookingSection(Boolean(entry?.isIntersecting)),
      { rootMargin: "-15% 0px -10% 0px" },
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  const showing = visible && !atBookingSection && !open;

  return (
    <>
      {/* ── Mobile ───────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showing && (
          <motion.div
            initial={reduced ? false : { y: "115%" }}
            animate={{ y: "0%" }}
            exit={{ y: "115%" }}
            transition={{ duration: reduced ? 0 : 0.55, ease: EASE }}
            className="fixed inset-x-0 bottom-0 z-[120] lg:hidden"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div
              data-ground="ink"
              className="flex items-stretch border-t border-paper/15"
            >
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="label flex w-[40%] items-center justify-center py-4 text-paper"
              >
                Ask us
              </button>
              <a
                href={contact.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="label flex flex-1 items-center justify-center gap-2 bg-sea py-4 text-paper"
              >
                Book now
                <ArrowUpRight
                  className="h-3.5 w-3.5"
                  strokeWidth={1.75}
                  aria-hidden="true"
                />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Desktop ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showing && (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: reduced ? 0 : 0.55, ease: EASE }}
            className="fixed bottom-8 right-8 z-[120] hidden items-center gap-3 lg:flex"
          >
            <ConciergeButton onClick={() => setOpen(true)} />

            <a
              href={contact.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/cta relative flex items-center gap-2.5 overflow-hidden bg-sea px-7 py-3.5 text-paper shadow-[0_6px_28px_-8px_rgb(26_21_18/0.6)] transition-transform duration-500 ease-settle hover:-translate-y-px"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-paper-lit/70 to-transparent transition-transform duration-[900ms] ease-settle group-hover/cta:translate-x-full"
              />
              <span className="label relative">Book now</span>
              <ArrowUpRight
                className="relative h-4 w-4 transition-transform duration-500 ease-settle group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <Concierge open={open} onOpenChange={setOpen} />
    </>
  );
}
