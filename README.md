# Welcome Sudak

Welcome Sudak is an informational web application for tourists and vacationers in Sudak.

## Stack (MVP foundation)

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Prisma + PostgreSQL
- React Hook Form
- Zod
- FSD-lite layers: `app`, `shared`, `entities`, `features`, `widgets`

## Quick start

1. Install dependencies:

```bash
pnpm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Generate Prisma client:

```bash
pnpm prisma:generate
```

4. Run dev server:

```bash
pnpm dev
```
