# ADR-0003: One shop per COD checkout, with snapshot order items

## Status

Accepted (2026-10-31)

## Context

tcl-shop starts with cash-on-delivery orders and no payment processing. A
cross-merchant cart would require splitting orders, coordinating delivery, and
handling per-merchant cancellation — none of which is in the first release.
Product listings also change over time, so an order that reads live product
data would silently rewrite its own history.

## Decision

- Each checkout belongs to exactly one shop.
- Orders are COD only; tcl-shop records order status and payment status but
  never moves money.
- Guest checkout is supported; an account is not required to order.
- Each `OrderItem` snapshots the product name and unit price at order time.
- Order items never read current product data for display or totals.

## Consequences

- Multi-shop carts are out of scope until a delivery and settlement model
  exists.
- Product edits and deletions do not change past orders.
- Order history survives product archiving or deletion.
- Order status transitions are permission-checked on the server, per shop.
