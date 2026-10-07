import { Suspense } from "react";

import { getCategories } from "@/features/categories/categories-queries";
import { PlacesExplorer } from "@/features/places/components/places-explorer";
import { PlacesMapSkeleton } from "@/features/places/components/places-map/places-map";
import { PlaceListSkeleton } from "@/features/places/components/place-list";
import { getPlaces } from "@/features/places/places-queries";

export default async function Home({ searchParams }: PageProps<"/">) {
  const sp = await searchParams;
  const category = typeof sp.category === "string" ? sp.category : undefined;
  const search = typeof sp.search === "string" ? sp.search : undefined;

  // Single fetch: map, list, popup, and sheet all derive from this Place[].
  const [places, categories] = await Promise.all([
    getPlaces({ category, search }),
    getCategories(),
  ]);

  return (
    <Suspense
      fallback={
        <div className="grid gap-2 p-4">
          <PlaceListSkeleton />
          <PlacesMapSkeleton />
        </div>
      }
    >
      <PlacesExplorer places={places} categories={categories} />
    </Suspense>
  );
}
