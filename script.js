const body = document.body;
const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = themeToggle.querySelector(".theme-label");
const navLinks = [...document.querySelectorAll(".nav-menu a")];
const sections = [...document.querySelectorAll("main section[id]")];
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector(".contact-form");
const formNote = document.querySelector("[data-form-note]");

// Theme state lives only in the current page session, ready for a future backend preference.
let isDark = false;

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

function closeMenu() {
  navMenu.classList.remove("is-open");
  navToggle.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

navToggle.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("is-open");
  navToggle.classList.toggle("is-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

themeToggle.addEventListener("click", () => {
  isDark = !isDark;
  body.classList.toggle("dark-theme", isDark);
  themeLabel.textContent = isDark ? "Dark" : "Light";
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

// Scroll reveal keeps the page calm while still giving sections a polished entrance.
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealItems.forEach((item) => revealObserver.observe(item));

// Active navigation state follows the section currently closest to the top.
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, {
  rootMargin: "-35% 0px -55% 0px",
  threshold: 0
});

sections.forEach((section) => sectionObserver.observe(section));

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formNote.textContent = "Xabaringiz tayyor. Backend ulangandan keyin yuborish faollashadi.";
  contactForm.reset();
});

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
