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

const lightbox = document.getElementById("gameLightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const lightboxCounter = document.getElementById("lightboxCounter");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
const browseGamesBtn = document.getElementById("browseGamesBtn");
const gameShowcaseImage = document.getElementById("browseGamesImage");

const gameScreens = [
  { src: "assets/screens/solitaire-x.jpg", alt: "Solitaire X gameplay screenshot", title: "Solitaire X" },
  { src: "assets/screens/21.jpg", alt: "21 gameplay screenshot", title: "21" },
  { src: "assets/screens/yacht.jpg", alt: "Yacht gameplay screenshot", title: "Yacht" },
  { src: "assets/screens/american-popculture-trivia.jpg", alt: "American Pop Trivia gameplay screenshot", title: "American Pop Trivia" },
  { src: "assets/screens/gemzy.jpg", alt: "Gemzy gameplay screenshot", title: "Gemzy" },
];

let currentSlide = 0;
let lightboxLastFocused = null;

function showSlide(index) {
  currentSlide = (index + gameScreens.length) % gameScreens.length;
  const shot = gameScreens[currentSlide];
  lightboxImage.src = shot.src;
  lightboxImage.alt = shot.alt;
  if (lightboxTitle) {
    lightboxTitle.textContent = shot.title;
  }
  lightboxCounter.textContent = `${currentSlide + 1} / ${gameScreens.length}`;
}

function onLightboxKeydown(event) {
  if (event.key === "Escape") {
    closeLightbox();
  } else if (event.key === "ArrowRight") {
    showSlide(currentSlide + 1);
  } else if (event.key === "ArrowLeft") {
    showSlide(currentSlide - 1);
  }
}

function openLightbox(index) {
  if (!lightbox || !lightboxImage) {
    return;
  }

  lightboxLastFocused = document.activeElement;
  showSlide(index);
  lightbox.hidden = false;
  document.body.classList.add("lightbox-open");
  lightboxClose?.focus();
  document.addEventListener("keydown", onLightboxKeydown);
}

function closeLightbox() {
  if (!lightbox) {
    return;
  }

  lightbox.hidden = true;
  document.body.classList.remove("lightbox-open");
  document.removeEventListener("keydown", onLightboxKeydown);
  if (lightboxLastFocused instanceof HTMLElement) {
    lightboxLastFocused.focus();
  }
}

if (lightbox && lightboxImage) {
  browseGamesBtn?.addEventListener("click", () => openLightbox(0));
  gameShowcaseImage?.addEventListener("click", () => openLightbox(0));
  gameShowcaseImage?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(0);
    }
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightboxPrev?.addEventListener("click", () => showSlide(currentSlide - 1));
  lightboxNext?.addEventListener("click", () => showSlide(currentSlide + 1));
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });
}

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
