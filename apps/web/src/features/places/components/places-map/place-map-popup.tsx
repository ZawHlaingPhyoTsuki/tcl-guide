"use client";

import type { Route } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { MapPopup } from "@/components/ui/map";

import type { Place } from "../../types/place";

export function PlaceMapPopup({
  place,
  onClose,
}: {
  place: Place & { latitude: number; longitude: number };
  onClose: () => void;
}) {
  return (
    <MapPopup
      longitude={place.longitude}
      latitude={place.latitude}
      onClose={onClose}
      closeOnClick={false}
      closeButton
    >
      <div className="grid w-56 gap-2">
        {place.photos[0] ? (
          // Plain img: Neon Object Storage URL, lazy, no Next optimizer config needed.
          <img
            src={place.photos[0]}
            alt=""
            loading="lazy"
            className="h-24 w-full rounded-md object-cover"
          />
        ) : null}
        <div>
          <p className="text-muted-foreground text-xs">{place.category.nameMy}</p>
          <p className="font-medium">{place.nameMy || place.nameEn}</p>
          {place.hoursText || place.priceNote ? (
            <p className="text-muted-foreground text-xs">
              {[place.hoursText, place.priceNote].filter(Boolean).join(" · ")}
            </p>
          ) : null}
        </div>
        <Link
          href={`/places/${place.id}` as Route}
          className={buttonVariants({ variant: "secondary", size: "sm" })}
        >
          View Place
        </Link>
      </div>
    </MapPopup>
  );
}
