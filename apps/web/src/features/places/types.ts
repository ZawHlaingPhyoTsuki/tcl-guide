export type Category = {
  id: string;
  slug: string;
  nameMy: string;
  nameEn: string | null;
};

export type PlaceSummary = {
  allPlaces: number;
  publishedPlaces: number;
  hiddenPlaces: number;
  areasCovered: number;
};

export type PlaceMutation = {
  nameMy: string;
  nameEn?: string;
  descriptionMy?: string;
  categoryId: string;
  area?: string;
  addressText?: string;
  phone?: string;
  hoursText?: string;
  priceRange?: string;
  latitude?: number | null;
  longitude?: number | null;
  photos?: string[];
  isActive?: boolean;
};

export type Place = {
  id: string;
  nameMy: string;
  nameEn: string | null;
  descriptionMy: string | null;
  categoryId: string;
  category: Category & { createdAt: string; updatedAt: string };
  area: string | null;
  addressText: string | null;
  phone: string | null;
  hoursText: string | null;
  priceRange: string | null;
  latitude: number | null;
  longitude: number | null;
  photos: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};
