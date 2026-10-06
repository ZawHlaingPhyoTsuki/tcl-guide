import { PlaceCard } from "./place-card";
import { getPlaces } from "../places-queries";
import { Skeleton } from "@/components/ui/skeleton";

export async function PlaceList({ category, area }: { category?: string; area?: string }) {
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

export function PlaceListSkeleton() {
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
