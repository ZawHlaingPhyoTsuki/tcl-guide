import { getAreas } from "@/features/areas/areas-queries";
import { getCategories } from "@/features/categories/categories-queries";

import { getAdminPlaces } from "../../places-queries";
import { AdminPlaces, AdminPlacesSkeleton } from "./admin-places";

export async function AdminPlacesSection() {
  const [places, categories, areas] = await Promise.all([
    getAdminPlaces(),
    getCategories(),
    getAreas(),
  ]);

  return <AdminPlaces initialPlaces={places} categories={categories} areas={areas} />;
}

export { AdminPlacesSkeleton };
