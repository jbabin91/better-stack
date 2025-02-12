FROM imbios/bun-node:latest-jod-debian AS base
RUN corepack enable && npm install -g corepack@latest

FROM base AS builder
WORKDIR /app
COPY . .

# Install turbo
RUN npm install -g turbo

# Generate a partial monorepo with a pruned lockfile for a target workspace.
# Assuming "backend" is the name entered in the project's package.json { name: "backend" }
RUN turbo prune backend --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml .
RUN pnpm install --frozen-lockfile

# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm turbo run build --filter backend

FROM base AS runner
WORKDIR /app

# Environment variables
ENV NODE_ENV=production
ARG PORT=3000
ARG LOG_LEVEL=info
ARG BASE_URL
ARG FRONTEND_URL

# Database
ARG DATABASE_URL

# Better Auth
ARG BETTER_AUTH_SECRET
ARG BETTER_AUTH_URL

# Don't run production as root
RUN addgroup --system --gid 1002 nodejs
RUN adduser --system --uid 1002 honojs
USER honojs

COPY --from=installer /app .

# Healthcheck
HEALTHCHECK --interval=5s --timeout=5s --start-period=5s CMD curl --silent --fail http://localhost:3000 || exit 1

CMD ["pnpm", "--filter", "backend", "start"]