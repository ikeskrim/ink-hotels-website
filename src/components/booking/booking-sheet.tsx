"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MessageCircle } from "lucide-react";

import { AvailabilityForm } from "@/components/booking/availability-form";
import { EASE } from "@/components/motion/reveal";
import { InkAnchor } from "@/components/ui/ink-link";
import { contact, reception } from "@/content/site";
import { useI18n } from "@/i18n/provider";

/**
 * The booking sheet, on a phone.
 *
 * A bar sits at the bottom of the page with the two things a reader on a phone
 * in a foreign old town actually wants — book, or message the desk. Dragging
 * it up, or pressing the handle, expands it into the availability form without
 * leaving the page.
 *
 * ── Physics ────────────────────────────────────────────────────────────────
 *
 * A spring, not a duration, so a fast flick and a slow drag end differently —
 * the sheet carries the reader's velocity into the settle, which is what makes
 * a native sheet feel attached to the finger rather than played back at it.
 * The dismiss threshold is velocity OR distance: a quick flick down closes it
 * even if it barely moved, and a long slow drag closes it even if it was slow,
 * because both are unambiguous statements of intent.
 *
 * Under `prefers-reduced-motion` there is no spring and no drag animation. The
 * sheet opens and closes, instantly.
 *
 * ── It is a dialog ─────────────────────────────────────────────────────────
 *
 * Focus moves into it, Escape closes it, the page behind it does not scroll,
 * and closing returns focus to the control that opened it. Same contract as
 * the concierge panel, because a thing that covers the page owes the reader
 * the same courtesies whether it arrived by drag or by click.
 *
 * ── The price ──────────────────────────────────────────────────────────────
 *
 * The brief for this component asked the bar to show a starting price. There
 * is no rate anywhere in this repository, and inventing one is the single
 * thing this project's content rules forbid most explicitly — "a best-rate
 * line, if it is true" is on the owner's outstanding list for exactly that
 * reason, and the Book Direct block deliberately makes no rate claim.
 *
 * So the price is a slot, not a string. Pass `startingPrice` when a real,
 * evidenced figure exists and the bar will lead with it; until then the bar
 * leads with what is true, which is that the desk answers until reception
 * closes. Nothing here has to change on the day the number arrives.
 */
export function BookingSheet({
  open,
  onOpenChange,
  reserveHref,
  /** A real, evidenced rate. Omitted until the owner supplies one. */
  startingPrice,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reserveHref: string;
  startingPrice?: string;
}) {
  const { m } = useI18n();
  const reduced = useReducedMotion();
  const sheetRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    sheetRef.current?.focus();
    /* Captured now: by the time this effect tears down, the ref may point
       somewhere else, and focus would return to the wrong control or to
       nothing. */
    const opener = openerRef.current;
    /* The page behind a full-height sheet must not scroll under it. */
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      /* Focus goes back where it came from, not to the top of the page. */
      opener?.focus();
    };
  }, [open, onOpenChange]);

  return (
    <>
      {/* ── The bar ───────────────────────────────────────────────────── */}
      <div
        data-ground="ink"
        className="flex items-stretch border-t border-paper/15"
      >
        <button
          ref={openerRef}
          type="button"
          onClick={() => onOpenChange(true)}
          aria-expanded={open}
          className="flex flex-1 flex-col items-start justify-center gap-1 py-3 pl-5 pr-3 text-left"
        >
          {/* The grab handle. Decorative — the button around it is what is
              announced, and it says what it does. */}
          <span
            aria-hidden="true"
            className="mb-1 block h-1 w-9 rounded-full bg-paper/35"
          />
          <span className="label text-paper">
            {startingPrice ? startingPrice : m.actions.checkAvailability}
          </span>
          <span className="spec text-paper/55">
            {m.common.receptionUntil.replace("{time}", reception.openUntil)}
          </span>
        </button>

        <a
          href={contact.whatsapp.url(m.concierge.whatsappGreeting)}
          target="_blank"
          rel="noopener noreferrer"
          className="label flex items-center justify-center gap-2 px-5 text-paper"
        >
          <MessageCircle className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          {m.concierge.whatsapp}
        </a>
      </div>

      {/* ── The sheet ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label={m.actions.close}
              onClick={() => onOpenChange(false)}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.35, ease: EASE }}
              className="fixed inset-0 z-[160] bg-ink/70 backdrop-blur-sm"
            />

            <motion.div
              ref={sheetRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-label={m.booking.bookDirectTitle}
              data-ground="ink"
              initial={reduced ? false : { y: "100%" }}
              animate={{ y: 0 }}
              exit={reduced ? { opacity: 0 } : { y: "100%" }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 320, damping: 34, mass: 0.9 }
              }
              drag={reduced ? false : "y"}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.55 }}
              onDragEnd={(_, info) => {
                /* Either a decisive flick or a decisive distance. Requiring
                   both would strand a slow, deliberate drag open; requiring
                   distance alone would ignore a flick that never travelled. */
                if (info.velocity.y > 520 || info.offset.y > 140) {
                  onOpenChange(false);
                }
              }}
              className="fixed inset-x-0 bottom-0 z-[170] max-h-[92svh] overflow-y-auto overscroll-contain rounded-t-[1.25rem] bg-ink px-5 pb-8 pt-3 text-paper"
              style={{ paddingBottom: "calc(2rem + env(safe-area-inset-bottom))" }}
            >
              <div
                aria-hidden="true"
                className="mx-auto mb-6 h-1 w-10 rounded-full bg-paper/30"
              />

              <p className="label mb-5 text-phos">{m.home.datesTitle}</p>

              <AvailabilityForm tone="light" layout="stack" />

              <p className="mt-6 text-paper/70">
                {m.booking.bookDirectAnswer}
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <a
                  href={reserveHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label flex items-center justify-center gap-2 bg-sea py-4 text-paper"
                >
                  {m.actions.bookNow}
                  <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                </a>

                <p className="spec text-center text-paper/60">
                  <InkAnchor href={contact.phones[0].href}>
                    {contact.phones[0].value}
                  </InkAnchor>
                  {contact.phones[0].ext ? (
                    <span className="text-paper/45">
                      {" "}
                      ({m.common.ext} {contact.phones[0].ext})
                    </span>
                  ) : null}
                  <span className="text-paper/45"> · </span>
                  <InkAnchor
                    href={contact.whatsapp.url(m.concierge.whatsappGreeting)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {m.concierge.whatsapp}
                  </InkAnchor>
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
