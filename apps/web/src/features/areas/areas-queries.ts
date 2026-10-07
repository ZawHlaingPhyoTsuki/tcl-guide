import "server-only";

import { areasTransport } from "./areas-transport";
import type { AdminArea, Area } from "./types/area";

export async function getAreas(): Promise<Area[]> {
  return areasTransport.getAreas();
}

export async function getAdminAreas(): Promise<AdminArea[]> {
  return areasTransport.getAdminAreas();
}
