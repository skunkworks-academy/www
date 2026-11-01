/* Independent optional enhancement for the Academy Learning Design page. */
(function () {
  "use strict";
  function init() {
    var button = document.getElementById("ald-copy-prompt");
    var source = document.getElementById("ald-prompt-text");
    var status = document.getElementById("ald-copy-status");
    if (!button || !source || !status) return;
    button.addEventListener("click", async function () {
      var promptText = source.textContent.trim();
      if (!promptText) {
        status.textContent = "No prompt text is available.";
        return;
      }
      if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") {
        status.textContent = "Clipboard access is unavailable. Select the example prompt and copy it manually.";
        return;
      }
      try {
        await navigator.clipboard.writeText(promptText);
        status.textContent = "Example prompt copied. Paste it into ChatGPT to begin.";
      } catch (_) {
        status.textContent = "Copy was blocked by your browser. Select and copy the example prompt manually.";
      }
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, {once:true});
  } else {
    init();
  }
})();
