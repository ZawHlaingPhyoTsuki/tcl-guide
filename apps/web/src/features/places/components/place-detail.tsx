import type { Place } from "../types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlaceLocationMap } from "./place-location-map";

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[8rem_1fr] gap-2">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

export function PlaceDetail({ place }: { place: Place }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">{place.nameMy}</CardTitle>
        {place.nameEn ? <CardDescription>{place.nameEn}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <dl className="grid gap-2">
          <DetailRow label="Category" value={place.category.nameMy} />
          <DetailRow label="Area" value={place.area} />
          <DetailRow label="Address" value={place.addressText} />
          <DetailRow label="Phone" value={place.phone} />
          <DetailRow label="Hours" value={place.hoursText} />
          <DetailRow label="Price" value={place.priceRange} />
          {place.descriptionMy ? (
            <div className="pt-2">
              <dt className="text-muted-foreground">About</dt>
              <dd className="mt-1">{place.descriptionMy}</dd>
            </div>
          ) : null}
        </dl>
      </CardContent>
      {place.latitude !== null && place.longitude !== null ? (
        <CardContent className="border-t">
          <PlaceLocationMap place={place} />
        </CardContent>
      ) : null}
    </Card>
  );
}

export function PlaceDetailSkeleton() {
  return (
    <div
      className="grid gap-2 rounded-none p-4 ring-1 ring-foreground/10"
      aria-busy="true"
      aria-label="Loading place"
    >
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
      {[0, 1, 2, 3].map((index) => (
        <div key={index} className="grid grid-cols-[8rem_1fr] gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}
