(() => {
  const endpoint = document.documentElement.dataset.assessmentApi || "https://api.skunkworksacademy.com/v1/assessment/chat";
  const assessment = document.documentElement.dataset.assessment;
  const app = document.querySelector("[data-assessment-chat]");
  if (!assessment || !app) return;

  const messages = app.querySelector("[data-assessment-messages]");
  const form = app.querySelector("[data-assessment-composer]");
  const input = app.querySelector("textarea");
  const send = app.querySelector("button[type=submit]");
  const error = app.querySelector("[data-assessment-error]");
  const restart = document.querySelector("[data-assessment-restart]");
  const storageKey = `skunkworks-assessment:${assessment}:v1`;
  let transcript = [];
  let busy = false;

  const save = () => sessionStorage.setItem(storageKey, JSON.stringify(transcript));
  const scrollToLatest = () => { messages.scrollTop = messages.scrollHeight; };

  function message(role, text, persist = true) {
    const element = document.createElement("div");
    element.className = `assessment-message assessment-message--${role}`;
    element.textContent = text;
    messages.append(element);
    scrollToLatest();
    if (persist && (role === "assistant" || role === "user")) {
      transcript.push({ role, text });
      save();
    }
  }

  function setBusy(value) {
    busy = value;
    send.disabled = value;
    input.disabled = value;
    send.textContent = value ? "Thinking…" : "Send";
  }

  async function ask(messageText, start = false) {
    setBusy(true);
    error.hidden = true;
    const status = document.createElement("div");
    status.className = "assessment-message assessment-message--status";
    status.textContent = "Your assessment guide is preparing the next step…";
    messages.append(status);
    scrollToLatest();

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessment, message: messageText, transcript, start })
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok || typeof body.reply !== "string") throw new Error(body.error || "The assessment service is unavailable.");
      status.remove();
      if (!start) {
        transcript.push({ role: "user", text: messageText });
        save();
      }
      message("assistant", body.reply);
    } catch (caught) {
      status.remove();
      error.hidden = false;
      error.textContent = `${caught.message} Please try again shortly, or use the full Microsoft Form.`;
    } finally {
      setBusy(false);
      input.focus();
    }
  }

  function load() {
    try { transcript = JSON.parse(sessionStorage.getItem(storageKey) || "[]"); } catch { transcript = []; }
    if (transcript.length) {
      transcript.forEach(({ role, text }) => message(role, text, false));
      return;
    }
    ask("", true);
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = input.value.trim();
    if (!value || busy) return;
    message("user", value, false);
    input.value = "";
    ask(value);
  });

  restart?.addEventListener("click", () => {
    sessionStorage.removeItem(storageKey);
    transcript = [];
    messages.replaceChildren();
    error.hidden = true;
    ask("", true);
  });

  load();
})();
