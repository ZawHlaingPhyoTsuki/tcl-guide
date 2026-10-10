import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PlaceDetail } from "@/features/places/components/place-detail";
import { getPlace } from "@/features/places/places-queries";
import { PublicFooter } from "@/components/public-footer";
import { displayName } from "@/i18n/display-name";
import { getDictionary } from "@/i18n/get-dictionary";
import { getLocale } from "@/i18n/get-locale";

export async function generateMetadata({ params }: PageProps<"/places/[id]">): Promise<Metadata> {
  const place = await getPlace((await params).id);
  const locale = await getLocale();
  const primary = displayName(place.nameMy, place.nameEn, locale);
  const secondary = displayName(place.nameEn, place.nameMy, locale);
  return {
    title: secondary && secondary !== primary ? `${primary} · ${secondary}` : primary,
    openGraph: place.photos[0] ? { images: [place.photos[0]] } : undefined,
  };
}

// Deliberately async (not params.then + Suspense): the existence check must
// resolve before anything streams, otherwise a missing Place returns HTTP 200
// with not-found UI (soft 404) instead of a real 404. The identical fetch in
// generateMetadata above is deduplicated by fetch memoization.
export default async function PlacePage({ params }: PageProps<"/places/[id]">) {
  const { id } = await params;
  const [place, t] = await Promise.all([getPlace(id), getDictionary()]);
  return (
    <>
      {/* pb-28 on mobile leaves room for the fixed action bar. */}
      <div className="container mx-auto max-w-5xl px-4 pt-3 pb-28 lg:pb-12">
        <Link
          href="/map"
          className="text-muted-foreground hover:text-foreground -ml-2 inline-flex h-10 items-center gap-1.5 rounded-lg px-2 text-sm"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {t.detailBack}
        </Link>
        <div className="mt-2">
          <PlaceDetail place={place} />
        </div>
      </div>
      <div className="pb-24 lg:pb-0">
        <PublicFooter />
      </div>
    </>
  );
}
