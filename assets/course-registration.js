/* Skunkworks Academy course registration interactions. */
(function () {
  "use strict";

  function byId(id) { return document.getElementById(id); }

  function setYear() {
    var year = byId("year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  function initRegistrationForm() {
    var form = byId("courseRegistrationForm");
    if (!form) return;

    var errorBox = byId("formError");
    var timestamp = byId("registrationTimestamp");
    var email = byId("email");
    var phone = byId("phone");

    function showError(message, control) {
      if (errorBox) {
        errorBox.textContent = message;
        errorBox.classList.add("is-visible");
      }
      if (control && typeof control.focus === "function") control.focus();
    }

    function clearError() {
      if (!errorBox) return;
      errorBox.textContent = "";
      errorBox.classList.remove("is-visible");
    }

    form.addEventListener("input", clearError);

    form.addEventListener("submit", function (event) {
      clearError();
      if (timestamp) timestamp.value = new Date().toISOString();

      if (email && !email.validity.valid) {
        event.preventDefault();
        showError("Please enter a valid email address.", email);
        return;
      }

      if (phone && phone.value.replace(/\D/g, "").length < 8) {
        event.preventDefault();
        showError("Please enter a valid phone or WhatsApp number with at least eight digits.", phone);
        return;
      }

      if (!form.checkValidity()) {
        event.preventDefault();
        showError("Please complete all required fields before submitting.", form.querySelector(":invalid"));
      }
    });

    try {
      var params = new URLSearchParams(window.location.search);
      var requestedCourse = params.get("course");
      var select = byId("course");
      if (requestedCourse && select) {
        Array.prototype.slice.call(select.options).some(function (option) {
          if (option.value === requestedCourse || option.text === requestedCourse) {
            select.value = option.value || option.text;
            return true;
          }
          return false;
        });
      }
    } catch (_error) {
      /* Query-string prefill is optional. */
    }
  }

  function initConfirmation() {
    var continueCourse = byId("continueCourse");
    if (!continueCourse) return;

    var unlockStatus = byId("unlockStatus");
    var redirectMessage = byId("redirectMessage");
    var stayButton = byId("stayHere");
    var COURSE_LABELS = {
      "SKW-OWASP10-2025": "OWASP Top 10:2025 Web Application Security"
    };
    var COURSE_DEFAULT_RETURN = {
      "SKW-OWASP10-2025": "/self-paced/security/skw-owasp-top10-2025/"
    };

    var params = new URLSearchParams(window.location.search);
    var course = params.get("course") || "";
    var unlock = params.get("unlock") === "1";
    var fallbackReturn = COURSE_DEFAULT_RETURN[course] || "/self-paced/";
    var requestedReturn = params.get("return") || fallbackReturn;

    function safeReturnUrl(value) {
      try {
        var parsed = new URL(value, window.location.origin);
        if (parsed.origin !== window.location.origin) return fallbackReturn;
        return parsed.pathname + parsed.search + parsed.hash;
      } catch (_error) {
        return fallbackReturn;
      }
    }

    var target = safeReturnUrl(requestedReturn);
    continueCourse.href = target;

    if (unlock && course) {
      try {
        localStorage.setItem("skwacademy.entitlement." + course, "granted");
        localStorage.setItem(
          "skwacademy.registration." + course + ".confirmed",
          JSON.stringify({ course: course, returnUrl: target, confirmedAt: new Date().toISOString() })
        );
      } catch (_error) {
        /* Registration confirmation remains useful when storage is blocked. */
      }
      if (unlockStatus) unlockStatus.textContent = (COURSE_LABELS[course] || "Your selected course") + " is now unlocked in this browser.";
    } else if (unlockStatus) {
      unlockStatus.textContent = "Your registration has been received. Course access will be confirmed by the training team.";
    }

    if (!redirectMessage || window.matchMedia("(prefers-reduced-motion: reduce)").matches || params.get("redirect") === "0") {
      if (redirectMessage) redirectMessage.textContent = "Use Continue to course when you are ready.";
      return;
    }

    var seconds = 6;
    var cancelled = false;
    function renderCountdown() {
      redirectMessage.textContent = "Returning you to your course in " + seconds + " seconds.";
    }
    renderCountdown();

    var timer = window.setInterval(function () {
      if (cancelled) {
        window.clearInterval(timer);
        return;
      }
      seconds -= 1;
      renderCountdown();
      if (seconds <= 0) {
        window.clearInterval(timer);
        window.location.assign(target);
      }
    }, 1000);

    if (stayButton) {
      stayButton.addEventListener("click", function () {
        cancelled = true;
        window.clearInterval(timer);
        redirectMessage.textContent = "Automatic redirect cancelled. Continue when you are ready.";
        stayButton.hidden = true;
      });
    }
  }

  function init() {
    setYear();
    initRegistrationForm();
    initConfirmation();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
