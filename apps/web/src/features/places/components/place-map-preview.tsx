"use client";

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { Place } from "../types";

export function PlaceMapPreview({ place }: { place: Place }) {
  return (
    <Card className="border-x-0 border-b-0 rounded-none sm:border">
      <CardContent className="grid gap-3 p-4">
        <div>
          <p className="font-medium">{place.nameMy}</p>
          <p className="text-sm text-muted-foreground">
            {place.category.nameMy}
            {place.area ? ` · ${place.area}` : ""}
          </p>
        </div>
        {/* <Button render={<Link href={`/places/${place.id}`} />}>View place</Button> */}
        <Link href={`/places/${place.id}`} className={buttonVariants({ variant: "outline" })}>
          View place
        </Link>
      </CardContent>
    </Card>
  );
}
