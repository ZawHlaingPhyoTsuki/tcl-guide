import "server-only";

import { notFound } from "next/navigation";

import { PlacesTransportError, placesTransport } from "./transport";
import type { Category, Place, PlaceSummary } from "./types";

export async function getCategories(): Promise<Category[]> {
  return placesTransport.getCategories();
}

export async function getPlaces(filters?: { category?: string; area?: string }): Promise<Place[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.set("category", filters.category);
  if (filters?.area) params.set("area", filters.area);
  const query = params.size > 0 ? `?${params.toString()}` : "";
  return placesTransport.getPlaces(query);
}

export async function getPlace(id: string): Promise<Place> {
  try {
    return await placesTransport.getPlace(id);
  } catch (error) {
    if (error instanceof PlacesTransportError && error.status === 404) {
      notFound();
    }
    throw error;
  }
}

export async function getAdminPlaces(filters?: {
  category?: string;
  area?: string;
}): Promise<Place[]> {
  const params = new URLSearchParams();
  if (filters?.category) params.set("category", filters.category);
  if (filters?.area) params.set("area", filters.area);
  const query = params.size > 0 ? `?${params.toString()}` : "";
  return placesTransport.getAdminPlaces(query);
}

export async function getAdminPlaceSummary(): Promise<PlaceSummary> {
  return placesTransport.getAdminSummary();
}
