# tcl-shop — Design Direction

## Product personality

tcl-shop should feel:

- local
- trustworthy
- welcoming
- practical
- modern
- lightweight

It should feel like a real neighborhood shop, not a generic marketplace or a
SaaS dashboard. Mobile is the primary surface; most customers arrive from a
shared link on a phone.

## Visual direction

Prefer:

- clean layouts
- strong typography
- generous whitespace
- real product photography
- subtle borders
- restrained shadows
- clear information hierarchy

Avoid:

- excessive gradients
- glassmorphism everywhere
- excessive animations
- oversized decorative elements
- generic AI-generated SaaS aesthetics
- fake stock photos, fake review stars, fake discount badges

## Colors

The exact palette is still to be defined.

- Primary: TBD
- Background: TBD
- Accent: TBD

Until the palette is defined, use the existing neutral design tokens and do not
introduce new colors.

## Typography

The exact typeface and scale are still to be defined.

- Typeface: TBD
- Heading scale: TBD
- Body scale: TBD

Typography should prioritize readability and clear information hierarchy over
decorative treatment.

## Product cards

A product card should prioritize:

1. photo
2. product name
3. price with currency
4. shop name
5. availability (in stock / sold out)

Do not fabricate photos, prices, ratings, or availability. Use an honest
placeholder or omit unavailable information. Show the currency code next to
every price; never rely on a symbol alone.

## Product detail

Product detail should prioritize:

1. product name
2. photo gallery
3. price and currency
4. variant selector when variants exist
5. shop name and link to its storefront
6. description
7. availability and delivery information

The primary action is **Order**. Keep it visible on mobile (sticky action)
without covering price or variant controls.

## Shop storefront

A storefront should prioritize:

1. shop name and photo
2. short description
3. delivery information
4. published products, in a scannable grid or list
5. share action

A storefront is shareable and readable without signing in. Hidden or archived
products never appear on it.

## Browse and search

- Search results are products, not shops; a shop link is secondary metadata.
- Filters and sort live in the URL so any result view is shareable.
- Sort options stay few and obvious: newest, price low to high, price high to
  low.
- Empty states explain what to do next instead of showing a blank grid.

## COD checkout

Checkout is short and works for guests.

- One shop per order; the cart is scoped to that shop.
- Ask only for what is needed to deliver: name, phone, address, optional note.
- Show the item total plus any delivery note, in the order's currency.
- Make it explicit that payment happens on delivery.
- Confirmation shows an order reference and what happens next; no account is
  created silently.

## Merchant UI

The merchant dashboard can be more utilitarian than the public storefront.

It should prioritize:

- fast product entry
- clear validation
- visible save and error states
- reliable filtering and bulk state changes (publish, unpublish, archive)
- safe order status transitions
- keyboard accessibility

The merchant UI does not need to share every visual treatment of the public
storefront, but it should use the same typography, color tokens, spacing, and
interaction standards.

## Admin UI

Admin tools are for moderation, not merchandising:

- review shops and products
- hide or moderate listings
- manage categories
- investigate reports and suspend accounts

Destructive actions are confirmed and explain their effect on live storefronts.

## Responsive behavior

- Mobile is a first-class layout, not a reduced desktop layout.
- Avoid horizontal overflow.
- Keep controls comfortable to tap, including variant and quantity controls.
- Let product and price information wrap naturally without clipping.
- Preserve the order of the product-card priorities at every breakpoint.
- Use a single-column layout when multiple columns would make product
  information difficult to scan.

## Map and location

Maps are not a primary surface. A shop may optionally show a location or
directions on its storefront or product detail; never make the map the entry
point to discovery.

## Design dials

- ENERGY: 1
- RHYTHM: 1
- MOTION: 1
