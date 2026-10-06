"use client";

import { Button } from "@/components/ui/button";

import { PlacesMap } from "../../components/places-map/places-map";

export function PlaceLocationPicker({
  latitude,
  longitude,
  onChange,
}: {
  latitude?: number;
  longitude?: number;
  onChange: (latitude?: number, longitude?: number) => void;
}) {
  const hasLocation = latitude !== undefined && longitude !== undefined;

  return (
    <div className="grid gap-3">
      <div className="relative h-64 overflow-hidden border">
        <PlacesMap
          places={[]}
          editable={{
            latitude,
            longitude,
            onPick: (lat, lng) => onChange(lat, lng),
          }}
        />
      </div>
      <div className="grid gap-2 text-sm sm:grid-cols-2">
        <p>Latitude: {hasLocation ? latitude.toFixed(6) : "Not set"}</p>
        <p>Longitude: {hasLocation ? longitude.toFixed(6) : "Not set"}</p>
      </div>
      {hasLocation ? (
        <Button type="button" variant="outline" onClick={() => onChange(undefined, undefined)}>
          Clear location
        </Button>
      ) : null}
    </div>
  );
}
