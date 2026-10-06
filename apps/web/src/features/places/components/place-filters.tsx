import { PlaceFilter } from "./place-filter";
import { getCategories } from "@/features/categories/queries";
import { Skeleton } from "@/components/ui/skeleton";

export async function PlaceFilters({ category, area }: { category?: string; area?: string }) {
  const categories = await getCategories();
  return <PlaceFilter categories={categories} current={{ category, area }} />;
}

export function PlaceFiltersSkeleton() {
  return (
    <div className="flex flex-wrap items-end gap-3" aria-busy="true" aria-label="Loading filters">
      <div className="grid gap-1">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-9 w-44" />
      </div>
      <div className="grid gap-1">
        <Skeleton className="h-4 w-10" />
        <span className="flex gap-2">
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-20" />
        </span>
      </div>
    </div>
  );
}
