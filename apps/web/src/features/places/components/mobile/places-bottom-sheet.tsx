"use client";

import { ChevronDown, ChevronUp, GripHorizontal } from "lucide-react";

import type { Category } from "@/features/categories/types/category";
import { cn } from "@/lib/utils";

import type { Place } from "../../types/place";
import { PlaceFilterChips } from "../place-filter-chips";
import { PlaceList } from "../place-list";

export type SheetState = "peek" | "expanded";

export function PlacesBottomSheet({
  places,
  categories,
  selectedPlaceId,
  onSelect,
  state,
  onStateChange,
}: {
  places: Place[];
  categories: Category[];
  selectedPlaceId: string | null;
  onSelect: (id: string) => void;
  state: SheetState;
  onStateChange: (state: SheetState) => void;
}) {
  const expanded = state === "expanded";
  // Peek guarantee: a marker tap on a place outside the first 2 must still
  // show its highlighted row — promote the selected place to the top of peek.
  const peekPlaces = expanded
    ? places
    : (() => {
        const first = places.slice(0, 2);
        if (selectedPlaceId == null || first.some((p) => p.id === selectedPlaceId)) return first;
        const selected = places.find((p) => p.id === selectedPlaceId);
        return selected ? [selected, ...first.slice(0, 1)] : first;
      })();

  return (
    <>
      {expanded ? (
        <button
          type="button"
          aria-label="Collapse list"
          onClick={() => onStateChange("peek")}
          className="absolute inset-0 z-10 bg-black/20 backdrop-blur-[2px] md:hidden"
        />
      ) : null}
      <section
        aria-label="Places list"
        className={cn(
          "absolute inset-x-0 bottom-0 z-10 flex flex-col rounded-t-2xl border-t bg-background shadow-lg md:hidden",
          expanded ? "max-h-[85svh]" : "max-h-[38svh]",
        )}
      >
        <button
          type="button"
          onClick={() => onStateChange(expanded ? "peek" : "expanded")}
          aria-expanded={expanded}
          className="flex shrink-0 flex-col items-center gap-1 pt-2 pb-1"
        >
          <GripHorizontal className="text-muted-foreground size-5" aria-hidden />
          <span className="text-muted-foreground flex items-center gap-1 text-xs">
            {expanded ? (
              <>
                Collapse <ChevronDown className="size-3.5" aria-hidden />
              </>
            ) : (
              <>
                {places.length} places <ChevronUp className="size-3.5" aria-hidden />
              </>
            )}
          </span>
        </button>
        <div className="shrink-0 px-3 pb-2">
          <PlaceFilterChips categories={categories} />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
          <PlaceList places={peekPlaces} selectedPlaceId={selectedPlaceId} onSelect={onSelect} />
          {!expanded && places.length > 2 ? (
            <button
              type="button"
              onClick={() => onStateChange("expanded")}
              className="text-muted-foreground w-full py-2 text-center text-sm underline"
            >
              Show all {places.length} places
            </button>
          ) : null}
        </div>
      </section>
    </>
  );
}
