import { Suspense } from "react";

import {
  AdminCategoriesSection,
  AdminCategoriesSkeleton,
} from "@/features/categories/admin/components/admin-categories-section";

export default function AdminCategoriesPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-6">
      <Suspense fallback={<AdminCategoriesSkeleton />}>
        <AdminCategoriesSection />
      </Suspense>
    </main>
  );
}
