# ADR-0001: Pivot from a local directory to tcl-shop

## Status

Accepted (2026-10-31)

## Context

v1 (`v1/tcl-guide`) was a map-first local directory of food-related places.
The map-first layout made discovery the product, but the businesses it listed
had no way to transact, and the directory competed with Telegram and social
media rather than replacing them.

## Decision

Move to tcl-shop on the `v2/tcl-shop` branch: a mobile-first product discovery
and storefront platform for social-commerce merchants.

- Customers browse products across shops and place COD orders.
- Merchants own a shop, its products, stock, and orders.
- Platform admins moderate shops, listings, and categories.
- Public product and shop pages work without signing in.
- The map is no longer a primary surface.

The repository, package names, and deployment topology stay the same; only the
product changes.

## Consequences

- v1 modules and pages are retired as v2 replaces them.
- The v2 schema starts a fresh migration baseline; migration history is
  append-only after the first deploy.
- Search, storefronts, and checkout become the core surfaces; maps become an
  optional detail-page element.
- The `v1/tcl-guide` branch remains the record of the directory product.
