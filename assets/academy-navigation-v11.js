/* Skunkworks Academy global navigation runtime v11. */
(function () {
  "use strict";

  var VERSION = "2026.08.20.1";
  var REVISION = "2026.08.20.1";
  var CANONICAL_ROOT = "https://skunkworksacademy.com/assets/";
  var host = String(window.location && window.location.hostname || "").toLowerCase();
  var isLocalPreview = host === "localhost" || host === "127.0.0.1" || host === "::1";
  var isApexAlias = host === "skunkworksacademy.com" || host === "www.skunkworksacademy.com";
  var isFirstPartyAssetHost = isApexAlias || isLocalPreview;
  var PRIMARY_ROOT = isFirstPartyAssetHost ? window.location.origin.replace(/\/$/, "") + "/assets/" : CANONICAL_ROOT;

  if (window.SKUNKWORKS_ACADEMY_GLOBAL_NAV_V11 === REVISION) return;
  window.SKUNKWORKS_ACADEMY_GLOBAL_NAV_V11 = REVISION;

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

  function assetUrl(root, file) {
    return root + file + "?v=" + VERSION + "&rev=" + REVISION;
  }

  window.SKUNKWORKS_ACADEMY_SHELL = Object.assign(window.SKUNKWORKS_ACADEMY_SHELL || {}, {
    version: VERSION,
    revision: REVISION,
    compatibility: "v11",
    canonicalUi: assetUrl(CANONICAL_ROOT, "skunkworks-ui.js"),
    canonicalFooter: assetUrl(CANONICAL_ROOT, "skunkworks-footer.js"),
    canonicalDesignSystem: assetUrl(CANONICAL_ROOT, "skunkworks-design-system.css"),
    assetRoot: PRIMARY_ROOT,
    topMenu: TOP_MENU.slice(),
    menuGroups: GLOBAL_NAV_GROUPS.map(function (group) {
      return { label: group.label, description: group.description, items: group.items.slice() };
    })
  });

  function ensureDesignSystem() {
    var selector = 'link[data-skunkworks-design-system="canonical"]';
    var existing = document.querySelector(selector);
    var primaryHref = assetUrl(PRIMARY_ROOT, "skunkworks-design-system.css");
    var fallbackHref = assetUrl(CANONICAL_ROOT, "skunkworks-design-system.css");
    if (existing) {
      if (existing.getAttribute("href") !== primaryHref) existing.setAttribute("href", primaryHref);
      return existing;
    }
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = primaryHref;
    link.setAttribute("data-skunkworks-design-system", "canonical");
    if (!isLocalPreview && primaryHref !== fallbackHref) {
      link.addEventListener("error", function () { if (link.href !== fallbackHref) link.href = fallbackHref; }, { once: true });
    }
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

  function ensureTopMenuStyles() {
    if (document.getElementById("swa-global-top-menu-styles")) return;
    var style = document.createElement("style");
    style.id = "swa-global-top-menu-styles";
    style.textContent = [
      "html body.swa-has-global-nav.swa-has-top-menu{padding-top:128px!important}",
      ".swa-global-nav.swa-has-top-menu{min-height:128px!important}",
      ".swa-global-nav__top-menu{position:relative!important;display:flex!important;align-items:stretch!important;min-height:44px!important;width:100%!important;padding:0 clamp(20px,4vw,56px)!important;gap:2px!important;background:#1c1c1c!important;border-top:1px solid #484848!important;white-space:nowrap!important}",
      ".swa-global-nav__top-menu-item{position:relative!important;display:flex!important;align-items:stretch!important}",
      ".swa-global-nav__top-menu-button{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-height:43px!important;padding:0 13px!important;border:0!important;border-bottom:3px solid transparent!important;background:transparent!important;color:#f5f5f5!important;font-family:Segoe UI,SegoeUI,system-ui,-apple-system,BlinkMacSystemFont,Arial,sans-serif!important;font-size:14px!important;font-weight:600!important;line-height:1!important;letter-spacing:.005em!important;cursor:pointer!important}",
      ".swa-global-nav__top-menu-button::after{content:\"⌄\"!important;margin-left:6px!important;font-size:12px!important;line-height:1!important;transform:translateY(-1px)!important}",
      ".swa-global-nav__top-menu-button:hover,.swa-global-nav__top-menu-button:focus,.swa-global-nav__top-menu-button[aria-expanded=\"true\"]{background:#303030!important;color:#fff!important}",
      ".swa-global-nav__top-menu-button:focus-visible{outline:3px solid #fff!important;outline-offset:-4px!important}",
      ".swa-global-nav__top-menu-button[aria-current=\"page\"]{border-bottom-color:#2b88d8!important;background:#303030!important;color:#fff!important}",
      ".swa-global-nav__top-menu-panel{position:absolute!important;top:100%!important;left:0!important;display:none!important;width:min(390px,calc(100vw - 32px))!important;max-height:min(580px,calc(100vh - 152px))!important;overflow:auto!important;padding:16px!important;background:#1c1c1c!important;border:1px solid #484848!important;border-top:3px solid #2b88d8!important;border-radius:0 0 8px 8px!important;box-shadow:0 20px 44px rgba(0,0,0,.42)!important;white-space:normal!important}",
      ".swa-global-nav__top-menu-item:nth-last-child(-n+3) .swa-global-nav__top-menu-panel{left:auto!important;right:0!important}",
      ".swa-global-nav__top-menu-item.swa-primary-open .swa-global-nav__top-menu-panel{display:block!important}",
      ".swa-global-nav__top-menu-title{margin:0 0 4px!important;color:#fff!important;font-size:18px!important;font-weight:700!important;line-height:1.2!important}",
      ".swa-global-nav__top-menu-description{margin:0 0 12px!important;color:#c8c8c8!important;font-size:13px!important;line-height:1.4!important}",
      ".swa-global-nav__top-menu-options{display:grid!important;grid-template-columns:1fr!important;gap:4px!important}",
      ".swa-global-nav__top-menu-option{display:grid!important;gap:2px!important;padding:9px 10px!important;border:1px solid transparent!important;border-radius:3px!important;background:transparent!important;color:#fff!important;text-decoration:none!important}",
      ".swa-global-nav__top-menu-option:hover,.swa-global-nav__top-menu-option:focus{background:#303030!important;border-color:#616161!important;color:#fff!important;text-decoration:none!important}",
      ".swa-global-nav__top-menu-option:focus-visible{outline:3px solid #fff!important;outline-offset:2px!important}",
      ".swa-global-nav__top-menu-option strong{font-size:14px!important;font-weight:700!important;line-height:1.3!important}.swa-global-nav__top-menu-option span{color:#c8c8c8!important;font-size:12px!important;line-height:1.35!important}",
      ".swa-global-nav__links.swa-global-nav__links--grouped{width:min(520px,calc(100vw - 32px))!important}",
      ".swa-global-nav.swa-menu-open .swa-global-nav__links.swa-global-nav__links--grouped{display:grid!important;grid-template-columns:1fr!important;gap:14px!important}",
      ".swa-global-nav__drawer-heading{margin:0!important;color:#c8c8c8!important;font-size:12px!important;font-weight:700!important;letter-spacing:.12em!important;text-transform:uppercase!important}",
      ".swa-global-nav__drawer-group{display:grid!important;gap:6px!important;padding-top:12px!important;border-top:1px solid #484848!important}",
      ".swa-global-nav__drawer-group:first-of-type{padding-top:0!important;border-top:0!important}",
      ".swa-global-nav__drawer-group-title{margin:0!important;color:#fff!important;font-size:17px!important;font-weight:700!important;line-height:1.2!important}",
      ".swa-global-nav__drawer-group-description{margin:0 0 2px!important;color:#c8c8c8!important;font-size:12px!important;line-height:1.35!important}",
      ".swa-global-nav__drawer-options{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:4px!important}",
      ".swa-global-nav__drawer-link{display:block!important;min-height:40px!important;padding:9px 10px!important;border:1px solid transparent!important;border-radius:3px!important;background:transparent!important;color:#fff!important;text-decoration:none!important;font-size:13px!important;font-weight:600!important;line-height:1.25!important}",
      ".swa-global-nav__drawer-link:hover,.swa-global-nav__drawer-link:focus{background:#303030!important;border-color:#616161!important;color:#fff!important;text-decoration:none!important}",
      ".swa-global-nav__drawer-link:focus-visible{outline:3px solid #fff!important;outline-offset:2px!important}",
      "@media(max-width:1120px){.swa-global-nav__top-menu-button{padding:0 10px!important;font-size:13px!important}}",
      "@media(max-width:980px){html body.swa-has-global-nav.swa-has-top-menu{padding-top:84px!important}.swa-global-nav.swa-has-top-menu{min-height:84px!important}.swa-global-nav__top-menu{display:none!important}}",
      "@media(max-width:620px){html body.swa-has-global-nav.swa-has-top-menu{padding-top:74px!important}.swa-global-nav.swa-has-top-menu{min-height:74px!important}.swa-global-nav__drawer-options{grid-template-columns:1fr!important}}"
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
      if (String(current.hostname).toLowerCase() !== String(target.hostname).toLowerCase()) return false;
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
    var currentPath = normalisePath(window.location && window.location.pathname || "/");
    for (var index = 0; index < SECTION_BRANDS.length; index += 1) {
      var section = SECTION_BRANDS[index];
      if (section.hosts.indexOf(currentHost) === -1) continue;
      if (!section.paths || section.paths.some(function (path) { return pathMatches(currentPath, path); })) return section;
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

  function createOptionLink(item, className) {
    var link = document.createElement("a");
    var label = document.createElement("strong");
    var description = document.createElement("span");
    link.className = className;
    link.href = item.url;
    label.textContent = item.label;
    description.textContent = item.description || item.url;
    link.appendChild(label);
    link.appendChild(description);
    return link;
  }

  function closePrimaryMenus(nav, exceptItem) {
    Array.prototype.slice.call(nav.querySelectorAll(".swa-global-nav__top-menu-item")).forEach(function (item) {
      if (exceptItem && item === exceptItem) return;
      item.classList.remove("swa-primary-open");
      var button = item.querySelector(".swa-global-nav__top-menu-button");
      if (button) button.setAttribute("aria-expanded", "false");
    });
  }

  function wireTopMenu(nav) {
    if (nav.getAttribute("data-skunkworks-top-menu-wired") === REVISION) return;
    nav.setAttribute("data-skunkworks-top-menu-wired", REVISION);
    nav.addEventListener("click", function (event) {
      var button = event.target && event.target.closest(".swa-global-nav__top-menu-button");
      if (!button || !nav.contains(button)) return;
      var item = button.closest(".swa-global-nav__top-menu-item");
      var opening = !item.classList.contains("swa-primary-open");
      closePrimaryMenus(nav, item);
      item.classList.toggle("swa-primary-open", opening);
      button.setAttribute("aria-expanded", opening ? "true" : "false");
    });
    nav.addEventListener("keydown", function (event) {
      var button = event.target && event.target.closest(".swa-global-nav__top-menu-button");
      if (button && (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        var item = button.closest(".swa-global-nav__top-menu-item");
        closePrimaryMenus(nav, item);
        item.classList.add("swa-primary-open");
        button.setAttribute("aria-expanded", "true");
        var firstLink = item.querySelector(".swa-global-nav__top-menu-option");
        if (firstLink) firstLink.focus();
        return;
      }
      if (event.key === "Escape") {
        var openItem = nav.querySelector(".swa-global-nav__top-menu-item.swa-primary-open");
        if (!openItem) return;
        event.preventDefault();
        var openButton = openItem.querySelector(".swa-global-nav__top-menu-button");
        closePrimaryMenus(nav);
        if (openButton) openButton.focus();
      }
    });
    document.addEventListener("click", function (event) { if (!nav.contains(event.target)) closePrimaryMenus(nav); });
  }

  function syncDrawerMenu() {
    var drawer = document.querySelector(".swa-global-nav__links");
    if (!drawer) return false;
    if (drawer.getAttribute("data-skunkworks-menu-groups") === REVISION) return true;
    while (drawer.firstChild) drawer.removeChild(drawer.firstChild);
    drawer.classList.add("swa-global-nav__links--grouped");
    drawer.setAttribute("data-skunkworks-menu-groups", REVISION);
    drawer.setAttribute("aria-label", "Skunkworks Academy navigation");
    var heading = document.createElement("p");
    heading.className = "swa-global-nav__drawer-heading";
    heading.textContent = "Explore Skunkworks Academy";
    drawer.appendChild(heading);
    GLOBAL_NAV_GROUPS.forEach(function (group) {
      var section = document.createElement("section");
      var title = document.createElement("h3");
      var description = document.createElement("p");
      var options = document.createElement("div");
      section.className = "swa-global-nav__drawer-group";
      title.className = "swa-global-nav__drawer-group-title";
      description.className = "swa-global-nav__drawer-group-description";
      options.className = "swa-global-nav__drawer-options";
      title.textContent = group.label;
      description.textContent = group.description;
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
    return true;
  }

  function ensureTopMenu() {
    if (!document.body || document.body.getAttribute("data-sk-global-nav") === "off") return false;
    var header = document.querySelector(".swa-global-nav");
    if (!header) return false;
    var existing = header.querySelector(".swa-global-nav__top-menu");
    if (existing) {
      header.classList.add("swa-has-top-menu");
      document.body.classList.add("swa-has-top-menu");
      syncDrawerMenu();
      syncBrandText();
      return true;
    }
    var nav = document.createElement("nav");
    nav.className = "swa-global-nav__top-menu";
    nav.setAttribute("aria-label", "Primary Academy navigation");
    nav.setAttribute("data-skunkworks-top-menu", "canonical-v11");
    GLOBAL_NAV_GROUPS.forEach(function (group) {
      var item = document.createElement("div");
      var button = document.createElement("button");
      var panel = document.createElement("section");
      var title = document.createElement("h2");
      var description = document.createElement("p");
      var options = document.createElement("div");
      var panelId = "swa-global-nav-group-" + group.label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      item.className = "swa-global-nav__top-menu-item";
      button.className = "swa-global-nav__top-menu-button";
      button.type = "button";
      button.textContent = group.label;
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", panelId);
      if (groupIsCurrent(group)) button.setAttribute("aria-current", "page");
      panel.className = "swa-global-nav__top-menu-panel";
      panel.id = panelId;
      panel.setAttribute("aria-label", group.label + " options");
      title.className = "swa-global-nav__top-menu-title";
      title.textContent = group.label;
      description.className = "swa-global-nav__top-menu-description";
      description.textContent = group.description;
      options.className = "swa-global-nav__top-menu-options";
      group.items.forEach(function (option) { options.appendChild(createOptionLink(option, "swa-global-nav__top-menu-option")); });
      panel.appendChild(title);
      panel.appendChild(description);
      panel.appendChild(options);
      item.appendChild(button);
      item.appendChild(panel);
      nav.appendChild(item);
    });
    header.appendChild(nav);
    header.classList.add("swa-has-top-menu");
    document.body.classList.add("swa-has-top-menu");
    wireTopMenu(nav);
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
    removeKnownPublicChrome();
    ensureTopMenu();
    syncDrawerMenu();
    syncBrandText();
  }

  function refreshRouteState() {
    var nav = document.querySelector(".swa-global-nav__top-menu");
    if (nav && nav.parentNode) nav.parentNode.removeChild(nav);
    var drawer = document.querySelector(".swa-global-nav__links");
    if (drawer) drawer.removeAttribute("data-skunkworks-menu-groups");
    ensureTopMenu();
    syncDrawerMenu();
    syncBrandText();
  }

  function startChromeGuard() {
    refreshCanonicalChrome();
    if (!document.body || typeof MutationObserver === "undefined") return;
    var observer = new MutationObserver(function () { refreshCanonicalChrome(); });
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("popstate", refreshRouteState);
    window.addEventListener("hashchange", syncBrandText);
    window.addEventListener("pagehide", function () { observer.disconnect(); }, { once: true });
  }

  ensureDesignSystem();
  ensureTopMenuStyles();
  ensureRuntime("skunkworks-ui.js", "data-skunkworks-ui", "canonical");
  ensureRuntime("skunkworks-footer.js", "data-skunkworks-global-footer", "canonical");
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", startChromeGuard, { once: true });
  else startChromeGuard();
})();
