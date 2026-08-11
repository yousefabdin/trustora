# syntax=docker/dockerfile:1

# Debian slim, not alpine: Prisma's query engine binary links against glibc/OpenSSL,
# which alpine's musl libc doesn't provide without extra workarounds. Slim avoids that
# whole class of "works locally, breaks in the container" problem.
FROM node:22-bookworm-slim AS base
WORKDIR /app
RUN apt-get update -y \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

# ---- deps: full install (incl. dev deps), reused by the build stage ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- build: type-check + compile TypeScript, generate the Prisma client ----
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json tsconfig.json tsconfig.build.json ./
COPY prisma ./prisma
COPY src ./src
RUN npx prisma generate
RUN npm run build

# ---- prod-deps: production-only node_modules, with the Prisma client generated
#      against the SAME base image as `runtime` so the query engine binary matches ----
FROM base AS prod-deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY prisma ./prisma
RUN npx prisma generate

# ---- runtime: minimal final image ----
FROM base AS runtime
ENV NODE_ENV=production
RUN groupadd --system holdline && useradd --system --gid holdline holdline
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/prisma ./prisma
COPY --from=build /app/dist ./dist
COPY package.json ./
COPY docker/entrypoint.sh ./docker/entrypoint.sh
RUN chmod +x ./docker/entrypoint.sh && chown -R holdline:holdline /app
USER holdline

EXPOSE 3000
HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=5 \
  CMD node -e "require('http').get('http://127.0.0.1:3000/health', r => process.exit(r.statusCode === 200 ? 0 : 1)).on('error', () => process.exit(1))"

ENTRYPOINT ["./docker/entrypoint.sh"]
