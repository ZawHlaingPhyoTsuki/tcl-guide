import type { Route } from "next";
import Link from "next/link";

import type { Place } from "../types/place";
import { getPlaces } from "../places-queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function PlaceCard({ place }: { place: Place }) {
  return (
    <Link href={`/places/${place.id}` as Route}>
      <Card className="h-full transition-colors hover:bg-muted/50">
        <CardHeader>
          <CardTitle>{place.nameMy}</CardTitle>
          {place.nameEn ? <CardDescription>{place.nameEn}</CardDescription> : null}
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-muted-foreground">
            <span>{place.category.nameMy}</span>
            {place.area ? <span>{place.area}</span> : null}
            {place.hoursText ? <span>{place.hoursText}</span> : null}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export async function PlacesList({ category, area }: { category?: string; area?: string }) {
  const places = await getPlaces({ category, area });
  if (places.length === 0) {
    return <p className="text-muted-foreground">No places found. Try different filters.</p>;
  }
  return (
    <section className="grid gap-4">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </section>
  );
}

export function PlacesListSkeleton() {
  return (
    <div className="grid gap-4" aria-busy="true" aria-label="Loading places">
      {[0, 1, 2].map((index) => (
        <div key={index} className="grid gap-2 rounded-none p-4 ring-1 ring-foreground/10">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
          <div className="flex gap-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  );
}
