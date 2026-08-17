"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Disclosure list. Radix supplies the keyboard model and the ARIA wiring; the
 * chrome is ours — a hairline, a rule that turns, and no rounded corners.
 */

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({
  value,
  question,
  children,
}: {
  value: string;
  question: string;
  children: React.ReactNode;
}) {
  return (
    <AccordionPrimitive.Item
      value={value}
      className="border-b border-[color:var(--hairline)]"
    >
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger
          className={cn(
            "group flex w-full items-start justify-between gap-6 py-6 text-left",
            "focus-visible:outline-offset-2",
          )}
        >
          <span className="font-display text-[length:var(--text-d4)] leading-tight">
            {question}
          </span>
          <Plus
            aria-hidden="true"
            strokeWidth={1}
            className="mt-1.5 h-5 w-5 shrink-0 text-[color:var(--fg-3)] transition-transform duration-500 ease-settle group-data-[state=open]:rotate-45"
          />
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>

      <AccordionPrimitive.Content
        className={cn(
          "overflow-hidden",
          "data-[state=open]:animate-[accordionOpen_420ms_var(--ease-settle)]",
          "data-[state=closed]:animate-[accordionClose_320ms_var(--ease-settle)]",
        )}
      >
        <div className="measure-wide pb-7 pr-10 text-[color:var(--fg-2)]">
          {children}
        </div>
      </AccordionPrimitive.Content>
    </AccordionPrimitive.Item>
  );
}
