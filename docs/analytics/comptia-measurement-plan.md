# CompTIA Commerce & Campaign Measurement Plan

Status: implementation contract  
Owner: Skunkworks Academy  
Scope: CompTIA catalogue and campaign traffic  
Canonical catalogue: `https://www.skunkworksacademy.com/comptia/`  
Campaign vanity entrypoint: `https://comptia.skunkworksacademy.com/`  
GA4 measurement ID: `G-NWBW8HWEDR`  
Contract version: `2026.08.26.1`

## Architecture

The `skunkworks-academy/www/comptia/` directory is the authoritative CompTIA catalogue source. The separate `skunkworks-academy/comptia` GitHub Pages property is treated as a campaign/vanity entrypoint and specialist assessment surface, not a second catalogue source.

All marketing destinations should resolve to canonical `www.skunkworksacademy.com/comptia/` URLs. Vanity-subdomain redirects must preserve query strings so UTM and click identifiers survive the hop.

## Primary KPIs

1. **Qualified catalogue engagement rate**
   - Definition: sessions with at least one `select_item` or `generate_lead` divided by CompTIA catalogue sessions.
   - Decision: identifies whether campaign traffic is reaching relevant certification offers.

2. **Lead / commerce-intent rate**
   - Definition: sessions with `generate_lead`, a tracked commerce outbound action, or a Shopify checkout initiation divided by CompTIA catalogue sessions.
   - Decision: determines which channel, creative and certification path should receive more distribution.

3. **Attributed downstream conversion rate**
   - Definition: purchases or confirmed leads attributed to a CompTIA campaign divided by campaign sessions.
   - Decision: controls spend, content cadence and product promotion priorities.
   - Dependency: Shopify/checkout purchase events and CRM/order reconciliation must be connected before this KPI is complete.

## Driver metrics

- `view_item_list` -> catalogue exposure
- `select_item` -> certification/product interest
- `generate_lead` -> email or phone enquiry intent
- `outbound_click` -> transition to external partner/product destination
- campaign sessions by `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`
- content performance by `skw_asset_id` and `skw_content_id`

## Guardrails

- No email addresses, phone numbers, names or form-field values are intentionally collected by the CompTIA analytics contract.
- Do not encode personal data in UTM parameters, asset IDs or content IDs.
- GA4 Google Signals and ad-personalisation signals are disabled in the initial implementation.
- Use a consent-management implementation before enabling advertising personalisation or remarketing features for jurisdictions where consent is required.
- Keep canonical product URLs clean. Use Google Ads tracking templates/final URL suffixes for paid Shopping traffic rather than hard-coding paid tracking into canonical URLs.

## UTM contract

Use lowercase values with hyphens only. Do not rename sources between campaigns.

| Field | Required | Contract | Examples |
| --- | --- | --- | --- |
| `utm_id` | yes | stable campaign ID | `comptia-2026q3-cert-pathways` |
| `utm_source` | yes | distribution system | `linkedin`, `facebook`, `instagram`, `whatsapp`, `google` |
| `utm_medium` | yes | traffic mechanism | `organic-social`, `paid-social`, `messaging`, `cpc`, `organic-shopping` |
| `utm_campaign` | yes | business campaign | `comptia-cert-pathways-202608` |
| `utm_content` | yes | creative/placement variant | `security-plus-carousel-v01`, `a-plus-reel-v02` |
| `utm_term` | optional | keyword/audience where meaningful | `security-plus-training` |
| `skw_asset_id` | yes for automated social | immutable creative ID | `cmp-202608-d03-security-reel-01` |
| `skw_content_id` | recommended | parent content concept | `cmp-security-plus-career-path` |

### Channel defaults

- LinkedIn organic: `utm_source=linkedin&utm_medium=organic-social`
- Facebook organic: `utm_source=facebook&utm_medium=organic-social`
- Instagram organic: `utm_source=instagram&utm_medium=organic-social`
- WhatsApp broadcast/status: `utm_source=whatsapp&utm_medium=messaging`
- Google Shopping paid: rely on Google Ads auto-tagging/tracking template; GA4 should resolve `google / cpc`
- Google free listings: use Merchant Center auto-tagging where supported; GA4 should report Google organic/free-listing traffic distinctly

## GA4 event contract

### `page_view`
Sent once when the CompTIA hub loads.

Custom context:
- `skw_area=comptia`
- `skw_contract_version`
- first/last-touch campaign fields when available
- `skw_asset_id`, `skw_content_id` when supplied

### `view_item_list`
Sent once when the catalogue renders. Items are parsed from catalogue cards.

Item fields:
- `item_id` = SKU
- `item_name`
- `item_brand=CompTIA`
- `item_category=Certification and training`
- `item_variant`
- `price`
- `currency=ZAR`
- `item_list_id=comptia_catalogue`
- `item_list_name=CompTIA certification catalogue`

### `select_item`
Sent when a catalogue product/certification card is selected.

### `generate_lead`
Sent when a catalogue enquiry action is selected. Recipient address/query content is not sent as an analytics parameter.

### `outbound_click`
Sent for links leaving the Skunkworks Academy domain.

## Merchant Center measurement rules

1. Product feed `link` values should point to the actual canonical product landing page, not the CompTIA catalogue homepage.
2. Each Merchant Center product ID should map deterministically to the same SKU used by GA4 `item_id` where possible.
3. Use Google Ads tracking templates/final URL suffixes and auto-tagging for Shopping ads.
4. Use Merchant Center/Google auto-tagging for free-listing attribution where available.
5. Reconcile Merchant Center clicks, GA4 sessions and Shopify orders by product/SKU and date.
6. Do not claim revenue attribution complete until Shopify `purchase` events and transaction IDs are available in the same measurement property.

## Social automation payload

Every scheduled social asset should contain at least:

```json
{
  "campaign_id": "comptia-2026q3-cert-pathways",
  "content_id": "cmp-security-plus-career-path",
  "asset_id": "cmp-202608-d03-security-reel-01",
  "platform": "instagram",
  "format": "reel",
  "destination": "https://www.skunkworksacademy.com/comptia/security-plus.html",
  "utm_source": "instagram",
  "utm_medium": "organic-social",
  "utm_campaign": "comptia-cert-pathways-202608",
  "utm_content": "security-plus-reel-v01"
}
```

The automation layer must generate the final destination URL from these fields, publish the asset, capture the platform post ID/permalink, and write back verification status.

## Verification criteria before 30-day automation activation

- CompTIA hub loads without console errors.
- GA4 receives `page_view` and `view_item_list` in DebugView/realtime.
- Clicking a catalogue card produces `select_item` with expected SKU/name/price.
- A test UTM URL persists first-touch and last-touch attribution.
- Vanity subdomain redirect preserves the complete query string.
- Merchant Center test product resolves to the intended canonical landing page.
- One test social post resolves to the intended landing page with correct UTM values.
- Platform post permalink/ID is captured by the automation workflow.
- Failure path raises an exception instead of silently marking the post as published.
- Shopify or order-system conversion evidence is connected before revenue ROAS is treated as authoritative.

## Known gap discovered during audit

Several individual CompTIA certification detail pages currently send their primary "Shop ... products" CTA to `comptia.org` rather than a Skunkworks Shopify product/checkout URL. This breaks the intended Skunkworks-owned commerce funnel and prevents complete purchase attribution. Resolve product-to-Shopify URL mapping before Merchant Center publication and before using purchase conversion rate as a primary KPI.
