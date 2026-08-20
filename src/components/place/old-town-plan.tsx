import Link from "next/link";

import { PLACE_GEO, distanceMetres, offsetMetres } from "@/content/places-geo";
import { getPlaces } from "@/lib/sanity/content";
import { getMessages } from "@/i18n";
import { localePath, type Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

/**
 * The quarter, plotted from the door.
 *
 * ── Why there is no map under it ───────────────────────────────────────────
 * A tiled basemap means a third-party request on every view, an attribution
 * obligation, and a page that looks broken when the tile server is slow. A
 * drawn street plan means drawing the streets of Rethymno, which would be
 * invention with a pen instead of invention with a number. So this plots only
 * what is verified — four places and the reception — on an empty ground, with
 * a north mark and a scale bar so it is legible as what it is: a bearing and
 * distance diagram, not a navigation aid. It says so, in the reader's
 * language, underneath.
 *
 * Every position comes from `places-geo.ts`, where each coordinate names the
 * OpenStreetMap element it was read from.
 *
 * ── Why it is HTML and not SVG or canvas ───────────────────────────────────
 * The hotspots are links, and links inside SVG are a well-known way to lose
 * the focus ring, the focus order and half of VoiceOver. These are ordinary
 * anchors in an ordinary list, absolutely positioned by percentage. Tab order
 * is document order; the focus ring is the site's own; a screen reader reads
 * "The Fortezza, 410 metres" and moves on. No script runs, and there is
 * nothing to hydrate — this is a server component.
 *
 * ── Where the pins go ──────────────────────────────────────────────────────
 * Equirectangular around the reception, which at this scale is exact to
 * centimetres, then scaled so the furthest place sits inside the frame with
 * room for its label. North is up, which the mark states rather than assumes.
 */
export async function OldTownPlan({
  locale,
  className,
}: {
  locale: Locale;
  className?: string;
}) {
  const m = getMessages(locale);
  const places = await getPlaces(locale);

  const pins = PLACE_GEO.map((geo) => {
    const place = places.find((p) => p.slug === geo.slug);
    return {
      ...geo,
      name: place?.name ?? geo.slug,
      ...offsetMetres(geo),
      metres: distanceMetres(geo),
    };
  }).filter((p) => p.name);

  if (!pins.length) return null;

  /* The frame is square and centred on the reception, so the extent is the
     furthest pin on either axis. The padding is for the labels, not the pins. */
  const reach = Math.max(...pins.map((p) => Math.max(Math.abs(p.east), Math.abs(p.north))));
  const extent = reach * 1.32;
  const pct = (metres: number) => 50 + (metres / extent) * 50;

  /* A scale bar of a round number that fits: 100, 200 or 500 metres. */
  const bar = [500, 200, 100].find((n) => n / extent < 0.8) ?? 100;

  return (
    <figure className={cn("relative", className)}>
      <div
        className="relative aspect-square w-full border border-[color:var(--hairline)]"
        /* The faint grid is the only ink on the ground: it says "this is a
           plan" without pretending to be streets. */
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, color-mix(in oklab, var(--color-ink) 5%, transparent) 0 1px, transparent 1px 12.5%), repeating-linear-gradient(90deg, color-mix(in oklab, var(--color-ink) 5%, transparent) 0 1px, transparent 1px 12.5%)",
        }}
      >
        {/* North. Stated, because a plan that does not say which way is up is
            a picture. */}
        <span
          aria-hidden="true"
          className="spec absolute left-1/2 top-3 -translate-x-1/2 text-[color:var(--fg-3)]"
        >
          ↑ {m.mapPlan.north}
        </span>

        {/* The reception, at the origin. */}
        <span
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--link)]"
        />
        <span
          aria-hidden="true"
          className="label absolute left-1/2 top-1/2 ml-3 -translate-y-1/2 whitespace-nowrap text-[color:var(--fg-2)]"
        >
          {m.mapPlan.reception}
        </span>

        <ul className="contents">
          {pins.map((pin) => {
            const left = pct(pin.east);
            /* North is up, so a positive northing is a smaller top. */
            const top = 100 - pct(pin.north);
            /* Labels flip to the inside near an edge so they cannot clip. */
            const flip = left > 62;

            return (
              <li key={pin.slug}>
                <Link
                  href={localePath(locale, `/rethymno#${pin.slug}`)}
                  className={cn(
                    "group absolute -translate-x-1/2 -translate-y-1/2",
                    "focus-visible:outline-offset-4",
                  )}
                  style={{ left: `${left}%`, top: `${top}%` }}
                >
                  <span className="flex items-center gap-2" style={flip ? { flexDirection: "row-reverse" } : undefined}>
                    <span
                      aria-hidden="true"
                      className="block h-2 w-2 shrink-0 rotate-45 border border-[color:var(--fg-2)] bg-[color:var(--bg)] transition-colors duration-500 ease-settle group-hover:bg-[color:var(--fg-1)]"
                    />
                    <span className="whitespace-nowrap">
                      <span className="label block text-[color:var(--fg-1)] underline-offset-4 group-hover:underline">
                        {pin.name}
                      </span>
                      <span className="spec block text-[color:var(--fg-3)]">
                        {m.mapPlan.metres.replace("{n}", String(pin.metres))}
                      </span>
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* The scale bar, so the distances are checkable against the drawing. */}
        <div
          aria-hidden="true"
          className="absolute bottom-3 left-3 flex items-center gap-2"
        >
          <span
            className="block h-px bg-[color:var(--fg-3)]"
            style={{ width: `${(bar / extent) * 50}%` }}
          />
          <span className="spec text-[color:var(--fg-3)]">
            {m.mapPlan.metres.replace("{n}", String(bar))}
          </span>
        </div>
      </div>

      <figcaption className="spec mt-4 text-[color:var(--fg-3)]">
        {m.mapPlan.note}
      </figcaption>
    </figure>
  );
}
