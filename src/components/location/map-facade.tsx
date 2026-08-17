"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

import { contact } from "@/content/site";

/**
 * A map that costs nothing until it is wanted.
 *
 * Third-party map embeds are among the heaviest things a hotel site loads, and
 * most visitors never touch them. This shows a drawn placeholder and only
 * mounts the OpenStreetMap frame on an explicit click — so the page carries no
 * third-party script, no cookie and no request until the visitor asks for one.
 *
 * OpenStreetMap is used rather than Google because it needs no API key and
 * sets no advertising cookie.
 */
export function MapFacade() {
  const [loaded, setLoaded] = useState(false);
  const { lat, lng } = contact.coordinates;

  const bbox = [lng - 0.006, lat - 0.004, lng + 0.006, lat + 0.004]
    .map((n) => n.toFixed(5))
    .join(",");

  const embed = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div
      data-ground="ink"
      className="relative aspect-[16/11] w-full overflow-hidden sm:aspect-[21/9]"
    >
      {loaded ? (
        <iframe
          src={embed}
          title="Map showing Ink Hotels in the old town of Rethymno"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoaded(true)}
          className="group absolute inset-0 flex flex-col items-center justify-center gap-5 focus-visible:outline-offset-2"
        >
          {/* An engraved stand-in: the shoreline, the fortress headland, and
              the lanes of the old town running back from the water. */}
          <svg
            viewBox="0 0 400 172"
            preserveAspectRatio="xMidYMid slice"
            aria-hidden="true"
            data-decorative
            className="absolute inset-0 h-full w-full text-sea-light"
            fill="none"
            stroke="currentColor"
          >
            {/* water */}
            <g opacity="0.28" strokeWidth="0.6">
              {[10, 17, 24, 31].map((y) => (
                <path
                  key={y}
                  d={`M0 ${y} C 80 ${y - 4}, 150 ${y + 5}, 230 ${y} S 340 ${y - 5}, 400 ${y + 1}`}
                />
              ))}
            </g>
            {/* shoreline */}
            <path
              d="M0 44 C 70 40, 120 50, 178 46 C 210 44, 224 30, 252 32 C 286 34, 300 48, 340 46 S 388 42, 400 44"
              strokeWidth="1.1"
              opacity="0.75"
            />
            {/* the old town grid, fanning back from the harbour */}
            <g opacity="0.4" strokeWidth="0.6">
              {[62, 80, 98, 116, 134, 152].map((y, i) => (
                <path key={y} d={`M${14 + i * 3} ${y} H${386 - i * 4}`} />
              ))}
              {[46, 92, 138, 184, 230, 276, 322, 368].map((x, i) => (
                <path
                  key={x}
                  d={`M${x} 52 L${x + (i - 4) * 5} 168`}
                />
              ))}
            </g>
            {/* the fortress headland */}
            <path
              d="M236 32 L246 22 L262 24 L268 34"
              strokeWidth="1.1"
              opacity="0.6"
            />
          </svg>

          <span className="relative flex h-12 w-12 items-center justify-center border border-sea-light text-sea-light transition-colors duration-500 ease-settle group-hover:bg-sea-light group-hover:text-ink">
            <MapPin className="h-4 w-4" strokeWidth={1.25} />
          </span>
          <span className="label relative text-paper">Load the map</span>
          <span className="spec relative text-olive">
            {lat.toFixed(4)}° N · {lng.toFixed(4)}° E
          </span>
        </button>
      )}
    </div>
  );
}
