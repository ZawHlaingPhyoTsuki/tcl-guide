export type Category = {
  id: string;
  slug: string;
  nameMy: string;
  nameEn: string | null;
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
