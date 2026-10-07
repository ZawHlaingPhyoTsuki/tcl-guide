import "server-only";

import { apiRequest } from "@/lib/api";

import type { Area } from "./types/area";

export const areasTransport = {
  getAreas() {
    return apiRequest<Area[]>("/areas");
  },
};
