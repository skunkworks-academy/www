(function () {
  const sitemap = document.querySelector('meta[name="skunkworks:repo-sitemap"]')?.content || "https://skunkworksacademy.com/repositories/";
  const repo = document.querySelector('meta[name="skunkworks:repo"]')?.content || "";

  if (document.querySelector(".skw-global-nav")) return;

  const nav = document.createElement("nav");
  nav.className = "skw-global-nav";
  nav.setAttribute("aria-label", "Skunkworks Academy global navigation");

  nav.innerHTML = `
    <div class="skw-global-nav-inner">
      <a class="skw-global-brand" href="https://skunkworksacademy.com/">
        <span>Skunkworks Academy</span>
        ${repo ? `<small>${repo}</small>` : ""}
      </a>
      <div class="skw-global-links">
        <a href="https://skunkworksacademy.com/">Home</a>
        <a href="https://portal.skunkworksacademy.com/">Portal</a>
        <a href="https://labs.skunkworksacademy.com/">Labs</a>
        <a href="https://jobs.skunkworksacademy.com/">Jobs</a>
        <a href="https://ibm.skunkworksacademy.com/">IBM</a>
        <a class="primary" href="${sitemap}">Repo Sitemap</a>
        <a href="https://github.com/skunkworks-academy">GitHub Org</a>
      </div>
    </div>
  `;

  document.body.prepend(nav);
})();
