# Next.js SaaS + RBAC Monorepo

Full‑stack, multi‑tenant SaaS starter with authentication, organizations, projects, invites, members, billing and role‑based access control (RBAC). Built with Next.js App Router, Fastify, Prisma, Zod and TypeScript. Monorepo managed by Turborepo and pnpm.

## Features

- Authentication: email/password, GitHub OAuth, password recovery, profile, delete user
- Multi‑tenant organizations: create/update/transfer/shutdown, domain auto‑attach
- Projects: create, list, get, update, delete
- Members: list, update role, remove, leave
- Invites: create, list, get details, accept, reject, revoke, pending
- Billing: organization billing endpoints (read/export placeholders)
- RBAC: Owner, Administrator, Member, Billing, Anonymous
- API Docs: Swagger UI at `/docs`
- File uploads: avatar upload with size limits

## Monorepo Structure

- `apps/web` — Next.js 15 (React 19) frontend: UI, forms, auth flows
- `apps/api` — Fastify 5 API: auth, orgs, projects, invites, members, billing
- `packages/_env` — Shared runtime env schema (Zod, `@t3-oss/env-nextjs`)
- `packages/auth` — Roles, permissions, models used across apps
- `config/*` — Shared ESLint, Prettier, TypeScript configs

## Tech Stack

- Web: Next.js 15, React 19, Radix UI, React Hook Form, Zod, Ky, TanStack Query
- API: Fastify 5, Prisma, Zod, JWT, Swagger UI, bcryptjs, Supabase client
- Tooling: Turborepo, TypeScript, ESLint, Prettier, pnpm

## RBAC Overview

Roles supported: Owner, Administrator, Member, Billing, Anonymous.

| Permission             | Administrator | Member | Billing | Anonymous |
| ---------------------- | ------------- | ------ | ------- | --------- |
| Update organization    | ✅            | ❌     | ❌      | ❌        |
| Delete organization    | ✅            | ❌     | ❌      | ❌        |
| Invite a member        | ✅            | ❌     | ❌      | ❌        |
| Revoke an invite       | ✅            | ❌     | ❌      | ❌        |
| List members           | ✅            | ✅     | ✅      | ❌        |
| Transfer ownership     | ⚠️            | ❌     | ❌      | ❌        |
| Update member role     | ✅            | ❌     | ❌      | ❌        |
| Delete member          | ✅            | ⚠️     | ❌      | ❌        |
| List projects          | ✅            | ✅     | ✅      | ❌        |
| Create a new project   | ✅            | ✅     | ❌      | ❌        |
| Update a project       | ✅            | ⚠️     | ❌      | ❌        |
| Delete a project       | ✅            | ⚠️     | ❌      | ❌        |
| Get billing details    | ✅            | ❌     | ✅      | ❌        |
| Export billing details | ✅            | ❌     | ✅      | ❌        |

Notes:

- Only owners may transfer organization ownership
- Administrators and project authors may update/delete a project
- Members can leave their own organization

## Getting Started

### Prerequisites

- Node.js >= 18
- pnpm 9
- PostgreSQL database (or compatible)

You can start a local Postgres with Docker:

```bash
docker compose up -d
```

This starts a Postgres instance on `localhost:5432` with default credentials from `docker-compose.yml`.

### 1) Install dependencies

```bash
pnpm install
```

### 2) Configure environment

Create a `.env` at the repository root. These variables are validated by `packages/_env` and loaded by both apps.

```bash
# Server
PORT=3333
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/next-saas?schema=public"
JWT_SECRET="replace-with-a-strong-secret"

# Public URLs
NEXT_PUBLIC_API_URL="http://localhost:3333"

# GitHub OAuth app (set callback to http://localhost:3000/api/auth/callback)
GITHUB_OAUTH_CLIENT_ID="..."
GITHUB_OAUTH_CLIENT_SECRET="..."
GITHUB_OAUTH_REDIRECT_URI="http://localhost:3000/api/auth/callback"

# Supabase (used for storage/services where applicable)
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="..."
```

- The API reads env via `packages/_env`. The web app reuses the same `.env` through its `env:load` script.
- Adjust `DATABASE_URL` to match your local or hosted Postgres.

### 3) Database migration (API)

```bash
pnpm --filter @saas/api db:migrate
# optional (GUI)
pnpm --filter @saas/api db:studio
```

Optional: seed sample data (users, orgs, projects):

```bash
pnpm --filter @saas/api prisma db seed
```

### 4) Run in development

Run both apps:

```bash
pnpm dev
```

- Web: `http://localhost:3000`
- API: `http://localhost:3333` (Swagger UI at `/docs`)

Run them individually:

```bash
pnpm --filter @saas/web dev   # Next.js
pnpm --filter @saas/api dev   # Fastify API
```

## Usage Notes

- Authentication cookies: JWT stored in `token` cookie (HTTP‑only). Client requests include `Authorization` when available.
- Errors: server actions normalize backend errors to `{ success, message, errors }`. Forms map `errors` keys to inputs.
- GitHub OAuth: failures redirect back to `/sign-in?error=...` with a user‑friendly banner.
- File uploads: avatar upload is limited to 5 MB.

## Scripts

Root scripts:

- `pnpm dev` — run all apps in dev via Turborepo
- `pnpm build` — build all apps
- `pnpm lint` — lint all packages/apps
- `pnpm check-types` — type‑check all packages/apps

API scripts (from repo root with filter or inside `apps/api`):

- `pnpm --filter @saas/api dev` — start API
- `pnpm --filter @saas/api db:migrate` — prisma migrate
- `pnpm --filter @saas/api db:studio` — prisma studio

Web scripts (from repo root with filter or inside `apps/web`):

- `pnpm --filter @saas/web dev` — start Next.js (Turbopack)
- `pnpm --filter @saas/web build` — build Next.js
- `pnpm --filter @saas/web start` — run production server

## API

- Base URL: `http://localhost:3333`
- Docs: `http://localhost:3333/docs`

Key endpoints include authentication, organizations, projects, members, invites, billing, and avatar upload. Browse the Swagger UI for full request/response schemas.

## Troubleshooting

- Migrations fail: verify `DATABASE_URL` and that Postgres is running. Try `docker compose up -d`.
- Env validation errors: ensure all required variables are present and valid URLs/strings per `packages/_env`.
- GitHub OAuth callback mismatch: set the callback to `http://localhost:3000/api/auth/callback` in your GitHub app.
- CORS issues in dev: the API enables CORS for development (`origin: true`). Ensure `NEXT_PUBLIC_API_URL` matches the API URL.
- Prisma client not generated: rerun `pnpm --filter @saas/api db:migrate` or `pnpm --filter @saas/api prisma generate`.

## License

MIT — use at your own risk. Contributions welcome.
