import type { CSSProperties, ElementType, ReactNode } from "react";
import { cn, folio } from "@/lib/utils";
import { SplitReveal } from "@/components/motion/split-reveal";

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
  stock = "wove",
  plaster = false,
  wash,
  chapter,
  name,
  label,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  ground?: Ground;
  size?: "sm" | "md" | "lg" | "none";
  grain?: boolean;
  /**
   * Which sheet this chapter is printed on. `wove` is the even machine-made
   * stock and the default; `laid` carries more fibre and the mould's chain
   * lines, for the chapters that are writing rather than tariff.
   */
  stock?: "wove" | "laid";
  /** Trowel and pore texture, for the long light sections. */
  plaster?: boolean;
  /**
   * Bleed the previous section's colour into the top edge, the way ink
   * spreads on damp paper. Pass the colour that is bleeding in.
   */
  wash?: "ink" | "night" | "paper" | "shade" | "sun";
  /**
   * The folio this section carries in the margin spine — "01", "02". Sections
   * without one are not chapters and the spine skips them.
   */
  chapter?: string;
  /**
   * A stable identity for this block, emitted as `data-section`.
   *
   * Not for styling and not for the reader — it is how a check can tell which
   * of fifteen sections it is looking at. Matching on heading text would work
   * until the copy changed, and would need the catalogue for all five
   * languages; matching on position would break the first time one moved,
   * which is exactly the change these names exist to guard.
   */
  name?: string;
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
      data-stock={grain && stock === "laid" ? "laid" : undefined}
      data-chapter={chapter}
      data-section={name}
      className={cn(
        "relative w-full",
        grain && "grain",
        plaster && "plaster",
        size === "sm" && "py-section-sm",
        size === "md" && "py-section",
        size === "lg" && "py-section-lg",
        className,
      )}
    >
      {/* The bleeding edge is its own element rather than a ::before, because
          .plaster wants that pseudo-element too and quietly won. */}
      {wash ? (
        <span
          aria-hidden="true"
          className="wash-edge"
          style={{ "--wash": WASH_VAR[wash] } as CSSProperties}
        />
      ) : null}
      {children}
    </section>
  );
}

/**
 * A rule pressed into the sheet, optionally with the house mark set into it.
 *
 * Presentational and announced as nothing: a divider that a screen reader
 * reads out is just noise between two sections it can already tell apart.
 */
export function Deboss({
  mark = false,
  className,
}: {
  mark?: boolean;
  className?: string;
}) {
  if (!mark) {
    return <div aria-hidden="true" className={cn("deboss w-full", className)} />;
  }
  return (
    <div aria-hidden="true" className={cn("flex w-full items-center gap-6", className)}>
      <div className="deboss flex-1" />
      <span className="spec tracking-[0.3em] text-[color:var(--fg-3)]">INK</span>
      <div className="deboss flex-1" />
    </div>
  );
}

/**
 * A foundry's margin mark. Decoration, so: aria-hidden, and only where there
 * is a margin wide enough to hold it.
 */
export function Specimen({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span aria-hidden="true" className={cn("specimen hidden xl:block", className)}>
      {children}
    </span>
  );
}

/**
 * The plate holds; the text moves past it.
 *
 * A chapter's photograph pins at the top of the viewport while its prose
 * advances alongside — so the reader keeps looking at the place they are
 * reading about instead of scrolling it off the top of the screen.
 *
 * ── Three conditions, all of them easy to break silently ───────────────────
 *
 * ONLY WHERE THERE ARE TWO COLUMNS. Below `lg` the layout stacks, and a
 * pinned image above stacked text is a photograph that will not go away.
 *
 * THE ROW MUST NOT STRETCH. A grid row defaults to `align-items: stretch`, so
 * the media column is already as tall as the text column and has no room left
 * to travel — sticky then does exactly nothing while looking correctly
 * written. Hence `self-start`, and `items-start` on the row rather than the
 * `items-center` these rows used to carry.
 *
 * NO CLIPPING OR TRANSFORMED ANCESTOR. Either one becomes the containing block
 * for the sticky element and the pin quietly stops working — the same trap
 * that `overflow-hidden` on TheName set for the Story write-on.
 */
export function StickyMedia({
  children,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  /** `figure` where the plate is a plate, so the element stays honest. */
  as?: ElementType;
}) {
  return (
    <Tag className={cn("lg:sticky lg:top-[max(6rem,12vh)] lg:self-start", className)}>
      {children}
    </Tag>
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
  split = false,
}: {
  children: ReactNode;
  level?: 1 | 2 | 3;
  size?: "d1" | "d2" | "d3" | "d4";
  className?: string;
  /**
   * Reveal the heading a word at a time, each rising out of its own mask.
   *
   * Only honoured when the child is a plain string — a heading built from
   * elements cannot be split without throwing its markup away, and silently
   * doing nothing is better than silently mangling it.
   */
  split?: boolean;
}) {
  const Tag = `h${level}` as const;

  const classes = cn(
    "font-display leading-[1.02] tracking-[-0.017em]",
    size === "d1" && "text-[length:var(--text-d1)]",
    size === "d2" && "text-[length:var(--text-d2)]",
    size === "d3" && "text-[length:var(--text-d3)]",
    size === "d4" && "text-[length:var(--text-d4)]",
    className,
  );

  if (split && typeof children === "string") {
    return <SplitReveal text={children} as={Tag} className={classes} />;
  }

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
