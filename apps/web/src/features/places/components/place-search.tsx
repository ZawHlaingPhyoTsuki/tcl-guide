"use client";

import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { cn } from "cn";

export function PlaceSearch({ isMobile }: { isMobile?: boolean }) {
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
    <InputGroup className={cn(isMobile && "!bg-background !shadow-md")}>
      <InputGroupInput
        placeholder="Search name, category, area…"
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <InputGroupAddon align="inline-end">
        <Search className="size-4 text-muted-foreground" />
      </InputGroupAddon>
    </InputGroup>
  );
}
