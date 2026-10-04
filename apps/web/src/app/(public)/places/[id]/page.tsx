import type { Metadata } from "next";
import Link from "next/link";

import { PlaceDetail } from "@/features/places/components/place-detail";
import { getPlace } from "@/features/places/queries";

export async function generateMetadata({ params }: PageProps<"/places/[id]">): Promise<Metadata> {
  const place = await getPlace((await params).id);
  return { title: place.nameEn ? `${place.nameMy} · ${place.nameEn}` : place.nameMy };
}

// Deliberately async (not params.then + Suspense): the existence check must
// resolve before anything streams, otherwise a missing Place returns HTTP 200
// with not-found UI (soft 404) instead of a real 404. The identical fetch in
// generateMetadata above is deduplicated by fetch memoization.
export default async function PlacePage({ params }: PageProps<"/places/[id]">) {
  const { id } = await params;
  const place = await getPlace(id);
  void id;
  return (
    <div className="container mx-auto max-w-3xl px-4 py-2">
      <Link href="/" className="text-sm text-muted-foreground underline">
        ← All places
      </Link>
      <div className="mt-4">
        <PlaceDetail place={place} />
      </div>
    </div>
  );
}
