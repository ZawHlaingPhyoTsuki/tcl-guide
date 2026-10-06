"use client";

import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import type { Category } from "@/features/categories/types/category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PlaceFilter({
  categories,
  current,
}: {
  categories: Category[];
  current: { category?: string; area?: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [area, setArea] = useState(current.area ?? "");

  function push(params: URLSearchParams) {
    const query = params.toString();
    router.push((query ? `${pathname}?${query}` : pathname) as Route);
  }

  function onCategoryChange(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    push(params);
  }

  function onAreaSubmit(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (area.trim()) {
      params.set("area", area.trim());
    } else {
      params.delete("area");
    }
    push(params);
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <label className="grid gap-1 text-sm">
        Category
        <select
          className="rounded-none border bg-background px-3 py-2"
          defaultValue={current.category ?? ""}
          onChange={(event) => onCategoryChange(event.target.value)}
        >
          <option value="">All</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.nameMy}
              {category.nameEn ? ` · ${category.nameEn}` : ""}
            </option>
          ))}
        </select>
      </label>
      <form onSubmit={onAreaSubmit} className="grid gap-1 text-sm">
        Area
        <span className="flex gap-2">
          <Input
            value={area}
            onChange={(event) => setArea(event.target.value)}
            placeholder="San Sai"
          />
          <Button type="submit">Search</Button>
        </span>
      </form>
    </div>
  );
}
