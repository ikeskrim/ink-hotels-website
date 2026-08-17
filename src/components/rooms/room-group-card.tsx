"use client";

import Image from "next/image";
import Link from "next/link";

import type { House } from "@/content/rooms";
import { roomsInHouse } from "@/content/rooms";
import { Gk } from "@/components/ui/greek";
import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/provider";
import { localeTags } from "@/i18n/config";

/**
 * A house, presented photograph-first.
 *
 * The 326 photographs are the only thing that actually sells these rooms, so
 * nothing abstract is allowed to sit between the guest and the picture at the
 * moment they choose where to sleep.
 */
export function RoomGroupCard({
  house,
  image,
  promise,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 46vw, 100vw",
}: {
  house: House;
  image: string;
  promise: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const { m, locale } = useI18n();
  const inHouse = roomsInHouse(house.id);
  const sizes_m2 = inHouse
    .map((r) => r.sizeSqm)
    .filter((n): n is number => typeof n === "number");

  const range =
    sizes_m2.length > 1
      ? `${Math.min(...sizes_m2)}–${Math.max(...sizes_m2)} m²`
      : sizes_m2.length === 1
        ? `${sizes_m2[0]} m²`
        : null;

  /* Digits, not spelled-out numerals. "Six room types" cannot be translated by
     a lookup table — every language spells numbers differently and inflects the
     noun after them — so the count goes through Intl and the noun through the
     catalogue, which is one string per language instead of six. */
  const count =
    inHouse.length === 1
      ? m.rooms.oneResidence
      : m.rooms.roomTypesCount.replace(
          "{count}",
          new Intl.NumberFormat(localeTags[locale]).format(inHouse.length),
        );

  return (
    <Link
      href={`/rooms#${house.id}`}
      className={cn("group block focus-visible:outline-offset-4", className)}
    >
      {/* The library is almost entirely landscape. Forcing a portrait crop
          cuts the subject out of nearly every frame, so the card takes the
          orientation the photographs were actually shot in. */}
      <div className="relative aspect-[3/2] overflow-hidden">
        <Image
          src={image}
          alt={`${house.name} at Ink Hotels`}
          fill
          priority={priority}
          sizes={sizes}
          quality={78}
          className="object-cover transition-transform duration-[1200ms] ease-settle group-hover:scale-[1.035]"
        />
      </div>

      <div className="mt-6">
        <p className="label mb-3 flex items-baseline gap-2.5 text-[color:var(--fg-3)]">
          {house.greek && (
            <>
              <Gk>{house.greek}</Gk>
              <span aria-hidden="true">·</span>
            </>
          )}
          {house.subtitle}
        </p>
        <h3 className="font-display text-[length:var(--text-d4)] leading-tight">
          <span className="relative inline-block">
            {house.name}
            <span
              aria-hidden="true"
              className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-current transition-transform duration-[600ms] ease-settle group-hover:origin-left group-hover:scale-x-100"
            />
          </span>
        </h3>
        <p className="measure mt-3 text-[color:var(--fg-2)]">{promise}</p>
        <p className="spec mt-4 text-[color:var(--fg-3)]">
          {count}
          {range ? ` · ${range}` : ""}
        </p>
      </div>
    </Link>
  );
}
