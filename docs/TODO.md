# TODO

## Open questions

- How far do variants go in v1: size/color only, or arbitrary option pairs?
- Can a guest look up an order by reference + phone, or is the confirmation link
  the only access?
- Do merchant accounts start as self-serve signup or admin-created in v1?
- Is a product limited to one category, or several?
- Do we need a separate shop location model now, or free-text delivery info?
- Shan language fields are deferred; the schema stores English and Myanmar
  explicitly until a reviewed migration adds Shan.

## Next up

- [ ] Define the v2 Prisma schema: Shop, Product, Variant, Category, Order,
      OrderItem, merchant membership.
- [ ] Decide order and payment status vocabularies and permitted transitions.
- [ ] Decide the money helper API (integer amount + currency, no FX).
- [ ] Set up Better Auth roles: customer (optional account), merchant, admin.
- [ ] Seed a demo shop, categories, and products for local development.

## Merchant

- [ ] Shop setup and edit form.
- [ ] Product create/edit with publish, unpublish, archive.
- [ ] Product image upload and ordering.
- [ ] Basic stock and variant management.
- [ ] Order list and permitted status updates.
- [ ] Delivery information settings.

## Customer

- [ ] Browse published products.
- [ ] Category filter and sort, in the URL.
- [ ] Product search.
- [ ] Product detail with variant selector and availability.
- [ ] Shop storefront with share action.
- [ ] COD checkout, guest-capable.
- [ ] Order confirmation and status view.

## Admin

- [ ] Shop review and approval.
- [ ] Listing moderation (hide).
- [ ] Category management.
- [ ] Report handling and account suspension.

## Deferred (explicitly out of first release)

- Online payments and payment processing.
- Delivery-provider integrations and live shipping quotes.
- Cross-merchant checkout.
- Automated TikTok scraping or importing.
- AI recommendations and complex personalization.
- Paid promotions, subscriptions, transaction fees.
- Advanced analytics.
- Reviews (Phase 8) and verified-purchase checks.

## Codebase

- [ ] Retire v1 modules (places, areas, tags) from `apps/server` once v2
      endpoints exist.
- [ ] Retire v1 public pages and dashboard screens.
- [ ] Update seeds and fixtures to the shop model.
