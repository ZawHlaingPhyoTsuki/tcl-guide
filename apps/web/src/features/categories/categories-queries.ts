import "server-only";

import { categoriesTransport } from "./categories-transport";
import type { AdminCategory, Category } from "./types/category";

export async function getCategories(): Promise<Category[]> {
  return categoriesTransport.getCategories();
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  return categoriesTransport.getAdminCategories();
}
