import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "./auth-client";

export async function requireAdminSession() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers(), throw: true },
  });

  if (!session?.user) redirect("/login");

  const role = (session.user as typeof session.user & { role?: string | null }).role;
  if (role !== "admin") redirect("/");

  return session;
}

export async function redirectIfAuthenticated() {
  const session = await authClient.getSession({
    fetchOptions: { headers: await headers(), throw: true },
  });

  if (!session?.user) return;

  const role = (session.user as typeof session.user & { role?: string | null }).role;
  redirect(role === "admin" ? "/dashboard" : "/");
}
