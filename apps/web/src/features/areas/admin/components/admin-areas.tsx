"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownIcon, ArrowUpIcon, MapPinIcon } from "lucide-react";

import { deleteArea, updateArea } from "../../areas-actions";
import { AdminAreaForm } from "./admin-area-form";
import type { AdminArea } from "../../types/area";

function byOrder(a: AdminArea, b: AdminArea) {
  return a.sortOrder - b.sortOrder || a.nameMy.localeCompare(b.nameMy);
}

export function AdminAreas({ initialAreas }: { initialAreas: AdminArea[] }) {
  const [areas, setAreas] = useState(initialAreas);
  const [editing, setEditing] = useState<AdminArea | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  function savedArea(saved: AdminArea) {
    setAreas((current) => {
      const exists = current.some((item) => item.id === saved.id);
      return exists
        ? current.map((item) => (item.id === saved.id ? saved : item)).sort(byOrder)
        : [saved, ...current].sort(byOrder);
    });
    setEditing(null);
    setIsCreating(false);
  }

  async function move(area: AdminArea, direction: -1 | 1) {
    const ordered = [...areas].sort(byOrder);
    const index = ordered.findIndex((item) => item.id === area.id);
    const other = ordered[index + direction];
    if (!other) return;
    setError(null);
    setBusy(area.id);
    try {
      // Serial: if a write fails the rest never run, so the order can never
      // half-swap. A pure swap is a no-op when both rows share a sortOrder,
      // so nudge one row upward instead. Only increments, so the >= 0
      // constraint can never trip.
      const tied = area.sortOrder === other.sortOrder;
      const writes =
        tied && direction === 1
          ? [{ id: area.id, nameMy: area.nameMy, sortOrder: area.sortOrder + 1 }]
          : tied
            ? [{ id: other.id, nameMy: other.nameMy, sortOrder: other.sortOrder + 1 }]
            : [
                { id: area.id, nameMy: area.nameMy, sortOrder: other.sortOrder },
                { id: other.id, nameMy: other.nameMy, sortOrder: area.sortOrder },
              ];
      const savedById = new Map<string, AdminArea>();
      for (const write of writes) {
        const saved = await updateArea(write.id, {
          nameMy: write.nameMy,
          sortOrder: write.sortOrder,
        });
        savedById.set(saved.id, saved);
      }
      setAreas((current) => current.map((item) => savedById.get(item.id) ?? item));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not reorder areas");
    } finally {
      setBusy(null);
    }
  }

  async function remove(area: AdminArea) {
    setError(null);
    setBusy(area.id);
    try {
      await deleteArea(area.id);
      setAreas((current) => current.filter((item) => item.id !== area.id));
      setDeleting(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not delete area");
    } finally {
      setBusy(null);
    }
  }

  const ordered = [...areas].sort(byOrder);

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid gap-1">
          <p className="text-sm text-muted-foreground">
            Where places are in the public directory. Lowest order shows first.
          </p>
          <h2 className="text-2xl font-semibold tracking-tight">Areas</h2>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setIsCreating(true);
          }}
        >
          Add an area
        </Button>
      </div>
      <Dialog
        open={isCreating || Boolean(editing)}
        onOpenChange={(open) => {
          if (!open) {
            setEditing(null);
            setIsCreating(false);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${editing.nameMy}` : "Add an area"}</DialogTitle>
            <DialogDescription>
              Slugs become public filter URLs; names and order can be changed anytime.
            </DialogDescription>
          </DialogHeader>
          <AdminAreaForm
            key={editing?.id ?? "new"}
            area={editing}
            onSaved={savedArea}
            onCancel={() => {
              setEditing(null);
              setIsCreating(false);
            }}
          />
        </DialogContent>
      </Dialog>
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
      {areas.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <MapPinIcon />
            </EmptyMedia>
            <EmptyTitle>No areas yet</EmptyTitle>
            <EmptyDescription>Add the first area to locate places.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ItemGroup>
          {ordered.map((area, index) => (
            <Item
              key={area.id}
              size="sm"
              variant="outline"
              className="bg-card sm:flex-nowrap hover:bg-muted/30"
            >
              <ItemContent className="min-w-0">
                <ItemTitle>
                  {area.nameMy}
                  {area.nameEn ? (
                    <span className="text-muted-foreground">{area.nameEn}</span>
                  ) : null}
                </ItemTitle>
                <ItemDescription>?area={area.slug}</ItemDescription>
              </ItemContent>
              <ItemActions className="max-sm:basis-full max-sm:justify-end">
                <Badge variant="outline" className="tabular-nums">
                  {area.placeCount} {area.placeCount === 1 ? "place" : "places"}
                </Badge>
                <Button
                  size="icon-sm"
                  variant="outline"
                  disabled={index === 0 || busy === area.id}
                  aria-label={`Move ${area.nameMy} up`}
                  onClick={() => void move(area, -1)}
                >
                  <ArrowUpIcon />
                </Button>
                <Button
                  size="icon-sm"
                  variant="outline"
                  disabled={index === ordered.length - 1 || busy === area.id}
                  aria-label={`Move ${area.nameMy} down`}
                  onClick={() => void move(area, 1)}
                >
                  <ArrowDownIcon />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setEditing(area);
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={area.placeCount > 0 || busy === area.id}
                  title={area.placeCount > 0 ? "Move its places to another area first" : undefined}
                  onClick={() => setDeleting(area.id)}
                >
                  {busy === area.id ? "Deleting..." : "Delete"}
                </Button>
              </ItemActions>
            </Item>
          ))}
        </ItemGroup>
      )}
      <Dialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this area?</DialogTitle>
            <DialogDescription>
              This permanently removes the area. It only applies to areas with no places.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Keep area
            </Button>
            <Button
              variant="destructive"
              disabled={!deleting || busy === deleting}
              onClick={() => {
                const area = areas.find((item) => item.id === deleting);
                if (area) void remove(area);
              }}
            >
              {deleting && busy === deleting ? "Deleting..." : "Delete area"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function AdminAreasSkeleton() {
  return (
    <div className="grid gap-2" aria-busy="true" aria-label="Loading areas">
      {[0, 1, 2].map((item) => (
        <Skeleton key={item} className="h-16 w-full" />
      ))}
    </div>
  );
}
