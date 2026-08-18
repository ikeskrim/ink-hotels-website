import { cn } from "@/lib/utils";

/**
 * The mark, pressed into the sheet rather than printed onto it.
 *
 * A deboss has no ink in it. The letterform is struck into the stock and you
 * read it entirely by the light: a shadow down one edge of the impression and
 * a lit ridge down the other. So this sets the word in the ground's own colour
 * at very low contrast and stacks two offset copies behind it — one darker and
 * a hair below, one lighter and a hair above — from the same fixed light
 * source as every other surface on the site: above and slightly left.
 *
 * It is the quietest possible way to sign a page, which is why it belongs at
 * the very bottom of one. A printer's blind stamp is not an announcement.
 *
 * Presentational: the accessible name of this site is in the masthead and in
 * `<title>`, and a screen reader meeting "Ink" a fourth time in the footer has
 * been told nothing. `aria-hidden`, no text alternative, no heading.
 */
export function DebossMark({
  word = "INK",
  className,
}: {
  word?: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-block select-none font-display leading-none",
        "tracking-[0.18em] text-[clamp(2.75rem,7vw,4.5rem)]",
        className,
      )}
    >
      {/* The trough: the shadow the press leaves on the far side of the
          impression. Sits under the face, one pixel down. */}
      <span
        className="absolute inset-0 translate-y-[1.5px] blur-[0.6px]"
        style={{ color: "rgb(0 0 0 / 0.42)" }}
      >
        {word}
      </span>
      {/* The ridge: the lit edge on the near side, one pixel up. */}
      <span
        className="absolute inset-0 -translate-y-[1px] blur-[0.4px]"
        style={{ color: "rgb(255 255 255 / 0.14)" }}
      >
        {word}
      </span>
      {/* The face itself, barely there — the stock showing through. */}
      <span className="relative" style={{ color: "rgb(255 255 255 / 0.05)" }}>
        {word}
      </span>
    </span>
  );
}
