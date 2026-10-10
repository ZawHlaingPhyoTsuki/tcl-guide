"use client";

import type { Route } from "next";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { MapPopup } from "@/components/ui/map";
import { useDictionary, useLocale } from "@/i18n/dictionary-provider";
import { displayName } from "@/i18n/display-name";

import type { Place } from "../../types/place";

export function PlaceMapPopup({
  place,
  onClose,
}: {
  place: Place & { latitude: number; longitude: number };
  onClose: () => void;
}) {
  const t = useDictionary();
  const locale = useLocale();
  const name = displayName(place.nameMy, place.nameEn, locale);
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
          <p className="text-muted-foreground text-xs">
            {displayName(place.category.nameMy, place.category.nameEn, locale)}
          </p>
          <p className="font-medium">{name}</p>
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
          {t.popup.viewPlace}
        </Link>
      </div>
    </MapPopup>
  );
}
