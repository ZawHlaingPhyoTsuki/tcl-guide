import "server-only";

import { categoriesTransport } from "./transport";
import type { AdminCategory, Category } from "./types";

export async function getCategories(): Promise<Category[]> {
  return categoriesTransport.getCategories();
}

export async function getAdminCategories(): Promise<AdminCategory[]> {
  return categoriesTransport.getAdminCategories();
}
