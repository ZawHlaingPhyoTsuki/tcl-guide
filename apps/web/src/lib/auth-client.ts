import { createAuthClient } from "better-auth/react";
import { ENV } from "@/env";

export const authClient = createAuthClient({
  baseURL: ENV.SERVER_URL || "http://localhost:3000", // Point to NestJS
});
