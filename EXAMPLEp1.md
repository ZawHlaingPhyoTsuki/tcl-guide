Search

Get app
Write
Sign up

Sign in

Unknown user

Programming

Nestjs

Authentication

JavaScript

Nodejs

NestJS + BetterAuth, Part 1: From Zero to Login (Prisma + Cookies)
Anindya Mukherjee(Andy)
Anindya Mukherjee(Andy)

Follow
6 min read
·
Feb 21, 2026
4

If you’ve tried to glue NestJS, sessions, and a modern auth SDK together, you’ve probably fought CORS, cookies, Prisma paths, and vague docs. This guide is the clean, reproducible path I wish I had on day one.

You’ll spin up a NestJS API that serves Better Auth endpoints, stores data in PostgreSQL via Prisma, and returns a working session cookie you can hit from Postman, curl, or a browser. No front‑end required yet (that’s Part 2).

What we’ll build (in 10 minutes of typing)
A Nest app with Better Auth mounted and cookie‑based sessions
A minimal Prisma schema and migrations
A protected GET /users/me route using a Nest AuthGuard
A smoke‑test flow: sign up → cookie set → /users/me returns your user → protected route works
High‑level diagram
Press enter or click to view image in full size

Prerequisites
Node 18+ (20+ recommended)
PostgreSQL running (local Docker is fine)
Nest CLI: npm i -g @nestjs/cli
A shell to run commands (Windows/macOS/Linux are all fine)
Heads‑up on modules: Better Auth ships as modern ESM. In this guide we use the community NestJS integration which handles mounting, guards, and DI. If you see ESM/CJS import errors later, see the “ESM notes” at the end.

Heads‑up on modules: Better Auth ships as modern ESM. In this guide we use the community NestJS integration which handles mounting, guards, and DI. If you see ESM/CJS import errors later, see the “ESM notes” at the end.

0. Scaffold a clean Nest project
   nest new auth-api
   cd auth-api
   Choose npm or pnpm — either works.

1. Install deps

# Core auth

npm i better-auth @thallesp/nestjs-better-auth

# Database + ORM

npm i @prisma/client
npm i -D prisma

# Config

npm i dotenv 2) Environment variables
Create .env at the project root:

#Public API port
PUBLIC_API_PORT=3000

# Base URL where your API (and Better Auth endpoints) will live in dev

BETTER_AUTH_URL=http://localhost:3000

# A strong secret for encryption & hashing in Better Auth

# tip: openssl rand -base64 32

BETTER_AUTH_SECRET=change-me

# Postgres connection

DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/authdb?schema=public
Tip: When you later deploy behind a reverse proxy (Nginx/Caddy) on HTTPS, update BETTER_AUTH_URL to the public origin.

3. Initialize Prisma and generate schema for Better Auth
   Initialize Prisma:

npx prisma init
This creates prisma/schema.prisma and uses DATABASE_URL from .env.

Make sure to remove the output directory from your prisma/schema.prisma

generator client {
provider = "prisma-client-js"
output = "../generated/prisma" // to be removed
}
Run your first migration and generate the client:

npx prisma migrate dev --name init_auth
npx prisma generate
Monorepo note: If you normally customize Prisma client output (e.g. output = “../generated/prisma”), keep the default during this first pass to avoid generator path issues. Once everything runs, you can move the output and update your imports accordingly (see Troubleshooting).

4. Create the Better Auth instance
   Create src/lib/auth.ts (you can pick any of: src/lib, src/utils, or project root). This file creates & exports a configured Better Auth instance using the Prisma adapter.

// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const auth = betterAuth({
url: process.env.BETTER_AUTH_URL, // Used to build callback URLs & cookies
secret: process.env.BETTER_AUTH_SECRET,
// Where requests will be routed (keep default for now → /api/auth/*)
// basePath: "/api/auth",
database: prismaAdapter(prisma, {
provider: "postgresql",
}),
// Enable simple email+password to start. (We'll add OAuth/Passkeys later.)
emailAndPassword: { enabled: true },
});
That’s the whole server brain. The Nest layer will mount it and provide guards/decorators.

Next, ask Better Auth to generate the required Prisma models:

npx @better-auth/cli generate
This command adds the tables/models Better Auth needs (users, sessions, accounts, etc.) to your schema.prisma. Review and keep your own models alongside.

5. Wire Better Auth into Nest
   We’ll use the NestJS Better Auth module. It mounts the handler, configures body parsing safely, and provides guards & decorators.

Get Anindya Mukherjee(Andy)’s stories in your inbox
Join Medium for free to get updates from this writer.

Enter your email
Subscribe

Remember me for faster sign in

a) Disable the built‑in body parser (the module will re‑add the right parsers for you):

// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
async function bootstrap() {
const app = await NestFactory.create(AppModule, {
bodyParser: false, // required so Better Auth can read the raw request body
});
const port = process.env.PUBLIC_API_PORT ?? 3000;
app.enableCors({
origin: ['<http://localhost:3000>'],
credentials: true,
});
await app.listen(port);
}
bootstrap();
b) Import the module and pass your auth instance:

// src/app.module.ts
import { Module } from "@nestjs/common";
import { AuthModule } from "@thallesp/nestjs-better-auth";
import { auth } from "./lib/auth";
import { UsersController } from "./users.controller";
@Module({
imports: [AuthModule.forRoot(auth)],
controllers: [UsersController],
})
export class AppModule {}
c) Add one protected route to prove guards work:

// src/users.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard, Session } from '@thallesp/nestjs-better-auth';
import type { UserSession } from '@thallesp/nestjs-better-auth';
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
@Get('me')
me(@Session() session: UserSession) {
// You'll get { user, sessionId, expiresAt, ... }
return { user: session.user };
}
}
d) Migrate auth schemas and add prisma generate to dev script:

Migrate auth schemas to DB:

npx prisma migrate dev --name init_better_auth_schemas
Update start DEV script in package.json

"start:dev": "npx prisma generate && nest start --watch"
That’s it — no Passport, no custom cookies, no middleware spaghetti.

6. Run & smoke test
   Start the server:

npm run start:dev
Better Auth exposes a small health endpoint you can hit right away:

curl -i <http://localhost:3000/api/auth/ok>
You should see 200 OK.

Sign up → receive cookie → call /users/me
Using curl (stores cookies in a temp file):

# 1) Sign up

curl -i \\
-c /tmp/bacookie \\
-H "Content-Type: application/json" \\
-d '{"name":"Alice", "email":"alice@example.com","password":"Str0ng!Pass"}' \\
<http://localhost:3000/api/auth/sign-up/email>

# 2) Hit the protected Nest controller

curl -i -b /tmp/bacookie <http://localhost:3000/users/me>
Using Postman

POST http://localhost:3000/api/auth/sign-up/email with JSON body { name, email, password }
Under Cookies, confirm a session cookie is set for localhost:3000
GET http://localhost:3000/users/me → returns the same user
If the cookie doesn’t appear: you likely missed credentials: true on CORS, trustedOrigins in the auth config, or you’re mixing ports/origins.

7. What’s actually happening
   @thallesp/nestjs-better-auth mounts a catch‑all route under /api/auth/* and feeds raw requests into your auth instance
   Better Auth handles the auth flow, sets a secure, HTTP‑only cookie, and exposes helpers to read sessions
   The module injects a Nest AuthGuard that validates the session and a @Session() decorator that hands you the user in controllers
   That keeps your controllers tiny and stateless.

Checkpoint: you should have
✅ GET /api/auth/ok returns 200
✅ POST /api/auth/sign-up/email creates a user and sets a cookie
✅ GET /users/me (guarded) returns the user when the cookie is present
If those four pass, you’re ready for Part 2 (Next.js client integration: CSR + SSR + middleware).

What’s Next?
This gives you a working auth backend. But right now, we’re testing with curl. In Part 2, we'll build a Next.js frontend that:

Calls the NestJS API for sign-up / sign-in
Uses useSession() from BetterAuth's React SDK
Reads the session server-side (SSR) via cookies
Protects routes with Next.js middleware
The backend is done. Now let’s give it a face.

This is an updated re-post. If you followed along the first time — appreciate you coming back. If you’re new here, you picked the right version.

Part 2 is already live — we build a full Next.js frontend with sign-in, sign-up, SSR session reads, and route protection using middleware. Link below.

Part 3 is in the pipeline: OAuth providers, role-based access, and account linking. Follow me so you don’t miss it.

If this helped, consider giving it a clap — it helps others find it too.

Press enter or click to view image in full size

Photo by SpaceX on Unsplash
Programming

Nestjs

Authentication

JavaScript

Nodejs

4

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
