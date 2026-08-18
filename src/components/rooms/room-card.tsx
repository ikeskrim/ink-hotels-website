"use client";

import Image from "next/image";
import { blurFor } from "@/content/generated/blur";
import Link from "next/link";

import type { Room } from "@/content/rooms";
import { houses } from "@/content/rooms";
import { cn } from "@/lib/utils";
import { RoomBadges } from "@/components/rooms/room-badges";
import { useI18n } from "@/i18n/provider";
import { localePath } from "@/i18n/config";
import { roomSpecs } from "@/i18n/specs";

/**
 * A room, led by its photograph.
 *
 * The plate is the card: full-bleed, portrait, with the house and the room's
 * name set into the foot of it and the specifics — outlook, terrace, size,
 * beds — surfacing underneath when the reader shows interest. Twenty rooms
 * shown as twenty photographs is a page you look at; twenty rooms shown as
 * twenty spec lists is a page you audit.
 *
 * ── Nothing is traded away for the effect ──────────────────────────────────
 * The link, the photograph count, the badge and the full spec line are all
 * still here. The reveal changes when the specifics are shown, never whether
 * they exist — they are in the markup on first paint, so they are in the page
 * source, in the accessible tree, and in what a crawler reads.
 *
 * ── The hover rule points the safe way ─────────────────────────────────────
 * `.card-reveal` is visible by default and only hides itself inside
 * `(hover: hover)`. Authored the other way round — hidden, revealed on
 * :hover — the specifics would be permanently invisible on every phone, which
 * is how this pattern usually ships broken. Focus reveals it too, or a
 * keyboard reader tabs onto a card and is told nothing.
 *
 * We never rename a room — the string here is re-laid out from the official
 * name the reservation engine uses, so recognition at handoff is lossless. The
 * suites are the exception: Evexia, Harmony, Agapi, Pathos, Elpida, Eros and
 * Zoi already carry real names in the engine.
 *
 * No reservation-system record numbers appear anywhere. They are internal
 * database keys, meaningless to a guest, and dressing them up as archive marks
 * would be the one place a site built on not inventing things invented something.
 */
export function RoomCard({
  room,
  priority = false,
  className,
  sizes = "(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 100vw",
}: {
  room: Room;
  priority?: boolean;
  className?: string;
  sizes?: string;
}) {
  const { m, locale } = useI18n();
  const house = houses.find((h) => h.id === room.house);
  const cover = room.images[0];

  const attributes = [room.outlook, room.outdoor]
    .filter(Boolean)
    .filter((v, i, a) => a.indexOf(v) === i);

  /* Built by the shared formatter, not assembled here from English nouns and
     an `s`. This line appears on every card on every page in five languages;
     it was the most-repeated untranslated string on the site. */
  const specs = roomSpecs(room, m, locale);

  return (
    <article className={cn("group", className)}>
      <Link
        href={localePath(locale, `/rooms/${room.slug}`)}
        className="block focus-visible:outline-offset-4"
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-[color:var(--bg-lift)]">
          {cover && (
            <Image
              src={cover}
              placeholder={blurFor(cover) ? "blur" : "empty"}
              blurDataURL={blurFor(cover)}
              alt={`${room.name} at Ink Hotels`}
              fill
              priority={priority}
              sizes={sizes}
              quality={78}
              className="object-cover transition-transform duration-[1200ms] ease-settle group-hover:scale-[1.04]"
            />
          )}

          {/* The scrim is not decoration — it is what makes the lockup legible
              over an unknown photograph. Deepest at the foot, where the type
              sits, and it strengthens a little on hover as the reveal arrives. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-transparent transition-opacity duration-700 ease-settle group-hover:opacity-100 sm:opacity-90"
          />

          {/* The facts a guest filters on, said on the plate rather than three
              clicks in: the hot tub, the plunge pool, step-free access, and
              whether the room takes children. One badge, not four — a card
              answers one question; the detail page carries the full set. */}
          <RoomBadges room={room} limit={1} className="absolute left-3 top-3" />

          {room.images.length > 1 && (
            <span className="spec absolute right-3 top-3 bg-ink/70 px-2 py-1 text-paper backdrop-blur-sm">
              {room.images.length}
            </span>
          )}

          <div className="absolute inset-x-0 bottom-0 p-[clamp(1rem,2vw,1.5rem)]">
            <p className="label mb-2 text-paper/70">{house?.name}</p>
            <h3 className="font-display text-[length:var(--text-d4)] leading-tight text-paper">
              <span className="relative inline-block">
                {room.displayName}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-[600ms] ease-settle group-hover:origin-left group-hover:scale-x-100"
                />
              </span>
            </h3>

            <div className="card-reveal">
              {attributes.length > 0 && (
                <p className="mt-2.5 text-paper/85">{attributes.join(" · ")}</p>
              )}
              <p className="spec mt-2 text-paper/65">{specs.join(" · ")}</p>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
