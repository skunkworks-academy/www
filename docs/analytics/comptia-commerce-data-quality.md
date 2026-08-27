# CompTIA Commerce Data Quality Gate

Audit date: 2026-08-26  
Status: **BLOCKED for Google Merchant Center publication**

## Scope

This gate reconciles the Skunkworks Academy CompTIA catalogue against the connected Shopify store and Google Shopping eligibility requirements before any Merchant Center product submission or automated campaign is allowed to optimize against revenue.

## Findings

### CRITICAL — current CompTIA catalogue is not a suitable Merchant Center product feed

Google's current Unsupported Shopping Content policy does not allow **services** in Shopping ads, and the corresponding free-listings policy also excludes unsupported service content. The Skunkworks CompTIA catalogue is dominated by exam vouchers, digital learning bundles, labs, CertMaster products and training/assessment offers rather than tangible goods.

**Risk:** submitting these offers as Merchant Center products can cause product disapprovals and potentially broader account-policy issues.

**Required remediation / routing decision:**

- Do **not** upload exam vouchers, digital course access, online labs, training services or similar non-tangible CompTIA offers to Merchant Center.
- Use Google Ads/Search campaigns and the instrumented CompTIA landing pages for these offers instead.
- Only enable Merchant Center for a separately identified set of eligible tangible physical products, if such products exist and meet Google's product-data and landing-page policies.
- Keep the Merchant sync fail-closed unless every candidate item has an explicit `merchant_eligible=true` classification backed by a tangible-product review.

### HIGH — currency contract mismatch

The connected Shopify store reports base currency `USD`, while `comptia/index.html` explicitly states that catalogue prices are shown in ZAR. A live Shopify Admin GraphQL check of `ProductVariant.contextualPricing(context: { country: ZA })` also resolves the featured CompTIA variants as `USD`, not ZAR.

At the same time, public storefront checks can render some of those same products in ZAR. This means the buyer-facing market/currency behaviour is not consistent enough to use a generic Admin price as the source of truth for any eligible commerce feed.

Examples:

| SKU | Academy catalogue | Shopify Admin / ZA contextual pricing |
| --- | ---: | ---: |
| `810182702612` Security+ | `R22,490.00` | `22490.00 USD` |
| `810182702926` Network+ | `R8,170.00` | `8170.00 USD` |
| `810182701141` Cloud+ | `R8,170.00` | `8170.00 USD` |
| `810182703244` Data+ | `R5,410.00` | `5410.00 USD` |

**Risk:** landing-page price/currency mismatch, incorrect checkout values and invalid conversion-value reporting.

**Required remediation:** establish one authoritative South Africa market pricing source. Make Shopify Markets/contextual pricing, Academy landing pages and GA4 ecommerce parameters agree. Do not derive commerce-feed currency from storefront text or the Shopify base-currency field alone.

### HIGH — duplicate active SKU with conflicting price

SKU `810182702940` resolves to two active Shopify products:

1. `A+ Voucher`
   - handle: `a-voucher`
   - price: `3369.11 USD`
2. `CompTIA A+ Voucher V15`
   - handle: `comptia-a-plus-voucher-v15-810182702940`
   - price: `4310.00 USD`

The Academy catalogue currently displays `R3,369.11` for this SKU.

**Risk:** non-deterministic product identity, inconsistent landing price, misleading reporting and broken SKU-level attribution.

**Required remediation:** keep one authoritative active sellable product per SKU/market and archive or re-key the duplicate.

### HIGH — incomplete owned-commerce funnel

Several individual CompTIA certification pages still send their primary purchase CTA to `comptia.org` rather than a Skunkworks Shopify product/checkout destination.

**Risk:** campaign traffic exits the owned funnel before transaction evidence can be tied to the Skunkworks campaign, SKU and content asset.

**Required remediation:** create and validate a deterministic `SKU -> Skunkworks product URL` map, then replace external purchase CTAs for products Skunkworks actually sells.

## Readiness contract

Any future Merchant Center integration remains disabled until all of the following are true:

- [ ] each candidate item has been classified as an eligible tangible product under current Google Shopping/free-listings policies;
- [ ] services, vouchers, digital course access, online labs and training offers are excluded;
- [ ] authoritative South African catalogue currency is confirmed;
- [ ] Shopify Markets/contextual price resolves the intended South Africa value and currency consistently;
- [ ] Shopify and Academy currency/value semantics agree;
- [ ] every eligible Merchant Center SKU is unique within the target market;
- [ ] every eligible product has exactly one canonical owned landing URL;
- [ ] landing-page title, price, currency, availability and SKU agree with the commerce source;
- [ ] GA4 ecommerce currency agrees with checkout/order currency;
- [ ] purchase events include stable transaction IDs and product SKUs;
- [ ] one end-to-end test order reconciles campaign -> GA4 -> Shopify transaction;
- [ ] Merchant Center diagnostics show no policy, price, currency or landing-page errors.

## Severity and confidence

| Finding | Severity | Confidence |
| --- | --- | --- |
| Current CompTIA offers are predominantly non-tangible services/digital access unsuitable for Shopping/free listings | CRITICAL | High |
| South Africa market/admin currency vs Academy ZAR mismatch | HIGH | High |
| Duplicate active A+ SKU with conflicting price | HIGH | High |
| External CompTIA.org purchase CTA breaks owned funnel | HIGH | High |

## Automation rule

Any future Merchant Center feed generator or social-commerce automation must fail closed when:

- an item is not explicitly classified `merchant_eligible=true` after tangible-product policy review;
- a SKU appears more than once among active sellable products;
- source and landing-page currency differ;
- landing-page price differs from the source price outside an explicitly configured conversion rule;
- canonical destination is missing or leaves the approved commerce-domain set;
- required image/title/availability fields are absent.

Do not silently repair, guess or upload ineligible CompTIA service/digital offers to Merchant Center.
