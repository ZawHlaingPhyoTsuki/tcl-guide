import "server-only";

import { notFound } from "next/navigation";

import type { Category, Place } from "./types/place";

function apiBase() {
  // Mirrors lib/auth-client.ts: container DNS server-side, public URL otherwise.
  if (typeof window === "undefined" && process.env.SERVER_URL) {
    return process.env.SERVER_URL.replace(/\/$/, "");
  }
  return (process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${apiBase()}/categories`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API /categories returned ${res.status}`);
  }
  return (await res.json()) as Category[];
}

export async function getPlaces(filters?: { category?: string; area?: string }): Promise<Place[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.set("category", filters.category);
  if (filters?.area) params.set("area", filters.area);
  const query = params.size > 0 ? `?${params.toString()}` : "";
  const res = await fetch(`${apiBase()}/places${query}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API /places returned ${res.status}`);
  }
  return (await res.json()) as Place[];
}

export async function getPlace(id: string): Promise<Place> {
  const res = await fetch(`${apiBase()}/places/${id}`, { cache: "no-store" });
  if (res.status === 404) {
    notFound();
  }
  if (!res.ok) {
    throw new Error(`API /places/${id} returned ${res.status}`);
  }
  return (await res.json()) as Place;
}
