import type { CSSProperties, ReactNode } from "react";
import { cn, folio } from "@/lib/utils";

/**
 * Sections declare their ground; the ground decides every colour inside it.
 * Components never name a pigment — they use --fg / --bg / --link / --border,
 * which is what makes the contrast guarantees structural rather than a matter
 * of remembering.
 */

export type Ground = "paper" | "shade" | "sun" | "ink" | "night";

export function Section({
  children,
  className,
  id,
  ground = "paper",
  size = "md",
  grain = true,
  plaster = false,
  wash,
  label,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  ground?: Ground;
  size?: "sm" | "md" | "lg" | "none";
  grain?: boolean;
  /** Trowel and pore texture, for the long light sections. */
  plaster?: boolean;
  /**
   * Bleed the previous section's colour into the top edge, the way ink
   * spreads on damp paper. Pass the colour that is bleeding in.
   */
  wash?: "ink" | "night" | "paper" | "shade" | "sun";
  label?: string;
}) {
  const WASH_VAR: Record<string, string> = {
    ink: "var(--color-ink)",
    night: "var(--color-night)",
    paper: "var(--color-paper)",
    shade: "var(--color-paper-shade)",
    sun: "var(--color-sun)",
  };

  return (
    <section
      id={id}
      data-ground={ground}
      aria-label={label}
      style={wash ? ({ "--wash": WASH_VAR[wash] } as CSSProperties) : undefined}
      className={cn(
        "relative w-full",
        grain && "grain",
        plaster && "plaster",
        wash && "wash",
        size === "sm" && "py-section-sm",
        size === "md" && "py-section",
        size === "lg" && "py-section-lg",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function Container({
  children,
  className,
  wide = false,
}: {
  children: ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative z-[2] mx-auto w-full px-6 sm:px-8 lg:px-12",
        wide ? "max-w-[1680px]" : "max-w-[1440px]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * The fixed opening move of every section: a folio number, an eyebrow, and
 * the heading — so the reader always knows where in the book they are.
 */
export function SectionHead({
  index,
  eyebrow,
  children,
  className,
  align = "start",
}: {
  index?: number;
  eyebrow?: string;
  children?: ReactNode;
  className?: string;
  align?: "start" | "center";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {(index !== undefined || eyebrow) && (
        <p className="label flex items-center gap-4 text-[color:var(--fg-3)]">
          {index !== undefined && <span aria-hidden="true">{folio(index)}</span>}
          {index !== undefined && eyebrow && (
            <span
              aria-hidden="true"
              className="block h-px w-8 bg-[color:var(--hairline)]"
            />
          )}
          {eyebrow}
        </p>
      )}
      {children}
    </div>
  );
}

/** A hairline that separates movements of the page. Decorative only. */
export function Rule({ className }: { className?: string }) {
  return (
    <hr
      aria-hidden="true"
      data-decorative
      className={cn("h-px w-full border-0 bg-[color:var(--hairline)]", className)}
    />
  );
}

/** Section heading — the display face at its working sizes. */
export function Heading({
  children,
  level = 2,
  size = "d3",
  className,
}: {
  children: ReactNode;
  level?: 1 | 2 | 3;
  size?: "d1" | "d2" | "d3" | "d4";
  className?: string;
}) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      className={cn(
        "font-display leading-[1.02] tracking-[-0.017em]",
        size === "d1" && "text-[length:var(--text-d1)]",
        size === "d2" && "text-[length:var(--text-d2)]",
        size === "d3" && "text-[length:var(--text-d3)]",
        size === "d4" && "text-[length:var(--text-d4)]",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
