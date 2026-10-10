"use client";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type * as React from "react";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

export function LandingSearch() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function submit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = value.trim();
    router.push((trimmed ? `/map?search=${encodeURIComponent(trimmed)}` : "/map") as Route);
  }

  return (
    <form onSubmit={submit} role="search" className="flex gap-2">
      <InputGroup className="h-11 bg-background shadow-md">
        <InputGroupInput
          placeholder="Search noodles, cafes, bakeries…"
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          aria-label="Search places"
          className="h-full"
        />
        <InputGroupAddon align="inline-end">
          <Search className="size-4 text-muted-foreground" />
        </InputGroupAddon>
      </InputGroup>
      <Button type="submit" size="lg" className="shrink-0">
        Search
      </Button>
    </form>
  );
}
