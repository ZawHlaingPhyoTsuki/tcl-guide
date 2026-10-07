"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

export function PlaceGallery({ photos, name }: { photos: string[]; name: string }) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);

  if (photos.length === 0) {
    return (
      <div
        className="bg-muted text-muted-foreground flex aspect-4/3 w-full flex-col items-center justify-center gap-2 rounded-2xl sm:aspect-video"
        role="img"
        aria-label="No photos yet"
      >
        <ImageOff className="size-6" aria-hidden />
        <span className="text-sm">No photos yet</span>
      </div>
    );
  }

  function go(direction: -1 | 1) {
    const el = trackRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: direction * el.clientWidth, behavior: reduce ? "auto" : "smooth" });
  }

  const arrow =
    "bg-background/90 text-foreground hover:bg-background absolute top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full shadow-sm outline-offset-2 focus-visible:outline-2 disabled:pointer-events-none disabled:opacity-0 md:flex";

  return (
    <div className="bg-muted relative overflow-hidden rounded-2xl">
      <ul
        ref={trackRef}
        tabIndex={0}
        aria-label={`${name} photos`}
        onScroll={(e) => {
          const el = e.currentTarget;
          setIndex(Math.round(el.scrollLeft / el.clientWidth));
        }}
        className="flex snap-x snap-mandatory overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {photos.map((photo, i) => (
          <li
            key={photo}
            className="relative aspect-4/3 w-full shrink-0 snap-center sm:aspect-video"
          >
            <Image
              src={photo}
              alt={i === 0 ? name : `${name} photo ${i + 1}`}
              fill
              className="object-cover"
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 640px"
            />
          </li>
        ))}
      </ul>

      {photos.length > 1 ? (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={index === 0}
            aria-label="Previous photo"
            className={`${arrow} left-3`}
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={index === photos.length - 1}
            aria-label="Next photo"
            className={`${arrow} right-3`}
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
          <span
            className="absolute right-3 bottom-3 rounded-full bg-black/65 px-2.5 py-1 text-xs text-white tabular-nums"
            aria-live="polite"
          >
            {index + 1} / {photos.length}
          </span>
        </>
      ) : null}
    </div>
  );
}
