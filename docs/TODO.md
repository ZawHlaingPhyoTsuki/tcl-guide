### UI

- [ON_HOLD] Polish the detail page UI.
- Create Admin Settings page (theme toggle, profile edit).
- Refactor folder structure (move places/categories to `src/features`).

### Server

- [DROP] Investigate/fix redundant data fetching when navigating between dashboard tabs.
- Add CRUD endpoints for **Areas**.
- Add CRUD endpoints for **Tags**.
- Implement server-side rate limiting (Redis).
- Configure Nginx.
- In Place model, createdByAdminId is NULL, addressText NULL in seed, tag table

### FUTURE Feature

- **Deli Integration:**
  - Link places to specific delis.
  - Filter public place list based on the selected deli.
