"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { useI18n } from "@/i18n/provider";
import { Concierge, ConciergeButton, useConcierge } from "./concierge";
import { EASE } from "@/components/motion/reveal";
import { useReserveHref } from "@/components/booking/reserve-link";
import { BookingSheet } from "@/components/booking/booking-sheet";

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
  /* The same deep link the header carries: on a room page this opens the
     engine on that room rather than on the list the reader just left. */
  const { href: reserveHref } = useReserveHref();
  const [visible, setVisible] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [atBookingSection, setAtBookingSection] = useState(false);
  const { open, setOpen } = useConcierge();
  const reduced = useReducedMotion();
  const { m } = useI18n();

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
            {/* The mobile affordance is a sheet now, not a bar of two
                links: the bar is its collapsed state, and dragging it up
                opens the availability form in place. Replacing the bar rather
                than sitting beside it, because two floating booking controls
                on one screen is the noise this component's own note warns
                about. */}
            <BookingSheet
              open={sheetOpen}
              onOpenChange={setSheetOpen}
              reserveHref={reserveHref}
            />
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
              href={reserveHref}
              target="_blank"
              rel="noopener noreferrer"
              className="group/cta relative flex items-center gap-2.5 overflow-hidden bg-sea px-7 py-3.5 text-paper shadow-[0_6px_28px_-8px_rgb(26_21_18/0.6)] transition-transform duration-500 ease-settle hover:-translate-y-px"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-paper-lit/70 to-transparent transition-transform duration-[900ms] ease-settle group-hover/cta:translate-x-full"
              />
              <span className="label relative">{m.actions.bookNow}</span>
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
