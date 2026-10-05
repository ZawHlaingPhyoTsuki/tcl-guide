"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Map, MapMarker, MarkerContent, useMap } from "@/components/ui/map";

const TACHILEIK: [number, number] = [99.882, 20.447];

function MapClickHandler({
  onSelect,
}: {
  onSelect: (longitude: number, latitude: number) => void;
}) {
  const { map } = useMap();

  useEffect(() => {
    if (!map) return;
    const handleClick = (event: { lngLat: { lng: number; lat: number } }) => {
      onSelect(event.lngLat.lng, event.lngLat.lat);
    };
    map.on("click", handleClick);
    return () => {
      map.off("click", handleClick);
    };
  }, [map, onSelect]);

  return null;
}

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
  const center: [number, number] = hasLocation ? [longitude, latitude] : TACHILEIK;

  return (
    <div className="grid gap-3">
      <div className="h-64 overflow-hidden border">
        <Map className="h-full" center={center} zoom={hasLocation ? 15 : 13}>
          <MapClickHandler
            onSelect={(nextLongitude, nextLatitude) => onChange(nextLatitude, nextLongitude)}
          />
          {hasLocation ? (
            <MapMarker
              longitude={longitude}
              latitude={latitude}
              draggable
              onDragEnd={({ lng, lat }) => onChange(lat, lng)}
            >
              <MarkerContent />
            </MapMarker>
          ) : null}
        </Map>
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
