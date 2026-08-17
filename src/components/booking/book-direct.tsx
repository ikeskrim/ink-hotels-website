"use client";

import { KeyRound, CalendarCheck, MessageCircle } from "lucide-react";

import { useI18n } from "@/i18n/provider";
import { cn } from "@/lib/utils";

/**
 * Why book here rather than through an agency.
 *
 * Three reasons, and every one of them is checkable against the rest of the
 * site: the family that runs Ink is named on the story page, the arrangements
 * are the experiences the desk already lists, and the phone, the WhatsApp
 * number and the 23:00 closing time are all published facts.
 *
 * There is no rate claim here, and there will not be one until the owner
 * confirms in writing that direct is never beaten — "best price guaranteed" is
 * the single most-copied line in hotel marketing and the easiest to be caught
 * out on by a guest with a comparison tab open. The reasons above are true
 * whatever the rate is, which is what makes them worth printing.
 *
 * Deliberately quiet: a bordered aside beside the booking control, not a
 * coloured banner. A luxury booking flow that shouts is a booking flow that
 * looks like it is arguing.
 */
export function BookDirect({
  className,
  tone = "paper",
}: {
  className?: string;
  /** `paper` sits on a light ground; `ink` on a dark one. */
  tone?: "paper" | "ink";
}) {
  const { m } = useI18n();

  const reasons = [
    { key: "keys", icon: KeyRound, text: m.booking.bookDirectKeys },
    { key: "arrange", icon: CalendarCheck, text: m.booking.bookDirectArrange },
    { key: "answer", icon: MessageCircle, text: m.booking.bookDirectAnswer },
  ];

  return (
    <aside
      className={cn(
        "border-l-2 pl-5",
        tone === "ink"
          ? "border-[color:var(--color-phos)]"
          : "border-[color:var(--link)]",
        className,
      )}
    >
      <p
        className={cn(
          "label mb-4",
          tone === "ink" ? "text-phos" : "text-[color:var(--fg-3)]",
        )}
      >
        {m.booking.bookDirectTitle}
      </p>
      <ul className="space-y-3">
        {reasons.map(({ key, icon: Icon, text }) => (
          <li key={key} className="flex items-start gap-3">
            <Icon
              aria-hidden="true"
              className={cn(
                "mt-[0.15em] h-4 w-4 shrink-0",
                tone === "ink" ? "text-olive" : "text-[color:var(--fg-3)]",
              )}
            />
            <span
              className={cn(
                "measure text-sm leading-relaxed",
                tone === "ink" ? "text-paper/80" : "text-[color:var(--fg-2)]",
              )}
            >
              {text}
            </span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
