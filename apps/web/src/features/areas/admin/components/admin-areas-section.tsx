import { getAdminAreas } from "../../areas-queries";
import { AdminAreas, AdminAreasSkeleton } from "./admin-areas";

export async function AdminAreasSection() {
  const areas = await getAdminAreas();

  return <AdminAreas initialAreas={areas} />;
}

export { AdminAreasSkeleton };
