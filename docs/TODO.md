### UI

- [ON_HOLD] Polish the detail page UI.
- category icons, make it dynamic
- add recommendation in detail page
- fo "nearbyPlaces" card, use the sidebar places cards
- improve the nearByPlaces login
- [VERIFYING]in production,
  - in home page, i can scroll hori a little(about 10px?)
  - in detail page too, same as i can scroll horizentally a little
  - after i zoom out with my finger, it work normamly and look good
  - no problem at auth pages

### Server

- [DROP] Investigate/fix redundant data fetching when navigating between dashboard tabs.
- Add CRUD endpoints for **Tags**.
- Implement server-side rate limiting (Redis).
- Configure Nginx.
- In Place model, createdByAdminId is NULL, addressText NULL in seed, tag table

### Codebase

- refactor agent skills

### FUTURE Feature

- **Deli Integration:**
  - Link places to specific delis.
  - Filter public place list based on the selected deli.

- Let users report incorrect phone numbers, closed businesses, wrong map pins, or outdated photos. Admins review the reports.
  - This helps keep the directory trustworthy as it grows.

- Recently added and recently updated places, show them to visitors
  - Give visitors a way to discover new businesses and see which listings have fresh information.
  - This can make the directory feel alive without building a social network.

- Favorites and saved places
  - Allow visitors to bookmark places they want to visit. You could start with local browser storage and add accounts only if cross-device sync becomes important.
- Populate accurate, useful listings
- Analytics, promotions, monetization

### Directions

#### A. The local directory

The best place to find businesses in Tachileik. Focus on coverage, accurate information, bilingual search, and excellent discovery.
(Simplest starting point)

#### B. The local business platform

A directory plus business owner accounts, listing claims, self-service updates, and insights.
(A natural evolution of A)

#### C. The local commerce ecosystem

A directory connected to delivery providers, ordering, promotions, and possibly transactions.
Most ambitious; (requires much more validation)
