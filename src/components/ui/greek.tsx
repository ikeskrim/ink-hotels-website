import { cn } from "@/lib/utils";

/**
 * Greek, set deliberately.
 *
 * IBM Plex Mono ships no Greek subset, so Greek inside a `.label` or `.spec`
 * would fall through the stack and break the word — Αρμονία renders as
 * ΑΡΜΟΝ1Α. Every Greek word that is part of the design is therefore set here,
 * in EB Garamond, which carries real Greek.
 *
 * Uppercase tracking is also not applied: Greek does not take the wide letter-
 * spacing that Latin small-caps labels do, and polytonic accents collide with
 * it. The word keeps its own case and its own colour on the page.
 */
export function Gk({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <span
      lang="el"
      className={cn(
        "font-display text-[1.25em] font-medium normal-case tracking-normal",
        className,
      )}
    >
      {children}
    </span>
  );
}
