/* Public navigation hint only; never evidence of authentication.
 * Validation policy mirrors portal/src/public-return.ts. No cookies or tokens
 * are shared between origins. Keep the redirect-security fixtures in sync. */
(function () {
  "use strict";
  if (window.SKUNKWORKS_ACADEMY_SIGN_IN_RETURN) return;
  window.SKUNKWORKS_ACADEMY_SIGN_IN_RETURN = true;
const publicHosts = new Set([
    "skunkworksacademy.com", "www.skunkworksacademy.com",
    "microsoft.skunkworksacademy.com", "ibm.skunkworksacademy.com",
    "cisco.skunkworksacademy.com", "comptia.skunkworksacademy.com",
    "security.skunkworksacademy.com", "catalog.skunkworksacademy.com",
    "labs.skunkworksacademy.com", "docs.skunkworksacademy.com",
    "jobs.skunkworksacademy.com", "badging.skunkworksacademy.com",
    "blog.skunkworksacademy.com", "brand.skunkworksacademy.com"
]);
const sensitiveParameter = /^(?:code|state|access_token|id_token|refresh_token|token|session_state|client_info|error|error_description|returnto|redirect|redirect_uri|redirecturl|next|continue)$/i;
function validatePublicReturnUrl(value) {
    if (typeof value !== "string" || value.length > 4096 || !/^https:\/\//i.test(value) || /[\s\\\u0000-\u001f\u007f]/u.test(value))
        return null;
    try {
        const url = new URL(value);
        if (url.protocol !== "https:" || url.username || url.password || url.port)
            return null;
        const publicConnection = url.hostname === "portal.skunkworksacademy.com" && /^\/connections(?:\/|$)/.test(url.pathname);
        if (!publicHosts.has(url.hostname) && !publicConnection)
            return null;
        const path = decodeURIComponent(url.pathname);
        if (/[\\\u0000-\u001f\u007f]/u.test(path) || /^\/(?:auth|oauth|login|logout|signin|sign-in|signout|sign-out|callback|api|\.auth)(?:\/|$)/i.test(path))
            return null;
        for (const key of url.searchParams.keys())
            if (sensitiveParameter.test(key))
                return null;
        // Preserve ordinary page anchors, never OAuth fragments or nested redirects.
        const fragment = decodeURIComponent(url.hash.slice(1));
        if (/[\u0000-\u001f\u007f]/u.test(fragment))
            return null;
        for (const key of new URLSearchParams(fragment.replace(/^\?/, "")).keys())
            if (sensitiveParameter.test(key))
                return null;
        if (/(?:^|[?&#])(?:code|state|access_token|id_token|refresh_token|token|returnto|redirect|redirect_uri|next)=/i.test(fragment))
            return null;
        return url.href;
    }
    catch {
        return null;
    }
}

  function decorate(link) {
    if (!(link instanceof HTMLAnchorElement)) return;
    const label = link.textContent.trim().replace(/\s+/g, " ");
    // Explicit opt-in or the actual Sign in control, never ordinary Portal links.
    if (!link.hasAttribute("data-academy-sign-in") && !/^sign[\s-]?in(?:\s+to\s+(?:the\s+)?(?:portal|skunkworks academy.*))?$/i.test(label)) return;
    let target;
    try { target = new URL(link.href); } catch { return; }
    if (target.origin !== "https://portal.skunkworksacademy.com" || target.pathname !== "/" || target.username || target.password) return;
    const returnTo = validatePublicReturnUrl(window.location.href);
    if (!returnTo) {
      // A previously decorated link must not retain stale page context.
      target.searchParams.delete("returnTo");
    } else {
      target.searchParams.set("returnTo", returnTo);
    }
    if (link.href !== target.href) link.href = target.href;
  }
  function decorateWithin(node) {
    if (!(node instanceof Element) && node !== document) return;
    if (node instanceof HTMLAnchorElement) decorate(node);
    node.querySelectorAll("a[href]").forEach(decorate);
  }
  ["click", "pointerdown", "focusin", "contextmenu"].forEach(function (type) {
    document.addEventListener(type, function (event) {
      if (event.target instanceof Element) decorate(event.target.closest("a[href]"));
    }, true);
  });
  function refresh() { decorateWithin(document); }
  function start() {
    refresh();
    const observer = new MutationObserver(function (records) {
      records.forEach(function (record) { record.addedNodes.forEach(decorateWithin); });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
  window.addEventListener("popstate", refresh);
  window.addEventListener("hashchange", refresh);
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
