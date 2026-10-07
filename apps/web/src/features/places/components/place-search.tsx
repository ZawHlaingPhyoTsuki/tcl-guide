"use client";

import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export function PlaceSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initial = searchParams.get("search") ?? "";
  const [value, setValue] = useState(initial);

  // Keep input in sync with back/forward navigation.
  useEffect(() => {
    setValue(searchParams.get("search") ?? "");
  }, [searchParams]);

  // Debounced URL update — search is server-filtered, shareable.
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const trimmed = value.trim();
      if (trimmed) params.set("search", trimmed);
      else params.delete("search");
      const next = params.toString();
      const current = searchParams.toString();
      if (next !== current) {
        router.replace((next ? `${pathname}?${next}` : pathname) as Route);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [value, pathname, router, searchParams]);

  return (
    <label className="relative block">
      <span className="sr-only">Search places</span>
      <Search
        className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2"
        aria-hidden
      />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search name, category, area…"
        className="pl-9"
        type="search"
      />
    </label>
  );
}
