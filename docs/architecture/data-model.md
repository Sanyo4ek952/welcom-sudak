# Data Model

## 1. Goal

This document defines the minimal domain model for the **Welcome Sudak** MVP.

The model should be:

* simple
* scalable
* practical for MVP
* suitable for Prisma + PostgreSQL

The main domain object is a **listing**.

---

## 2. Main Entities

### Category

Represents a top-level catalog section.

Examples:

* attractions
* food
* shops
* services

Suggested fields:

* `id`
* `slug`
* `title`
* `description` (optional)
* `sortOrder`
* `isActive`
* `createdAt`
* `updatedAt`

---

### Subcategory

Represents a more specific grouping inside a category.

Examples:

* restaurants
* cafes
* delivery
* excursions
* boat trips

Suggested fields:

* `id`
* `categoryId`
* `slug`
* `title`
* `description` (optional)
* `sortOrder`
* `isActive`
* `createdAt`
* `updatedAt`

Relations:

* many subcategories belong to one category

---

### Listing

Main business entity.

A listing is a place, point of interest, shop, food place, or service.

Examples:

* beach
* fortress
* restaurant
* grocery store
* boat rental
* excursion provider

Suggested fields:

* `id`
* `slug`
* `title`
* `shortDescription`
* `description`
* `categoryId`
* `subcategoryId` (optional)
* `district` (optional)
* `address` (optional)
* `latitude` (optional)
* `longitude` (optional)
* `phone` (optional)
* `whatsappUrl` (optional)
* `telegramUrl` (optional)
* `websiteUrl` (optional)
* `instagramUrl` (optional)
* `priceLabel` (optional)
* `priceFrom` (optional)
* `priceTo` (optional)
* `workingHoursText` (optional)
* `hasDelivery`
* `hasTakeaway`
* `isFeatured`
* `status`
* `coverImageUrl` (optional)
* `lastVerifiedAt` (optional)
* `createdAt`
* `updatedAt`

Relations:

* one listing belongs to one category
* one listing may belong to one subcategory
* one listing may have many images
* one listing may have many tags (optional in later step)

Notes:

* `status` should support at least: `draft`, `published`, `archived`
* `workingHoursText` is enough for MVP; complex working schedule can be added later
* `latitude` and `longitude` can be nullable for records without exact coordinates

---

### ListingImage

Stores gallery images for a listing.

Suggested fields:

* `id`
* `listingId`
* `url`
* `alt` (optional)
* `sortOrder`
* `createdAt`

Relations:

* many images belong to one listing

Notes:

* cover image can be stored directly on `Listing`
* gallery images should be stored separately

---

### AdminUser

Internal admin for content management.

Suggested fields:

* `id`
* `email`
* `name` (optional)
* `passwordHash` or auth provider field
* `role`
* `isActive`
* `createdAt`
* `updatedAt`

Suggested roles:

* `admin`

Notes:

* MVP does not require advanced permissions
* one admin role is enough initially

---

### IssueReport

Used to report outdated or incorrect information.

Suggested fields:

* `id`
* `listingId`
* `type`
* `message` (optional)
* `contact` (optional)
* `status`
* `createdAt`
* `updatedAt`

Suggested `type` values:

* `wrong_phone`
* `wrong_hours`
* `closed_place`
* `wrong_address`
* `other`

Suggested `status` values:

* `new`
* `reviewed`
* `resolved`

Relations:

* many issue reports belong to one listing

---

## 3. Core Relations

### Category → Subcategory

* one-to-many

### Category → Listing

* one-to-many

### Subcategory → Listing

* one-to-many

### Listing → ListingImage

* one-to-many

### Listing → IssueReport

* one-to-many

---

## 4. Minimal Enums

### ListingStatus

* `draft`
* `published`
* `archived`

### IssueReportStatus

* `new`
* `reviewed`
* `resolved`

### AdminRole

* `admin`

---

## 5. Fields Important for MVP UX

The following fields are most important for user value:

* `title`
* `shortDescription`
* `categoryId`
* `address`
* `phone`
* `workingHoursText`
* `coverImageUrl`
* `status`

These fields should be prioritized in admin CRUD and seed data.

---

## 6. Fields Important for Search and Filters

Search should rely on:

* `title`
* `shortDescription`
* `description`

Filters should rely on:

* `categoryId`
* `subcategoryId`
* `district`
* `hasDelivery`
* `hasTakeaway`
* `isFeatured`
* `status`

Possible later improvement:

* tags
* open now computed logic
* popularity score

---

## 7. Simplifications for MVP

To keep development fast, the following simplifications are recommended:

* one main phone field instead of multiple phones
* text-based working hours instead of complex schedule tables
* one admin role only
* no user accounts
* no review model
* no booking model
* no payment model
* no business self-service accounts

---

## 8. Future Extensions

These can be added later without breaking the MVP structure:

* multiple phones
* multiple messenger contacts
* tags table
* favorites synced to user account
* reviews
* booking requests
* paid promoted listings
* partner dashboard
* moderation workflow

---

## 9. Practical Rule

If unsure whether a field should exist in MVP, use this rule:

* add it only if it directly improves content quality, search, filtering, contact access, or admin editing
* otherwise postpone it
