"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/provider";
import { localePath } from "@/i18n/config";

/**
 * Carry the reader's language across an internal link.
 *
 * Links were written as plain site paths — `/rooms/evexia` — and the middleware
 * was left to sort the language out. It does, but only for a visitor who has a
 * `ink_locale` cookie, and the visitor most likely to be reading German has no
 * cookie at all: they arrived on /de straight from a search result, through the
 * hreflang alternates. Measured before this change, on a fresh context:
 *
 *   no cookie:   /rooms/evexia → /rooms/evexia   lang=en-GB
 *   with cookie: /rooms/evexia → /de/rooms/evexia lang=de-DE
 *
 * So the reader who found the German page the way Google intends lost German on
 * their first click, and every subsequent page was English. Prefixing here fixes
 * it for every caller at once rather than asking twenty-two files to remember.
 *
 * External URLs, anchors, mail and tel links are returned untouched.
 */
function useLocalisedHref(href: ComponentProps<typeof Link>["href"]) {
  const { locale } = useI18n();
  if (typeof href !== "string") return href;
  if (!href.startsWith("/") || href.startsWith("//")) return href;
  return localePath(locale, href);
}

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
  href,
  ...props
}: ComponentProps<typeof Link> & { children: ReactNode }) {
  return (
    <Link
      {...props}
      href={useLocalisedHref(href)}
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
