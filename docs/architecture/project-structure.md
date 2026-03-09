# Project Structure

## 1. Architecture Approach

This project uses **FSD-lite**.

The goal is to keep the codebase:

* simple
* scalable
* readable
* suitable for MVP development

We use only the layers that bring practical value.

---

## 2. Main Layers

### `app`

Application entry layer.

Responsibilities:

* routing
* layouts
* providers
* global styles
* app-level configuration
* page composition

Examples:

* `app/page.tsx`
* `app/attractions/page.tsx`
* `app/food/page.tsx`
* `app/listing/[slug]/page.tsx`
* `app/admin/...`

Rules:

* keep route files thin
* do not place heavy business logic here
* compose pages from widgets, features, and entities

---

### `shared`

Reusable generic code with no business meaning.

Contains:

* UI kit
* utility functions
* config
* constants
* shared hooks
* shared types
* API client helpers
* validation helpers

Examples:

* `shared/ui/button`
* `shared/ui/input`
* `shared/lib/utils`
* `shared/lib/date`
* `shared/config/env`
* `shared/types/common`

Rules:

* must not depend on `entities`, `features`, or `widgets`
* should stay generic and reusable

---

### `entities`

Domain entities and their basic logic.

Main entities for this project:

* `listing`
* `category`
* `subcategory`

Contains:

* types
* model helpers
* small domain UI blocks
* data mappers
* entity-related server functions if needed

Examples:

* `entities/listing/model/types.ts`
* `entities/listing/lib/get-open-now.ts`
* `entities/listing/ui/listing-card.tsx`
* `entities/category/model/types.ts`

Rules:

* entity code should describe domain concepts
* entities can depend on `shared`
* entities must not depend on `features` or `widgets`

---

### `features`

User actions and business interactions.

Examples:

* search listings
* filter listings
* toggle favorites
* report issue
* admin save listing
* admin publish listing

Contains:

* UI for action blocks
* action handlers
* forms
* mutations
* business interaction logic

Examples:

* `features/search-listings`
* `features/filter-listings`
* `features/toggle-favorite`
* `features/report-issue`
* `features/admin-save-listing`

Rules:

* features can depend on `shared` and `entities`
* features must not depend on unrelated features unless clearly justified
* each feature should represent a meaningful user interaction

---

### `widgets`

Composed page sections.

Examples:

* home hero
* category list section
* listings grid
* listing details block
* admin listing form section

Contains:

* combined UI sections built from entities and features

Examples:

* `widgets/home-hero`
* `widgets/popular-categories`
* `widgets/listings-grid`
* `widgets/listing-details`
* `widgets/admin-listing-form`

Rules:

* widgets can depend on `shared`, `entities`, and `features`
* widgets should not contain low-level reusable primitives
* widgets are building blocks for pages

---

## 3. Dependency Rules

### Allowed

* `app` → `widgets`, `features`, `entities`, `shared`
* `widgets` → `features`, `entities`, `shared`
* `features` → `entities`, `shared`
* `entities` → `shared`
* `shared` → nothing above it

### Forbidden

* `shared` → `entities/features/widgets/app`
* `entities` → `features/widgets/app`
* `features` → `widgets/app`

---

## 4. Suggested Folder Structure

```text
src/
  app/
  shared/
    ui/
    lib/
    config/
    hooks/
    types/
  entities/
    listing/
      model/
      lib/
      ui/
    category/
      model/
      ui/
    subcategory/
      model/
  features/
    search-listings/
    filter-listings/
    toggle-favorite/
    report-issue/
    admin-save-listing/
  widgets/
    home-hero/
    popular-categories/
    listings-grid/
    listing-details/
    admin-listing-form/
```

---

## 5. Server-Side Organization

Server-related logic should stay close to domain or feature needs, but without chaos.

Recommended approach:

* generic DB/client setup in `shared`
* domain-related server queries near `entities`
* action-specific mutations near `features`
* page composition stays in `app`

Examples:

* `shared/lib/prisma`
* `entities/listing/api/get-listings.ts`
* `entities/listing/api/get-listing-by-slug.ts`
* `features/admin-save-listing/api/save-listing.ts`

---

## 6. UI Organization

### Put in `shared/ui`

Reusable generic components:

* Button
* Input
* Select
* Modal
* Badge
* Card
* Tabs

### Put in `entities/.../ui`

Domain-aware UI:

* listing card
* category chip
* listing meta info

### Put in `features/.../ui`

Interactive action UI:

* search form
* filter panel
* favorite toggle
* admin publish button

### Put in `widgets`

Composed sections:

* home page hero
* listings section
* listing details section
* admin form section

---

## 7. Forms

Forms should live in `features` when they represent user actions.

Examples:

* search form
* filter form
* admin listing form
* report issue form

Validation:

* use `zod`
* keep schemas near the form or feature
* share schemas only when really reusable

---

## 8. Data and Types

Type placement rules:

### `shared/types`

For generic common types only.

### `entities/.../model`

For domain-specific types:

* `Listing`
* `Category`
* `Subcategory`

Avoid putting all app types into one global file.

---

## 9. What to Avoid

* huge `components/` folder with everything mixed together
* business logic inside pages
* duplicated query logic in many places
* generic abstractions too early
* large feature folders with unrelated responsibilities
* overusing TanStack Query where server-side data is enough

---

## 10. Practical Rule

When deciding where code belongs, use this logic:

* generic and reusable → `shared`
* describes domain object → `entities`
* user action / interaction → `features`
* composed page block → `widgets`
* route / layout / app setup → `app`
