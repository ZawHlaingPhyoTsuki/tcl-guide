import "server-only";

import { cookies } from "next/headers";
import { ENV } from "@/env";
import type { Session } from "./types/session";

export async function getServerSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("better-auth.session_token");

  if (!sessionCookie) return null;

  try {
    // Call your NestJS backend to validate the session
    // Use your server URL env variable
    const apiUrl = ENV.SERVER_URL || "http://localhost:3000";

    const res = await fetch(`${apiUrl}/api/auth/get-session`, {
      headers: {
        // Forward the cookie to NestJS for validation
        Cookie: `better-auth.session_token=${sessionCookie.value}`,
      },
      cache: "no-store", // Critical: Do not cache private user data
    });

    if (!res.ok) return null;

    return res.json();
  } catch (error) {
    console.error("Failed to fetch session from NestJS:", error);
    return null;
  }
}
