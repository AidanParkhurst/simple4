const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const form = document.getElementById("interestForm");
const emailInput = document.getElementById("emailInput");
const message = document.getElementById("formMessage");
const mobileNavMedia = window.matchMedia("(max-width: 720px)");

function syncNavToggle(isOpen) {
  if (!nav || !navToggle) {
    return;
  }

  nav.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  document.body.classList.toggle("nav-open", isOpen && mobileNavMedia.matches);
}

function closeNav() {
  syncNavToggle(false);
}

function toggleNav() {
  if (!nav) {
    return;
  }

  syncNavToggle(!nav.classList.contains("is-open"));
}

function onScroll() {
  if (!nav) {
    return;
  }

  const scrollY = window.scrollY;
  const mobileScrollProgress = Math.min(scrollY / 96, 1);

  nav.classList.toggle("scrolled", scrollY > 32);
  nav.style.setProperty("--mobile-nav-opacity", String(mobileScrollProgress));
  nav.style.setProperty("--mobile-nav-shadow-opacity", String(0.24 * mobileScrollProgress));
}

function setMessage(text, type) {
  message.textContent = text;
  message.classList.remove("is-error", "is-success");
  if (type) {
    message.classList.add(type === "error" ? "is-error" : "is-success");
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

if (navToggle && navLinks) {
  navToggle.addEventListener("click", toggleNav);

  mobileNavMedia.addEventListener("change", (event) => {
    if (!event.matches) {
      closeNav();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNav();
    }
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") {
      return;
    }

    const target = document.querySelector(id);
    if (!target) {
      return;
    }

    event.preventDefault();
    if (navLinks?.contains(link)) {
      closeNav();
    }
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

if (form && emailInput && message) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    setMessage("", "");

    const email = emailInput.value.trim();

    if (!email) {
      setMessage("Please enter your work email address.", "error");
      emailInput.focus();
      return;
    }

    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email address.", "error");
      emailInput.focus();
      return;
    }

    form.reset();
    setMessage("Thanks. Level4 will follow up to explore your fundraising idea.", "success");
  });
}
