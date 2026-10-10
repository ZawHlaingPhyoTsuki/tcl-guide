"use client";

import type { Route } from "next";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";

import { cn } from "cn";

import type { Place } from "../types/place";

export function PlaceListItem({
  place,
  active,
  onSelect,
}: {
  place: Place;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);

  // Keep the selected row visible when selection comes from the map.
  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [active]);

  const status = [place.hoursText, place.priceNote].filter(Boolean).join(" · ");

  return (
    <div
      className={cn(
        "flex w-full items-center gap-3 rounded-lg border p-3 transition-colors",
        "hover:bg-muted/50 focus-within:ring-ring focus-within:ring-2 focus-within:outline-none",
        active && "border-primary bg-muted/50 ring-1 ring-primary",
      )}
    >
      <button
        ref={ref}
        type="button"
        onClick={() => onSelect(place.id)}
        aria-pressed={active}
        className="flex min-w-0 flex-1 items-center gap-3 rounded-md text-left focus:outline-none"
      >
        {place.photos[0] ? (
          <img
            src={place.photos[0]}
            alt=""
            loading="lazy"
            className="size-20 shrink-0 rounded-md object-cover"
          />
        ) : (
          <div
            aria-hidden
            className="bg-muted text-muted-foreground flex size-20 shrink-0 items-center justify-center rounded-md text-xs"
          >
            No photo
          </div>
        )}
        <span className="grid min-w-0 flex-1 gap-0.5">
          <span className="truncate font-medium">{place.nameMy}</span>
          {place.nameEn ? (
            <span className="text-muted-foreground truncate text-sm">{place.nameEn}</span>
          ) : null}
          <span className="text-muted-foreground truncate text-xs">
            {place.category.nameMy}
            {place.area ? ` · ${place.area.nameMy}` : ""}
          </span>
          {status ? <span className="truncate text-xs">{status}</span> : null}
        </span>
      </button>
      <Link
        href={`/places/${place.id}` as Route}
        aria-label={`View ${place.nameMy} details`}
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring flex size-9 shrink-0 items-center justify-center rounded-md transition-colors focus-visible:ring-2 focus-visible:outline-none"
      >
        <ArrowUpRight className="size-4" aria-hidden />
      </Link>
    </div>
  );
}
