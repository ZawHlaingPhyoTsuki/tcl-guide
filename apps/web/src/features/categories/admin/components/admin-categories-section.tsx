import { getAdminCategories } from "../../categories-queries";
import { AdminCategories, AdminCategoriesSkeleton } from "./admin-categories";

export async function AdminCategoriesSection() {
  const categories = await getAdminCategories();

  return <AdminCategories initialCategories={categories} />;
}

export { AdminCategoriesSkeleton };
