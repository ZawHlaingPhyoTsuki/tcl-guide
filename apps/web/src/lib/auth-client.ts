import { ENV } from "@/env";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: ENV.SERVER_URL ?? "http://localhost:3000",
});
