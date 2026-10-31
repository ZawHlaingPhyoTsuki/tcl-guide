# tcl-shop

Mobile-first product discovery and storefront platform for social-commerce
merchants in Tachileik, Myanmar. Customers browse products across shops and
place cash-on-delivery orders; merchants manage a shop, its products, and its
orders.

## Language

**Shop**:
A merchant's storefront and the unit of ownership for products and orders.
One or more users may manage it.
_Avoid_: Store, Vendor, Seller, Merchant (the person is a Merchant, the
storefront is a Shop)

**Merchant**:
A user who owns or manages a Shop and its Products and Orders.
_Avoid_: Seller, Vendor, Owner

**Customer**:
A person who browses Products and places Orders. May be a guest with no
account.
_Avoid_: Buyer, User (too broad), Consumer

**Storefront**:
The public-facing view of a Shop at its shareable URL.
_Avoid_: Shop page, Store

**Product**:
A sellable listing owned by a Shop. Has a name, price, currency, images,
category, publication state, and optional Variants.
_Avoid_: Item, Listing (use Product), SKU (a SKU is a Variant-level code)

**Variant**:
An optional concrete option of a Product (for example size or color) with its
own price and stock.
_Avoid_: Option, SKU (a SKU identifies a Variant, it is not the term)

**Stock**:
The quantity of a Product or Variant available to order. Basic stock only in
the first release.
_Avoid_: Inventory (acceptable in prose, not as a model name), Quantity

**Category**:
A grouping for Products, managed by the platform. A relation, not an enum,
because categories evolve.
_Avoid_: Type, Tag, Collection

**ProductPublication**:
The lifecycle state of a Product: draft, published, or archived. Only
published Products are publicly visible and orderable.
_Avoid_: Status (reserved for Orders), Visibility

**Order**:
A COD purchase request for one Shop. Contains one or more OrderItems and
records both order status and payment status.
_Avoid_: Cart (a cart is pre-checkout), Checkout, Transaction

**OrderItem**:
A line in an Order. Snapshots the Product name and unit price at order time so
later listing edits do not rewrite history.
_Avoid_: LineItem, ProductOrder, CartItem

**COD**:
Cash on delivery. The only payment method in the first release. tcl-shop
records payment status but never processes money.
_Avoid_: Cash payment, Offline payment

**Money**:
An amount stored as a whole integer in its Currency, with an explicit
Currency code: MMK or THB. Both have no decimals. There is no implicit FX
conversion.
_Avoid_: Price (a Price is a Money amount on a Product), Float, Amount

**Currency**:
The denomination of a Money amount, `MMK` or `THB`. Never inferred; always
stored with the amount.
_Avoid_: Baht, Kyat (use the ISO code)

**Snapshot**:
A copy of Product data captured into an OrderItem at order time. Snapshots are
intentionally denormalized and never updated from the Product.
_Avoid_: Cache, Audit copy

**Review**:
A rating and comment from a Customer with an eligible completed purchase of
the Product. Not part of the first release.
_Avoid_: Rating, Feedback, Testimonial

**Admin**:
A platform user with the `admin` role who reviews Shops, moderates Products,
manages Categories, and suspends abusive accounts.
_Avoid_: Moderator, Staff, Superuser
