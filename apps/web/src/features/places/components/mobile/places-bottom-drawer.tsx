"use client";

import { PanelLeftOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import type { Category } from "@/features/categories/types/category";

import type { Place } from "../../types/place";
import { PlaceFilterChips } from "../place-filter-chips";
import { PlaceList } from "../place-list";

export type SheetState = "peek" | "expanded";

const SNAP_POINTS = [0.4, 0.85] as const;

export function PlacesBottomDrawer({
  places,
  categories,
  selectedPlaceId,
  onSelect,
  state,
  onStateChange,
  open,
  onOpenChange,
}: {
  places: Place[];
  categories: Category[];
  selectedPlaceId: string | null;
  onSelect: (id: string) => void;
  state: SheetState;
  onStateChange: (state: SheetState) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const expanded = state === "expanded";

  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      modal={false}
      disablePointerDismissal
      showSwipeHandle
      swipeDirection="down"
      snapPoints={[...SNAP_POINTS]}
      snapPoint={expanded ? SNAP_POINTS[1] : SNAP_POINTS[0]}
      onSnapPointChange={(snap) => onStateChange(snap === SNAP_POINTS[1] ? "expanded" : "peek")}
    >
      <DrawerTrigger
        render={
          <Button
            type="button"
            size="icon"
            variant="outline"
            aria-label="Toggle places list"
            className="absolute top-2 left-2 z-20 size-8 rounded-full shadow-md md:hidden"
          />
        }
      >
        <PanelLeftOpen className="size-4" aria-hidden />
      </DrawerTrigger>
      <DrawerContent aria-label="Places list" initialFocus={false} className="h-[85dvh] md:hidden">
        <DrawerTitle className="sr-only">Places list</DrawerTitle>
        <div className="shrink-0 px-3 pt-1 pb-2">
          <PlaceFilterChips categories={categories} />
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">
          <PlaceList places={places} selectedPlaceId={selectedPlaceId} onSelect={onSelect} />
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button>Close</Button>} />
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
