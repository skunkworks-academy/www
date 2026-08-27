/* Skunkworks Academy CompTIA analytics contract
 * Version: 2026.08.26.1
 * Scope: https://www.skunkworksacademy.com/comptia/
 *
 * Goals:
 * - keep social, WhatsApp and Merchant Center attribution consistent;
 * - send GA4 recommended ecommerce events for catalogue discovery;
 * - retain first/last campaign touch without collecting PII;
 * - expose a small stable API for future content automation.
 */
(function () {
  'use strict';

  var VERSION = '2026.08.26.1';
  var CONFIG = Object.freeze({
    measurementId: 'G-NWBW8HWEDR',
    currency: 'ZAR',
    affiliation: 'Skunkworks Academy',
    itemBrand: 'CompTIA',
    itemCategory: 'Certification and training',
    itemListId: 'comptia_catalogue',
    itemListName: 'CompTIA certification catalogue',
    storageKey: 'skw_comptia_attribution_v1',
    storageMaxAgeMs: 90 * 24 * 60 * 60 * 1000
  });

  var ATTRIBUTION_KEYS = [
    'utm_id',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'skw_asset_id',
    'skw_content_id',
    'gclid',
    'gbraid',
    'wbraid',
    'fbclid',
    'msclkid',
    'li_fat_id'
  ];

  function safeText(value, maxLength) {
    if (value === null || value === undefined) return '';
    return String(value).replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, maxLength || 160);
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function parseStoredAttribution() {
    try {
      var raw = window.localStorage.getItem(CONFIG.storageKey);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object') return null;
      if (!parsed.updatedAt || (Date.now() - new Date(parsed.updatedAt).getTime()) > CONFIG.storageMaxAgeMs) {
        window.localStorage.removeItem(CONFIG.storageKey);
        return null;
      }
      return parsed;
    } catch (error) {
      return null;
    }
  }

  function getCampaignTouch() {
    var params = new URLSearchParams(window.location.search || '');
    var touch = {};
    var present = false;

    ATTRIBUTION_KEYS.forEach(function (key) {
      var value = safeText(params.get(key), 180);
      if (value) {
        touch[key] = value;
        present = true;
      }
    });

    if (!present) return null;

    touch.landing_path = safeText(window.location.pathname, 240);
    touch.captured_at = nowIso();
    return touch;
  }

  function persistAttribution() {
    var stored = parseStoredAttribution() || {};
    var touch = getCampaignTouch();
    if (!touch) return stored;

    var next = {
      firstTouch: stored.firstTouch || touch,
      lastTouch: touch,
      updatedAt: nowIso()
    };

    try {
      window.localStorage.setItem(CONFIG.storageKey, JSON.stringify(next));
    } catch (error) {
      // Storage can be unavailable in private browsing or restrictive contexts.
    }

    return next;
  }

  function attributionEventParams(attribution) {
    var params = {};
    var last = attribution && attribution.lastTouch ? attribution.lastTouch : null;
    var first = attribution && attribution.firstTouch ? attribution.firstTouch : null;

    if (last) {
      if (last.utm_source) params.skw_last_source = last.utm_source;
      if (last.utm_medium) params.skw_last_medium = last.utm_medium;
      if (last.utm_campaign) params.skw_last_campaign = last.utm_campaign;
      if (last.utm_id) params.skw_last_campaign_id = last.utm_id;
      if (last.utm_content) params.skw_last_content = last.utm_content;
      if (last.skw_asset_id) params.skw_asset_id = last.skw_asset_id;
      if (last.skw_content_id) params.skw_content_id = last.skw_content_id;
    }

    if (first) {
      if (first.utm_source) params.skw_first_source = first.utm_source;
      if (first.utm_medium) params.skw_first_medium = first.utm_medium;
      if (first.utm_campaign) params.skw_first_campaign = first.utm_campaign;
      if (first.utm_id) params.skw_first_campaign_id = first.utm_id;
    }

    return params;
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };

  function installGtag() {
    var id = CONFIG.measurementId;
    if (!/^G-[A-Z0-9]+$/i.test(id)) return;

    var existing = document.querySelector('script[data-skw-ga4="' + id + '"]') ||
      document.querySelector('script[src*="googletagmanager.com/gtag/js?id=' + id + '"]');

    if (!existing) {
      var script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
      script.setAttribute('data-skw-ga4', id);
      document.head.appendChild(script);
    }

    window.gtag('js', new Date());
    window.gtag('config', id, {
      send_page_view: false,
      cookie_domain: 'skunkworksacademy.com',
      cookie_flags: 'SameSite=Lax;Secure',
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
  }

  var attribution = persistAttribution();

  function track(eventName, params) {
    var event = Object.assign({
      skw_area: 'comptia',
      skw_contract_version: VERSION
    }, attributionEventParams(attribution), params || {});

    window.dataLayer.push({
      event: 'skw_analytics_event',
      skw_event_name: eventName,
      skw_event_payload: event
    });

    window.gtag('event', eventName, event);
  }

  function parsePrice(text) {
    if (!text) return undefined;
    var normalized = String(text).replace(/[^0-9.,-]/g, '').replace(/,/g, '');
    var value = Number.parseFloat(normalized);
    return Number.isFinite(value) ? value : undefined;
  }

  function cardToItem(card, index) {
    if (!card) return null;

    var nameNode = card.querySelector('h3');
    var skuNode = card.querySelector('.sku');
    var priceNode = card.querySelector('.price');
    var badgeNode = card.querySelector('.badge');
    var variantNode = priceNode ? priceNode.querySelector('small') : null;

    var item = {
      item_id: safeText(skuNode ? skuNode.textContent.replace(/^\s*SKU\s*/i, '') : '', 80) || undefined,
      item_name: safeText(nameNode ? nameNode.textContent : '', 120) || 'CompTIA product',
      affiliation: CONFIG.affiliation,
      item_brand: CONFIG.itemBrand,
      item_category: CONFIG.itemCategory,
      item_list_id: CONFIG.itemListId,
      item_list_name: CONFIG.itemListName,
      index: Number.isFinite(index) ? index : undefined,
      item_variant: safeText(variantNode ? variantNode.textContent : (badgeNode ? badgeNode.textContent : ''), 120) || undefined,
      price: parsePrice(priceNode ? priceNode.childNodes[0].textContent : ''),
      quantity: 1
    };

    Object.keys(item).forEach(function (key) {
      if (item[key] === undefined || item[key] === '') delete item[key];
    });

    return item;
  }

  function catalogueItems() {
    return Array.prototype.map.call(document.querySelectorAll('.cards .card'), function (card, index) {
      return cardToItem(card, index);
    }).filter(Boolean);
  }

  function trackPageView() {
    track('page_view', {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname
    });
  }

  function trackCatalogueView() {
    var items = catalogueItems();
    if (!items.length) return;

    track('view_item_list', {
      item_list_id: CONFIG.itemListId,
      item_list_name: CONFIG.itemListName,
      currency: CONFIG.currency,
      items: items
    });
  }

  function clickContext(link) {
    var href = link.getAttribute('href') || '';
    var card = link.closest('.card');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.cards .card'));
    var index = card ? cards.indexOf(card) : -1;
    var item = card ? cardToItem(card, index) : null;
    return { href: href, card: card, item: item };
  }

  function bindClicks() {
    document.addEventListener('click', function (event) {
      var link = event.target.closest('a[href]');
      if (!link) return;

      var context = clickContext(link);
      var href = context.href;
      var item = context.item;

      if (context.card && item) {
        if (/^mailto:/i.test(href)) {
          track('generate_lead', {
            lead_type: 'email_enquiry',
            currency: CONFIG.currency,
            value: item.price,
            items: [item]
          });
          return;
        }

        track('select_item', {
          item_list_id: CONFIG.itemListId,
          item_list_name: CONFIG.itemListName,
          currency: CONFIG.currency,
          items: [item]
        });
      }

      if (/^mailto:/i.test(href)) {
        track('generate_lead', { lead_type: 'email' });
        return;
      }

      if (/^tel:/i.test(href)) {
        track('generate_lead', { lead_type: 'phone' });
        return;
      }

      if (/^https?:/i.test(href)) {
        try {
          var url = new URL(href, window.location.href);
          if (url.hostname !== window.location.hostname && !url.hostname.endsWith('.skunkworksacademy.com')) {
            track('outbound_click', {
              link_url: url.href,
              link_domain: url.hostname,
              link_text: safeText(link.textContent, 120)
            });
          }
        } catch (error) {
          // Ignore malformed links instead of disrupting navigation.
        }
      }
    }, { capture: true });
  }

  function boot() {
    installGtag();
    trackPageView();
    trackCatalogueView();
    bindClicks();
  }

  window.SkunkworksCompTIAAnalytics = Object.freeze({
    version: VERSION,
    measurementId: CONFIG.measurementId,
    track: track,
    getAttribution: function () { return parseStoredAttribution(); },
    getCatalogueItems: catalogueItems
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
