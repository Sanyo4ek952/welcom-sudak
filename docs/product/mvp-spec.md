# Welcome Sudak — MVP Spec

## 1. Product Overview
**Welcome Sudak** is an informational application for tourists and vacationers in Sudak.

The goal of the MVP is to help users quickly find:
- where to go
- where to eat
- what shops are available
- what local services are available
- how to contact a place or service fast

Core value:
- актуальная local information
- simple navigation
- fast search
- mobile-first usage

---

## 2. MVP Goal
Launch a useful first version in **4–8 weeks** that provides a curated local directory with:
- listings
- search
- filters
- detail pages
- admin CRUD for content management

This is **not** a booking platform and **not** a marketplace at MVP stage.

---

## 3. Target Audience
### Primary audience
- tourists in Sudak
- vacationers arriving for a short stay
- people looking for trusted local information

### Secondary audience
- locals who need quick access to services, food, and shops

---

## 4. Main User Scenarios
1. User wants to find where to go today
2. User wants to quickly find food / delivery / takeaway
3. User needs a boat, excursion, transfer, rental, or other service
4. User wants to see what is nearby
5. User needs verified contacts, opening hours, and basic price info

---

## 5. MVP Scope

### Included
- attractions catalog
- food catalog
- shops catalog
- services catalog
- search by name / category
- basic filters
- listing details page
- contacts with quick actions
- map integration
- minimal admin panel for create / edit / publish
- basic SEO
- basic analytics

### Excluded
- accommodation / housing
- booking
- payments
- reviews
- user accounts
- business accounts
- partner dashboards
- recommendation engine
- chat
- advanced moderation workflows

---

## 6. Information Architecture

### Public pages
- Home page
- Category page
- Listing details page
- Search results page
- About city page
- Useful contacts page

### Main categories
- Attractions
- Food
- Shops
- Services

### Home page sections
- hero with search
- main categories
- popular places
- where to go today
- nearby / useful picks
- useful contacts

---

## 7. Listing Card Requirements
Each listing should support:

### Basic info
- title
- slug
- short description
- full description
- category
- subcategory (optional)

### Location
- district
- address
- coordinates
- map

### Contacts
- phone
- messenger links
- website
- social links

### Business / visit info
- working hours
- “open now” logic
- price level or basic price info
- delivery / takeaway flags where relevant

### Media
- cover image
- gallery

### System fields
- published / draft status
- updated at
- featured flag

---

## 8. Filters and Search

### Search
- by listing name
- by category
- by keywords / tags

### Filters
- category
- district
- subcategory
- open now
- price level
- delivery
- takeaway
- featured

### Sorting
- featured first
- alphabetical
- nearby
- popular

---

## 9. Admin Panel MVP
Admin panel is internal and minimal.

### Admin can:
- create listing
- edit listing
- upload images
- change status: draft / published
- manage categories / subcategories
- update contacts, schedule, and price info

### Admin panel does not include:
- advanced roles
- audit logs
- workflow approvals
- business self-service accounts

---

## 10. Content Strategy
The product will succeed only if the data is useful and updated.

### Initial content target
- first 50 objects minimum
- preferred target: 100+ objects after initial filling

### First priority content groups
- top attractions
- food places
- shops with clear use for tourists
- services like boats, excursions, transfer, rental

### Content rules
- every key listing should have verified contacts
- every key listing should have working hours if available
- every key listing should have 2–5 images if possible
- every key listing should have last updated date

---

## 11. Non-Functional Requirements

### UX
- mobile-first
- fast access to contact actions
- easy scanning of cards
- minimal friction

### Performance
- fast loading on mobile
- optimized images
- avoid unnecessary client-side complexity

### SEO
- readable URLs
- metadata for listing pages
- sitemap
- robots
- open graph
- basic structured data where useful

---

## 12. Analytics
Track at least:
- home page view
- category page view
- listing page view
- search usage
- filter usage
- phone click
- messenger click
- website click
- map interaction
- report issue click

---

## 13. Success Criteria for MVP
MVP is successful if:
- users can quickly find useful places
- listings are easy to browse on mobile
- search works
- filters work
- listing pages contain enough practical info
- admin can update content without developer help
- there are at least 50–100 published listings
- the app is usable by real tourists

---

## 14. Main Risks
1. outdated data
2. too little content at launch
3. trying to build too many features
4. weak mobile UX
5. poor category structure

### Risk reduction
- keep MVP strict
- launch only strong categories
- verify top listings manually
- add “report issue” later if needed
- review content regularly

---

## 15. Product Principle
Welcome Sudak should win not by complexity, but by:
- useful information
- fast access
- mobile convenience
- clean structure
- trusted local relevance
