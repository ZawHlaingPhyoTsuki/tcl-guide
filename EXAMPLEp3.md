Search

Get app
Write
Sign up

Sign in

Unknown user

JavaScript

Web Development

Nextjs

Authentication

Artificial Intelligence

NestJS + BetterAuth, Part 3: OAuth, Roles & AI — The Endgame
Anindya Mukherjee(Andy)
Anindya Mukherjee(Andy)

Follow
15 min read
·
Feb 22, 2026
3

You survived Passport.js, dodged the JWT rabbit hole, and still need social login, role gates, and AI endpoints that actually know who’s asking. This is the part where the auth system earns its keep.

Where we left off
If you’ve been following along, you’ve got a NestJS backend with BetterAuth mounted (Part 1) and a Next.js frontend with CSR, SSR, and middleware-based route protection (Part 2). Email + password works, cookies flow between ports, and useSession() keeps everything in sync.

That’s a solid foundation. But real apps need more:

OAuth — so users can sign in with Google or GitHub instead of remembering yet another password
Roles — so you can lock down admin endpoints without writing guard spaghetti
AI that knows who you are — not a generic chat box, but endpoints that use your identity for moderation, risk scoring, and admin insights
This guide adds all three. Same stack, same cookie-based sessions, no new auth library.

What we’re building
By the end of this guide, your stack will have:

Google and GitHub social login (one-click sign-in, automatic account creation)
An admin plugin that adds a role field to every user (user by default, admin when promoted)
A @Roles(["admin"]) decorator that blocks non-admin users at the controller level
An organization plugin with custom access control (define your own resources and permissions)
Four AI endpoints — all protected by auth, each solving a different real-world problem:
/ai/chat — identity-aware assistant that knows your name and role
/ai/moderate — content moderation before user-generated text hits DB
/ai/score-login — anomaly detection that risk-scores each login session
/ai/insights — admin-only natural language queries on your user data
Frontend pages: social login buttons, admin panel with AI insights, and a tabbed AI tools interface
Architecture diagram

┌─────────────────────────-┐ ┌──────────────────────────────┐
│ Next.js :3001 │ │ NestJS :3000 │
│ │ cookie │ │
│ Google / GitHub buttons │────────→ │ /api/auth/sign-in/social │
│ Sign-in form (email) │────────→ │ /api/auth/sign-in/email │
│ │ │ │
│ AI Tools (tabbed) │────────→ │ /ai/chat (AuthGuard) │
│ → Chat │────────→ │ /ai/moderate (AuthGuard) │
│ → Moderation │────────→ │ /ai/score-login (AuthGuard) │
│ → Login Risk │ │ │
│ │ │ │
│ Admin Panel │────────→ │ /admin/* (@Roles) │
│ → AI Insights │────────→ │ /ai/insights (@Roles) │
│ │ │ │
│ middleware.ts │ cookie │ /api/auth/admin/list-users │
└─────────────────────────-┘ check └──────────────────────────────┘
Prerequisites
Everything from Parts 1 and 2, plus:

A Google Cloud project with OAuth credentials (optional — the code works in demo mode without them)
A GitHub OAuth app (optional, same reason)
An OpenAI API key (optional — demo mode returns mock responses)
If you don’t have any of these yet, don’t worry. The app runs without them. You’ll just see demo responses from the AI and the OAuth buttons will redirect to error pages until you add real credentials.

Step 0: Install new dependencies
In the backend (auth-api):

npm install openai
That’s it. The admin plugin, organization plugin, and social providers all ship inside the better-auth package. No extra installs.

If you want the AI endpoints to actually call OpenAI, you’ll need an API key. Without one, the service runs in demo mode and returns mock responses. Good enough for testing the auth flow.

Step 1: Add social providers (Google + GitHub)
Open src/lib/auth.ts and add the socialProviders block:

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
import { admin, organization } from "better-auth/plugins";
const prisma = new PrismaClient();
export const auth = betterAuth({
baseURL: process.env.BETTER_AUTH_URL,
database: prismaAdapter(prisma, { provider: "sqlite" }),
emailAndPassword: {
enabled: true,
},
// --- NEW: Social OAuth providers ---
socialProviders: {
google: {
clientId: process.env.GOOGLE_CLIENT_ID!,
clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
},
github: {
clientId: process.env.GITHUB_CLIENT_ID!,
clientSecret: process.env.GITHUB_CLIENT_SECRET!,
},
},
trustedOrigins: ["http://localhost:3000", "http://localhost:3001"],
});
Getting OAuth credentials
Google:

Go to Google Cloud Console → APIs & Services → Credentials
Create an OAuth 2.0 Client ID (Web application)
Add http://localhost:3000/api/auth/callback/google as an authorized redirect URI
Copy the Client ID and Client Secret into your .env
GitHub:

Go to GitHub → Settings → Developer settings → OAuth Apps
Create a new OAuth App
Set the callback URL to http://localhost:3000/api/auth/callback/github
Copy the Client ID and Client Secret into your .env
Your .env should now include:

GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
OPENAI_API_KEY=sk-your-openai-key # optional
BetterAuth handles the entire OAuth dance — redirect, callback, token exchange, user creation, account linking. You don’t write any of that.

Step 2: Add the admin plugin (roles + RBAC)
This is where it gets interesting. BetterAuth’s admin plugin adds a role field to the user model and provides built-in endpoints for user management. The @thallesp/nestjs-better-auth package gives you a @Roles() decorator that reads that field.

2a: Define your access control
Create src/lib/permissions.ts:

import { createAccessControl } from "better-auth/plugins/access";
import {
defaultStatements,
adminAc,
} from "better-auth/plugins/organization/access";
const statement = {
...defaultStatements,
project: ["create", "read", "update", "delete"],
aiChat: ["use"],
} as const;
export const ac = createAccessControl(statement);
export const member = ac.newRole({
project: ["create", "read"],
aiChat: ["use"],
});
export const admin = ac.newRole({
project: ["create", "read", "update", "delete"],
aiChat: ["use"],
...adminAc.statements,
});
export const owner = ac.newRole({
project: ["create", "read", "update", "delete"],
aiChat: ["use"],
...adminAc.statements,
});
A few things to note here:

createAccessControl takes a statement object where keys are resource names and values are arrays of allowed actions. The as const is required so TypeScript can infer literal types.
defaultStatements preserves BetterAuth's built-in organization permissions (member management, invitations, etc.). If you skip merging these in, your custom roles lose the ability to manage org members.
adminAc.statements preserves the default admin permissions. Without this, your custom admin role can't do things like ban users or list accounts.
You can define any resource names you want. Here, project and aiChat are custom. BetterAuth doesn't know or care what they mean — it just checks if a role has the right permission when you ask.
2b: Register the plugins
Update src/lib/auth.ts to include both the admin and organization plugins:

import { admin, organization } from "better-auth/plugins";
import { ac, admin as adminRole, member, owner } from "./permissions";
export const auth = betterAuth({
// ... existing config ...
plugins: [
admin(),
organization({
ac,
roles: {
owner,
admin: adminRole,
member,
},
}),
],
});
The admin() plugin does three things behind the scenes:

Adds a role field (default: "user") and a banned field to the user model
Exposes endpoints like /api/auth/admin/list-users, /api/auth/admin/set-role, /api/auth/admin/ban-user
Only allows users with an admin role to call those endpoints
2c: Update the Prisma schema
The admin plugin needs a role and banned column on the user table. Add them:

model User {
id String @id @default(cuid())
name String
email String @unique
emailVerified Boolean @default(false)
image String?
role String @default("user") // ← NEW
banned Boolean @default(false) // ← NEW
banReason String? // ← NEW
banExpires DateTime? // ← NEW
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
sessions Session[]
accounts Account[]
}
Then run:

npx prisma db push
npx prisma generate
Step 3: Create the admin controller
The @Roles() decorator from @thallesp/nestjs-better-auth reads the user's role from the session and blocks access if it doesn't match.

Create src/admin.controller.ts:

import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard, Session, Roles } from "@thallesp/nestjs-better-auth";
import type { UserSession } from "@thallesp/nestjs-better-auth";
@Controller("admin")
@UseGuards(AuthGuard)
@Roles(["admin"])
export class AdminController {
@Get("dashboard")
dashboard(@Session() session: UserSession) {
return {
message: "Welcome to the admin dashboard",
admin: session.user.name,
role: (session.user as any).role,
timestamp: new Date().toISOString(),
};
}
@Get("stats")
stats() {
return {
totalUsers: 42,
activeSessionsToday: 18,
oauthSignUps: { google: 12, github: 8, email: 22 },
aiRequestsToday: 156,
};
}
}
The key line is @Roles(["admin"]) at the class level. Every route in this controller now requires the user to have role === "admin". A regular user gets:

{ "code": "FORBIDDEN", "message": "Insufficient permissions" }
No custom guard logic, no manual role checks, no middleware. One decorator.

Step 4: Build the AI module
This is where auth stops being plumbing and starts being useful. Instead of bolting on a generic chatbot, we’re building four endpoints that each solve a real problem — and every one of them uses the session to know who’s asking and what they’re allowed to do.

4a: The service
Create src/ai/ai.service.ts. Here are the four methods:

1. Content Moderation — check user-submitted text before it hits your database:

async moderate(text: string, userId: string) {
this.logger.log(`Moderation request from user ${userId}`);
// In production, use OpenAI's moderation API
const moderation = await this.openai.moderations.create({ input: text });
const result = moderation.results[0];
return {
flagged: result.flagged,
categories: Object.fromEntries(
Object.entries(result.categories).filter(([, v]) => v)
),
reason: result.flagged
? `Flagged for: ${Object.keys(result.categories).filter(k => result.categories[k]).join(", ")}`
: null,
};
}
Every user review, comment, or bio goes through this before saving. The auth layer ensures you know who submitted the content. If something gets flagged, you have a user ID tied to it.

2. Login Anomaly Scoring — risk-score a login session using heuristics + optional AI refinement:

async scoreLoginRisk(context: {
userId: string;
ip: string;
userAgent: string;
hour: number;
knownIps: string[];
knownAgents: string[];
}) {
let score = 0;
const reasons: string[] = [];
if (!context.knownIps.includes(context.ip)) {
score += 30;
reasons.push("Login from unknown IP address");
}
if (!context.knownAgents.includes(context.userAgent)) {
score += 25;
reasons.push("Login from unrecognized device");
}
if (context.hour >= 1 && context.hour <= 5) {
score += 20;
reasons.push(`Unusual login hour (${context.hour}:00)`);
}
// Optional: let GPT-4o-mini refine the heuristic score
// ...
const riskLevel = score >= 60 ? "high" : score >= 30 ? "medium" : "low";
return { riskScore: Math.min(100, score), riskLevel, reasons };
}
The heuristic layer works without OpenAI. It compares the current login’s IP and user agent against the user’s known session history (which BetterAuth already stores). The AI layer is an optional refinement — useful when you want smarter analysis but not required.

In production, you’d trigger this as a databaseHook on session creation and conditionally block or challenge the login. For this demo, we expose it as a standalone endpoint.

Get Anindya Mukherjee(Andy)’s stories in your inbox
Join Medium for free to get updates from this writer.

Enter your email
Subscribe

Remember me for faster sign in

3. Admin Insights — natural language queries on your user data (admin-only):

async adminInsights(query: string, userData: any[]) {
const completion = await this.openai.chat.completions.create({
model: "gpt-4o-mini",
messages: [
{
role: "system",
content: `You are an analytics assistant. Given a question and user data,
                  provide a concise answer. Never expose passwords or tokens.`,
},
{
role: "user",
content: `Question: ${query}\n\nUser data (${userData.length} users):
                  ${JSON.stringify(userData.map(u => ({
                    name: u.name, email: u.email, role: u.role,
                    banned: u.banned, createdAt: u.createdAt
                  })))}`,
},
],
max_tokens: 300,
temperature: 0.3,
});
return {
answer: completion.choices[0]?.message?.content ?? "No answer.",
query,
};
}
Instead of building a dashboard with 15 different filters, you let admins ask things in plain English: “How many users signed up via GitHub this week?” or “Who are my most recently banned users?” The auth layer handles two things here: confirming the caller is an admin, and providing the user data to query against.

4. Identity-Aware Chat — an assistant that knows who you are:

async chat(prompt: string, userId: string, userName: string, userRole: string) {
const completion = await this.openai.chat.completions.create({
model: "gpt-4o-mini",
messages: [
{
role: "system",
content: `You are a helpful assistant. The current user is "${userName}"
                  with role "${userRole}". Personalize your responses.`,
},
{ role: "user", content: prompt },
],
max_tokens: 500,
});
return {
reply: completion.choices[0]?.message?.content ?? "No response.",
model: completion.model,
};
}
This isn’t a generic chatbot. The system prompt includes the user’s name and role from the session. An admin asking “what can I do?” gets a different answer than a regular user. The identity comes from the cookie — the frontend doesn’t send it, which means it can’t be faked.

4b: The controller
Create src/ai/ai.controller.ts:

@Controller("ai")
@UseGuards(AuthGuard)
export class AiController {
constructor(private readonly aiService: AiService) {}
@Post("chat")
async chat(@Body() body: { prompt: string }, @Session() session: UserSession) {
const user = session.user as any;
return this.aiService.chat(body.prompt, user.id, user.name, user.role ?? "user");
}
@Post("moderate")
async moderate(@Body() body: { text: string }, @Session() session: UserSession) {
return this.aiService.moderate(body.text, session.user.id);
}
@Post("score-login")
async scoreLogin(@Session() session: UserSession, @Req() req: any) {
const ip = req.headers?.["x-forwarded-for"] || req.ip || "unknown";
const userAgent = req.headers?.["user-agent"] || "unknown";
// Gather known IPs/agents from existing sessions in DB
// ...
return this.aiService.scoreLoginRisk({ userId: session.user.id, ip, userAgent, ... });
}
@Post("insights")
@Roles(["admin"]) // ← Only admins can query user data
async insights(@Body() body: { query: string }) {
return this.aiService.adminInsights(body.query, /* user data from DB */);
}
}
Notice the pattern: every endpoint uses AuthGuard to confirm the user is logged in. The AI insights endpoint adds @Roles(["admin"]) on top. No custom middleware, no token parsing. The session gives you the user's identity, the guard gives you access control, and the AI service uses both.

4c: Register the module
// src/ai/ai.module.ts
import { Module } from "@nestjs/common";
import { AiService } from "./ai.service";
import { AiController } from "./ai.controller";
@Module({
providers: [AiService],
controllers: [AiController],
})
export class AiModule {}
Update src/app.module.ts:

@Module({
imports: [AuthModule.forRoot({ auth }), AiModule],
controllers: [UsersController, AdminController],
})
export class AppModule {}
Step 5: Update the frontend
5a: Add client plugins
Update src/lib/auth-client.ts:

import { createAuthClient } from "better-auth/react";
import { adminClient, organizationClient } from "better-auth/client/plugins";
export const authClient = createAuthClient({
baseURL: "http://localhost:3000",
plugins: [adminClient(), organizationClient()],
});
export const { signIn, signUp, signOut, useSession } = authClient;
5b: Social login buttons
Create src/components/social-buttons.tsx:

"use client";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";
export function SocialButtons() {
const [loading, setLoading] = useState<string | null>(null);
const handleSocial = async (provider: "google" | "github") => {
setLoading(provider);
await signIn.social({ provider, callbackURL: "/dashboard" });
setLoading(null);
};
return (
<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
<button onClick={() => handleSocial("google")} disabled={loading !== null}>
{loading === "google" ? "Connecting…" : "Continue with Google"}
</button>
<button onClick={() => handleSocial("github")} disabled={loading !== null}>
{loading === "github" ? "Connecting…" : "Continue with GitHub"}
</button>
</div>
);
}
signIn.social() does the full OAuth redirect. The user leaves your site, authenticates with Google/GitHub, and comes back to /dashboard with a session cookie already set. No token handling, no popup windows, no callback route.

Drop it into the sign-in and sign-up pages with an “or” divider between social and email options.

5c: AI tools page (tabbed)
Instead of a single chat box, build a tabbed interface with all four AI features. The page has three tabs: Chat, Moderate, and Login Risk. Each tab makes a fetch() with credentials: "include" to the corresponding backend endpoint.

The chat panel passes user messages to /ai/chat, the moderation panel sends text to /ai/moderate and shows a green (clean) or red (flagged) result card, and the risk panel calls /ai/score-login and displays a 0–100 risk score with color-coded severity and a list of reasons.

If the user is an admin, a callout at the bottom links to the admin panel where AI Insights lives.

5d: Admin panel with AI insights
Add an insights panel to the admin page — a text input where admins can ask questions in plain English and get answers from the AI. The panel calls /ai/insights with credentials: "include". Non-admins can't even see the panel (client-side role check), and even if they could, the backend returns 403.

5e: Update middleware
Add /admin and /ai to the protected routes:

const protectedRoutes = ["/dashboard", "/profile", "/admin", "/ai"];
Step 6: Bootstrap your first admin
In production, you’d use a Prisma seed script:

// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
await prisma.user.update({
where: { email: "your-email@example.com" },
data: { role: "admin" },
});
console.log("Admin role set.");
}
main().finally(() => prisma.$disconnect());
Run it with npx tsx prisma/seed.ts after you've signed up with that email.

Once one admin exists, they can promote other users via BetterAuth’s built-in endpoint:

curl -X POST http://localhost:3000/api/auth/admin/set-role \
-H "Content-Type: application/json" \
-H "Origin: http://localhost:3000" \
-b cookies.txt \
-d '{"userId": "target-user-id", "role": "admin"}'
Only existing admins can call this. The plugin enforces that.

Step 7: Smoke test
Start both servers:

# Terminal 1

cd auth-api && npm run start:dev

# Terminal 2

cd auth-client && npm run dev
Walk through the flow:

Open http://localhost:3001/auth/sign-up — social buttons above the email form
Sign up (email or OAuth if you’ve added credentials)
Land on /dashboard — Role field shows user
Go to /ai — try all three tabs: chat, moderate some text, score your login
Go to /admin — see "Access denied"
Promote yourself to admin (via seed script or dev endpoint)
Refresh /admin — stats grid, user table, and AI insights panel
Ask the insights panel: “How many users are there?” — get a real answer
Sign out → try /ai → middleware bounces you to sign-in
Checkpoint:

✅ Social buttons render on sign-in/sign-up pages

✅ Email sign-up still works, user has role: "user" by default

✅ /ai/chat returns identity-aware responses, 401 for anonymous

✅ /ai/moderate flags unsafe content, passes clean content

✅ /ai/score-login returns a risk score based on session history

✅ /ai/insights works for admins, returns 403 for regular users

✅ /admin/dashboard returns 403 for regular users, 200 for admins

✅ Middleware protects /admin and /ai routes

What’s actually happening
Let me break down the auth flow for each scenario:

Email sign-in (same as Part 1 and 2): Browser → POST /api/auth/sign-in/email → BetterAuth validates credentials → Sets cookie → Done.

OAuth sign-in (new): Browser → signIn.social({ provider: "google" }) → Redirects to Google → User consents → Google calls /api/auth/callback/google → BetterAuth creates/links the user and account → Sets cookie → Redirects to callbackURL.

You don’t build the callback handler. BetterAuth mounts it on /api/auth/callback/{provider} automatically.

Role-protected endpoint: Request hits NestJS → AuthGuard validates cookie → @Roles(["admin"]) checks session.user.role → If role doesn't match → 403 → If it does → controller runs.

AI endpoint with identity: AuthGuard confirms cookie → session injected → controller passes userId, userName, role to AI service → AI uses identity in its system prompt, for logging, or for scope control. The frontend never sends the user's identity — it comes from the server-side session. Can't be spoofed.

Gotchas
OAuth credentials are provider-specific. Google requires consent screens and redirect URIs. GitHub is simpler but requires user:email scope (BetterAuth handles this by default). If the OAuth redirect fails with a vague error, check your redirect URI first.

The admin plugin’s role field is a string, not an enum. BetterAuth stores it as a plain string ("user", "admin", etc.). If you want custom roles like "moderator" or "billing", just use those strings. @Roles(["admin", "moderator"]) works.

Organization vs. Admin plugin. The admin plugin is for system-wide roles (who can manage all users). The organization plugin is for org-scoped roles (who can do what within a specific org). They’re separate plugins with separate decorators: @Roles() for admin, @OrgRoles() for organization. An org admin shouldn't automatically get system-level admin access.

Demo mode is real auth, fake AI. The demo mode only affects OpenAI responses. Authentication, sessions, role checks, route protection, anomaly scoring heuristics — all of that works exactly like production. You can test the full auth + RBAC flow without burning API credits.

What you’ve got now
Take a step back. Across three articles, you’ve built:

A NestJS backend with BetterAuth mounted as middleware
Email/password + Google + GitHub authentication
Cookie-based sessions stored in your database
Role-based access control with @Roles() and @OrgRoles() decorators
Custom access control with resources and permissions
Four AI endpoints: identity-aware chat, content moderation, login anomaly detection, and admin insights
An admin dashboard with user management and natural language querying
A Next.js frontend with CSR hooks, SSR data fetching, and middleware protection
Social login buttons that handle the entire OAuth flow in one function call
No Passport.js. No NextAuth. No JWT refresh token dance. Just BetterAuth, a cookie, and a database.

Ideas to take this further
This is a working foundation. Here’s where it gets interesting.

AI-powered session policies. Right now, the anomaly scoring is a standalone endpoint. Wire it into a databaseHook on session creation, and you've got adaptive authentication — high-risk logins trigger MFA, suspicious IPs get rate-limited, and you can flag accounts for review without blocking them outright. The heuristic layer works without OpenAI, so it's zero-latency on the happy path.

Per-user AI rate limiting with cost attribution. Every AI request already carries a userId from the session. Store a daily counter per user, enforce limits by role (admins get 500 requests/day, free users get 50), and pipe the OpenAI usage tokens into your billing system. You've got the identity plumbing — now make it earn money.

Semantic admin search. The insights endpoint sends raw user data to GPT-4o-mini, which works for small datasets. For real scale, embed your user profiles into a vector store (Pinecone, pgvector, Qdrant) and let admins run semantic queries: “find users similar to this churned account” or “which users haven’t logged in since their trial expired?” BetterAuth gives you the role gate. The vector store gives you the intelligence.

Organization-scoped AI. The organization plugin already supports teams and custom roles. Combine it with per-org API key management: each org brings their own OpenAI key, their own model preferences, their own system prompt. Multi-tenant AI with per-org isolation, built on top of BetterAuth’s access control. No separate auth layer needed.

Edge-side session validation. Right now, Next.js middleware checks if the cookie exists. Cloudflare Workers or Vercel Edge Functions can validate the session token against a KV store or your database, giving you sub-millisecond auth checks at the edge. BetterAuth’s session tokens are standard strings — they work anywhere you can read a cookie.

Plug-and-play auth for MCP servers. If you’re building AI agents or MCP (Model Context Protocol) tools, this exact auth stack gives you the identity layer. Your NestJS backend becomes the auth gateway — agents authenticate via the same OAuth/cookie flow, and @Roles() controls which agents can access which tools. You've already got the foundation.

Audit trail and compliance. Every session, login, role change, and AI request already passes through BetterAuth or your NestJS controllers. Add a simple event emitter — log every action with userId, timestamp, action, and metadata to a separate audit table. You've got a compliance-ready activity log with zero additional auth work.

The auth system is done. The AI is connected. The roles are enforced. Now build the thing that makes money.

If this series helped you ship faster, give it a clap — it helps others find it too. And if you spot something off, leave a comment. I read all of them.

Press enter or click to view image in full size

Photo by NASA on Unsplash
JavaScript

Web Development

Nextjs

Authentication

Artificial Intelligence

3

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
