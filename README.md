# Welcome Sudak

Welcome Sudak is an informational web application for tourists and vacationers in Sudak.

The MVP helps users quickly find:

* attractions
* food places
* shops
* local services

Users should be able to easily access:

* contacts
* address
* map
* working hours
* basic price information

---

## MVP Scope

### Included

* attractions catalog
* food catalog
* shops catalog
* services catalog
* search
* filters
* listing details pages
* minimal admin panel for CRUD
* basic SEO
* analytics

### Excluded

* accommodation / housing
* booking
* payments
* reviews
* user accounts
* business accounts
* partner dashboards
* chat
* recommendation engine

---

## Tech Stack

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* shadcn/ui
* Prisma
* PostgreSQL
* React Hook Form
* Zod
* TanStack Query only where needed

---

## Architecture

This project uses **FSD-lite**.

Main layers:

* `app`
* `shared`
* `entities`
* `features`
* `widgets`

Architecture and product rules are described in:

* `AGENT.md`
* `docs/product/mvp-spec.md`
* `docs/architecture/project-structure.md`

---

## Main Categories

* Attractions
* Food
* Shops
* Services

---

## Product Principles

This is not a marketplace.
This is not a booking platform.
This is not a super app.

The MVP should win through:

* useful information
* clean structure
* fast access
* mobile usability
* relevant local content

---

## Project Status

Current stage: **MVP planning and repository setup**

Planned implementation stages:

1. repository foundation
2. database schema
3. seed data
4. public catalog pages
5. search and filters
6. listing details pages
7. admin CRUD
8. SEO and analytics

---

## Suggested Project Structure

```text
src/
  app/
  shared/
  entities/
  features/
  widgets/

prisma/
docs/
public/
```

---

## Development Rules

* keep MVP scope strict
* avoid over-engineering
* prefer simple scalable solutions
* keep code strongly typed
* do not introduce unnecessary dependencies
* do not mix unrelated responsibilities in one module

---

## Documentation

* `AGENT.md` — working rules for Codex / agent
* `docs/product/mvp-spec.md` — MVP boundaries and product definition
* `docs/architecture/project-structure.md` — architecture and layer rules

---

## Next Steps

* finalize repository setup
* create Prisma schema
* prepare seed data
* implement first public pages
