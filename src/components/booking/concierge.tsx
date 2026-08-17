"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Mail, MessageCircle, Phone, Smartphone, X } from "lucide-react";

import { contact, reception } from "@/content/site";
import { AvailabilityForm } from "./availability-form";
import { ChatSlot } from "./chat-slot";
import { EASE } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/provider";
import { spokenLanguages } from "@/i18n/languages";

/**
 * The concierge.
 *
 * Crete Holiday Home runs no chatbot, so rather than bolt a third-party widget
 * onto a hotel that answers its own phone, this is the desk itself: the real
 * routes to a real person, plus the booking form, in one panel that belongs to
 * the site rather than floating on top of it.
 *
 * It is a proper dialog — focus moves in, Escape closes, focus returns to the
 * launcher — and it carries no third-party script, no cookie and no network
 * request until a guest chooses one.
 */

const ROUTE_ICONS = {
  call: Phone,
  whatsapp: MessageCircle,
  mobile: Smartphone,
  email: Mail,
} as const;

export function Concierge({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const { m, locale } = useI18n();

  const ROUTES = [
    {
      id: "call" as const,
      label: m.concierge.callReception,
      value: contact.phones[0].ext
        ? `${contact.phones[0].value} · ${m.common.ext} ${contact.phones[0].ext}`
        : contact.phones[0].value,
      href: contact.phones[0].href,
      note: m.common.receptionUntil.replace("{time}", reception.openUntil),
    },
    {
      /* Same number as the mobile below it, a different way in. For most
         guests arriving from abroad WhatsApp is free and a Greek mobile call
         is not, which decides whether the question gets asked at all. */
      id: "whatsapp" as const,
      label: m.concierge.whatsapp,
      value: contact.phones[1].value,
      href: contact.whatsapp.url(m.concierge.whatsappGreeting),
      note: m.concierge.whatsappNote,
    },
    {
      id: "mobile" as const,
      label: m.concierge.mobile,
      value: contact.phones[1].value,
      href: contact.phones[1].href,
      note: m.concierge.urgent,
    },
    {
      id: "email" as const,
      label: m.concierge.writeToUs,
      value: contact.emails.general,
      href: `mailto:${contact.emails.general}?subject=${encodeURIComponent("Enquiry — Ink Hotels, Rethymno")}`,
      note: m.concierge.withinADay,
    },
  ];

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.4, ease: EASE }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-[160] bg-ink/55 backdrop-blur-[3px]"
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label="Speak to the desk"
            data-ground="ink"
            data-lenis-prevent
            initial={reduced ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: reduced ? 0 : 0.55, ease: EASE }}
            className={cn(
              "fixed z-[170] flex max-h-[88svh] flex-col overflow-y-auto overscroll-contain",
              "inset-x-0 bottom-0 lg:inset-auto lg:bottom-8 lg:right-8 lg:w-[27rem]",
              "shadow-[0_20px_80px_-20px_rgb(26_21_18/0.7)]",
            )}
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <div className="flex items-start justify-between gap-6 px-7 pt-7">
              <div>
                <p className="label mb-2 text-phos">{m.concierge.eyebrow}</p>
                <p className="font-display text-[length:var(--text-d4)] leading-tight text-paper">
                  {m.concierge.title}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label={m.actions.close}
                className="-mr-2 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center text-paper/70 transition-colors hover:text-paper"
              >
                <X className="h-4.5 w-4.5" strokeWidth={1.25} />
              </button>
            </div>

            <p className="px-7 pt-3 text-sm text-paper/70">
              {m.concierge.intro.replace("{languages}", spokenLanguages(locale))}
            </p>

            {/* ── Real routes to a real person ─────────────────────────── */}
            <ul className="mt-6 px-7">
              {ROUTES.map((r) => {
                const Icon = ROUTE_ICONS[r.id];
                return (
                  <li key={r.id}>
                    <a
                      href={r.href}
                      className="group flex items-center gap-4 border-t border-paper/12 py-4 transition-colors duration-300 hover:bg-paper/[0.04]"
                    >
                      <Icon
                        className="h-4 w-4 shrink-0 text-phos"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="label block text-paper/55">
                          {r.label}
                        </span>
                        <span className="spec block truncate text-paper">
                          {r.value}
                        </span>
                      </span>
                      <span className="spec shrink-0 text-paper/40">
                        {r.note}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* An assistant, if one is configured — inside the panel, in our
                own frame, rather than floating in a corner of its own. */}
            <ChatSlot
              label="Chat with us"
              hint="Start a conversation with our assistant"
            />

            {/* ── Or just take the dates ───────────────────────────────── */}
            <div className="mt-6 border-t border-paper/12 px-7 pb-8 pt-7">
              <p className="label mb-5 text-paper/55">{m.concierge.orFindDates}</p>
              <AvailabilityForm tone="light" layout="stack" />
            </div>

            <div className="border-t border-paper/12 px-7 py-5">
              <a
                href={contact.group.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between gap-4 text-sm text-paper/60 transition-colors hover:text-paper"
              >
                <span>
                  {m.concierge.villasLine
                    .split("{group}")
                    .flatMap((part, i) =>
                      i === 0
                        ? [part]
                        : [
                            <span key="g" className="text-paper/85">
                              {contact.group.name}
                            </span>,
                            part,
                          ],
                    )}
                </span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 shrink-0 transition-transform duration-500 ease-settle group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/** The launcher. Sits beside the booking action, never on top of content. */
export function ConciergeButton({
  onClick,
  className,
}: {
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex items-center gap-2.5 border border-paper/30 bg-ink/85 px-5 py-3.5 text-paper backdrop-blur-md",
        "transition-colors duration-500 ease-settle hover:border-paper/60 hover:bg-ink",
        className,
      )}
    >
      <MessageCircle className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
      <span className="label">Ask us</span>
    </button>
  );
}

/** Convenience hook so the header, dock and any CTA can open the same panel. */
export function useConcierge() {
  const [open, setOpen] = useState(false);
  return { open, setOpen };
}
