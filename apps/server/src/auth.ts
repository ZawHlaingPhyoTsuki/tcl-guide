import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { admin } from "better-auth/plugins/admin";

import type { PrismaClient } from "./generated/client.js";

export type AuthConfig = {
  WEB_URL: string;
  BETTER_AUTH_SECRET: string;
  CORS_ORIGIN: string;
};

export function createAuth(
  env: AuthConfig,
  database: PrismaClient,
  desktopOrigins: readonly string[] = [],
) {
  return betterAuth({
    database: prismaAdapter(database, {
      provider: "postgresql",
    }),
    trustedOrigins: [env.WEB_URL, ...desktopOrigins],
    emailAndPassword: { enabled: true },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.WEB_URL,
    plugins: [admin()],
  });
}

export type Session = ReturnType<typeof createAuth>["$Infer"]["Session"];
