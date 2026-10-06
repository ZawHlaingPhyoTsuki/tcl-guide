import { getCategories } from "@/features/categories/categories-queries";

import { getAdminPlaces } from "../../places-queries";
import { AdminPlaces, AdminPlacesSkeleton } from "./admin-places";

export async function AdminPlacesSection() {
  const [places, categories] = await Promise.all([getAdminPlaces(), getCategories()]);

  return <AdminPlaces initialPlaces={places} categories={categories} />;
}

export { AdminPlacesSkeleton };
