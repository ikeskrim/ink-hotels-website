"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Disclosure. Radix supplies the keyboard model and the ARIA wiring; the
 * chrome is ours — a hairline, a mark that turns, and no rounded corners.
 *
 * ── Why this is not a FAQ component ────────────────────────────────────────
 * It used to take a `question`, which is why it could only ever be a FAQ. The
 * same control is the right one for a room's layout, its occupancy and its
 * amenity list: three long blocks a reader wants one at a time. So the prop is
 * `label`, the panel takes arbitrary children, and there is a `meta` slot for
 * the one-line summary that belongs beside a closed row — "40 m²", "sleeps 3" —
 * because a disclosure that hides the answer entirely makes you open all of
 * them to find anything.
 *
 * ── The heading level is a prop, and it has to be ──────────────────────────
 * Radix renders the trigger inside an `h3`. That is right on the FAQ page,
 * where an `h2` sits above the list, and wrong anywhere the surrounding order
 * differs — and a skipped heading level is both an axe violation and a real
 * screen-reader stumble. `headingLevel` sets it per use site.
 *
 * ── Motion ─────────────────────────────────────────────────────────────────
 * The panel animates to its measured height, which Radix publishes as a custom
 * property, so it travels to its real size rather than to a guess. Under
 * reduced motion it does not animate at all: the panel is simply there. An
 * accordion is a control, and a control that makes you wait is worse than one
 * that does not move.
 */
export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({
  value,
  label,
  meta,
  headingLevel = 3,
  children,
  className,
}: {
  value: string;
  label: string;
  /** A short line that stays visible while the row is closed. */
  meta?: ReactNode;
  headingLevel?: 2 | 3 | 4;
  children: ReactNode;
  className?: string;
}) {
  const Tag = `h${headingLevel}` as const;

  return (
    <AccordionPrimitive.Item
      value={value}
      className={cn("border-b border-[color:var(--hairline)]", className)}
    >
      {/* asChild: the heading is ours, the trigger stays Radix's. */}
      <AccordionPrimitive.Header asChild>
        <Tag className="m-0">
          <AccordionPrimitive.Trigger
            className={cn(
              "group flex w-full items-start justify-between gap-6 py-6 text-left",
              "transition-colors duration-500 ease-settle hover:text-[color:var(--fg-1)]",
              "focus-visible:outline-offset-2",
            )}
          >
            <span className="flex-1">
              <span className="block font-display text-[length:var(--text-d4)] leading-tight">
                {label}
              </span>
              {meta ? (
                <span className="spec mt-2 block text-[color:var(--fg-3)]">
                  {meta}
                </span>
              ) : null}
            </span>

            {/* The mark: two hairlines, at exactly the weight of every other
                rule on the page. The vertical one folds away, so open reads as
                a minus without swapping an icon. */}
            <span
              aria-hidden="true"
              className="relative mt-3 block h-3 w-3 shrink-0"
            >
              <span className="absolute left-0 top-1/2 h-px w-full bg-[color:var(--fg-3)]" />
              <span
                className={cn(
                  "absolute left-1/2 top-0 h-full w-px bg-[color:var(--fg-3)]",
                  "origin-center transition-transform duration-500 ease-settle",
                  "group-data-[state=open]:scale-y-0",
                )}
              />
            </span>
          </AccordionPrimitive.Trigger>
        </Tag>
      </AccordionPrimitive.Header>

      <AccordionPrimitive.Content
        className={cn(
          "overflow-hidden",
          "data-[state=open]:animate-[accordionOpen_420ms_var(--ease-settle)]",
          "data-[state=closed]:animate-[accordionClose_320ms_var(--ease-settle)]",
          /* The reduced-motion override has to carry the same attribute
             selector as the rule it is overriding. A bare `motion-reduce:` is
             one class; `data-[state=open]:` is a class plus an attribute, so it
             wins on specificity and the panel animates anyway — measured:
             animation-name was still `accordionOpen` under
             prefers-reduced-motion. A media query adds no specificity of its
             own, which is exactly the trap. */
          "motion-reduce:data-[state=open]:animate-none",
          "motion-reduce:data-[state=closed]:animate-none",
        )}
      >
        <div className="measure-wide pb-7 pr-10 text-[color:var(--fg-2)]">
          {children}
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}
