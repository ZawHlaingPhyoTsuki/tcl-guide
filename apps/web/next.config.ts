import { varlockNextConfigPlugin } from "@varlock/nextjs-integration/plugin";

const withVarlock = varlockNextConfigPlugin();
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typedRoutes: true,
  reactCompiler: true,
  output: "standalone",
  // Same-origin proxy for Better Auth: the browser only talks to the web
  // domain, so the session cookie stays first-party and is visible to
  // Server Components via headers(). Never settable via cookie `domain`
  // from a cross-origin backend (browsers reject that).
  async rewrites() {
    const serverUrl = (process.env.SERVER_URL ?? process.env.NEXT_PUBLIC_SERVER_URL ?? "").replace(
      /\/$/,
      "",
    );
    if (!serverUrl) return [];
    return [{ source: "/api/auth/:path*", destination: `${serverUrl}/api/auth/:path*` }];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.neon.tech",
      },
    ],
  },
};

export default withVarlock(nextConfig);
