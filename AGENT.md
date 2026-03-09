# AGENT.md

## Project
**Welcome Sudak** — an informational application for отдыхающих in Sudak.

The MVP helps users quickly find:
- attractions
- food places
- shops
- local services

The main value is fast access to актуальная information:
- contacts
- working hours
- address
- map
- basic pricing info

---

## MVP Scope

### Included
- attractions catalog
- food catalog
- shops catalog
- services catalog
- search
- filters
- listing details page
- minimal admin panel for CRUD
- basic SEO
- analytics

### Excluded
- accommodation / housing
- booking
- payments
- reviews
- business dashboards
- partner accounts
- chat
- recommendation engine
- any feature outside MVP unless explicitly approved

---

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Prisma
- PostgreSQL
- React Hook Form
- Zod
- TanStack Query only when really needed

---

## Architecture
Use **FSD-lite** structure:

- `app`
- `shared`
- `entities`
- `features`
- `widgets`

### Layer rules
- `shared` contains reusable UI, utilities, config, constants, helpers
- `entities` contains domain models and entity-related logic
- `features` contains user actions and business interactions
- `widgets` contains composed UI blocks
- `app` contains routing, providers, layouts, app-level setup

Avoid over-engineering.
Prefer simple scalable solutions.

---

## Agent Workflow Rules

### Default mode
- Default mode is **PLAN ONLY**
- Do not write or change code until the user explicitly approves the plan
- After approval, implement **only** what was approved

### Planning
- Always start with a short **plan in Russian**
- Keep the plan practical and scoped to the task
- If the task is too broad, break it into smaller steps

### Scope control
- Do not go beyond the requested task
- Do not add extra features “for convenience”
- Do not refactor unrelated code
- Do not change unrelated files

### Dependencies
- Do not add new dependencies unless clearly necessary
- If a dependency is needed, explain why before using it

### Code quality
- Prefer strongly typed code
- Avoid `any` unless unavoidable
- Keep components small and composable
- Keep business logic out of presentational UI
- Prefer clear naming over clever abstractions
- Prefer maintainability over premature optimization

### Architecture discipline
- Reusable generic UI goes to `shared/ui`
- Domain-specific models go to `entities`
- User actions go to `features`
- Larger composed sections go to `widgets`
- Keep pages and route files thin

---

## Response Format for Every Task
1. **Plan** — in Russian
2. **Files** — list of files to create/change
3. **Implementation**
4. **Checks** — how to verify
5. **Summary** — short result

---

## Approval Rules
- No code changes before user approval
- If implementation requires changes outside approved scope, stop and ask for approval
- If assumptions are needed, keep them minimal and explicit

---

## MVP Product Rules
This project is an informational local city guide, not a marketplace.

Prioritize:
- fast navigation
- useful listings
- mobile usability
- up-to-date content
- clean information architecture

Do not turn MVP into:
- booking platform
- super app
- CRM
- social network
- review platform

---

## Preferred Development Style
- production-minded
- simple first
- scalable later
- minimal abstractions
- clean file boundaries
- user value over technical complexity

---

## Definition of Done
A task is done only if:
- it matches approved scope
- code is type-safe
- no unrelated files were changed
- architecture stays consistent
- implementation is practical for MVP
- verification steps are provided
