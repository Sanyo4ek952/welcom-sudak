# Welcome Sudak

Welcome Sudak is an MVP guide app for Sudak with a public catalog, listing detail pages, issue reports, and a minimal admin panel.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- Zod
- FSD-lite layers: `app`, `shared`, `entities`, `features`, `widgets`

## Environment

Create a `.env` file with:

```bash
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
ADMIN_PASSWORD="admin123" # local fallback only, ignored when AdminUser exists
ADMIN_SESSION_TOKEN="change-me-in-production"
REPORT_ISSUE_CAPTCHA_ENABLED="false"
```

Notes:
- In production, `ADMIN_SESSION_TOKEN` is mandatory.
- Admin authentication uses `AdminUser.passwordHash` from DB. `ADMIN_PASSWORD` is only for local bootstrap when no `AdminUser` exists.
- CAPTCHA can be enabled by setting `REPORT_ISSUE_CAPTCHA_ENABLED=true` (verification hook is ready in API).

## Local run

```bash
pnpm install
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
pnpm dev
```

## Main routes

- `/` - home page
- `/listings` - catalog with search/filters/query params
- `/listing/[slug]` - listing details + report issue form
- `/admin` - admin login
- `/admin/listings` - listing CRUD and publication statuses
- `/admin/issues` - issue reports with status updates

## Quality checks

```bash
pnpm lint
pnpm build
```

For a stable local release-check cycle on Windows:

```bash
# 1) stop pnpm dev if running
# 2) run the checks
pnpm check:release
```

If `.next` lock errors (`EPERM`) happen, stop all Next.js processes and rerun checks.

## Production checklist

- Set required env vars: `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL`, `ADMIN_SESSION_TOKEN`.
- Ensure at least one active `AdminUser` exists with valid `passwordHash`.
- Run `pnpm prisma:generate` and production migrations.
- Review seed policy: run `pnpm prisma:seed` only for non-production/demo environments.
- Run smoke checks: open `/`, `/listings`, `/listing/[slug]`, `/admin`, `/admin/issues`.
- Run pre-release commands: `pnpm lint`, `pnpm test:ci`, `pnpm build`, `pnpm test:e2e` (if e2e env ready).

## Definition of Done (release)

- Public catalog and listing details work end-to-end, including card -> detail navigation.
- `/api/report-issue` validates payload, applies rate limit, and handles optional CAPTCHA gate.
- Admin login and CRUD flows are working, including archive/delete and image management.
- CI workflows pass for lint/test/build and scheduled/on-demand e2e.
