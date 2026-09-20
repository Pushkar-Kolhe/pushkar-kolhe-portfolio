/* ==========================================================================
   PORTFOLIO SCRIPT
   --------------------------------------------------------------------------
   Plain vanilla JavaScript - no frameworks or libraries. Each feature lives
   in its own small function so it's easy to read, test and explain on its
   own. Everything is wired up from init() at the bottom of the file.

   Table of contents:
     1. Mobile navigation menu
     2. Active nav link on scroll
     3. Scroll reveal animations
     4. Dark / light theme toggle
     5. Current year in footer
     6. Contact form validation
     7. Back-to-top button
     8. Init
   ========================================================================== */

(function () {
  "use strict";

  /* ------------------------------------------------------------------------
     1. MOBILE NAVIGATION MENU
     Toggles the collapsible nav on small screens and keeps the button's
     aria-expanded attribute in sync for screen-reader users. The menu also
     closes itself whenever a link inside it is clicked, so tapping "About"
     both scrolls to the section AND tidies the menu away.
     ------------------------------------------------------------------------ */
  function initMobileNav() {
    var toggleBtn = document.getElementById("nav-toggle");
    var navLinks = document.getElementById("nav-links");

    if (!toggleBtn || !navLinks) return;

    function closeMenu() {
      navLinks.classList.remove("is-open");
      toggleBtn.setAttribute("aria-expanded", "false");
      toggleBtn.setAttribute("aria-label", "Open menu");
    }

    function openMenu() {
      navLinks.classList.add("is-open");
      toggleBtn.setAttribute("aria-expanded", "true");
      toggleBtn.setAttribute("aria-label", "Close menu");
    }

    toggleBtn.addEventListener("click", function () {
      var isOpen = navLinks.classList.contains("is-open");
      if (isOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    // Close the menu after choosing a link (mobile only - harmless on desktop).
    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeMenu);
    });
  }

  /* ------------------------------------------------------------------------
     2. ACTIVE NAV LINK ON SCROLL
     Watches every <section> that has a matching nav link and highlights
     that link while its section is the one in view. Smooth scrolling itself
     is handled by CSS (html { scroll-behavior: smooth }) - this just tracks
     which section is currently on screen.
     ------------------------------------------------------------------------ */
  function initActiveNavOnScroll() {
    var navLinks = document.querySelectorAll(".nav-links a[href^='#']");
    if (!navLinks.length) return;

    var sections = [];
    navLinks.forEach(function (link) {
      var id = link.getAttribute("href").slice(1);
      var section = document.getElementById(id);
      if (section) sections.push(section);
    });

    if (!sections.length) return;

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = document.querySelector(
            '.nav-links a[href="#' + entry.target.id + '"]'
          );
          if (!link) return;

          if (entry.isIntersecting) {
            navLinks.forEach(function (l) { l.classList.remove("is-active"); });
            link.classList.add("is-active");
          }
        });
      },
      {
        // Counts a section as "current" once it crosses roughly the
        // middle of the viewport, so the nav updates while it's actually
        // being read rather than the instant it appears at the bottom.
        rootMargin: "-40% 0px -50% 0px",
        threshold: 0,
      }
    );

    sections.forEach(function (section) { observer.observe(section); });
  }

  /* ------------------------------------------------------------------------
     3. SCROLL REVEAL ANIMATIONS
     Any element with the .reveal class starts hidden (see css/style.css)
     and fades/slides into place the first time it enters the viewport.
     Once revealed, an element is left alone - we don't hide it again on
     scroll-up, which would be distracting.
     ------------------------------------------------------------------------ */
  function initScrollReveal() {
    var revealEls = document.querySelectorAll(".reveal");
    if (!revealEls.length) return;

    // If the browser doesn't support IntersectionObserver, just show
    // everything immediately rather than leaving content invisible.
    if (!("IntersectionObserver" in window)) {
      revealEls.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    revealEls.forEach(function (el) { observer.observe(el); });
  }

  /* ------------------------------------------------------------------------
     4. DARK / LIGHT THEME TOGGLE
     The chosen theme is stored on <html data-theme="..."> (which is what
     css/style.css reads) and remembered in localStorage so it persists
     between visits. If the visitor has never chosen one, we fall back to
     their operating system's preference.
     ------------------------------------------------------------------------ */
  function initThemeToggle() {
    var toggleBtn = document.getElementById("theme-toggle");
    var root = document.documentElement;
    var STORAGE_KEY = "portfolio-theme";

    function applyTheme(theme) {
      root.setAttribute("data-theme", theme);
      if (toggleBtn) {
        toggleBtn.setAttribute(
          "aria-label",
          theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
        );
      }
    }

    var stored = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      // Some browsers block localStorage (e.g. private mode) - that's fine,
      // the toggle still works for the current visit, it just won't persist.
    }

    var prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(stored || (prefersDark ? "dark" : "light"));

    if (!toggleBtn) return;

    toggleBtn.addEventListener("click", function () {
      var current = root.getAttribute("data-theme");
      var next = current === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        /* ignore - see note above */
      }
    });
  }

  /* ------------------------------------------------------------------------
     5. CURRENT YEAR IN FOOTER
     Keeps the copyright line correct without ever having to edit it by hand.
     ------------------------------------------------------------------------ */
  function initFooterYear() {
    var yearEl = document.getElementById("current-year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /* ------------------------------------------------------------------------
     6. CONTACT FORM VALIDATION
     There's no backend to send this form to, so on a valid submission we
     open the visitor's email app with a mailto: link pre-filled with what
     they typed. Update MAILTO_ADDRESS below once you have a real inbox to
     use, and see the note in the form itself about connecting a form
     service instead if you'd rather receive messages directly on the site.
     ------------------------------------------------------------------------ */
  function initContactForm() {
    var form = document.getElementById("contact-form");
    if (!form) return;

    var MAILTO_ADDRESS = "your.email@example.com";

    var nameField = document.getElementById("name");
    var emailField = document.getElementById("email");
    var messageField = document.getElementById("message");
    var statusEl = document.getElementById("form-status");

    function setFieldError(field, message) {
      var errorEl = document.getElementById(field.id + "-error");
      if (errorEl) errorEl.textContent = message;
    }

    function isValidEmail(value) {
      // A simple, readable check - not a full RFC 5322 validator, just
      // enough to catch obviously missing "@" or domain.
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validate() {
      var isValid = true;

      if (!nameField.value.trim()) {
        setFieldError(nameField, "Please enter your name.");
        isValid = false;
      } else {
        setFieldError(nameField, "");
      }

      if (!emailField.value.trim()) {
        setFieldError(emailField, "Please enter your email.");
        isValid = false;
      } else if (!isValidEmail(emailField.value.trim())) {
        setFieldError(emailField, "Please enter a valid email address.");
        isValid = false;
      } else {
        setFieldError(emailField, "");
      }

      if (!messageField.value.trim()) {
        setFieldError(messageField, "Please enter a message.");
        isValid = false;
      } else {
        setFieldError(messageField, "");
      }

      return isValid;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!validate()) {
        statusEl.textContent = "Please fix the highlighted fields.";
        statusEl.setAttribute("data-state", "error");
        return;
      }

      var subject = "Portfolio contact from " + nameField.value.trim();
      var body =
        "Name: " + nameField.value.trim() +
        "\nEmail: " + emailField.value.trim() +
        "\n\n" + messageField.value.trim();

      var mailtoLink =
        "mailto:" + MAILTO_ADDRESS +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);

      window.location.href = mailtoLink;

      statusEl.textContent = "Opening your email app to send this message...";
      statusEl.setAttribute("data-state", "success");
    });
  }

  /* ------------------------------------------------------------------------
     7. BACK-TO-TOP BUTTON
     Hidden until the visitor scrolls down a bit, then fades in. Clicking it
     scrolls smoothly back to the top of the page.
     ------------------------------------------------------------------------ */
  function initBackToTop() {
    var btn = document.getElementById("back-to-top");
    if (!btn) return;

    var SHOW_AFTER_PX = 480;

    function toggleVisibility() {
      if (window.scrollY > SHOW_AFTER_PX) {
        btn.classList.add("is-visible");
      } else {
        btn.classList.remove("is-visible");
      }
    }

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    toggleVisibility(); // set the correct state if the page loads already scrolled

    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ------------------------------------------------------------------------
     8. INIT
     ------------------------------------------------------------------------ */
  function init() {
    initMobileNav();
    initActiveNavOnScroll();
    initScrollReveal();
    initThemeToggle();
    initFooterYear();
    initContactForm();
    initBackToTop();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
