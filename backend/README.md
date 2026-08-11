# Holdline

A two-sided escrow marketplace backend. Payment is captured and held on checkout;
funds only move to the seller once the buyer confirms receipt, or to a refund if
an admin resolves a dispute in the buyer's favor.

Built to spec as a 2-week intern-scoped project: the state machine and
authorization logic are the parts that matter most here, and they're covered
accordingly — everything else is deliberately kept minimal.

## Tech stack

- **Runtime:** Node.js 20+ / TypeScript
- **Framework:** Express — see [Why Express, not NestJS](#why-express-not-nestjs) below
- **Database:** PostgreSQL via Prisma (schema-first, migrations, typed client)
- **Auth:** JWT access tokens (15 min) + rotated httpOnly refresh cookie, passwords hashed with argon2
- **Payments:** simulated ledger behind a `PaymentProvider` interface — see [Payment approach](#payment-approach) below
- **Validation:** Zod, at every route boundary
- **Testing:** Vitest (unit + integration + e2e smoke)

## Why Express, not NestJS

Stuck with the spec's default. NestJS's DI container, module system, and decorator-heavy
routing solve problems this codebase doesn't have at this size (a few dozen routes, one
service layer, no plugin ecosystem to manage). Express plus a small, explicit middleware
chain keeps the authz story easy to audit — every guard is a plain function in
`src/middleware/`, not something routed through a DI graph. Not worth the added ceremony
here.

## Payment approach

**Simulated ledger + `PaymentProvider` interface**, not real Stripe Connect.

Real Stripe Connect requires connected-account onboarding, OAuth, and (for the hold →
release flow) async webhook-driven transfers — real surface area, but not what this
project is graded on (state-machine and authz correctness, per the spec). It also
turns "confirm receipt releases funds" into an eventually-consistent flow, which
fights the "wrap every transition + ledger update in one DB transaction" requirement
head-on.

Instead, `src/services/paymentProvider.ts` defines a `PaymentProvider` interface with
three methods — `captureAndHold`, `release`, `refund` — each mapping 1:1 onto a real
Stripe primitive:

| PaymentProvider method | Real Stripe equivalent |
|---|---|
| `captureAndHold` | `PaymentIntent.create` + manual capture |
| `release` | `Transfer.create` (transfer_data to the seller's connected account) |
| `refund` | `Refund.create` |

`SimulatedPaymentProvider` implements it with no network calls and deterministic fake
refs, so the whole hold/release/refund lifecycle runs inside a single Prisma
`$transaction` alongside the order status transition and its audit event — no
outbox pattern needed for this scope. A `payments` table (`src/db` via
`prisma/schema.prisma`) tracks the ledger state (`pending → held → released` or
`refunded`) exactly as it would with a real Stripe integration.

**Swapping in real Stripe later:** implement `PaymentProvider` with real SDK calls, wire
it up in `getPaymentProvider()`, and move the calls in `src/routes/orders.ts` outside
the DB transaction (a real Stripe call cannot safely be *inside* a Postgres transaction
— if the DB rolls back after Stripe already captured money, you'd have a stuck payment).
That would need an idempotency-key / outbox pattern: write an intent row, call Stripe,
then confirm the write in a follow-up transaction, reconciled by webhook. None of the
order/authz/state-machine logic would need to change.

## Domain model highlights

- `sellerId` is denormalized directly onto `Order` (not derived via `Listing.sellerId`)
  so every order-scoped authz check is a single indexed row lookup.
- `Order.version` is an optimistic-concurrency column. Every transition writes with
  `WHERE id = ? AND version = ? AND status = ?`; zero rows affected means someone else
  moved the order first, and the caller gets a clean `409 CONFLICT` instead of a
  corrupted state. See `src/services/orderTransitions.ts`.
- `OrderEvent` rows are immutable and append-only — the full audit trail for every
  order, actor-and-timestamp-stamped.
- The `delivered` status exists in the graph (disputes are reachable from it) but no
  current endpoint transitions an order **into** it — the spec's `confirm-receipt`
  rule ("shipped|delivered → released") only requires it as a valid *source*, and no
  endpoint in the given contract marks an order delivered. It's reserved for a future
  carrier-webhook integration. Flagged to the requester before implementation; see
  conversation for confirmation.
- Deleting a listing (`DELETE /listings/:id`) sets `status: inactive` rather than
  removing the row — orders reference listings and must keep rendering historical
  listing details, and the `Listing` model has no third "deleted" state to model
  actual removal.
- User accounts have no display-name field in the spec's signup contract, so
  `buyerName` / `sellerName` on `Order` responses use the account's email.

## The state machine and permissions function

`src/services/orderStateMachine.ts` is the single source of truth for the transition
graph: an explicit array of `{ from, to, action, allowedActor }` edges, not
if-statements scattered across route handlers. `assertTransition` is the only place
that decides whether a transition is legal; every route calls it (via the
`requireOrderTransition` middleware) before any business logic runs.

`src/services/orderPermissions.ts`'s `computeOrderPermissions` — the function behind
every `GET /orders/:id` response's `permissions` object — is deliberately implemented
*in terms of* the state machine's `canPerformAction`, not as a second copy of the
rules. It cannot drift out of sync with what the state machine actually allows.

Both are unit-tested exhaustively: every `(actor relationship) × (order status) ×
(action)` combination, including the negative cases the spec calls out by name
(seller can't confirm receipt, buyer can't ship, non-admin can't resolve a dispute).

## Authorization

- `requireAuth` verifies the JWT and loads the user; `requireRole` / `requireAdmin`
  check role claims for actions that don't yet have a specific resource (e.g.
  "can this account create a listing at all").
- `loadOrderForParty` (in `src/middleware/orderAuthz.ts`) is the ownership guard: it
  loads the order named by `:id` and rejects (403) any requester who isn't that
  order's buyer, seller, or an admin — checked against the row itself, never against
  `req.user.roles` alone. Every order-scoped route runs this before its handler.
- `requireOrderTransition` runs the actual state-machine guard as middleware, so a
  disallowed transition (wrong actor **or** wrong current status) is rejected before
  the handler's business logic executes — never a reachable-but-silently-wrong route.

## Error shape

Every error response is `{ error: { code, message, details? } }`. Codes in use:
`VALIDATION_ERROR`, `EMAIL_TAKEN`, `INVALID_CREDENTIALS`, `UNAUTHENTICATED`,
`FORBIDDEN`, `NOT_FOUND`, `INVALID_TRANSITION`, `CONFLICT`, `LISTING_NOT_ACTIVE`,
`INTERNAL_ERROR`. A rejected transition is `FORBIDDEN` (409→403) when the actor is
wrong for an otherwise-real edge, and `INVALID_TRANSITION` (409) when the edge
doesn't exist at all for the order's current status.

## Local setup

Requires Docker (for Postgres) and Node 20+.

```bash
cp .env.example .env
# edit .env if you want non-default secrets; defaults work for local dev

docker compose up -d          # starts Postgres, and creates both the `holdline`
                               # and `holdline_test` databases on first init

npm install
npm run prisma:generate
npm run prisma:migrate:dev    # applies migrations to `holdline` (dev)
npm run seed                  # demo users/listings/orders — see below

npm run dev                   # starts the API on http://localhost:3000
```

Demo accounts created by `npm run seed` (password `password123` for all):

| Email | Roles |
|---|---|
| `buyer@holdline.dev` | buyer |
| `seller@holdline.dev` | seller |
| `dual@holdline.dev` | buyer + seller |
| `admin@holdline.dev` | admin |

The seed script also creates 4 listings and 5 orders spanning `paid_held`,
`shipped`, `released`, `disputed`, and `refunded`, so the frontend has real
variety to render on day one. It's idempotent — re-running it after orders
already exist skips reseeding them.

## Environment files

Nothing is hardcoded inline in the CI workflow or the Docker Compose files —
every environment reads its config from a file under `env/`, each scoped to
exactly one consumer:

| File | Consumer | Contains real secrets? |
|---|---|---|
| `.env.example` (repo root) | Template you copy to `.env` for `npm run dev` locally | No — placeholders |
| `env/ci.env` | `verify` job in `ci.yml` | No — CI-only dummy values, never touch real data |
| `env/stack.env` | `docker-compose.stack.yml`, both locally (`npm run docker:stack:up`) and the `docker` job's smoke-test step in `ci.yml` | No — throwaway values for an ephemeral stack |
| `env/qa.env`, `env/prod.env` | `docker` job in `ci.yml` (just the `ENV_TAG`/`ALIAS_TAG` image-tag names today) | No — non-secret config, doubles as the documented shape a real deploy would read |
| `env/qa.secrets.env.example`, `env/prod.secrets.env.example` | Nothing yet — templates for when a real QA/prod host exists | Template only, no values |

All of these except the two `.example` files are committed — they're either
pure placeholders or config that only ever runs inside an ephemeral CI runner
or a local throwaway stack, so there's nothing sensitive in them. The one
real constraint: `env/*.secrets.env` (without `.example`) is git-ignored, so
if a real deployment ever fills one in locally for testing, it can't
accidentally get committed. Real secrets for an actual QA/prod deployment
belong in GitHub Environment secrets (or the host's own secret manager), read
directly in a deploy job's `env:` — never as a file in this repo.

The one place a value can't come from a file: `services.postgres.env` in the
`verify` job. GitHub Actions starts service containers before any step —
including checkout — runs, so that block literally cannot read a repo file;
only `${{ secrets.* }}` / `${{ vars.* }}` expressions or plain literals are
available there. Those two lines are the sole exception, and a comment in
`ci.yml` says so and points back at `env/ci.env` to keep them in sync.

## Tests

```bash
npm run typecheck          # tsc --noEmit
npm run lint                # ESLint
npm run test:unit           # state machine + permissions matrix + money helpers
npm run test:integration    # full lifecycle, dispute path, authz rejections, concurrency
npm run test:e2e-smoke      # real HTTP server (app.listen + fetch), not supertest injection
npm run verify               # the hard gate — runs all of the above in order, exits
                              # non-zero on first failure
```

`test:integration` and `test:e2e-smoke` need `TEST_DATABASE_URL` migrated first;
`npm run verify` does this for you via `prisma:migrate:test-db`. To run integration
tests standalone: `npm run prisma:migrate:test-db && npm run test:integration`.

`npm run verify` step order, and why:

1. `typecheck`, `lint` — fast, fail first
2. `test:unit` — no DB required
3. `prisma:migrate:test-db` — migrates `TEST_DATABASE_URL` so integration tests have a schema
4. `test:integration` — full lifecycle, dispute, authz, and concurrency suites against real Postgres
5. `migration:check` (`prisma migrate deploy` against `DATABASE_URL`) — this is the
   **first** time `DATABASE_URL`'s database is touched in the whole run, so this step
   is a genuine "migrations apply cleanly to a fresh, never-before-migrated database"
   check, exactly as it would run in a deploy pipeline — not just `prisma db push` in dev.
6. `seed:check` — runs the seed script against that freshly-migrated database

## Docker

Two separate Docker setups exist, for two separate purposes:

- **`docker-compose.yml`** — Postgres only, for local dev. The app runs on the host
  via `npm run dev` (see [Local setup](#local-setup)). Project name defaults to
  `holdline`.
- **`Dockerfile` + `docker-compose.stack.yml`** — the *fully dockerized* app+Postgres
  stack: what CI builds, smoke-tests, and publishes on `develop`/`master`, and what
  actually running Holdline in QA/prod looks like. Explicitly named project
  `holdline-stack` so it can run alongside the dev stack above without colliding on
  container names (learned that one the hard way — see the comment at the top of the
  compose file).

**The Dockerfile** is a 4-stage multi-stage build (`deps` → `build` → `prod-deps` →
`runtime`) on `node:22-bookworm-slim` — Debian slim, not alpine, because Prisma's
query engine binary needs glibc/OpenSSL that alpine's musl libc doesn't provide
without extra work. The final `runtime` stage has no dev dependencies, no TypeScript
source, no build tooling — just `dist/`, the generated Prisma client, and the
`prisma` CLI (kept as a runtime dependency, not a dev one, specifically so the
container can migrate itself on boot). It runs as a non-root user and ships a
`HEALTHCHECK`.

**`docker/entrypoint.sh`** runs `prisma migrate deploy` before starting the server,
so a freshly-started container brings its own database schema up to date. That's the
right call for this project's scale (single instance per environment); if this ever
ran multiple replicas, migrations would need to move to a separate one-off job so N
containers don't race each other applying the same migration on boot.

**Run it locally** — no env vars to type, everything comes from `env/stack.env`:

```bash
npm run docker:stack:up
# same as: docker compose -f docker-compose.stack.yml --env-file env/stack.env up -d --build

curl http://localhost:3000/health

npm run docker:stack:down   # stops and removes the stack, including its DB volume
```

## CI / CD — what's actually wired up

`.github/workflows/ci.yml` has two jobs:

1. **`verify`** (every push and pull request, any branch) — loads `env/ci.env` into
   `$GITHUB_ENV`, then runs `npm run verify` plus the e2e smoke test against a real
   Postgres service container. This is what gates everything else.
2. **`docker`** (push only, `develop` or `master`, gated on `verify` passing first) —
   picks `env/qa.env` or `env/prod.env` based on the branch (for the image-tag names),
   loads `env/stack.env` for the smoke-test stack's actual runtime config, builds the
   image from the `Dockerfile`, brings up the *actual* `docker-compose.stack.yml` stack
   from that image, waits for its healthcheck, smoke-tests it over real HTTP (`/health`,
   then a real signup), tears the stack down, and only then logs into **GitHub Container
   Registry (GHCR)** and pushes the image. A push that fails the dockerized smoke test
   never gets published.

   Image tags, per branch:

   | Branch | Tags pushed |
   |---|---|
   | `develop` | `ghcr.io/<owner>/<repo>:qa`, `:develop`, `:<commit-sha>` |
   | `master` | `ghcr.io/<owner>/<repo>:prod`, `:latest`, `:<commit-sha>` |

   No extra secrets needed — GHCR authenticates with the workflow's built-in
   `GITHUB_TOKEN` (the job requests `packages: write`).

**What's still not wired up: an actual remote QA/prod host pulling and running these
images.** That requires infrastructure this repo doesn't have an opinion on yet — a
VM, a PaaS, a Swarm/Kubernetes cluster. Whatever it turns out to be, the deploy step
is the same shape everywhere: pull `ghcr.io/<owner>/<repo>:qa` (or `:prod`) and run it
with `docker-compose.stack.yml`, supplying real `JWT_ACCESS_SECRET` /
`JWT_REFRESH_SECRET` / `DATABASE_URL` for that environment. As a follow-on job in the
same workflow, gated on `docker`, it would look like:

```yaml
deploy:
  needs: docker
  runs-on: ubuntu-latest
  steps:
    - # SSH in and `docker compose pull && up -d`, or the target platform's CLI/action
```

## Project structure

```
src/
  routes/       # one file per resource: auth, me, listings, orders, disputes
  middleware/    # auth, order ownership + transition guards, error handler, rate limiter, validation
  services/      # state machine, permissions, payment provider, order transitions/view, auth tokens
  db/            # Prisma client
  lib/            # jwt, money, zod schemas, env, error types, cookies
  __tests__/
    unit/         # state machine, permissions matrix, money helpers
    integration/  # lifecycle, dispute path, authz rejections, concurrency
    e2e/          # smoke test against a real listening HTTP server
prisma/
  schema.prisma
  seed.ts
docker/
  entrypoint.sh          # migrate deploy, then start the server
env/
  ci.env                        # verify job config
  stack.env                     # docker-compose.stack.yml config (local + CI smoke)
  qa.env / prod.env             # non-secret per-branch pipeline config
  qa.secrets.env.example        # template for a future real QA deploy's secrets
  prod.secrets.env.example      # template for a future real prod deploy's secrets
docker-compose.yml         # local dev: Postgres only
docker-compose.stack.yml   # fully dockerized app + Postgres (CI, QA, prod)
Dockerfile
.github/workflows/ci.yml
.env.example
```
