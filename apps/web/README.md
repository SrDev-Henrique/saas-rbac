# Web App (Next.js)

Frontend for the SaaS + RBAC starter. Built with Next.js App Router (15), React 19, Radix UI, React Hook Form, Zod and Ky.

For a full overview of the project, features, and setup, see the root README.

## Getting Started

You can run only the web app:

```bash
pnpm --filter web dev
```

Or run web and API together from the repo root:

```bash
pnpm dev
```

- Web runs at `http://localhost:3000`
- API runs at `http://localhost:3333` (configurable via `SERVER_PORT` in root `.env`)

## Environment

This app relies on the root `.env` used by the API (validated in `packages/_env`). No extra env variables are required for the web app by default.

GitHub OAuth callback must be set to:

```
http://localhost:3000/api/auth/callback
```

## Authentication flows

- Email & password sign‑in and sign‑up (JWT stored in `token` cookie)
- GitHub OAuth sign‑in (redirect to GitHub, callback handled at `/api/auth/callback`)

## Error handling (client side)

- Ky is configured with `throwHttpErrors: true` and attaches `Authorization` from `token` cookie
- Server actions catch backend errors and return `{ success, message, errors }`
- Forms display a global error banner (backend `message` or `?error=...` query)
- Field‑level errors from backend `errors` are mapped to inputs with `react-hook-form`

## Scripts

From `apps/web`:

- `pnpm dev` — start Next.js (Turbopack)
- `pnpm build` — build (Turbopack)
- `pnpm start` — start production build
