"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

import { cn } from "@/lib/utils";
import { useI18n } from "@/i18n/provider";

/**
 * A 360° walkthrough, behind a facade.
 *
 * The two tours the property publishes are third-party viewers — one from
 * Pepita, one from Momento360 — and each pulls several megabytes of runtime,
 * tiles and its own cookies the moment its iframe exists. Embedding them
 * directly would mean every visitor to Eros or Zoi paying for a tour most of
 * them never open, on a page whose whole job is to load fast enough to be
 * looked at.
 *
 * So the page renders a still from the suite with a play affordance over it,
 * and the iframe is created only when somebody asks for it. Nothing
 * third-party is contacted before that click: no script, no cookie, no
 * request. Once loaded, it stays.
 *
 * This is not the same as the old link-out. A guest who wants to walk the
 * suite now does it here, on our page, rather than being handed to another
 * tab and losing the booking rail.
 */
export function TourFacade({
  url,
  poster,
  posterAlt,
  className,
}: {
  url: string;
  poster: string;
  posterAlt: string;
  className?: string;
}) {
  const { m } = useI18n();
  const [live, setLive] = useState(false);

  return (
    <figure className={cn("relative", className)}>
      <div className="relative aspect-[3/2] overflow-hidden bg-[color:var(--bg-lift)]">
        {live ? (
          <iframe
            src={url}
            title={m.rooms.tour360}
            allow="fullscreen; accelerometer; gyroscope; xr-spatial-tracking"
            /* No `allow-same-origin`: the tour has no business reading our
               storage, and neither viewer needs it to render. */
            sandbox="allow-scripts allow-popups allow-forms allow-presentation"
            referrerPolicy="strict-origin-when-cross-origin"
            loading="lazy"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <>
            <Image
              src={poster}
              alt={posterAlt}
              fill
              sizes="(min-width: 1024px) 58vw, 100vw"
              quality={70}
              loading="lazy"
              className="object-cover"
            />
            <button
              type="button"
              onClick={() => setLive(true)}
              className="group absolute inset-0 flex items-center justify-center bg-ink/25 transition-colors duration-500 ease-settle hover:bg-ink/40 focus-visible:outline-offset-[-4px]"
            >
              <span className="flex items-center gap-3 bg-ink/75 px-6 py-4 text-paper backdrop-blur-sm transition-transform duration-500 ease-settle group-hover:-translate-y-px">
                <Play className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                <span className="label">{m.rooms.tour360}</span>
              </span>
            </button>
          </>
        )}
      </div>
      <figcaption className="spec mt-3 text-[color:var(--fg-3)]">
        {live ? m.rooms.tour360Live : m.rooms.tour360Facade}
      </figcaption>
    </figure>
  );
}
