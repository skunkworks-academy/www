/* Skunkworks Academy global navigation runtime v11. */
(function () {
  "use strict";

  var VERSION = "2026.09.08.3";
  var REVISION = "2026.11.25.1";
  var NAVIGATION_REVISION = "2026.11.25.1";
  var FOOTER_REVISION = "2026.11.20.2";
  var BRAND_THEME_REVISION = "2026.11.05.2";
  var CANONICAL_ROOT = "https://skunkworksacademy.com/assets/";
  var host = String(window.location && window.location.hostname || "").toLowerCase();
  var isLocalPreview = host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]";
  var isApexAlias = host === "skunkworksacademy.com" || host === "www.skunkworksacademy.com";
  var isFirstPartyAssetHost = isApexAlias || isLocalPreview;
  var PRIMARY_ROOT = isFirstPartyAssetHost ? window.location.origin.replace(/\/$/, "") + "/assets/" : CANONICAL_ROOT;
  var BRAND_THEME_ROOT = isLocalPreview ? PRIMARY_ROOT : "https://www.skunkworksacademy.com/assets/";

  // The first v11 runtime owns this document until reload, regardless of its
  // content revision. Keep the legacy sentinel stable so an older cached
  // runtime also defers instead of installing a competing chrome observer.
  if (window.SKUNKWORKS_ACADEMY_GLOBAL_NAV_V11) return;
  window.SKUNKWORKS_ACADEMY_GLOBAL_NAV_V11 = VERSION;

  var GLOBAL_NAV_GROUPS = [
    {
      label: "Learn",
      description: "Courses, learning paths and technology training",
      items: [
        { label: "All courses", url: "https://skunkworksacademy.com/courses", description: "Browse the complete Academy course catalogue" },
        { label: "Learning paths", url: "https://skunkworksacademy.com/learning-paths/", description: "Structured role and skill pathways" },
        { label: "Self-paced", url: "https://skunkworksacademy.com/self-paced/", description: "Learn on your own schedule" },
        { label: "Instructor-led", url: "https://skunkworksacademy.com/instructor-led/", description: "Scheduled live and cohort delivery" },
        { label: "Microsoft", url: "https://microsoft.skunkworksacademy.com/", description: "Microsoft learning and certification" },
        { label: "IBM", url: "https://ibm.skunkworksacademy.com/", description: "IBM enterprise learning" },
        { label: "CompTIA", url: "https://skunkworksacademy.com/comptia/", description: "CompTIA certification learning" },
        { label: "Cisco", url: "https://skunkworksacademy.com/cisco/", description: "Cisco networking and infrastructure learning" },
        { label: "Security training", url: "https://security.skunkworksacademy.com/", description: "Cybersecurity learning and resources" }
      ]
    },
    {
      label: "Teach",
      description: "Instructor resources, faculty and course delivery",
      items: [
        { label: "Faculty", url: "https://skunkworksacademy.com/faculty/", description: "Academy faculty and instructors" },
        { label: "Instructor-led delivery", url: "https://skunkworksacademy.com/instructor-led/", description: "Delivery formats and scheduled learning" },
        { label: "Instructor handbook", url: "https://skunkworksacademy.com/forms/Skunkworks_Academy_Instructor_Handbook.html", description: "Instructor standards and operating guidance" },
        { label: "Instructor task orders", url: "https://skunkworksacademy.com/forms/Skunkworks_Academy_Instructor_Task_Order_Template.html", description: "Course delivery task-order template" },
        { label: "Teaching opportunities", url: "https://jobs.skunkworksacademy.com/", description: "Instructor, facilitator and Academy opportunities" }
      ]
    },
    {
      label: "Publish",
      description: "Authoring, articles, guides and learning content",
      items: [
        { label: "Publishing workspace", url: "https://publish.skunkworksacademy.com/", description: "Publish Academy learning and knowledge content" },
        { label: "Articles & blog", url: "https://blog.skunkworksacademy.com/", description: "Academy articles, updates and commentary" },
        { label: "Technical guides", url: "https://skunkworksacademy.com/guides/", description: "Practical technical and learning guides" },
        { label: "Authors", url: "https://skunkworksacademy.com/authors/", description: "Academy authors and technical reviewers" },
        { label: "Documentation", url: "https://docs.skunkworksacademy.com/", description: "Academy documentation and references" },
        { label: "Slides & learning assets", url: "https://skunkworksacademy.com/slides/", description: "Reusable presentation and learning assets" }
      ]
    },
    {
      label: "Practice",
      description: "Labs, exercises, simulations and assessments",
      items: [
        { label: "Hands-on labs", url: "https://labs.skunkworksacademy.com/", description: "Technical labs and guided practical work" },
        { label: "Activities", url: "https://skunkworksacademy.com/activities/", description: "Applied learning activities and exercises" },
        { label: "Assessments", url: "https://skunkworksacademy.com/assessments/", description: "Knowledge and capability assessments" },
        { label: "Workbooks", url: "https://skunkworksacademy.com/workbooks/", description: "Structured practice and learner workbooks" },
        { label: "Security practice", url: "https://security.skunkworksacademy.com/", description: "Cybersecurity practice environments and resources" }
      ]
    },
    {
      label: "Certify",
      description: "Certification preparation, exams, vouchers and credentials",
      items: [
        { label: "Certification courses", url: "https://skunkworksacademy.com/courses", description: "Find certification-aligned courses" },
        { label: "CompTIA", url: "https://skunkworksacademy.com/comptia/", description: "CompTIA certification preparation and exams" },
        { label: "Digital badges", url: "https://badging.skunkworksacademy.com/", description: "Digital credentials and badge services" },
        { label: "Plans & vouchers", url: "https://skunkworksacademy.com/plans-and-purchases/", description: "Training plans, purchases and voucher options" },
        { label: "Course registration", url: "https://skunkworksacademy.com/course-registration/", description: "Register for Academy training" }
      ]
    },
    {
      label: "Work",
      description: "Jobs, talent opportunities and career pathways",
      items: [
        { label: "Jobs", url: "https://jobs.skunkworksacademy.com/", description: "Current Academy and ecosystem opportunities" },
        { label: "Career pathways", url: "https://skunkworksacademy.com/learning-paths/", description: "Build skills against career pathways" },
        { label: "Professional profile", url: "https://skunkworksacademy.com/profile/", description: "Profile and professional development resources" }
      ]
    },
    {
      label: "Connect",
      description: "Learners, faculty, community, partners and events",
      items: [
        { label: "Learner connections", url: "https://portal.skunkworksacademy.com/connections/", description: "Connect with learners and the Academy network" },
        { label: "Faculty", url: "https://skunkworksacademy.com/faculty/", description: "Meet Academy faculty and instructors" },
        { label: "Partners", url: "https://skunkworksacademy.com/partners/", description: "Explore Academy partners" },
        { label: "Webinars & events", url: "https://skunkworksacademy.com/webinars/", description: "Live sessions, webinars and events" },
        { label: "Contact", url: "https://skunkworksacademy.com/contact.html", description: "Contact Skunkworks Academy" }
      ]
    },
    {
      label: "Partner",
      description: "Enterprise training, vendors and channel programmes",
      items: [
        { label: "Partner ecosystem", url: "https://skunkworksacademy.com/partners/", description: "Technology, training and channel partners" },
        { label: "Enterprise training", url: "https://skunkworksacademy.com/instructor-led/", description: "Instructor-led and enterprise delivery" },
        { label: "Learning catalogue", url: "https://skunkworksacademy.com/courses", description: "Build corporate and public-sector learning plans" },
        { label: "Plans & purchases", url: "https://skunkworksacademy.com/plans-and-purchases/", description: "Commercial training options and purchases" },
        { label: "Contact partnerships", url: "https://skunkworksacademy.com/contact.html", description: "Discuss vendor, channel or delivery partnerships" }
      ]
    },
    {
      label: "Manage",
      description: "Portal, enrolments, purchases, reports and administration",
      items: [
        { label: "Learner portal", url: "https://portal.skunkworksacademy.com/", description: "Open your Academy account and learning portal" },
        { label: "Enrolments", url: "https://skunkworksacademy.com/course-registration/", description: "Manage course registration and enrolment" },
        { label: "Plans & purchases", url: "https://skunkworksacademy.com/plans-and-purchases/", description: "Training plans and purchases" },
        { label: "Reports", url: "https://portal.skunkworksacademy.com/reports/", description: "Learning and programme reports" },
        { label: "Forms", url: "https://skunkworksacademy.com/forms/", description: "Academy forms and administrative resources" },
        { label: "Profile", url: "https://skunkworksacademy.com/profile/", description: "Manage profile-related resources" }
      ]
    }
  ];

  var TOP_MENU = GLOBAL_NAV_GROUPS.map(function (group) {
    return { label: group.label, url: group.items[0] && group.items[0].url || "https://skunkworksacademy.com/" };
  });

  var SECTION_BRANDS = [
    { label: "Connections", hosts: ["portal.skunkworksacademy.com"], paths: ["/connections"] },
    { label: "Reports", hosts: ["portal.skunkworksacademy.com"], paths: ["/reports"] },
    { label: "Learner portal", hosts: ["portal.skunkworksacademy.com"] },
    { label: "Courses", hosts: ["skunkworksacademy.com", "www.skunkworksacademy.com"], paths: ["/courses", "/catalogue"] },
    { label: "Learning paths", hosts: ["skunkworksacademy.com", "www.skunkworksacademy.com"], paths: ["/learning-paths"] },
    { label: "Self-paced", hosts: ["skunkworksacademy.com", "www.skunkworksacademy.com"], paths: ["/self-paced"] },
    { label: "Instructor-led", hosts: ["skunkworksacademy.com", "www.skunkworksacademy.com"], paths: ["/instructor-led"] },
    { label: "CompTIA", hosts: ["skunkworksacademy.com", "www.skunkworksacademy.com"], paths: ["/comptia"] },
    { label: "Cisco", hosts: ["skunkworksacademy.com", "www.skunkworksacademy.com"], paths: ["/cisco"] },
    { label: "Faculty", hosts: ["skunkworksacademy.com", "www.skunkworksacademy.com"], paths: ["/faculty"] },
    { label: "Guides", hosts: ["skunkworksacademy.com", "www.skunkworksacademy.com"], paths: ["/guides"] },
    { label: "Activities", hosts: ["skunkworksacademy.com", "www.skunkworksacademy.com"], paths: ["/activities"] },
    { label: "Assessments", hosts: ["skunkworksacademy.com", "www.skunkworksacademy.com"], paths: ["/assessments"] },
    { label: "Workbooks", hosts: ["skunkworksacademy.com", "www.skunkworksacademy.com"], paths: ["/workbooks"] },
    { label: "Partners", hosts: ["skunkworksacademy.com", "www.skunkworksacademy.com"], paths: ["/partners"] },
    { label: "Plans & purchases", hosts: ["skunkworksacademy.com", "www.skunkworksacademy.com"], paths: ["/plans-and-purchases"] },
    { label: "Registration", hosts: ["skunkworksacademy.com", "www.skunkworksacademy.com"], paths: ["/course-registration"] },
    { label: "Forms", hosts: ["skunkworksacademy.com", "www.skunkworksacademy.com"], paths: ["/forms"] },
    { label: "Labs", hosts: ["labs.skunkworksacademy.com", "lab.skunkworksacademy.com"] },
    { label: "Security", hosts: ["security.skunkworksacademy.com"] },
    { label: "Microsoft", hosts: ["microsoft.skunkworksacademy.com"] },
    { label: "IBM", hosts: ["ibm.skunkworksacademy.com"] },
    { label: "Badging", hosts: ["badging.skunkworksacademy.com", "badge-hub.skunkworksacademy.com"] },
    { label: "Work", hosts: ["jobs.skunkworksacademy.com"] },
    { label: "Docs", hosts: ["docs.skunkworksacademy.com"] },
    { label: "Publish", hosts: ["publish.skunkworksacademy.com"] },
    { label: "Blog", hosts: ["blog.skunkworksacademy.com"] },
    { label: "Home", hosts: ["skunkworksacademy.com", "www.skunkworksacademy.com"], paths: ["/"] }
  ];

  if (typeof document === "undefined") return;

  // Course applications own their document subtree through React. Their
  // explicitly marked shell may update only the separate Academy header.
  var hydrationSafe = Boolean(document.querySelector('script[data-skunkworks-react-safe="true"]'));
  var lastRoute = String(window.location.pathname || "/");

  function assetUrl(root, file) {
    var revision = file === "skunkworks-footer.js" ? FOOTER_REVISION : file === "skunkworks-ui.js" ? NAVIGATION_REVISION : file === "academy-brand-theme.css" ? BRAND_THEME_REVISION : REVISION;
    return root + file + "?v=" + VERSION + "&rev=" + revision;
  }

  window.SKUNKWORKS_ACADEMY_SHELL = Object.assign(window.SKUNKWORKS_ACADEMY_SHELL || {}, {
    version: VERSION,
    revision: REVISION,
    compatibility: "v11",
    canonicalUi: assetUrl(CANONICAL_ROOT, "skunkworks-ui.js"),
    canonicalFooter: assetUrl(CANONICAL_ROOT, "skunkworks-footer.js"),
    canonicalTheme: assetUrl(BRAND_THEME_ROOT, "academy-brand-theme.css"),
    assetRoot: PRIMARY_ROOT,
    navigationMode: "single-header-drawer",
    // Compatibility metadata only; no secondary navigation is rendered.
    topMenu: TOP_MENU.slice(),
    menuGroups: GLOBAL_NAV_GROUPS.map(function (group) {
      return { label: group.label, description: group.description, items: group.items.slice() };
    })
  });

  function notifyNavigationReady() {
    window.dispatchEvent(new CustomEvent("skunkworksacademy:navigation-ready"));
  }
  notifyNavigationReady();

  function isPortalWorkspace() {
    var account = window.SKUNKWORKS_ACADEMY_NAV_ACCOUNT;
    return host === "portal.skunkworksacademy.com" && account && account.source === "portal" && account.authenticated === true && account.workspaceNavigation === "sidebar";
  }

  function ensureAcademyTheme() {
    var selector = 'link[data-skunkworks-brand-theme="canonical"]';
    var existing = document.querySelector(selector);
    var primaryHref = assetUrl(BRAND_THEME_ROOT, "academy-brand-theme.css");
    if (existing) {
      if (existing.getAttribute("href") !== primaryHref) existing.setAttribute("href", primaryHref);
      return existing;
    }
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = primaryHref;
    link.setAttribute("data-skunkworks-brand-theme", "canonical");
    (document.head || document.documentElement).appendChild(link);
    return link;
  }

  function ensureRuntime(file, attribute, value) {
    var selector = 'script[' + attribute + '="' + value + '"]';
    var existing = document.querySelector(selector);
    if (existing) return existing;
    var primarySrc = assetUrl(PRIMARY_ROOT, file);
    var fallbackSrc = assetUrl(CANONICAL_ROOT, file);
    var script = document.createElement("script");
    script.defer = true;
    script.src = primarySrc;
    script.referrerPolicy = "strict-origin-when-cross-origin";
    script.setAttribute(attribute, value);
    if (!isLocalPreview && primarySrc !== fallbackSrc) {
      script.addEventListener("error", function () { if (script.src !== fallbackSrc) script.src = fallbackSrc; });
    }
    (document.head || document.documentElement).appendChild(script);
    return script;
  }

  function ensureDrawerStyles() {
    var obsolete = document.getElementById("swa-global-top-menu-styles");
    if (obsolete) obsolete.remove();
    if (document.getElementById("swa-global-drawer-styles")) return;
    var style = document.createElement("style");
    style.id = "swa-global-drawer-styles";
    style.textContent = [
      ".swa-global-nav__links.swa-global-nav__links--grouped{width:min(520px,calc(100vw - 32px))!important}",
      ".swa-global-nav.swa-menu-open .swa-global-nav__links.swa-global-nav__links--grouped{display:grid!important;grid-template-columns:1fr!important;gap:8px!important}",
      ".swa-global-nav__drawer-heading{margin:0!important;color:var(--swa-muted,#d9d9d9)!important;font-size:12px!important;font-weight:700!important;letter-spacing:.08em!important;text-transform:uppercase!important}",
      ".swa-global-nav__drawer-group{min-width:0!important;border:1px solid var(--swa-line,#666)!important;border-radius:4px!important;padding:0!important}",
      ".swa-global-nav__drawer-group-summary{display:flex!important;align-items:center!important;gap:12px!important;min-height:48px!important;padding:10px 12px!important;color:var(--swa-text,#fff)!important;font:inherit!important;font-size:16px!important;font-weight:600!important;cursor:pointer!important;list-style:none!important}",
      ".swa-global-nav__drawer-group-summary::-webkit-details-marker{display:none!important}",
      ".swa-global-nav__drawer-group-summary::after{content:'+';margin-inline-start:auto;font-size:20px;font-weight:400}",
      ".swa-global-nav__drawer-group[open]>.swa-global-nav__drawer-group-summary::after{content:'−'}",
      ".swa-global-nav__drawer-group-summary:hover,.swa-global-nav__drawer-group-summary[data-current]{background:var(--swa-panel-strong,#1a1a1a)!important}",
      ".swa-global-nav__drawer-group-summary[data-current]{border-inline-start:3px solid var(--swa-accent,#fff)!important}",
      ".swa-global-nav__drawer-group-summary:focus-visible,.swa-global-nav__drawer-link:focus-visible{outline:3px solid var(--swa-focus,#fff)!important;outline-offset:-3px!important}",
      ".swa-global-nav__drawer-group-description{margin:0!important;padding:4px 12px 8px!important;color:var(--swa-muted,#d9d9d9)!important;font-size:13px!important;line-height:1.4!important}",
      ".swa-global-nav__drawer-options{display:grid!important;grid-template-columns:1fr!important;gap:2px!important;padding:0 8px 8px!important}",
      ".swa-global-nav__drawer-group:not([open])>:not(summary){display:none!important}",
      ".swa-global-nav__drawer-link{display:flex!important;align-items:center!important;min-height:44px!important;padding:8px 10px!important;border:1px solid transparent!important;border-radius:3px!important;color:var(--swa-text,#fff)!important;text-decoration:none!important;font-size:14px!important;font-weight:500!important;line-height:1.35!important}",
      ".swa-global-nav__drawer-link:hover,.swa-global-nav__drawer-link:focus,.swa-global-nav__drawer-link[aria-current=page]{background:var(--swa-panel-strong,#1a1a1a)!important;color:var(--swa-text,#fff)!important;border-color:var(--swa-line,#666)!important}",
      ".swa-global-nav.swa-portal-workspace .swa-global-nav__links{display:none!important}"
    ].join("\n");
    (document.head || document.documentElement).appendChild(style);
  }

  function normalisePath(pathname) {
    var value = String(pathname || "/").replace(/\/+$/, "");
    return value || "/";
  }

  function pathMatches(currentPath, candidatePath) {
    var targetPath = normalisePath(candidatePath);
    if (targetPath === "/") return currentPath === "/";
    return currentPath === targetPath || currentPath.indexOf(targetPath + "/") === 0;
  }

  function locationMatchesUrl(url) {
    try {
      var current = new URL(window.location.href);
      var target = new URL(url);
      var currentHost = String(current.hostname).toLowerCase();
      var targetHost = String(target.hostname).toLowerCase();
      if (isLocalPreview) currentHost = "www.skunkworksacademy.com";
      var apexHosts = ["skunkworksacademy.com", "www.skunkworksacademy.com"];
      if (currentHost !== targetHost && !(apexHosts.indexOf(currentHost) !== -1 && apexHosts.indexOf(targetHost) !== -1)) return false;
      var targetPath = normalisePath(target.pathname);
      var currentPath = normalisePath(current.pathname);
      return targetPath === "/" ? currentPath === "/" : pathMatches(currentPath, targetPath);
    } catch (_error) { return false; }
  }

  function groupIsCurrent(group) {
    return group.items.some(function (item) { return locationMatchesUrl(item.url); });
  }

  function humaniseSegment(value) {
    return String(value || "").replace(/\.(html?|php)$/i, "").replace(/[-_]+/g, " ").replace(/\b\w/g, function (character) { return character.toUpperCase(); });
  }

  function currentSection() {
    var currentHost = String(window.location && window.location.hostname || "").toLowerCase();
    // Local previews represent the main Academy site, not a "127" section.
    if (isLocalPreview) currentHost = "www.skunkworksacademy.com";
    var currentPath = normalisePath(window.location && window.location.pathname || "/");
    for (var index = 0; index < SECTION_BRANDS.length; index += 1) {
      var section = SECTION_BRANDS[index];
      if (section.hosts.indexOf(currentHost) === -1) continue;
      if (!section.paths || section.paths.some(function (path) { return pathMatches(currentPath, path); })) {
        // The portal publishes its already-authorized workspace choice for display only.
        var account = window.SKUNKWORKS_ACADEMY_NAV_ACCOUNT;
        if (currentHost === "portal.skunkworksacademy.com" && !section.paths && account && account.source === "portal" && account.authenticated === true) {
          if (account.workspaceRole === "Staff") return { label: "Staff portal" };
          if (account.workspaceRole === "Instructor") return { label: "Instructor portal" };
          if (account.workspaceRole === "Student") return { label: "Learner portal" };
        }
        return section;
      }
    }
    if ((currentHost === "skunkworksacademy.com" || currentHost === "www.skunkworksacademy.com") && currentPath !== "/") {
      return { label: humaniseSegment(currentPath.split("/").filter(Boolean)[0]) || "Home" };
    }
    var subdomain = currentHost.split(".")[0];
    if (subdomain && subdomain !== "www" && subdomain !== "skunkworksacademy") return { label: humaniseSegment(subdomain) };
    return { label: "Home" };
  }

  function syncBrandText() {
    var brandText = document.querySelector(".swa-global-nav__brand-text");
    if (!brandText) return false;
    var section = currentSection();
    if (brandText.textContent !== section.label) brandText.textContent = section.label;
    brandText.setAttribute("data-skunkworks-section-label", section.label);
    return true;
  }

  function syncDrawerMenu() {
    var drawer = document.querySelector(".swa-global-nav__links");
    if (!drawer) return false;
    if (drawer.getAttribute("data-skunkworks-menu-groups") === REVISION) return true;
    var hadFocus = drawer.contains(document.activeElement);
    while (drawer.firstChild) drawer.removeChild(drawer.firstChild);
    drawer.classList.add("swa-global-nav__links--grouped");
    drawer.setAttribute("data-skunkworks-menu-groups", REVISION);
    drawer.setAttribute("aria-label", "Skunkworks Academy navigation");
    var heading = document.createElement("p");
    heading.className = "swa-global-nav__drawer-heading";
    heading.textContent = "Explore Skunkworks Academy";
    drawer.appendChild(heading);
    var initialGroup = GLOBAL_NAV_GROUPS.find(groupIsCurrent) || GLOBAL_NAV_GROUPS[0];
    GLOBAL_NAV_GROUPS.forEach(function (group) {
      var section = document.createElement("details");
      var title = document.createElement("summary");
      var description = document.createElement("p");
      var options = document.createElement("div");
      section.className = "swa-global-nav__drawer-group";
      title.className = "swa-global-nav__drawer-group-summary";
      description.className = "swa-global-nav__drawer-group-description";
      options.className = "swa-global-nav__drawer-options";
      title.textContent = group.label;
      if (groupIsCurrent(group)) title.setAttribute("data-current", "true");
      description.textContent = group.description;
      section.open = group === initialGroup;
      group.items.forEach(function (item) {
        var link = document.createElement("a");
        link.className = "swa-global-nav__drawer-link";
        link.href = item.url;
        link.textContent = item.label;
        if (locationMatchesUrl(item.url)) link.setAttribute("aria-current", "page");
        options.appendChild(link);
      });
      section.appendChild(title);
      section.appendChild(description);
      section.appendChild(options);
      drawer.appendChild(section);
    });
    if (hadFocus) {
      var currentSummary = drawer.querySelector("details[open] > summary");
      if (currentSummary) currentSummary.focus();
    }
    return true;
  }

  function ensureSingleHeader() {
    if (!document.body || document.body.getAttribute("data-sk-global-nav") === "off") return false;
    var header = document.querySelector(".swa-global-nav");
    if (!header) return false;
    var toggle = header.querySelector(".swa-global-nav__toggle");
    // Clean up legacy injected chrome during a mixed-version transition.
    Array.prototype.slice.call(header.querySelectorAll(".swa-global-nav__top-menu")).forEach(function (node) {
      if (node.contains(document.activeElement) && toggle) toggle.focus();
      node.remove();
    });
    header.classList.remove("swa-has-top-menu");
    document.body.classList.remove("swa-has-top-menu");
    header.classList.toggle("swa-portal-workspace", Boolean(isPortalWorkspace()));
    syncDrawerMenu();
    syncBrandText();
    return true;
  }

  function isPreserved(node, kind) {
    if (!node || !node.matches) return true;
    if (kind === "header") return node.matches('.swa-global-nav,[data-sk-preserve-header],[data-skunkworks-ui="canonical"]');
    return node.matches('.swa-global-footer,[data-sk-preserve-footer],[data-skunkworks-global-footer="canonical"]');
  }

  function removeNode(node, kind) {
    if (!node || isPreserved(node, kind)) return;
    // Docusaurus owns these nodes through React. Removing its navbar/footer
    // leaves React refs null and crashes the hydrated course controls.
    // Preserve DOM identity and hide only visual duplicate framework chrome.
    if (node.closest && node.closest('#__docusaurus')) {
      node.style.setProperty('display', 'none', 'important');
      return;
    }
    if (node.parentNode) node.parentNode.removeChild(node);
  }

  function removeKnownPublicChrome() {
    var headerSelectors = ['nav.navbar.navbar--fixed-top','#__docusaurus > nav.navbar','#__docusaurus .theme-layout-navbar > nav.navbar','.site-header','.main-header','.sk-topbar','[data-sk-nav-shell]','header[data-skunkworks-global-header]','header.swa-fallback-top','header.fallback-top','body > nav.ibm-masthead'];
    var footerSelectors = ['#__docusaurus > footer.footer','#__docusaurus footer.footer','.site-footer[data-site-footer]','footer[data-skunkworks-global-footer]:not([data-skunkworks-global-footer="canonical"])','[data-site-footer][data-skunkworks-public-shell]'];
    headerSelectors.forEach(function (selector) {
      Array.prototype.slice.call(document.querySelectorAll(selector)).forEach(function (node) {
        if (isPreserved(node, "header")) return;
        if (node.closest && node.closest('main,article,[data-sk-preserve-header]')) return;
        removeNode(node, "header");
      });
    });
    Array.prototype.slice.call(document.querySelectorAll('body > header')).forEach(function (node) {
      if (isPreserved(node, "header")) return;
      var hasPublicChrome = Boolean(node.querySelector('nav,.brand,.logo,.nav-toggle,[aria-label*="navigation" i]'));
      if (hasPublicChrome) removeNode(node, "header");
    });
    footerSelectors.forEach(function (selector) {
      Array.prototype.slice.call(document.querySelectorAll(selector)).forEach(function (node) {
        if (isPreserved(node, "footer")) return;
        if (node.closest && node.closest('[data-sk-preserve-footer]')) return;
        removeNode(node, "footer");
      });
    });
  }

  function refreshCanonicalChrome() {
    if (!hydrationSafe) removeKnownPublicChrome();
    if (String(window.location.pathname || "/") !== lastRoute) {
      refreshRouteState();
      return;
    }
    ensureSingleHeader();
  }

  function refreshRouteState() {
    lastRoute = String(window.location.pathname || "/");
    var drawer = document.querySelector(".swa-global-nav__links");
    if (drawer) drawer.removeAttribute("data-skunkworks-menu-groups");
    ensureSingleHeader();
  }

  function startChromeGuard() {
    refreshCanonicalChrome();
    window.addEventListener("skunkworksacademy:account-change", function () {
      refreshCanonicalChrome();
      notifyNavigationReady();
    });
    if (!document.body || typeof MutationObserver === "undefined") return;
    var observer = new MutationObserver(function () { refreshCanonicalChrome(); });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("popstate", refreshRouteState);
    window.addEventListener("hashchange", syncBrandText);
    window.addEventListener("pagehide", function () { observer.disconnect(); }, { once: true });
  }

  if (!hydrationSafe) ensureAcademyTheme();
  ensureDrawerStyles();
  ensureRuntime("skunkworks-ui.js", "data-skunkworks-ui", "canonical");
  ensureRuntime("skunkworks-footer.js", "data-skunkworks-global-footer", "canonical");
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startChromeGuard, { once: true });
  else startChromeGuard();
})();

