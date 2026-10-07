# TCL Guide

Local discovery platform for Tachileik, Myanmar. Helps people discover restaurants and food-related businesses more easily than through Telegram posts or scattered social media.

## Language

**Place**:
A discoverable food-related business: a restaurant, cafe, bakery, street-food stall, bar, hotel, or shop.
_Avoid_: Restaurant (too narrow), Listing, Venue, Spot

**Category**:
A grouping for Places (restaurant, cafe, bakery, street_food, bar, hotel, shop). A separate relation, not an enum, because categories evolve.
_Avoid_: Type, Tag, Cuisine (cuisine is a future refinement, not today's term)

**Admin**:
A user with the `admin` role (via the Better Auth admin plugin) who can create and manage Places. The first admin is bootstrapped from the `ADMIN_EMAIL` environment variable.
_Avoid_: Moderator, Owner, Staff

**Area**:
A named neighborhood or township grouping for Places (e.g. "San Sai", "Night Market"). A separate relation, like Category, because areas evolve; deleting an area that still has places is blocked.
_Avoid_: Township (too formal — many businesses have no formal address), Zone, District

**PriceLevel**:
A coarse price tier for a Place: LOW (Budget, $), MID (Moderate, $$), HIGH (Premium, $$$). Complements the free-text price note (e.g. "2,000-5,000 Ks per person"), which carries the specifics.
_Avoid_: PriceRange (the old free-text column name), PriceTier

**Tag**:
A fixed-vocabulary label on a Place (halal, vegetarian, delivery, dine-in, takeaway, parking, wifi, air-conditioned, kid-friendly, accepts-thb, accepts-mmk). A plain string list, not a DB enum, validated against the vocabulary in code.
_Avoid_: Cuisine (a future refinement, not today's term)
