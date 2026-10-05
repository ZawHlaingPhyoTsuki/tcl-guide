"use server";

import { placeInputSchema, type PlaceInput } from "./schema";
import { placesTransport } from "../transport";

export async function createPlace(input: PlaceInput) {
  return placesTransport.createPlace(placeInputSchema.parse(input));
}

export async function updatePlace(id: string, input: Partial<PlaceInput>) {
  return placesTransport.updatePlace(id, placeInputSchema.partial().parse(input));
}

export async function deletePlace(id: string) {
  return placesTransport.deletePlace(id);
}

export async function requestUpload(contentType: string) {
  return placesTransport.createUpload(contentType);
}

export async function removeUpload(url: string) {
  return placesTransport.deleteUpload(url);
}
