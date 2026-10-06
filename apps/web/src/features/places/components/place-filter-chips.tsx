"use client";

import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  LayoutGrid,
  UtensilsCrossed,
  Coffee,
  CakeSlice,
  Store,
  Beer,
  BedDouble,
} from "lucide-react";

import type { Category } from "@/features/categories/types/category";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function iconForSlug(slug: string) {
  if (slug.includes("cafe") || slug.includes("coffee") || slug.includes("tea")) return Coffee;
  if (slug.includes("bakery") || slug.includes("cake") || slug.includes("dessert"))
    return CakeSlice;
  if (slug.includes("bar") || slug.includes("drink")) return Beer;
  if (slug.includes("hotel") || slug.includes("stay")) return BedDouble;
  if (slug.includes("shop") || slug.includes("store") || slug.includes("market")) return Store;
  if (slug.includes(" noodle") || slug.includes("food") || slug.includes("restaurant"))
    return UtensilsCrossed;
  return UtensilsCrossed;
}

export function PlaceFilterChips({
  categories,
  className,
}: {
  categories: Category[];
  className?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get("category");

  function select(slug: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set("category", slug);
    else params.delete("category");
    const query = params.toString();
    router.push((query ? `${pathname}?${query}` : pathname) as Route);
  }

  return (
    <div
      role="group"
      aria-label="Filter by category"
      className={cn(
        "flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      <Button
        size="sm"
        variant={active == null ? "secondary" : "outline"}
        aria-pressed={active == null}
        onClick={() => select(null)}
        className="shrink-0"
      >
        <LayoutGrid aria-hidden />
        All
      </Button>
      {categories.map((category) => {
        const Icon = iconForSlug(category.slug);
        const isActive = active === category.slug;
        return (
          <Button
            key={category.id}
            size="sm"
            variant={isActive ? "secondary" : "outline"}
            aria-pressed={isActive}
            onClick={() => select(isActive ? null : category.slug)}
            className="shrink-0"
          >
            <Icon aria-hidden />
            {category.nameMy}
          </Button>
        );
      })}
    </div>
  );
}
