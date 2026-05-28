const nav = document.getElementById("nav");
const form = document.getElementById("interestForm");
const emailInput = document.getElementById("emailInput");
const message = document.getElementById("formMessage");

function onScroll() {
  if (!nav) {
    return;
  }

  nav.classList.toggle("scrolled", window.scrollY > 32);
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
