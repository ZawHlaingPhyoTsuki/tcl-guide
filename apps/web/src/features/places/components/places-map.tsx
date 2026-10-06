"use client";

import { useMemo } from "react";

import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MarkerTooltip,
} from "@/components/ui/map";

import type { Place } from "../types/place";

const TACHILEIK: [number, number] = [99.882, 20.447];

export function PlacesMap({
  places,
  includeInactive = false,
}: {
  places: Place[];
  includeInactive?: boolean;
}) {
  // const [selectedId, setSelectedId] = useState<string | null>(null);
  const mappedPlaces = useMemo(
    () =>
      places.filter((place): place is Place & { latitude: number; longitude: number } => {
        return (
          (includeInactive || place.isActive) && place.latitude !== null && place.longitude !== null
        );
      }),
    [includeInactive, places],
  );
  // const selected = mappedPlaces.find((place) => place.id === selectedId) ?? null;

  return (
    <section className="grid gap-3" aria-label="Places map">
      <div className="relative h-[min(62vh,30rem)] min-h-72 overflow-hidden border">
        <Map className="absolute inset-0" center={[TACHILEIK[0], TACHILEIK[1]]} zoom={13}>
          <MapControls position="top-right" showLocate={false} />
          {mappedPlaces.map((place) => (
            <MapMarker
              key={place.id}
              longitude={place.longitude}
              latitude={place.latitude}
              // onClick={() => setSelectedId(place.id)}
            >
              <MarkerContent className="flex min-h-11 min-w-11 items-center justify-center">
                <span
                  className="block size-4 rounded-full border-2 border-white bg-primary shadow-md"
                  aria-label={`Select ${place.nameMy}`}
                />
              </MarkerContent>

              {/* <MarkerContent>
              <div className="bg-blue-500 size-4 rounded-full border-2 border-white shadow-lg" />
            </MarkerContent> */}
              <MarkerTooltip>{place.nameMy || place.nameEn}</MarkerTooltip>
              <MarkerPopup>
                <div className="space-y-1">
                  <p className="text-foreground font-medium">{place.nameMy || place.nameEn}</p>
                  <p className="text-muted-foreground text-xs">
                    {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                  </p>
                </div>
              </MarkerPopup>
            </MapMarker>
          ))}
        </Map>
      </div>
      {/* {selected ? <PlaceMapPreview place={selected} /> : null}
      {mappedPlaces.length === 0 ? (
        <p className="text-sm text-muted-foreground">No published places have map locations yet.</p>
      ) : null} */}
    </section>
  );
}

export function PlacesMapSkeleton() {
  return (
    <div
      className="h-[min(62vh,30rem)] min-h-72 animate-pulse border bg-muted/30"
      aria-busy="true"
    />
  );
}
