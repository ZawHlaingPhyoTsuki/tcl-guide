"use client";

import { useEffect, useRef, type RefObject } from "react";

import type { MapRef } from "@/components/ui/map";
import type { Place } from "../types/place";

const SIDEBAR_PX = 400; // desktop side drawer width
const POPUP_ROOM_PX = 290; // space reserved above a selected marker for its popup (mobile)
const FIT_MARGIN_PX = 80; // breathing room around fitted results

// Tells the map how much of the screen the drawers cover.
export type PlacesMapViewport = {
  sidebarOpen: boolean; // desktop: is the side drawer open?
  sheetRatio: number; // mobile: fraction of screen height the bottom sheet covers (0 to 1)
};

type Padding = { top: number; right: number; bottom: number; left: number };
const NO_PADDING: Padding = { top: 0, right: 0, bottom: 0, left: 0 };

// Pure: easy to reason about and to test. Areas covered by drawers count as "not visible".
function computePadding(
  viewport: PlacesMapViewport | undefined,
  isDesktop: boolean,
  reservePopupRoom: boolean,
): Padding {
  if (!viewport) return NO_PADDING;
  if (isDesktop) return { ...NO_PADDING, left: viewport.sidebarOpen ? SIDEBAR_PX : 0 };
  return {
    ...NO_PADDING,
    top: reservePopupRoom ? POPUP_ROOM_PX : 0,
    bottom: Math.round(window.innerHeight * viewport.sheetRatio),
  };
}

type Located = Place & { latitude: number; longitude: number };

export function useMapCamera({
  mapRef,
  places,
  selected,
  fitResults,
  viewport,
  isDesktop,
}: {
  mapRef: RefObject<MapRef | null>;
  places: Located[];
  selected: Located | null;
  fitResults: boolean; // false for the admin picker, which manages its own view
  viewport?: PlacesMapViewport;
  isDesktop: boolean;
}) {
  // Latest values for effects to read without re-running when they change.
  const latest = useRef({ viewport, isDesktop, hasSelection: false });
  useEffect(() => {
    latest.current = { viewport, isDesktop, hasSelection: selected !== null };
  });

  const selectedId = selected?.id;
  const selectedLng = selected?.longitude;
  const selectedLat = selected?.latitude;

  // Selection: fly to the chosen place, clear of the drawers and popup.
  useEffect(() => {
    const map = mapRef.current;
    if (!map || selectedLng === undefined || selectedLat === undefined) return;
    const { viewport, isDesktop } = latest.current;
    map.flyTo({
      center: [selectedLng, selectedLat],
      zoom: Math.max(map.getZoom(), 15),
      padding: computePadding(viewport, isDesktop, true),
      duration: 600,
    });
  }, [mapRef, selectedId, selectedLng, selectedLat]);

  // Results: when search/category changes, zoom to fit every matching pin.
  // Skipped while a place is selected so a refetch doesn't yank the view away.
  useEffect(() => {
    const map = mapRef.current;
    const { viewport, isDesktop, hasSelection } = latest.current;
    if (!map || !fitResults || hasSelection || places.length === 0) return;

    const lngs = places.map((p) => p.longitude);
    const lats = places.map((p) => p.latitude);
    const pad = computePadding(viewport, isDesktop, false);
    map.fitBounds(
      [
        [Math.min(...lngs), Math.min(...lats)],
        [Math.max(...lngs), Math.max(...lats)],
      ],
      {
        padding: {
          top: pad.top + FIT_MARGIN_PX,
          right: pad.right + FIT_MARGIN_PX,
          bottom: pad.bottom + FIT_MARGIN_PX,
          left: pad.left + FIT_MARGIN_PX,
        },
        maxZoom: 16,
        duration: 600,
      },
    );
  }, [mapRef, places, fitResults]);
}
