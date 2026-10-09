"use client";

import { Suspense, useMemo, useState } from "react";

import type { Category } from "@/features/categories/types/category";

import type { Place } from "../types/place";
import { PlacesMap } from "./places-map/places-map";
import { PlacesSideDrawer } from "./desktop/places-side-drawer";
import { PlacesBottomSheet, type SheetState } from "./mobile/places-bottom-sheet";
import { PlaceSearch } from "./place-search";

export function PlacesExplorer({
  places,
  categories,
}: {
  places: Place[];
  categories: Category[];
}) {
  // Client state: selection + drawers. Filters live in URL (see PlaceSearch/Chips).
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [sheetState, setSheetState] = useState<SheetState>("expanded");
  const [sheetOpen, setSheetOpen] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  // Single select path for map + drawers. Mobile also drops the drawer to
  // peek so the marker + popup are visible.
  function handleMobileSelect(id: string) {
    setSelectedPlaceId(id);
    setSheetOpen(true);
    setSheetState("peek");
  }

  return (
    <div className="relative z-0 h-svh">
      <PlacesMap
        places={places}
        selectedPlaceId={effectiveSelected}
        onSelect={setSelectedPlaceId}
      />
      <PlacesSideDrawer
        places={places}
        categories={categories}
        selectedPlaceId={effectiveSelected}
        onSelect={setSelectedPlaceId}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />
      <div className="md:hidden">
        <Suspense>
          <div className="absolute top-2 right-16 left-14">
            <PlaceSearch />
          </div>
          <PlacesBottomSheet
            places={places}
            categories={categories}
            selectedPlaceId={effectiveSelected}
            onSelect={handleMobileSelect}
            state={sheetState}
            onStateChange={setSheetState}
            open={sheetOpen}
            onOpenChange={setSheetOpen}
          />
        </Suspense>
      </div>
    </div>
  );
}
