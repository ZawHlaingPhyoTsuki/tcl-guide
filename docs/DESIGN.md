# TCL Guide - Design Direction

## Product personality

TCL Guide should feel:

- local
- trustworthy
- welcoming
- practical
- modern
- lightweight

It should feel like a useful local guide, not a generic SaaS dashboard.

## Visual direction

Prefer:

- clean layouts
- strong typography
- generous whitespace
- real place photography
- subtle borders
- restrained shadows
- clear information hierarchy

Avoid:

- excessive gradients
- glassmorphism everywhere
- excessive animations
- oversized decorative elements
- generic AI-generated SaaS aesthetics

## Colors

The exact palette is still to be defined.

- Primary: TBD
- Background: TBD
- Accent: TBD

Until the palette is defined, use the existing neutral design tokens and do not introduce new colors.

## Typography

The exact typeface and scale are still to be defined.

- Typeface: TBD
- Heading scale: TBD
- Body scale: TBD

Typography should prioritize readability and clear information hierarchy over decorative treatment.

## Place cards

A place card should prioritize:

1. photo
2. name
3. category
4. area
5. rating or open status when available

Do not fabricate photos, ratings, or open status. Use an honest placeholder or omit unavailable information.

## Place detail

Place detail should prioritize:

1. place name
2. primary photo
3. category and area
4. address and contact information
5. opening hours when available
6. description
7. map or directions when coordinates are available

The page should make the next practical action obvious without adding decorative sections that do not help someone visit or contact the place.

## Responsive behavior

- Mobile is a first-class layout, not a reduced desktop layout.
- Avoid horizontal overflow.
- Keep controls comfortable to tap.
- Let place information wrap naturally without clipping.
- Preserve the order of the place-card priorities at every breakpoint.
- Use a single-column layout when multiple columns would make place information difficult to scan.

## Admin UI

The admin interface can be more utilitarian than the public site.

It should prioritize:

- fast data entry
- clear validation
- visible save and error states
- reliable filtering
- safe publish or hide actions
- keyboard accessibility

The admin UI does not need to share every visual treatment of the public discovery experience, but it should use the same typography, color tokens, spacing, and interaction standards.

## Design dials

- ENERGY: 1
- RHYTHM: 1
- MOTION: 1
