
(function () {
  "use strict";
  var root = document.getElementById("mapa-root");
  if (!root) return;

  /* Policy links open their section. */
  function openTarget(id) {
    if (!id) return;
    var el = document.getElementById(id);
    if (el && el.tagName === "DETAILS") el.open = true;
  }
  document.addEventListener("click", function (e) {
    if (!e.target.closest) return;
    var a = e.target.closest('a[href^="#"]');
    if (a) openTarget(a.getAttribute("href").slice(1));
  });
  window.addEventListener("hashchange", function () { openTarget(location.hash.slice(1)); });
  openTarget(location.hash.slice(1));

  /* Install the app. The hosted site carries a web app manifest and a service worker, so browsers
     that support it install MAP-A Care in one tap; everywhere else the steps for the device are shown. */
  var installStatus = document.getElementById("install-status");
  var installPrompt = null;
  var ua = navigator.userAgent || "";
  var isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  var myPlat = isIOS ? "ios" : /Android/i.test(ua) ? "android" : "desktop";
  var embedded = (function () { try { return window.self !== window.top; } catch (err) { return true; } })();
  var hosted = !!document.querySelector('link[rel="manifest"]');
  var reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var platTabs = Array.prototype.slice.call(root.querySelectorAll('.plat-tabs [role="tab"]'));

  function sayInstall(msg) { if (installStatus) installStatus.textContent = msg; }
  function runningInstalled() {
    if (navigator.standalone === true) return true;
    if (!window.matchMedia) return false;
    return ["standalone", "minimal-ui", "window-controls-overlay"].some(function (m) {
      return window.matchMedia("(display-mode: " + m + ")").matches;
    });
  }
  function markInstalled(msg) {
    Array.prototype.forEach.call(root.querySelectorAll("[data-install]"), function (el) { el.hidden = true; });
    sayInstall(msg);
  }
  function manualHint() {
    if (embedded) return "This copy of the page is shown inside another site, which blocks installing. Open the MAP-A Care website in Chrome, Edge or Safari to install it.";
    if (isIOS) return "On iPhone and iPad, open the app in Safari, then add it from the Share menu. Follow these steps.";
    return "Install MAP-A Care from your browser's menu with these steps. If it is already installed, open it from your apps.";
  }
  function selectPlat(plat, focus) {
    platTabs.forEach(function (t) {
      var on = t.getAttribute("data-plat") === plat;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
      var panel = document.getElementById(t.getAttribute("aria-controls"));
      if (panel) panel.hidden = !on;
      if (on && focus) t.focus();
    });
  }
  platTabs.forEach(function (t, i) {
    t.addEventListener("click", function () { selectPlat(t.getAttribute("data-plat")); });
    t.addEventListener("keydown", function (e) {
      var j = e.key === "ArrowRight" ? (i + 1) % platTabs.length
        : e.key === "ArrowLeft" ? (i - 1 + platTabs.length) % platTabs.length
        : e.key === "Home" ? 0 : e.key === "End" ? platTabs.length - 1 : -1;
      if (j < 0) return;
      e.preventDefault();
      selectPlat(platTabs[j].getAttribute("data-plat"), true);
    });
  });
  root.addEventListener("click", function (e) {
    if (!e.target.closest) return;
    var trigger = e.target.closest("[data-install]");
    if (!trigger) return;
    if (installPrompt) {
      e.preventDefault();
      var p = installPrompt;
      installPrompt = null;
      p.prompt();
      p.userChoice.then(function (choice) {
        sayInstall(choice && choice.outcome === "accepted"
          ? "Installing MAP-A Care. It will appear on your home screen or in your app list."
          : "Install cancelled. You can install MAP-A Care from this page at any time.");
      }, function () {});
      return;
    }
    sayInstall(manualHint());
    selectPlat(myPlat);
    var box = root.querySelector(".how-install");
    if (trigger.tagName === "BUTTON" && box && box.scrollIntoView) box.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
  });
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    installPrompt = e;
  });
  window.addEventListener("appinstalled", function () {
    installPrompt = null;
    markInstalled("MAP-A Care is installed. Open it from your home screen or app list.");
  });
  selectPlat(myPlat);
  if (!hosted) Array.prototype.forEach.call(root.querySelectorAll("[data-hosted-only]"), function (el) { el.hidden = true; });
  if (runningInstalled()) markInstalled("MAP-A Care is installed on this device. You are using the app.");
  else if (embedded) sayInstall(manualHint());
  if (hosted && !embedded && "serviceWorker" in navigator && window.isSecureContext) {
    var registerWorker = function () { navigator.serviceWorker.register("sw.js").catch(function () {}); };
    if (document.readyState === "complete") registerWorker();
    else window.addEventListener("load", registerWorker);
  }
})();
