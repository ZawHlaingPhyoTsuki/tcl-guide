"use client";

import { Suspense, useMemo, useState } from "react";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Category } from "@/features/categories/types/category";
import { cn } from "@/lib/utils";

import type { Place } from "../types/place";
import { PlacesMap } from "./places-map/places-map";
import { PlacesBottomSheet, type SheetState } from "./mobile/places-bottom-sheet";
import { PlaceFilterChips } from "./place-filter-chips";
import { PlaceList } from "./place-list";
import { PlaceSearch } from "./place-search";

export function PlacesExplorer({
  places,
  categories,
}: {
  places: Place[];
  categories: Category[];
}) {
  // Client state: selection + sheet + sidebar. Filters live in URL (see PlaceSearch/Chips).
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [sheetState, setSheetState] = useState<SheetState>("peek");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const selectableIds = useMemo(
    () =>
      new Set(
        places
          .filter((p) => p.isActive && p.latitude != null && p.longitude != null)
          .map((p) => p.id),
      ),
    [places],
  );
  const effectiveSelected =
    selectedPlaceId != null && selectableIds.has(selectedPlaceId) ? selectedPlaceId : null;

  // Single select path for map + desktop list. Mobile also collapses the
  // sheet to peek so the marker + popup are visible.
  function handleMobileSelect(id: string) {
    setSelectedPlaceId(id);
    setSheetState("peek");
  }

  return (
    <div
      className={cn(
        "h-svh md:grid md:overflow-hidden",
        sidebarCollapsed ? "md:grid-cols-[0px_1fr]" : "md:grid-cols-[400px_1fr]",
      )}
    >
      {/* Desktop sidebar — stays mounted when collapsed (width 0) so the map
          keeps its grid cell and never collapses to zero height. */}
      <aside
        className={cn(
          "hidden min-h-0 flex-col md:flex",
          sidebarCollapsed ? "md:w-0 md:overflow-hidden" : "md:w-auto",
        )}
        aria-hidden={sidebarCollapsed}
      >
        <div className="sticky top-0 z-10 grid gap-2 border-b bg-background p-4">
          <Suspense>
            <PlaceSearch />
            <PlaceFilterChips categories={categories} />
          </Suspense>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <PlaceList
            places={places}
            selectedPlaceId={effectiveSelected}
            onSelect={setSelectedPlaceId}
          />
        </div>
      </aside>

      {/* Map: desktop right cell, mobile full-screen base */}
      <div className="relative z-0 h-svh md:h-auto">
        <PlacesMap
          places={places}
          selectedPlaceId={effectiveSelected}
          onSelect={setSelectedPlaceId}
        />
        <Button
          type="button"
          size="icon"
          variant="outline"
          aria-expanded={!sidebarCollapsed}
          aria-label={sidebarCollapsed ? "Show places list" : "Hide places list"}
          onClick={() => setSidebarCollapsed((value) => !value)}
          className="absolute top-1/2 left-2 z-20 hidden size-10 rounded-full shadow-md md:flex"
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="size-5" aria-hidden />
          ) : (
            <PanelLeftClose className="size-5" aria-hidden />
          )}
        </Button>
        <div className="md:hidden">
          <Suspense>
            <div className="absolute top-2 right-16 left-2">
              <PlaceSearch />
            </div>
            <PlacesBottomSheet
              places={places}
              categories={categories}
              selectedPlaceId={effectiveSelected}
              onSelect={handleMobileSelect}
              state={sheetState}
              onStateChange={setSheetState}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
