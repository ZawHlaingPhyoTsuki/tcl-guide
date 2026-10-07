import { Suspense } from "react";

import {
  AdminAreasSection,
  AdminAreasSkeleton,
} from "@/features/areas/admin/components/admin-areas-section";

export default function AdminAreasPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-6">
      <Suspense fallback={<AdminAreasSkeleton />}>
        <AdminAreasSection />
      </Suspense>
    </main>
  );
}
