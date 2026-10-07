import { createAuthClient } from "better-auth/react";

function getBaseURL() {
  // Browser: same-origin so the session cookie stays first-party and is
  // sent to (and readable by) our own Server Components and middleware.
  if (typeof window !== "undefined") return "/api/auth";

  const serverUrl = (
    process.env.SERVER_URL ??
    process.env.NEXT_PUBLIC_SERVER_URL ??
    "http://localhost:3000"
  ).replace(/\/$/, "");

  return `${serverUrl}/api/auth`;
}

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
});
