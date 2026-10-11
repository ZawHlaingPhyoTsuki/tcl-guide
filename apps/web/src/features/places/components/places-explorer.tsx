"use client";

import { Suspense, useMemo, useState } from "react";

import type { Category } from "@/features/categories/types/category";

import type { Place } from "../types/place";
import { PlacesMap } from "./places-map/places-map";
import { PlacesDrawer, SHEET_SNAP_POINTS, type SheetState } from "./places-drawer";
import { PlaceSearch } from "./place-search";
import { LocaleToggle } from "@/i18n/locale-toggle";
import { useLocale } from "@/i18n/dictionary-provider";

export function PlacesExplorer({
  places,
  categories,
}: {
  places: Place[];
  categories: Category[];
}) {
  const locale = useLocale();

  // Client state: selection + drawers. Filters live in URL (see PlaceSearch/Chips).
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [sheetState, setSheetState] = useState<SheetState>("peek");
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
        viewport={{
          sidebarOpen,
          sheetRatio: sheetOpen ? SHEET_SNAP_POINTS[sheetState] : 0,
        }}
      />

      <PlacesDrawer
        variant="side"
        places={places}
        categories={categories}
        selectedPlaceId={effectiveSelected}
        onSelect={setSelectedPlaceId}
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        header={
          <div className="flex items-center gap-2 border-b p-4">
            <div className="min-w-0 flex-1">
              <Suspense>
                <PlaceSearch />
              </Suspense>
            </div>
          </div>
        }
      />
      <div className="md:hidden">
        <Suspense>
          <div className="absolute top-2 right-2 left-14 z-20 flex items-center gap-2">
            <div className="min-w-0 flex-1">
              <PlaceSearch className="bg-background! shadow-md!" />
            </div>
            <div className="shrink-0 rounded-full border border-border/70 bg-card/95 p-1 shadow-md backdrop-blur">
              <LocaleToggle locale={locale} className={"border-none"} />
            </div>
          </div>
          <PlacesDrawer
            variant="bottom"
            places={places}
            categories={categories}
            selectedPlaceId={effectiveSelected}
            onSelect={handleMobileSelect}
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            snapPoint={SHEET_SNAP_POINTS[sheetState]}
            onSnapPointChange={(snap) =>
              setSheetState(snap === SHEET_SNAP_POINTS.expanded ? "expanded" : "peek")
            }
          />
        </Suspense>
      </div>
    </div>
  );
}
