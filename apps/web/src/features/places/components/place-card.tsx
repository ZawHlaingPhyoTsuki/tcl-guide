import type { Route } from "next";
import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { Place } from "../types/place";

export function PlaceCard({ place }: { place: Place }) {
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
