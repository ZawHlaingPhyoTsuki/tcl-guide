import { Suspense } from "react";

import {
  PlacesFilterSection,
  PlacesFilterSectionSkeleton,
} from "@/features/places/components/places-filter-section";
import { PlacesList, PlacesListSkeleton } from "@/features/places/components/places-list";

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
                <Suspense fallback={<PlacesFilterSectionSkeleton />}>
                  <PlacesFilterSection category={category} area={area} />
                </Suspense>
                <Suspense fallback={<PlacesListSkeleton />}>
                  <PlacesList category={category} area={area} />
                </Suspense>
              </>
            );
          })}
        </section>
      </div>
    </div>
  );
}
