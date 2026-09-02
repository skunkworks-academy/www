(function () {
  const authConfig = {
    clientId: "0e931bbb-3758-40fc-9813-2a19b84f8b75",
    authority: "https://login.microsoftonline.com/common",
    graphEndpoint: "https://graph.microsoft.com/v1.0/me",
    scopes: ["openid", "profile", "email", "User.Read"]
  };

  const selectors = {
    loginButtons: "[data-login-button]",
    logoutButton: "[data-logout-button]",
    refreshButton: "[data-refresh-profile]",
    status: "[data-auth-status]",
    message: "[data-auth-message]",
    profileCard: "[data-profile-card]",
    profileAvatar: "[data-profile-avatar]",
    profileName: "[data-profile-name]",
    profileEmail: "[data-profile-email]",
    profileDetails: "[data-profile-details]",
    profileType: "[data-profile-type]",
    profileTenant: "[data-profile-tenant]",
    profileJob: "[data-profile-job]",
    profileOrganisation: "[data-profile-organisation]",
    warning: "[data-setup-warning]",
    workspace: "[data-learner-workspace]",
    workspaceIdentity: "[data-workspace-identity]",
    workspaceStatus: "[data-workspace-status]"
  };

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => Array.from(document.querySelectorAll(selector));

  const state = {
    msalInstance: null,
    account: null
  };

  function setText(selector, value) {
    const element = $(selector);
    if (element) element.textContent = value;
  }

  function setHidden(selector, hidden) {
    const element = $(selector);
    if (element) element.hidden = hidden;
  }

  function setBusy(isBusy) {
    $$(selectors.loginButtons).forEach((button) => {
      button.disabled = isBusy;
      button.textContent = isBusy ? "Connecting..." : "Sign in with Microsoft";
    });
    const refreshButton = $(selectors.refreshButton);
    if (refreshButton) refreshButton.disabled = isBusy;
  }

  function initialsFor(name, fallback) {
    const source = (name || fallback || "SA").trim();
    const parts = source.split(/\s+/).filter(Boolean);
    return parts.slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  }

  function accountType(account, graphProfile) {
    const tenantId = account?.tenantId || account?.idTokenClaims?.tid;
    const username = account?.username || graphProfile?.userPrincipalName || "";
    if (tenantId === "9188040d-6c67-4c5b-b112-36a304b66dad") return "Personal Microsoft account";
    if (username.includes("#EXT#")) return "Guest account";
    return "Work or school account";
  }

  function readStoredProfile() {
    try {
      return JSON.parse(sessionStorage.getItem("skwLearnerProfile") || "null");
    } catch {
      return null;
    }
  }

  function storeProfile(profile) {
    sessionStorage.setItem("skwLearnerProfile", JSON.stringify(profile));
  }

  function clearProfile() {
    sessionStorage.removeItem("skwLearnerProfile");
  }

  function profileFrom(account, graphProfile) {
    const claims = account?.idTokenClaims || {};
    const displayName = graphProfile?.displayName || account?.name || claims.name || "Signed-in learner";
    const email =
      graphProfile?.mail ||
      graphProfile?.userPrincipalName ||
      account?.username ||
      claims.preferred_username ||
      "Microsoft account connected";

    return {
      displayName,
      email,
      givenName: graphProfile?.givenName || claims.given_name || "",
      surname: graphProfile?.surname || claims.family_name || "",
      jobTitle: graphProfile?.jobTitle || "",
      organisation: graphProfile?.companyName || "",
      accountType: accountType(account, graphProfile),
      tenantId: account?.tenantId || claims.tid || "common",
      localAccountId: account?.localAccountId || "",
      homeAccountId: account?.homeAccountId || "",
      updatedAt: new Date().toISOString()
    };
  }

  function renderSignedOut(message) {
    setText(selectors.status, "Signed out");
    setText(selectors.message, message || "Sign in with a personal, school or work Microsoft account to create your approved learner profile for this experience.");
    setHidden(selectors.profileCard, true);
    setHidden(selectors.profileDetails, true);
    setHidden(selectors.refreshButton, true);
    setHidden(selectors.logoutButton, true);
    setHidden(selectors.workspace, true);
    $$(selectors.loginButtons).forEach((button) => {
      button.hidden = false;
      button.disabled = false;
      button.textContent = "Sign in with Microsoft";
    });
  }

  function renderProfile(profile) {
    setText(selectors.status, "Connected");
    setText(selectors.message, "Your Microsoft account details have initialised the learner profile for this portal experience.");
    setText(selectors.profileAvatar, initialsFor(profile.displayName, profile.email));
    setText(selectors.profileName, profile.displayName);
    setText(selectors.profileEmail, profile.email);
    setText(selectors.profileType, profile.accountType);
    setText(selectors.profileTenant, profile.tenantId);
    setText(selectors.profileJob, profile.jobTitle || "Not provided by Microsoft profile");
    setText(selectors.profileOrganisation, profile.organisation || "Not provided by Microsoft profile");
    setText(selectors.workspaceIdentity, `${profile.displayName} is signed in as ${profile.email}.`);
    setText(selectors.workspaceStatus, `Profile refreshed ${new Date(profile.updatedAt).toLocaleString()}.`);
    setHidden(selectors.profileCard, false);
    setHidden(selectors.profileDetails, false);
    setHidden(selectors.refreshButton, false);
    setHidden(selectors.logoutButton, false);
    setHidden(selectors.workspace, false);
    $$(selectors.loginButtons).forEach((button) => {
      button.hidden = true;
      button.disabled = false;
    });
  }

  function renderWarning(error) {
    const warning = $(selectors.warning);
    if (!warning) return;
    warning.hidden = false;
    const message = warning.querySelector("span");
    if (message && error) {
      message.textContent = error;
    }
  }

  async function fetchGraphProfile(accessToken) {
    const response = await fetch(authConfig.graphEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Microsoft Graph profile request failed (${response.status}).`);
    }

    return response.json();
  }

  async function acquireProfile(account) {
    const tokenResponse = await state.msalInstance.acquireTokenSilent({
      account,
      scopes: ["User.Read"]
    });
    const graphProfile = await fetchGraphProfile(tokenResponse.accessToken);
    const profile = profileFrom(account, graphProfile);
    storeProfile(profile);
    renderProfile(profile);
  }

  async function signIn() {
    if (!state.msalInstance) return;

    setBusy(true);
    try {
      const response = await state.msalInstance.loginPopup({
        scopes: authConfig.scopes,
        prompt: "select_account"
      });
      state.account = response.account;
      state.msalInstance.setActiveAccount(response.account);
      await acquireProfile(response.account);
    } catch (error) {
      const message = error?.errorMessage || error?.message || "Microsoft sign-in could not be completed.";
      renderSignedOut("Microsoft sign-in was not completed. You can try again or contact the portal administrator.");
      renderWarning(message);
    } finally {
      setBusy(false);
    }
  }

  async function refreshProfile() {
    const account = state.msalInstance?.getActiveAccount() || state.account;
    if (!account) {
      renderSignedOut();
      return;
    }

    setBusy(true);
    try {
      await acquireProfile(account);
    } catch (error) {
      const message = error?.errorMessage || error?.message || "The learner profile could not be refreshed.";
      renderWarning(message);
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    const account = state.msalInstance?.getActiveAccount() || state.account;
    clearProfile();
    state.account = null;
    renderSignedOut("You have signed out of this portal experience.");
    if (account) {
      await state.msalInstance.logoutPopup({ account });
    }
  }

  async function initialise() {
    if (!window.msal?.PublicClientApplication) {
      renderSignedOut("Microsoft sign-in is temporarily unavailable because the identity library did not load.");
      renderWarning("The MSAL browser library could not be loaded. Check the network path to cdn.jsdelivr.net.");
      return;
    }

    const redirectUri = window.location.origin + window.location.pathname;
    state.msalInstance = new window.msal.PublicClientApplication({
      auth: {
        clientId: authConfig.clientId,
        authority: authConfig.authority,
        redirectUri,
        postLogoutRedirectUri: redirectUri
      },
      cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false
      }
    });

    await state.msalInstance.initialize();
    const accounts = state.msalInstance.getAllAccounts();
    state.account = accounts[0] || null;
    if (state.account) {
      state.msalInstance.setActiveAccount(state.account);
      const storedProfile = readStoredProfile();
      if (storedProfile) renderProfile(storedProfile);
      await refreshProfile();
    } else {
      renderSignedOut();
    }
  }

  window.addEventListener("DOMContentLoaded", () => {
    $$(selectors.loginButtons).forEach((button) => button.addEventListener("click", signIn));
    $(selectors.logoutButton)?.addEventListener("click", signOut);
    $(selectors.refreshButton)?.addEventListener("click", refreshProfile);
    initialise().catch((error) => {
      renderSignedOut("Microsoft sign-in could not be initialised.");
      renderWarning(error?.message || "Unknown Microsoft identity initialisation error.");
    });
  });
})();
