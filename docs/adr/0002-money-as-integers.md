# ADR-0002: Money as whole integers with an explicit currency

## Status

Accepted (2026-10-31)

## Context

tcl-shop operates in Tachileik, where both MMK and THB circulate. Both
currencies are commonly used without decimal subunits in daily trade. Floating
point money introduces rounding errors, and a shared price column without a
currency cannot say which denomination an amount is in.

## Decision

- Store every money amount as a whole integer in its smallest used unit.
- Store the currency explicitly with every amount: `MMK` or `THB`, both with no
  decimals.
- Prices are always displayed with their currency code.
- Never infer a currency from context, locale, or another field.

## Consequences

- No floating point anywhere in the money path.
- No implicit FX conversion; a product is priced in exactly one currency.
- If a currency with decimals is added later, the meaning of "whole integer"
  must be redefined in a reviewed migration.
- Aggregating totals across currencies is invalid and must be rejected.
