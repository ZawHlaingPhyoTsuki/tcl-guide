import { ENV } from "@/env";
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL:
    typeof window === "undefined"
      ? ENV.SERVER_URL // server components: call NestJS directly
      : window.location.origin, // browser: goes through the rewrite
});
