import { z } from "zod";

export const listPlacesSchema = z.object({
  category: z.string().min(1).optional(),
  area: z.string().min(1).optional(),
});

export type ListPlacesQuery = z.infer<typeof listPlacesSchema>;

const placeFields = {
  nameMy: z.string().min(1),
  nameEn: z.string().optional(),
  descriptionMy: z.string().optional(),
  categoryId: z.string().min(1),
  area: z.string().optional(),
  addressText: z.string().optional(),
  phone: z.string().optional(),
  hoursText: z.string().optional(),
  priceRange: z.string().optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
  photos: z.array(z.string().url()).optional(),
  isActive: z.boolean().optional(),
};

export const createPlaceSchema = z.object(placeFields);

export const updatePlaceSchema = createPlaceSchema.partial();

export type CreatePlaceDto = z.infer<typeof createPlaceSchema>;
export type UpdatePlaceDto = z.infer<typeof updatePlaceSchema>;
