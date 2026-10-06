import Link from "next/link";
import { Suspense } from "react";
import type { Route } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getAdminPlaceSummary } from "../../places-queries";
import { AdminPlacesMapSection, AdminPlacesMapSkeleton } from "./admin-places-map-section";

export async function AdminDashboard() {
  const summary = await getAdminPlaceSummary();

  return (
    <div className="grid gap-8">
      <section className="grid gap-2 border-b pb-6">
        <p className="text-sm text-muted-foreground">A practical view of the local directory</p>
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight">
          Keep Tachileik easy to explore.
        </h1>
        <p className="max-w-xl text-sm leading-6 text-muted-foreground">
          Add the places people need, keep details current, and publish only what is ready to be
          seen.
        </p>
      </section>
      <section className="grid gap-3 sm:grid-cols-3" aria-label="Directory summary">
        <SummaryCard
          label="All places"
          value={summary.allPlaces}
          detail="Records in the directory"
        />
        <SummaryCard
          label="Published"
          value={summary.publishedPlaces}
          detail="Visible to visitors"
        />
        <SummaryCard
          label="Areas covered"
          value={summary.areasCovered}
          detail={
            summary.hiddenPlaces ? `${summary.hiddenPlaces} hidden for review` : "No hidden records"
          }
        />
      </section>
      <Suspense fallback={<AdminPlacesMapSkeleton />}>
        <AdminPlacesMapSection />
      </Suspense>
      <section className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t pt-5 text-sm">
        <Link
          href={"/dashboard/places" as Route}
          className="font-medium underline underline-offset-4"
        >
          Manage places
        </Link>
        <Link href={"/" as Route} className="text-muted-foreground underline underline-offset-4">
          View public directory
        </Link>
      </section>
    </div>
  );
}

function SummaryCard({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <Card>
      <CardHeader className="gap-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
        <p className="text-3xl font-semibold tabular-nums">{value}</p>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">{detail}</CardContent>
    </Card>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div
      className="h-72 animate-pulse border bg-muted/30"
      aria-busy="true"
      aria-label="Loading dashboard"
    />
  );
}
