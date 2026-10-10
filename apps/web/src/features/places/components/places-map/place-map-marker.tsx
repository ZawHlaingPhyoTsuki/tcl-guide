"use client";

import { MapPin } from "lucide-react";

import { MapMarker, MarkerContent, MarkerLabel } from "@/components/ui/map";
import { cn } from "cn";

export function PlaceMapMarker({
  longitude,
  latitude,
  name,
  selected,
  onSelect,
}: {
  longitude: number;
  latitude: number;
  name: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <MapMarker longitude={longitude} latitude={latitude} onClick={onSelect}>
      <MarkerContent
        className={cn("flex min-h-11 min-w-11 items-center justify-center", selected && "z-10")}
      >
        {selected ? (
          <span className="bg-destructive flex size-6 items-center justify-center rounded-full border-2 border-white shadow-md">
            <MapPin className="size-3.5 text-white" aria-hidden />
          </span>
        ) : (
          <span
            className="bg-primary block size-4 rounded-full border-2 border-white shadow-md"
            aria-label={`Select ${name}`}
          />
        )}
        <MarkerLabel position="bottom" className={cn(selected && "font-semibold")}>
          {name}
        </MarkerLabel>
      </MarkerContent>
    </MapMarker>
  );
}
