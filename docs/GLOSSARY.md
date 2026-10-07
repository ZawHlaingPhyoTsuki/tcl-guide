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
A free-text neighborhood or township descriptor locating a Place (e.g. "San Sai", "near the border gate"). Complements coordinates; neither is mandatory.
_Avoid_: Township (too formal — many businesses have no formal address), Zone, District
