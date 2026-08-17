"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * A room's photographs, as a contact sheet you can drag.
 *
 * One large plate with a filmstrip beneath it. Embla handles the drag physics;
 * the thumbnails are a real listbox so the whole thing is operable from the
 * keyboard, and the live region announces position for screen readers.
 */
export function RoomGallery({
  images,
  roomName,
}: {
  images: readonly string[];
  roomName: string;
}) {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true, duration: 26 });
  const [thumbRef, thumbs] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!embla || !thumbs) return;
    const i = embla.selectedScrollSnap();
    setSelected(i);
    thumbs.scrollTo(i);
  }, [embla, thumbs]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on("select", onSelect).on("reInit", onSelect);
    return () => {
      embla.off("select", onSelect).off("reInit", onSelect);
    };
  }, [embla, onSelect]);

  const scrollTo = useCallback((i: number) => embla?.scrollTo(i), [embla]);

  if (images.length === 0) return null;

  return (
    <div className="relative">
      {/* ── The plate ─────────────────────────────────────────────────── */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {images.map((src, i) => (
            <div key={src} className="relative min-w-0 flex-[0_0_100%]">
              <div className="relative aspect-[3/2] bg-[color:var(--bg-lift)]">
                <Image
                  src={src}
                  alt={`${roomName} — photograph ${i + 1} of ${images.length}`}
                  fill
                  priority={i === 0}
                  loading={i === 0 ? "eager" : "lazy"}
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  quality={80}
                  className="object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          <div className="mt-4 flex items-center justify-between gap-6">
            <p className="spec text-[color:var(--fg-3)]" aria-live="polite">
              {selected + 1} / {images.length}
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => embla?.scrollPrev()}
                aria-label="Previous photograph"
                className="flex h-10 w-10 items-center justify-center border border-[color:var(--border)] transition-colors duration-300 ease-state hover:border-[color:var(--fg)] hover:bg-[color:var(--fg)] hover:text-[color:var(--bg)]"
              >
                <ArrowLeft className="h-4 w-4" strokeWidth={1.25} />
              </button>
              <button
                type="button"
                onClick={() => embla?.scrollNext()}
                aria-label="Next photograph"
                className="flex h-10 w-10 items-center justify-center border border-[color:var(--border)] transition-colors duration-300 ease-state hover:border-[color:var(--fg)] hover:bg-[color:var(--fg)] hover:text-[color:var(--bg)]"
              >
                <ArrowRight className="h-4 w-4" strokeWidth={1.25} />
              </button>
            </div>
          </div>

          {/* ── The filmstrip ───────────────────────────────────────── */}
          <div className="mt-4 overflow-hidden" ref={thumbRef}>
            <ul className="flex gap-2">
              {images.map((src, i) => (
                <li key={src} className="min-w-0 flex-[0_0_18%] sm:flex-[0_0_11%]">
                  <button
                    type="button"
                    onClick={() => scrollTo(i)}
                    aria-label={`Show photograph ${i + 1}`}
                    aria-current={i === selected}
                    className={cn(
                      "relative block aspect-[3/2] w-full overflow-hidden transition-opacity duration-300 ease-state",
                      i === selected
                        ? "opacity-100"
                        : "opacity-45 hover:opacity-80",
                    )}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="12vw"
                      quality={45}
                      className="object-cover"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
