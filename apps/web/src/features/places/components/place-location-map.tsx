"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Map, MapMarker, MarkerContent } from "@/components/ui/map";
import { useDictionary } from "@/i18n/dictionary-provider";

import type { Place } from "../types/place";

export function PlaceLocationMap({ place }: { place: Place }) {
  const t = useDictionary();
  if (place.latitude === null || place.longitude === null) return null;

  return (
    <section className="grid gap-3" aria-label={t.locationMap.label}>
      <div className="h-52 overflow-hidden rounded-2xl border border-border">
        <Map
          className="h-full"
          center={[place.longitude, place.latitude]}
          zoom={15}
          styles={{ light: "https://tiles.openfreemap.org/styles/bright" }}
        >
          <MapMarker longitude={place.longitude} latitude={place.latitude}>
            <MarkerContent />
          </MapMarker>
        </Map>
      </div>

      <Link
        href={`https://www.google.com/maps/search/?api=1&query=${place.latitude},${place.longitude}`}
        target="_blank"
        rel="noreferrer"
        className={buttonVariants({ variant: "outline", className: "h-10 gap-2 rounded-full" })}
      >
        <ExternalLink className="size-4" aria-hidden />
        {t.locationMap.openInMaps}
      </Link>
    </section>
  );
}
