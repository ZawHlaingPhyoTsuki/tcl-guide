"use client";

import { Skeleton } from "@/components/ui/skeleton";

import type { Place } from "../types/place";
import { PlaceListItem } from "./place-list-item";

export function PlaceList({
  places,
  selectedPlaceId,
  onSelect,
}: {
  places: Place[];
  selectedPlaceId: string | null;
  onSelect: (id: string) => void;
}) {
  if (places.length === 0) {
    return (
      <p className="text-muted-foreground p-1 text-sm">No places found. Try different filters.</p>
    );
  }
  return (
    <div className="grid gap-2" role="list">
      {places.map((place) => (
        <PlaceListItem
          key={place.id}
          place={place}
          active={place.id === selectedPlaceId}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

export function PlaceListSkeleton() {
  return (
    <div className="grid gap-2" aria-busy="true" aria-label="Loading places">
      {[0, 1, 2].map((index) => (
        <div key={index} className="flex gap-3 rounded-lg border p-3">
          <Skeleton className="size-20 shrink-0 rounded-md" />
          <div className="grid flex-1 gap-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
