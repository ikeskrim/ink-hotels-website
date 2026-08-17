"use client";

import { Accessibility, Droplets, Waves } from "lucide-react";

import type { Room } from "@/content/rooms";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/provider";

/**
 * The four facts that change whether a room is even a candidate.
 *
 * A hot tub, a plunge pool, step-free access and an adults-only policy are not
 * amenities in the sense that a hairdryer is one — they decide the booking, so
 * they are said on the plate rather than left for someone to find in a list of
 * fifteen. Everything else stays in the amenities.
 *
 * Each badge carries its own text; the icon is decorative and never the only
 * carrier of meaning.
 */
export function RoomBadges({
  room,
  className,
  tone = "over-photo",
  limit,
}: {
  room: Room;
  className?: string;
  /** `over-photo` sits on an image; `inline` sits on the page ground. */
  tone?: "over-photo" | "inline";
  /**
   * How many to show. A card passes 1; the detail page passes nothing and
   * gets the lot.
   *
   * Four badges stacked on a photograph stop being information and become
   * decoration — the eye reads a row of chips rather than the one thing that
   * distinguishes this room from the nineteen others. On a card there is
   * exactly one question worth answering, so only the first is shown, and the
   * order below is the answer to it.
   */
  limit?: number;
}) {
  const { m } = useI18n();

  /* Ordered by how much each fact decides a booking, not alphabetically.
     A private hot tub or a heated plunge pool is why someone chooses this
     hotel at all. Step-free access is not a luxury but a requirement: for the
     guest who needs it, it outranks everything except the water they came
     for. Adults-only is last because it excludes rather than attracts. */
  const badges: { key: string; label: string; icon: typeof Waves }[] = [];
  if (room.hotTub) badges.push({ key: "hotTub", label: m.rooms.badgeHotTub, icon: Waves });
  if (room.plungePool)
    badges.push({ key: "pool", label: m.rooms.badgePlungePool, icon: Droplets });
  if (room.accessible)
    badges.push({ key: "a11y", label: m.rooms.badgeAccessible, icon: Accessibility });
  if (room.adultsOnly)
    badges.push({ key: "adults", label: m.rooms.badgeAdultsOnly, icon: Waves });

  if (!badges.length) return null;

  const shown = typeof limit === "number" ? badges.slice(0, limit) : badges;

  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {shown.map(({ key, label, icon: Icon }) => (
        <li
          key={key}
          className={cn(
            "label flex items-center gap-1.5 px-2.5 py-1.5",
            tone === "over-photo"
              ? "bg-ink/72 text-paper backdrop-blur-sm"
              : "border border-[color:var(--hairline)] text-[color:var(--fg-2)]",
          )}
        >
          {key !== "adults" && (
            <Icon className="h-3 w-3" strokeWidth={1.75} aria-hidden="true" />
          )}
          {label}
        </li>
      ))}
    </ul>
  );
}
