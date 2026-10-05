import { Suspense } from "react";

import { PlaceFilters, PlaceFiltersSkeleton } from "@/features/places/components/place-filters";
import { PlaceList, PlaceListSkeleton } from "@/features/places/components/place-list";
import {
  PlacesMapSection,
  PlacesMapSkeleton,
} from "@/features/places/components/places-map-section";

export default function Home({ searchParams }: PageProps<"/">) {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <div className="grid gap-6">
        <section className="grid gap-2">
          <h1 className="text-xl font-medium">Places to eat in Tachileik</h1>
          {searchParams.then((sp) => {
            const category = typeof sp.category === "string" ? sp.category : undefined;
            const area = typeof sp.area === "string" ? sp.area : undefined;
            return (
              <>
                <Suspense fallback={<PlaceFiltersSkeleton />}>
                  <PlaceFilters category={category} area={area} />
                </Suspense>
                <Suspense fallback={<PlaceListSkeleton />}>
                  <PlaceList category={category} area={area} />
                </Suspense>
                <Suspense fallback={<PlacesMapSkeleton />}>
                  <PlacesMapSection category={category} area={area} />
                </Suspense>
              </>
            );
          })}
        </section>
      </div>
    </div>
  );
}
