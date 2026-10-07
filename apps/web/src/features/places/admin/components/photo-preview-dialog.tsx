"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function PhotoPreviewDialog({
  photos,
  index,
  placeName,
  open,
  onOpenChange,
  onIndexChange,
}: {
  photos: string[];
  index: number;
  placeName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIndexChange: (index: number) => void;
}) {
  const total = photos.length;
  const current = index;

  useEffect(() => {
    if (!open || total < 2) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") onIndexChange(Math.max(current - 1, 0));
      if (event.key === "ArrowRight") onIndexChange(Math.min(current + 1, total - 1));
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, total, current, onIndexChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {placeName ? `Photos of ${placeName}` : "Photo preview"}
          </DialogTitle>
        </DialogHeader>
        <img
          src={photos[current]}
          alt={`Photo ${current + 1} of ${total}`}
          className="max-h-[70vh] w-full object-contain"
        />
        <div className="flex items-center justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={current === 0}
            onClick={() => onIndexChange(current - 1)}
            aria-label="Previous photo"
          >
            <ChevronLeft />
          </Button>
          <p className="text-xs text-muted-foreground tabular-nums">
            Photo {current + 1} of {total}
          </p>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={current === total - 1}
            onClick={() => onIndexChange(current + 1)}
            aria-label="Next photo"
          >
            <ChevronRight />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
