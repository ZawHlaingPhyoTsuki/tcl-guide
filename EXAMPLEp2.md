NestJS + BetterAuth, Part 2: Next.js Client (CSR + SSR + Middleware)
Anindya Mukherjee(Andy)
Anindya Mukherjee(Andy)

Follow
9 min read
·
Feb 21, 2026
6

2

If you followed Part 1, you’ve got a NestJS API with Better Auth mounted, Prisma talking to Postgres, and a working cookie you can hit with curl. No front-end yet.

This guide picks up right there. You’ll spin up a Next.js App Router project on a separate port, wire up sign-in / sign-up / sign-out using Better Auth’s React hooks, read the session server-side in a Server Component, and protect routes with Next.js middleware. Same cookie, no localStorage tokens, no custom fetch wrappers.

Quick fixes from Part 1
Two small breaking changes have landed since Part 1 went out. Apply these before moving on:

1. @thallesp/nestjs-better-auth v2.x expects an object now

// src/app.module.ts — before
AuthModule.forRoot(auth)
// src/app.module.ts — after
AuthModule.forRoot({ auth })
The old signature still compiles but it’s deprecated. You’ll get a warning.

2. Better Auth renamed url → baseURL

// src/lib/auth.ts — before
export const auth = betterAuth({
url: process.env.BETTER_AUTH_URL,
...
});
// src/lib/auth.ts — after
export const auth = betterAuth({
baseURL: process.env.BETTER_AUTH_URL,
...
});
Both are one-liner changes. Once those are in, your Part 1 backend is current.

· · ·

What we’ll build
A Next.js 15 app (App Router, TypeScript) on port 3001 that talks to the NestJS backend on port 3000:

Sign-up and sign-in forms using signIn.email() / signUp.email() from better-auth/react
A useSession() hook that shows the logged-in user in a nav bar and updates across tabs
A protected /dashboard route — middleware redirects you to sign-in if the cookie is missing
A /profile page that reads the session on the server via a Server Component (SSR)
A smoke-test flow: sign up → cookie → dashboard renders → sign out → middleware blocks you
High-level diagram

┌─────────────────────┐ ┌──────────────────────┐
│ Next.js :3001 │ │ NestJS :3000 │
│ │ cookie │ │
│ Sign-in form (CSR) │────────→ │ /api/auth/sign-in │
│ useSession() (CSR) │←──────── │ Set-Cookie │
│ │ │ │
│ Profile (SSR) │────────→ │ /users/me │
│ middleware.ts │ check │ (AuthGuard) │
└─────────────────────┘ cookie └──────────────────────┘
Prerequisites
Everything from Part 1, plus:

The NestJS backend running on port 3000 with the two fixes above applied
Node 18+ (20+ recommended, same as before) 0) Update the backend for cross-origin
The front-end will run on :3001 — different port, so technically a different origin. Two spots need updating in the NestJS project:

// src/main.ts
app.enableCors({
origin: ['http://localhost:3000', 'http://localhost:3001'],
credentials: true,
});
// src/lib/auth.ts
trustedOrigins: ['http://localhost:3000', 'http://localhost:3001'],
These have to match. If you forget one of them, cookies won’t flow and you’ll spend 20 minutes staring at CORS errors in the console. (Ask me how I know.)

Rebuild and restart the backend. GET /api/auth/ok should still return 200.

1. Scaffold the Next.js project
   npx create-next-app@latest auth-client \
   --typescript --app --no-tailwind --no-eslint --no-src-dir
   cd auth-client
   We’ll use a src/ directory in this guide for clarity. Set up the folders:

mkdir -p src/{lib,components,app/auth/sign-in,app/auth/sign-up,app/dashboard,app/profile}
Install Better Auth:

npm i better-auth
That’s it — the React hooks ship inside the main package. No separate @better-auth/react or anything.

2. Configure the Better Auth client
   Create src/lib/auth-client.ts:

import { createAuthClient } from "better-auth/react";
export const authClient = createAuthClient({
baseURL: "http://localhost:3000", // points to the NestJS backend
});
export const { signIn, signUp, signOut, useSession } = authClient;
createAuthClient sets credentials: "include" on every fetch call it makes, which tells the browser to send cookies even on cross-origin requests. That's how the cookie from :3000 gets sent when :3001 makes a request.

3. Sign-up and sign-in forms (CSR)
   Create src/components/sign-up-form.tsx:

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
export function SignUpForm() {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(false);
const router = useRouter();
const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
setLoading(true);
setError(null);
const { error } = await signUp.email({ name, email, password });
if (error) {
setError(error.message ?? "Sign up failed");
setLoading(false);
return;
}
router.push("/dashboard");
};
return (
<form onSubmit={handleSubmit}>
{error && <p style={{ color: "red" }}>{error}</p>}
<input type="text" value={name} onChange={e => setName(e.target.value)}
placeholder="Full name" required />
<input type="email" value={email} onChange={e => setEmail(e.target.value)}
placeholder="Email" required />
<input type="password" value={password} onChange={e => setPassword(e.target.value)}
placeholder="Password (8+ chars)" required minLength={8} />
<button type="submit" disabled={loading}>
{loading ? "Creating account…" : "Sign Up"}
</button>
</form>
);
}
The sign-in form is almost the same — you just call signIn.email({ email, password }) and drop the name field.

Create src/components/sign-in-form.tsx:

"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth-client";
export function SignInForm() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState<string | null>(null);
const [loading, setLoading] = useState(false);
const router = useRouter();
const handleSubmit = async (e: React.FormEvent) => {
e.preventDefault();
setLoading(true);
setError(null);
const { error } = await signIn.email({ email, password });
if (error) {
setError(error.message ?? "Sign in failed");
setLoading(false);
return;
}
router.push("/dashboard");
};
return (
<form onSubmit={handleSubmit}>
{error && <p style={{ color: "red" }}>{error}</p>}
<input type="email" value={email} onChange={e => setEmail(e.target.value)}
placeholder="Email" required />
<input type="password" value={password} onChange={e => setPassword(e.target.value)}
placeholder="Password" required />
<button type="submit" disabled={loading}>
{loading ? "Signing in…" : "Sign In"}
</button>
</form>
);
}
Now wire them into their pages:

// src/app/auth/sign-up/page.tsx
import { SignUpForm } from "@/components/sign-up-form";
import Link from "next/link";
export default function SignUpPage() {
return (
<>
<h1>Sign Up</h1>
<SignUpForm />
<p>Already have an account? <Link href="/auth/sign-in">Sign in</Link></p>
</>
);
}
// src/app/auth/sign-in/page.tsx
import { SignInForm } from "@/components/sign-in-form";
import Link from "next/link";
export default function SignInPage() {
return (
<>
<h1>Sign In</h1>
<SignInForm />
<p>No account? <Link href="/auth/sign-up">Sign up</Link></p>
</>
);
} 4) Session display and sign-out (CSR)
Create src/components/user-button.tsx:

"use client";
import { useSession, signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
export function UserButton() {
const { data: session, isPending } = useSession();
const router = useRouter();
if (isPending) return <span>Loading…</span>;
if (!session?.user) {
return (
<div>
<a href="/auth/sign-in">Sign In</a>{" "}
<a href="/auth/sign-up">Sign Up</a>
</div>
);
}
return (
<div>
<span>{session.user.name}</span>
<button onClick={async () => {
await signOut();
router.push("/");
router.refresh();
}}>
Sign Out
</button>
</div>
);
}
useSession() returns { data, isPending, error }. It auto-refreshes on tab focus and syncs across browser tabs via BroadcastChannel — so signing out in one tab updates the others. You don't have to wire any of that up yourself.

Get Anindya Mukherjee(Andy)’s stories in your inbox
Join Medium for free to get updates from this writer.

Enter your email
Subscribe

Remember me for faster sign in

Drop it into the root layout so it shows everywhere:

// src/app/layout.tsx
import { UserButton } from "@/components/user-button";
export default function RootLayout({ children }: { children: React.ReactNode }) {
return (
<html lang="en">
<body>
<nav>
<a href="/">Auth Demo</a>
<UserButton />
</nav>
<main>{children}</main>
</body>
</html>
);
} 5) Protected dashboard (CSR)
The dashboard is simple — it just reads the session and shows your user info. The actual protection comes from the middleware in the next step.

Create src/app/dashboard/page.tsx:

"use client";
import { useSession } from "@/lib/auth-client";
export default function DashboardPage() {
const { data: session, isPending } = useSession();
if (isPending) return <p>Loading session…</p>;
return (
<>
<h1>Dashboard</h1>
<p>This route is protected by middleware. If you can see this, your cookie is valid.</p>
{session?.user && (
<table>
<tbody>
<tr><td><strong>Name</strong></td><td>{session.user.name}</td></tr>
<tr><td><strong>Email</strong></td><td>{session.user.email}</td></tr>
<tr><td><strong>User ID</strong></td><td>{session.user.id}</td></tr>
</tbody>
</table>
)}
</>
);
}
This page is client-rendered — useSession() fetches the session on mount. But unauthenticated users never even get here because the middleware (next step) catches them first.

6. Middleware — route protection
   Now for the part that actually keeps people out.

Create src/middleware.ts in your project root (not inside app/ — this trips people up):

import { NextRequest, NextResponse } from "next/server";
const protectedRoutes = ["/dashboard", "/profile"];
export function middleware(request: NextRequest) {
const { pathname } = request.nextUrl;
const isProtected = protectedRoutes.some(route => pathname.startsWith(route));
if (!isProtected) return NextResponse.next();
const sessionCookie = request.cookies.get("better-auth.session_token");
if (!sessionCookie) {
const signInUrl = new URL("/auth/sign-in", request.url);
signInUrl.searchParams.set("callbackUrl", pathname);
return NextResponse.redirect(signInUrl);
}
return NextResponse.next();
}
export const config = {
matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
This runs before the page renders. No cookie? 307 redirect to /auth/sign-in with a callbackUrl param so you can send users back after they log in.

Heads-up: the middleware only checks whether the cookie exists, not whether the session is still valid. For most apps that’s fine — useSession() or the SSR fetch (next section) will catch expired sessions. If you really need to validate in middleware, you could fetch() the backend's /users/me and check the response code, but that adds latency on every single navigation. Usually not worth it.

7. Server-side session reading (SSR)
   This is the part I was most excited to get working. A Server Component that reads the session on the server, before any JS reaches the browser.

Create src/app/profile/page.tsx:

import { cookies } from "next/headers";
async function getServerSession() {
const cookieStore = await cookies();
const sessionCookie = cookieStore.get("better-auth.session_token");
if (!sessionCookie) return null;
try {
const res = await fetch("http://localhost:3000/users/me", {
headers: {
Cookie: `better-auth.session_token=${sessionCookie.value}`,
},
cache: "no-store",
});
if (!res.ok) return null;
return res.json();
} catch {
return null;
}
}
export default async function ProfilePage() {
const session = await getServerSession();
if (!session) {
return (
<>
<h1>Profile (SSR)</h1>
<p>Not authenticated. This was checked on the server.</p>
<a href="/auth/sign-in">Sign in</a>
</>
);
}
return (
<>
<h1>Profile (SSR)</h1>
<p>This data was fetched on the <strong>server</strong> by forwarding your
cookie to the NestJS backend. No client-side JS needed for this page.</p>
<pre>{JSON.stringify(session, null, 2)}</pre>
</>
);
}
So the flow is: middleware confirms the cookie exists, the Server Component grabs it via cookies(), forwards it to GET /users/me on the NestJS backend, the AuthGuard validates it and returns the user, and the page renders with that data already baked into the HTML. No loading spinner, no flash of unauthenticated content, no hydration delay.

This is the pattern you want for SEO-sensitive pages, personalised content above the fold, or basically anything that should work with JS disabled.

8. Smoke test
   Start both servers:

# Terminal 1 — backend

cd auth-api
npm run start:dev

# Terminal 2 — frontend

cd auth-client
npm run dev
Open http://localhost:3001 and walk through the flow:

Click Sign Up → fill in the form → you should land on /dashboard
Open DevTools → Application → Cookies → localhost → confirm better-auth.session_token is there (HttpOnly, SameSite=Lax)
Nav bar should show your name + Sign Out button (that’s useSession() doing its thing)
Go to /profile → user data should be there instantly, and if you view-source, it's already in the HTML
Click Sign Out → back on the home page
Try /dashboard directly → middleware should kick you to /auth/sign-in?callbackUrl=%2Fdashboard
Open a second tab while signed in → sign out in one → both tabs update
Checkpoint: you should have

✅ Sign-up → cookie set → landed on dashboard

✅ Nav bar shows your name (that’s useSession() doing its thing)

✅ /profile has your data in the HTML source — not client-rendered

✅ Hit /dashboard logged out → bounced to /auth/sign-in

✅ Sign out in one tab, the other tab knows about it

If the cookie doesn’t appear: check that credentials: true is on CORS, trustedOrigins includes http://localhost:3001, and both CORS origins match. This was the most common issue from Part 1 and it'll bite you here too if the origins are out of sync.

9. What’s actually happening
   better-auth/react gives you createAuthClient() which wraps every fetch with credentials: "include". Calls to signIn.email(), signUp.email(), and signOut() go straight to the NestJS backend. The browser handles cookie storage — your code never touches the token.

useSession() uses Nanostores internally (small reactive state library). It re-fetches the session on tab focus, on network reconnect, and on storage events, which is how the multi-tab sync works without you writing anything extra.

On the server (middleware + Server Components), we just read the cookie from the incoming request. Middleware checks if it exists. The SSR fetch forwards it to the backend for proper validation. The backend’s AuthGuard does the real work — the front-end never looks inside the token.

The cookie itself is HttpOnly (JS can’t read it), SameSite=Lax, scoped to the backend’s origin. No localStorage, no token in memory, no XSS vector. That’s one less thing to worry about.

Gotchas
Cross-origin cookies in production: localhost:3000 and localhost:3001 share the same domain in dev, so cookies flow fine. In production with api.example.com and example.com, you'll need to set Better Auth's cookie domain to .example.com and make sure the proxy adds Secure and adjusts SameSite accordingly.

SSR fetch URL: That fetch("http://localhost:3000/users/me") in the Server Component is a server-to-server call. In production, point this at the backend's internal address, not the public one — you don't want your SSR going out to the internet and back.

Middleware doesn’t validate the session. It only checks if the cookie is there. An expired session will pass middleware but then fail the useSession() check or the SSR fetch. That's by design — keeps middleware fast. If you absolutely need validation there, add a fetch to /api/auth/get-session, but measure the latency first. It adds up.

What’s next
You’ve got a full NestJS + Better Auth + Next.js stack with cookie-based sessions, React hooks, server-side rendering, and middleware protection. No Passport, no NextAuth, no middleware spaghetti.

From here you could add OAuth providers (Google, GitHub — Better Auth has built-in support), email verification (the emailVerified field is already there), or role-based access using the @Roles() and @OrgRoles() decorators from @thallesp/nestjs-better-auth.

That’s Part 2.

Press enter or click to view image in full size

Photo by NASA on Unsplash
JavaScript

Nextjs

Web Development

Authentication

Reactjs

6

2

Anindya Mukherjee(Andy)
Written by Anindya Mukherjee(Andy)
13 followers
·
1 following
Aspiring Entrepreneur | Developer at Heart | Engineer | Innovator | Traveller | Photographer | Technology Enthusiast | Get in touch @ andysenclave.com

Follow
Help

Status

About

Careers

Press

Blog

Store

Privacy

Rules

Terms

Text to speech
