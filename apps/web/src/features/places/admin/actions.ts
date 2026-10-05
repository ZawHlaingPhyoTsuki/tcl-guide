"use server";

import { z } from "zod";

import { placesTransport } from "../transport";

export const placeInputSchema = z.object({
  nameMy: z.string().trim().min(1),
  nameEn: z.string().trim().optional(),
  descriptionMy: z.string().trim().optional(),
  categoryId: z.string().min(1),
  area: z.string().trim().optional(),
  addressText: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  hoursText: z.string().trim().optional(),
  priceRange: z.string().trim().optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  photos: z.array(z.string().url()).optional(),
  isActive: z.boolean().optional(),
});

export type PlaceInput = z.infer<typeof placeInputSchema>;

export async function createPlace(input: PlaceInput) {
  return placesTransport.createPlace(placeInputSchema.parse(input));
}

export async function updatePlace(id: string, input: Partial<PlaceInput>) {
  return placesTransport.updatePlace(id, placeInputSchema.partial().parse(input));
}

export async function deletePlace(id: string) {
  return placesTransport.deletePlace(id);
}
