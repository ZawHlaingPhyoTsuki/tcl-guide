# Phase log

Running record of the tcl-shop (v2) build. Each entry lists what shipped and
the migration it created (if any).

The v1 directory product lives on the `v1/tcl-guide` branch; its phase log is
not carried over.

Standing rule: migration history is append-only from the first deploy on. Never
squash after deploying.

## Migration history

v2 starts a fresh migration baseline when Phase 1 lands. Record the baseline
migration name here at that point.

## Phase 1 — Schema (pending)

`Shop`, `Product`, `Variant`, `Order`, `OrderItem`, `Category`, merchant
membership; publication state, money + currency, order-item snapshots.

## Phase 2 — Auth and merchant roles (pending)

Better Auth integration, merchant role and shop ownership, server-enforced
permissions, guest access for public pages.

## Phase 3 — Merchant shop and products (pending)

Shop setup, product CRUD with publish/unpublish/archive, image upload, basic
stock and variants, category assignment.

## Phase 4 — Public browse and search (pending)

Published-product listing, category filters and sort in the URL, search across
product and shop names.

## Phase 5 — Product and shop pages (pending)

Product detail, shareable storefront, share actions, SEO metadata.

## Phase 6 — COD checkout and orders (pending)

Per-shop cart, guest checkout, order and payment status, confirmation page,
merchant order workflow with permitted transitions.

## Phase 7 — Admin and moderation (pending)

Shop review, listing moderation, category management, account suspension.

## Phase 8 — Reviews (pending)

Verified-purchase reviews for eligible customers.
