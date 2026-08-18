"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { contact } from "@/content/site";
import { rooms } from "@/content/rooms";
import { useI18n } from "@/i18n/provider";

/**
 * Reserve — but reserve *what*.
 *
 * Every booking control on this site pointed at the engine's front page. On
 * `/rooms/harmony`, having read that one room, chosen it and pressed the most
 * prominent button on the page, the reader arrived at a list of twenty rooms
 * and had to find it again. The room's own panel already knew the id and
 * passed it; the header and the dock — the two controls a reader is most
 * likely to press, because they follow them down the page — did not.
 *
 * So the affordance reads the route. On a room page it carries that room's
 * `bedroom` id into the engine; anywhere else it opens the engine plainly,
 * which is the correct behaviour when there is no room in context.
 *
 * The visible label never changes — a button that renames itself as you scroll
 * is a button you have to re-read. The context goes into the accessible name
 * instead, so a screen reader hears "Book now, Harmony" and everyone else gets
 * a link that lands where they meant.
 *
 * Rooms with no `bookingId` yet fall back to the plain URL rather than sending
 * a made-up parameter. The room page says so in words beside its own panel.
 */
export function useReserveHref() {
  const pathname = usePathname() ?? "";
  const { m } = useI18n();

  /* `/rooms/<slug>`, with or without a locale prefix — and the prefix is
     matched as any two-letter segment rather than the list el|de|fr|nl.
     English is served by a middleware *rewrite*, so the browser shows
     /rooms/harmony while `usePathname` reports /en/rooms/harmony: a list of
     the four visible prefixes matched every locale except the default one,
     which is the one most readers are on. Measured before the fix — header
     deep=false on /rooms/harmony, deep=true on /el/rooms/harmony. */
  const match = /^\/(?:[a-z]{2}\/)?rooms\/([^/?#]+)/.exec(pathname);
  const slug = match?.[1];
  const room = slug ? rooms.find((r) => r.slug === slug) : undefined;

  const href = room?.bookingId
    ? `${contact.bookingUrl}?bedroom=${encodeURIComponent(room.bookingId)}`
    : contact.bookingUrl;

  return {
    href,
    room,
    /* "Book now" alone, or "Book now, Harmony" where there is a room. */
    label: room ? `${m.actions.bookNow}, ${room.name}` : undefined,
  };
}

export function ReserveLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { href, label } = useReserveHref();
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className={className}
    >
      {children}
    </a>
  );
}
