// lib/admin-session.ts
import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "./auth-client";

const getSession = cache(async () => {
  const { data, error } = await authClient.getSession({
    fetchOptions: { headers: await headers() }, // forward cookies to NestJS
  });
  if (error) return null;
  return data;
});

export async function requireAdminSession() {
  const session = await getSession();
  if (!session?.user) redirect("/login");

  const role = (session.user as { role?: string | null }).role;
  if (role !== "admin") redirect("/");

  return session;
}

export async function redirectIfAuthenticated() {
  const session = await getSession();
  if (!session?.user) return;

  const role = (session.user as { role?: string | null }).role;
  redirect(role === "admin" ? "/dashboard" : "/");
}
