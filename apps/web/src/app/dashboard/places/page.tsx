import { Suspense } from "react";

import {
  AdminPlacesSection,
  AdminPlacesSkeleton,
} from "@/features/places/admin/components/admin-places-section";

export default function AdminPlacesPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-6">
      <Suspense fallback={<AdminPlacesSkeleton />}>
        <AdminPlacesSection />
      </Suspense>
    </main>
  );
}
