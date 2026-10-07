# Phase log

Running record of the six build phases. Each entry lists what shipped, the
migration it created (if any), and follow-up fixes applied afterwards.

Standing rule: migration history was squashed pre-deploy (see below) and is
append-only from the first deploy on. Never squash again after deploying.

## Migration history (squashed 2026-10-07, pre-deploy)

Single migration: `20261007073603_init` — pure schema (Area, slug, PriceLevel,
contacts, tags, auth tables), zero data statements. Retired pre-deploy history:
`20261004155508_init`, `20261004171402_add_better_auth_admin`,
`20261004171728_add_category_place`,
`20261007110947_phase1_area_slug_price_contacts_tags` (contained the
priceRange→priceNote rename and area/slug backfills),
`20261007134648_backfill_area_sort_order` (flawed tied-only renumber),
`20261007134823_compact_area_sort_order`. Dev DB wiped and re-seeded at squash
time (7 categories, 6 areas born ordered, 10 places).

## Phase 1 — Schema (done)

- `Area` model (id, slug unique, nameMy, nameEn?, sortOrder, `@@map("area")`);
  `Place.areaId` relation (`Restrict`, indexed), free-text `area` dropped.
- `Place.slug @unique` generated from nameEn (else `place-` + 6-char id),
  collision-suffixed; shared generator with unit tests (both apps).
- `PriceLevel` enum (LOW/MID/HIGH) + `priceNote` (renamed from `priceRange`,
  data preserved); labels in `places-constants.ts` ($/$$/$$$ + Budget/Moderate/Premium).
- Contacts: `phoneSecondary`, `facebookUrl` (single https-URL check),
  `telegramHandle` (leading `@` stripped, rendered as `https://t.me/<handle>`).
- `tags String[]` validated against an 11-word vocabulary (not a DB enum).
- Latitude/longitude both-set-or-both-null, enforced in validators.
- Dashboard `areasCovered` counts Area rows with at least one published place.
- vitest added to `apps/web` (`test`, `test:watch`).
- Seed: areas upserted, places carry phone/facebook/telegram/descriptions;
  re-seeds fill nulls only, never overwrite curated edits.
- Admin form: area is a select; price level select; new contact fields.
  (Slug editing, tags picker, area CRUD remain Phase 2.)
- Migration: `20261007110947_phase1_area_slug_price_contacts_tags`
  (single migration; backfilled 6 areas, 10/10 slugs, all places linked).
- Follow-up fixes: facebook double-error collapsed to one message;
  price-level chip on detail page shows symbol + name, priceNote moved to info card.

## Phase 2 — Admin (done)

- Server area admin (`src/areas/`: schemas, repository, service, controller,
  module): slug immutable, `sortOrder` int >= 0, 409 on slug clash, delete
  blocked naming the place count. No migration. Spec: 6 cases.
- Web area management at `/dashboard/areas` (sidebar entry): list with
  place-count badges, create/rename dialog, up/down reorder buttons (serial
  PATCHes of `{ nameMy, sortOrder }` — the update schema requires nameMy),
  delete disabled with "move its places first" message when used.
- Place form: slug auto-fills from English name until typed (untouched
  tracking; clearing regenerates on save), live `/places/<slug>` preview,
  inline format check, client-side uniqueness check against the loaded
  places plus server 409 backstop. Tags checkbox group from the fixed
  vocabulary. Area select, price-level select, contact fields (Phase 1).
- Photo upload: browser resize to longest-side 1600px, WebP ~0.8 via canvas;
  GIFs skipped (animation), any failure falls back to the original file;
  "Resized N photos, saving ~X KB" hint. No jsdom in web tests, so the
  converter is untested by unit tests (kept to ~40 lines, total-fallback design).
- Dashboard "areas covered" verified: already counts Area rows with at least
  one published place; no change needed.
- Sort-order follow-ups: new areas append after the max (`maxSortOrder` + 1
  in `AreasAdminService.create`); seeds are born ordered (position index on
  create, never touched on update); two heal migrations —
  `20261007134648_backfill_area_sort_order` (tied-only; flawed, could collide
  with distinct rows) superseded by `20261007134823_compact_area_sort_order`
  (compacts all rows preserving relative order). Lesson: renumber the whole
  sequence, never a subset.

## Phase 3 — Public explorer and routing (pending)

Slug detail route with permanent redirect from old id URLs; area + price +
tag filters in URL; search across area names, tag labels, nameEn/My.

## Phase 4 — Detail page (pending)

Second phone + contact links, tags chips, share button, relative updated
line, correction link, nearby places, lazy map, JSON-LD.

## Phase 5 — Robustness, SEO, analytics (pending)

error/not-found segments, sitemap + robots, `PlaceEvent` analytics with
in-memory rate limiting, last-30-day counts in admin.

## Phase 6 — Open now (pending)

`OpeningPeriod` model, Yangon-timezone `getOpenStatus` util, weekly hours
editor, status badges, open-now filter.
