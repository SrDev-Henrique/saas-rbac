# Next.js SaaS + RBAC

Full‑stack multi‑tenant SaaS starter with authentication, organizations, projects, invites, members, billing and role‑based access control (RBAC). Built with Next.js App Router, Fastify, Prisma, Zod and TypeScript.

## Monorepo structure

- `apps/web`: Next.js 15 app (React 19) — UI, forms, auth flows
- `apps/api`: Fastify API — auth, orgs, projects, invites, members, billing
- `packages/_env`: Shared runtime env schema (validated with Zod)

## Tech stack

- Web: Next.js 15, React 19, Radix UI, React Hook Form, Zod, Ky
- API: Fastify 5, Prisma, Zod, JWT, Swagger UI, bcryptjs
- Tooling: Turborepo, TypeScript, ESLint, Prettier, pnpm

## What works today

### Authentication

- Email & password sign‑in and sign‑up (JWT stored in `token` cookie)
- GitHub OAuth sign‑in (callback at `/api/auth/callback` on web)
- Password recovery endpoints (request + reset) on the API
- Delete user endpoint and UI button

Error handling on the web:

- Global error banner shows backend `message` or `?error=...` query (e.g., GitHub failures)
- Field‑level errors from backend `errors` map to inputs via `react-hook-form`

### Organizations (API)

- Create organization
- Get organizations for current user and membership details
- Get organization by id
- Update organization
- Shutdown organization
- Transfer ownership

### Projects (API)

- Create, list, get, update and delete projects

### Members (API)

- List members, update member role, remove member

### Invites (API)

- Create invite, list invites, get invite details
- Accept, reject and revoke invites
- List pending invites

### Billing (API)

- Get organization billing details

### API Docs

- Swagger UI available at `http://localhost:<SERVER_PORT>/docs`

## RBAC

Roles supported: Owner, Administrator, Member, Billing, Anonymous.

High‑level permissions (examples):

|                        | Administrator | Member | Billing | Anonymous |
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
- Only administrators and project authors may update/delete a project
- Members can leave their own organization

## Getting started

Prerequisites:

- Node.js >= 18
- pnpm 9
- PostgreSQL database (or compatible) for Prisma

1. Install deps

```bash
pnpm install
```

2. Create `.env` at repo root (used by API via `packages/_env`):

```bash
SERVER_PORT=3333
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/saas_rbac?schema=public"
JWT_SECRET="your-jwt-secret"

# GitHub OAuth app (set callback to http://localhost:3000/api/auth/callback)
GITHUB_OAUTH_CLIENT_ID="..."
GITHUB_OAUTH_CLIENT_SECRET="..."
GITHUB_OAUTH_REDIRECT_URI="http://localhost:3000/api/auth/callback"
```

3. Run database migrations (API)

```bash
pnpm --filter @saas/api db:migrate
# optional
pnpm --filter @saas/api db:studio
```

4. Start dev servers (web + api)

```bash
pnpm dev
```

Web: `http://localhost:3000`

API: `http://localhost:3333` (configurable via `SERVER_PORT`) and Docs at `/docs`

## Developer notes

- Web auth client uses Ky with `throwHttpErrors: true` and reads JWT from `token` cookie
- Server actions normalize backend errors to `{ success, message, errors }`
- Forms map `errors` keys to fields and show `message` in a banner
- GitHub OAuth errors are redirected back to `/sign-in?error=...`

## Scripts

Root:

- `pnpm dev` — run all apps in dev via Turborepo
- `pnpm build` — build all
- `pnpm lint` — lint all
- `pnpm check-types` — type‑check all

API:

- `pnpm --filter @saas/api dev` — start API
- `pnpm --filter @saas/api db:migrate` — prisma migrate
- `pnpm --filter @saas/api db:studio` — prisma studio

Web:

- `pnpm --filter web dev` — start Next.js
- `pnpm --filter web build` — build Next.js
