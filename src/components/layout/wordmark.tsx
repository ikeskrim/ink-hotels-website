import { cn } from "@/lib/utils";

/**
 * The Ink mark: a thumbprint of concentric rings — an impression pressed into a
 * surface — beside monoline letterforms.
 *
 * Redrawn from the property's own logo as vector, so it stays crisp at any size
 * and inherits `currentColor` rather than shipping a white PNG that disappears
 * on light grounds. The mark itself is unchanged; only its rendering is.
 *
 * Ring count is size-dependent. The original has ten rings, which at a 24px
 * header lockup fall roughly a pixel apart and alias into a grey disc. Seven
 * rings read as a thumbprint at that size and still resolve; the full ten are
 * drawn only where there is room for them.
 */

const RINGS = [
  { r: 3.6, dx: 0, dy: 0 },
  { r: 8.4, dx: 0.6, dy: 0.4 },
  { r: 13.4, dx: 1.4, dy: 0.9 },
  { r: 18.6, dx: 2.4, dy: 1.5 },
  { r: 24.0, dx: 3.6, dy: 2.2 },
  { r: 29.6, dx: 5.0, dy: 3.0 },
  { r: 35.4, dx: 6.6, dy: 3.9 },
  { r: 41.4, dx: 8.4, dy: 4.9 },
];

/** Rings dropped first when the mark is drawn small. */
const COMPACT_RINGS = RINGS.filter((_, i) => i !== 1 && i !== 3);

export function Wordmark({
  className,
  compact = false,
  showPlace = false,
  markColor = "brand",
}: {
  className?: string;
  /** Fewer rings, for lockups under ~28px tall. */
  compact?: boolean;
  showPlace?: boolean;
  /** `brand` paints the rings teal; `inherit` follows the surrounding colour. */
  markColor?: "brand" | "inherit";
}) {
  const rings = compact ? COMPACT_RINGS : RINGS;

  return (
    <svg
      viewBox={showPlace ? "0 0 330 118" : "0 0 330 100"}
      role="img"
      aria-label="Ink Hotels"
      fill="none"
      className={cn("block overflow-visible", className)}
    >
      {/* ── The thumbprint ───────────────────────────────────────────────
          The mark is teal on the hotel's own signage. It keeps that colour
          wherever there is enough contrast for it, and falls back to
          currentColor over photography, where the real-world sign is white. */}
      <g
        stroke={markColor === "brand" ? "var(--color-sea)" : "currentColor"}
        strokeWidth={compact ? 4.2 : 3.4}
      >
        {rings.map((ring, i) => (
          <circle
            key={i}
            cx={46 - ring.dx}
            cy={50 - ring.dy}
            r={ring.r}
            className={cn(
              "origin-center",
              /* The rings settle outward once, as an impression spreading. */
              "motion-safe:animate-[markSettle_900ms_var(--ease-settle)_backwards]",
            )}
            style={{ animationDelay: `${i * 55}ms` }}
          />
        ))}
      </g>

      {/* ── I N K ──────────────────────────────────────────────────────── */}
      <g
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M132 20 V80" />
        <path d="M166 80 V20 L212 80 V20" />
        <path d="M246 20 V80 M292 20 L252 52 M266 41 L296 80" />
      </g>

      {showPlace && (
        <text
          x="132"
          y="110"
          fill="currentColor"
          fontSize="9"
          letterSpacing="5.6"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          RETHYMNO · CRETE
        </text>
      )}
    </svg>
  );
}
