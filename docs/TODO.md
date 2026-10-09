### UI

- [DONE] Implement sub-image click-to-expand on the detail page.
- [ON_HOLD] Polish the detail page UI.
- Create Admin Settings page (theme toggle, profile edit).
- Replace `Sheet` with `Drawer` on the home page for better mobile UX.
- Remove "minimal 2 items" logic; allow full drawer toggle. (when user first open the page, the drawer must be expanded)
- Improve the look of `<select>` inputs in forms. using shadcn component
- Refactor folder structure (move places/categories to `src/features`).
- in mobile view, align and make same size for both drawer trigger button and search bar(don't make search bar glassmor)

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
