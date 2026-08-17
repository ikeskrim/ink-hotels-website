"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * A link whose rule is drawn the way ink spreads into paper: it grows from the
 * leading edge on hover, and retracts to the trailing edge on leave, so the
 * gesture reads as a stroke rather than a toggle.
 *
 * Implemented with a scaled pseudo-element rather than a width transition so it
 * stays on the compositor.
 */
export function InkLink({
  children,
  className,
  ...props
}: ComponentProps<typeof Link> & { children: ReactNode }) {
  return (
    <Link
      {...props}
      className={cn(
        "group relative isolate inline-block",
        /* The rule: drawn from the leading edge, retracted to the trailing one. */
        "after:absolute after:bottom-[-0.15em] after:left-0 after:h-px after:w-full",
        "after:origin-right after:scale-x-0 after:bg-current",
        "after:transition-transform after:duration-[600ms] after:ease-settle",
        "hover:after:origin-left hover:after:scale-x-100",
        "focus-visible:after:origin-left focus-visible:after:scale-x-100",
        /* The drop: a wash of the same ink soaking up behind the words, a
           beat slower than the rule, so the two read as one gesture landing. */
        "before:absolute before:inset-x-0 before:-bottom-[0.08em] before:-z-10",
        "before:h-[0.62em] before:origin-left before:scale-x-0 before:bg-current/[0.12]",
        "before:transition-transform before:duration-[520ms] before:ease-settle",
        "hover:before:scale-x-100 focus-visible:before:scale-x-100",
        "focus-visible:outline-none",
        className,
      )}
    >
      {children}
    </Link>
  );
}

/** Same treatment for links that leave the site. */
export function InkAnchor({
  children,
  className,
  ...props
}: ComponentProps<"a"> & { children: ReactNode }) {
  return (
    <a
      {...props}
      className={cn(
        "group relative isolate inline-block",
        /* The rule: drawn from the leading edge, retracted to the trailing one. */
        "after:absolute after:bottom-[-0.15em] after:left-0 after:h-px after:w-full",
        "after:origin-right after:scale-x-0 after:bg-current",
        "after:transition-transform after:duration-[600ms] after:ease-settle",
        "hover:after:origin-left hover:after:scale-x-100",
        "focus-visible:after:origin-left focus-visible:after:scale-x-100",
        /* The drop: a wash of the same ink soaking up behind the words, a
           beat slower than the rule, so the two read as one gesture landing. */
        "before:absolute before:inset-x-0 before:-bottom-[0.08em] before:-z-10",
        "before:h-[0.62em] before:origin-left before:scale-x-0 before:bg-current/[0.12]",
        "before:transition-transform before:duration-[520ms] before:ease-settle",
        "hover:before:scale-x-100 focus-visible:before:scale-x-100",
        "focus-visible:outline-none",
        className,
      )}
    >
      {children}
    </a>
  );
}
