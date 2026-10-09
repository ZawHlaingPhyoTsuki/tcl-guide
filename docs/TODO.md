### UI

- [ON_HOLD] Polish the detail page UI.
- Create Admin Settings page (theme toggle, profile edit).
- Improve the look of `<select>` inputs in forms. using shadcn component
- Refactor folder structure (move places/categories to `src/features`).
- in admin places, places lists, i can see place list collapse to 2 rows (1st are image and info , 2nd are actins button) in smaller view depending on the text. i want them to collapse on smaller size (since orignal one is like some are collapse to 2 and some are still 1 rows etc)

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
