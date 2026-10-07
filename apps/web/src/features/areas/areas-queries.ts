import "server-only";

import { areasTransport } from "./areas-transport";
import type { Area } from "./types/area";

export async function getAreas(): Promise<Area[]> {
  return areasTransport.getAreas();
}
