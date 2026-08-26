# CompTIA Commerce Data Quality Gate

Audit date: 2026-08-26  
Status: **BLOCKED for Google Merchant Center publication**

## Scope

This gate reconciles the Skunkworks Academy CompTIA catalogue against the connected Shopify store before any Merchant Center feed is published or any automated campaign is allowed to optimize against revenue.

## Findings

### HIGH — currency contract mismatch

The connected Shopify store reports base currency `USD`, while `comptia/index.html` explicitly states that catalogue prices are shown in ZAR. The numeric values currently match, which strongly suggests a unit/currency configuration mismatch rather than an FX conversion.

Examples:

| SKU | Academy catalogue | Shopify |
| --- | ---: | ---: |
| `810182702612` Security+ | `R22,490.00` | `22490.00 USD` |
| `810182702926` Network+ | `R8,170.00` | `8170.00 USD` |
| `810182701141` Cloud+ | `R8,170.00` | `8170.00 USD` |
| `810182703244` Data+ | `R5,410.00` | `5410.00 USD` |

**Risk:** Merchant Center landing-page price/currency mismatch, incorrect checkout values, invalid ROAS, and possible product disapproval.

**Required remediation:** establish one authoritative customer-facing currency/market contract, then make Shopify, Academy landing pages, GA4 ecommerce parameters and Merchant Center feed currency agree.

### HIGH — duplicate active SKU with conflicting price

SKU `810182702940` resolves to two active Shopify products:

1. `A+ Voucher`
   - handle: `a-voucher`
   - price: `3369.11 USD`
2. `CompTIA A+ Voucher V15`
   - handle: `comptia-a-plus-voucher-v15-810182702940`
   - price: `4310.00 USD`

The Academy catalogue currently displays `R3,369.11` for this SKU.

**Risk:** non-deterministic product identity, feed duplication, inconsistent landing price, misleading reporting and broken SKU-level attribution.

**Required remediation:** keep one authoritative active sellable product per SKU/market and archive or re-key the duplicate.

### HIGH — incomplete owned-commerce funnel

Several individual CompTIA certification pages still send their primary purchase CTA to `comptia.org` rather than a Skunkworks Shopify product/checkout destination.

**Risk:** campaign traffic exits the owned funnel before transaction evidence can be tied to the Skunkworks campaign, SKU and content asset.

**Required remediation:** create and validate a deterministic `SKU -> Skunkworks product URL` map, then replace external purchase CTAs before Merchant Center activation.

## Readiness contract

Merchant Center publication remains disabled until all of the following are true:

- [ ] authoritative South African catalogue currency is confirmed;
- [ ] Shopify and Academy currency/value semantics agree;
- [ ] every Merchant Center SKU is unique within the target market;
- [ ] every product has exactly one canonical Skunkworks-owned landing URL;
- [ ] landing-page title, price, currency, availability and SKU agree with Shopify;
- [ ] primary purchase CTA remains inside the measurable Skunkworks commerce funnel;
- [ ] GA4 ecommerce currency agrees with checkout/order currency;
- [ ] purchase events include stable transaction IDs and product SKUs;
- [ ] one end-to-end test order reconciles campaign -> GA4 -> Shopify transaction;
- [ ] Merchant Center diagnostics show no price/currency/landing-page errors.

## Severity and confidence

| Finding | Severity | Confidence |
| --- | --- | --- |
| Shopify base currency vs Academy ZAR mismatch | HIGH | High |
| Duplicate active A+ SKU with conflicting price | HIGH | High |
| External CompTIA.org purchase CTA breaks owned funnel | HIGH | High |

## Automation rule

Any future Merchant Center feed generator or social-commerce automation must fail closed when:

- a SKU appears more than once among active sellable products;
- source and landing-page currency differ;
- landing-page price differs from the source price outside an explicitly configured conversion rule;
- canonical destination is missing or leaves the approved Skunkworks commerce domain set;
- required image/title/availability fields are absent.

Do not silently repair or guess currency values in the feed generator.
