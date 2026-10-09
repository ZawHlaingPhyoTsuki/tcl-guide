"use client";

import { Suspense } from "react";
import { PanelLeftOpen, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import type { Category } from "@/features/categories/types/category";

import type { Place } from "../../types/place";
import { PlaceFilterChips } from "../place-filter-chips";
import { PlaceList } from "../place-list";
import { PlaceSearch } from "../place-search";

export function PlacesSideDrawer({
  places,
  categories,
  selectedPlaceId,
  onSelect,
  open,
  onOpenChange,
}: {
  places: Place[];
  categories: Category[];
  selectedPlaceId: string | null;
  onSelect: (id: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      modal={false}
      disablePointerDismissal
      swipeDirection="left"
    >
      <DrawerTrigger
        render={
          <Button
            type="button"
            size="icon"
            variant="outline"
            aria-label="Toggle places list"
            className="absolute top-4 left-4 z-20 hidden size-10 rounded-full shadow-md md:flex"
          />
        }
      >
        <PanelLeftOpen className="size-5" aria-hidden />
      </DrawerTrigger>
      <DrawerContent
        aria-label="Places list"
        showOverlay={false}
        showCloseButton={false}
        initialFocus={false}
        className="max-md:hidden"
      >
        <DrawerTitle className="sr-only">Places list</DrawerTitle>
        <div className="flex items-center gap-2 border-b p-4">
          <div className="min-w-0 flex-1">
            <Suspense>
              <PlaceSearch />
            </Suspense>
          </div>
          <DrawerClose
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Close places list"
                className="shrink-0"
              />
            }
          >
            <XIcon aria-hidden />
          </DrawerClose>
        </div>
        <div className="shrink-0 px-4 pt-3">
          <Suspense>
            <PlaceFilterChips categories={categories} />
          </Suspense>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <PlaceList places={places} selectedPlaceId={selectedPlaceId} onSelect={onSelect} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
