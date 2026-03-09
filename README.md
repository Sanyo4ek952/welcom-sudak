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
ADMIN_PASSWORD="admin123"
ADMIN_SESSION_TOKEN="welcome-sudak-admin-session"
```

If `ADMIN_PASSWORD` and `ADMIN_SESSION_TOKEN` are omitted, default fallback values are used for local MVP usage.

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
