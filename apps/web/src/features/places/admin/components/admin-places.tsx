"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

import { deletePlace, updatePlace } from "../actions";
import { AdminPlaceForm } from "./admin-place-form";
import type { Category, Place } from "../../types";

export function AdminPlaces({
  initialPlaces,
  categories,
}: {
  initialPlaces: Place[];
  categories: Category[];
}) {
  const [places, setPlaces] = useState(initialPlaces);
  const [editing, setEditing] = useState<Place | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const filteredPlaces = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return places;
    return places.filter((place) =>
      [place.nameMy, place.nameEn, place.area, place.addressText].some((value) =>
        value?.toLocaleLowerCase().includes(query),
      ),
    );
  }, [places, search]);

  function savedPlace(saved: Place) {
    setPlaces((current) => {
      const exists = current.some((place) => place.id === saved.id);
      return exists
        ? current.map((place) => (place.id === saved.id ? saved : place))
        : [saved, ...current];
    });
    setEditing(null);
    setIsCreating(false);
  }

  async function toggleActive(place: Place) {
    setError(null);
    setIsUpdating(place.id);
    try {
      const saved = await updatePlace(place.id, { isActive: !place.isActive });
      setPlaces((current) => current.map((item) => (item.id === saved.id ? saved : item)));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not update place");
    } finally {
      setIsUpdating(null);
    }
  }

  async function remove(place: Place) {
    setError(null);
    setIsUpdating(place.id);
    try {
      await deletePlace(place.id);
      setPlaces((current) => current.filter((item) => item.id !== place.id));
      setDeleting(null);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Could not delete place");
    } finally {
      setIsUpdating(null);
    }
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="grid gap-1">
          <p className="text-sm text-muted-foreground">The working directory for Tachileik</p>
          <h2 className="text-2xl font-semibold tracking-tight">Places</h2>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setIsCreating(true);
          }}
        >
          Add a place
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
            <DialogTitle>{editing ? `Edit ${editing.nameMy}` : "Add a place"}</DialogTitle>
            <DialogDescription>
              Keep the public directory accurate with practical, verified details.
            </DialogDescription>
          </DialogHeader>
          <AdminPlaceForm
            key={editing?.id ?? "new"}
            categories={categories}
            place={editing}
            onSaved={savedPlace}
            onCancel={() => {
              setEditing(null);
              setIsCreating(false);
            }}
          />
        </DialogContent>
      </Dialog>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-1">
          <label htmlFor="place-search" className="text-sm font-medium">
            Find a place
          </label>
          <p className="text-xs text-muted-foreground">Search by name, area, or address.</p>
        </div>
        <Input
          id="place-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Name, area, or address"
        />
      </div>
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
      {places.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyTitle>No places yet</EmptyTitle>
            <EmptyDescription>Add the first place to start the public directory.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : filteredPlaces.length === 0 ? (
        <Empty className="border border-dashed">
          <EmptyHeader>
            <EmptyTitle>No matching places</EmptyTitle>
            <EmptyDescription>Try a different name, area, or address.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid gap-2">
          {filteredPlaces.map((place) => (
            <Card key={place.id} size="sm" className="transition-colors hover:bg-muted/30">
              <CardContent className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
                <div className="grid gap-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <h3 className="font-medium">{place.nameMy}</h3>
                    {place.nameEn ? (
                      <span className="text-muted-foreground">{place.nameEn}</span>
                    ) : null}
                  </div>
                  <p className="text-muted-foreground">
                    {place.category.nameMy}
                    {place.area ? ` · ${place.area}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <Badge variant={place.isActive ? "default" : "outline"}>
                    {place.isActive ? "Published" : "Hidden"}
                  </Badge>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setIsCreating(false);
                      setEditing(place);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isUpdating === place.id}
                    onClick={() => toggleActive(place)}
                  >
                    {isUpdating === place.id ? "Updating..." : place.isActive ? "Hide" : "Publish"}
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setDeleting(place.id)}>
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Dialog
        open={Boolean(deleting)}
        onOpenChange={(open) => {
          if (!open) setDeleting(null);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Delete this place?</DialogTitle>
            <DialogDescription>
              This permanently removes the place from the directory. Hiding it is safer if it may
              return later.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Keep place
            </Button>
            <Button
              variant="destructive"
              disabled={!deleting || isUpdating === deleting}
              onClick={() => {
                const place = places.find((item) => item.id === deleting);
                if (place) void remove(place);
              }}
            >
              {deleting && isUpdating === deleting ? "Deleting..." : "Delete place"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function AdminPlacesSkeleton() {
  return (
    <div className="grid gap-2" aria-busy="true" aria-label="Loading places">
      {[0, 1, 2].map((item) => (
        <Skeleton key={item} className="h-20 w-full" />
      ))}
    </div>
  );
}
