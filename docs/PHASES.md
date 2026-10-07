# Phase log

Running record of the six build phases. Each entry lists what shipped, the
migration it created (if any), and follow-up fixes applied afterwards.

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

## Phase 2 — Admin (pending)

Area management (list with counts, create, rename, reorder, blocked delete),
slug editing with uniqueness check + URL preview, tags picker, photo resize
to WebP-1600px before upload.

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
