import "server-only";

import { getRequestHeaders, serverUrl } from "@/lib/server-url";

import type { Category, Place, PlaceMutation, PlaceSummary, UploadTicket } from "./types";

export class PlacesTransportError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function request<T>(path: string, init?: RequestInit, authenticated = false): Promise<T> {
  const response = await fetch(`${serverUrl()}${path}`, {
    ...init,
    cache: "no-store",
    headers: authenticated ? await getRequestHeaders() : init?.headers,
  });
  if (!response.ok) {
    throw new PlacesTransportError(
      (await response.text()) || `Request failed with status ${response.status}`,
      response.status,
    );
  }
  return (await response.json()) as T;
}

export const placesTransport = {
  getCategories() {
    return request<Category[]>("/categories");
  },

  getPlaces(query: string) {
    return request<Place[]>(`/places${query}`);
  },

  getPlace(id: string) {
    return request<Place>(`/places/${id}`);
  },

  getAdminPlaces(query: string) {
    return request<Place[]>(`/admin/places${query}`, undefined, true);
  },

  getAdminSummary() {
    return request<PlaceSummary>("/admin/places/summary", undefined, true);
  },

  createPlace(input: PlaceMutation) {
    return request<Place>(
      "/admin/places",
      {
        method: "POST",
        body: JSON.stringify(input),
      },
      true,
    );
  },

  updatePlace(id: string, input: Partial<PlaceMutation>) {
    return request<Place>(
      `/admin/places/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(input),
      },
      true,
    );
  },

  deletePlace(id: string) {
    return request<{ deleted: true }>(
      `/admin/places/${id}`,
      {
        method: "DELETE",
      },
      true,
    );
  },

  createUpload(contentType: string) {
    return request<UploadTicket>(
      "/admin/uploads",
      {
        method: "POST",
        body: JSON.stringify({ contentType }),
      },
      true,
    );
  },

  deleteUpload(url: string) {
    return request<{ deleted: true }>(
      "/admin/uploads",
      {
        method: "DELETE",
        body: JSON.stringify({ url }),
      },
      true,
    );
  },
};
