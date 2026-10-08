FROM node:24-slim AS builder
RUN npm install -g pnpm@12.8.1
WORKDIR /app

# Manifests first: code-only edits reuse the install layer below.
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/server/package.json ./apps/server/package.json
COPY apps/web/package.json ./apps/web/package.json
COPY apps/server/.env.schema ./apps/server/.env.schema
COPY apps/web/.env.schema ./apps/web/.env.schema
RUN --mount=type=secret,id=web_env,target=/app/apps/web/.env.local --mount=type=secret,id=server_env,target=/app/apps/server/.env.local --mount=type=cache,target=/pnpm-store pnpm install --frozen-lockfile --store-dir /pnpm-store

COPY . .
ENV NODE_ENV=production
RUN --mount=type=secret,id=web_env,target=/app/apps/web/.env.local --mount=type=secret,id=server_env,target=/app/apps/server/.env.local cd apps/server && pnpm run build
RUN pnpm deploy --filter server --prod /app/server-deploy
RUN mkdir -p /app/server-deploy/dist && cp -r apps/server/dist/. /app/server-deploy/dist/

FROM node:24-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/server-deploy ./

EXPOSE 3000

CMD ["node", "dist/main.js"]
