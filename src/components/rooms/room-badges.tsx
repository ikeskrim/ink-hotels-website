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
}: {
  room: Room;
  className?: string;
  /** `over-photo` sits on an image; `inline` sits on the page ground. */
  tone?: "over-photo" | "inline";
}) {
  const { m } = useI18n();

  const badges: { key: string; label: string; icon: typeof Waves }[] = [];
  if (room.hotTub) badges.push({ key: "hotTub", label: m.rooms.badgeHotTub, icon: Waves });
  if (room.plungePool)
    badges.push({ key: "pool", label: m.rooms.badgePlungePool, icon: Droplets });
  if (room.accessible)
    badges.push({ key: "a11y", label: m.rooms.badgeAccessible, icon: Accessibility });
  if (room.adultsOnly)
    badges.push({ key: "adults", label: m.rooms.badgeAdultsOnly, icon: Waves });

  if (!badges.length) return null;

  return (
    <ul className={cn("flex flex-wrap gap-1.5", className)}>
      {badges.map(({ key, label, icon: Icon }) => (
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
