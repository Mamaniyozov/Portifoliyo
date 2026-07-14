/* ============================================================
   AOS (Animate On Scroll) — faollashtirish
   ============================================================ */

if (window.AOS) {
  AOS.init({
    duration: 1000,
    easing: "ease-out-cubic",
    once: true,
    offset: 60,
  });
}

/* ============================================================
   Navbar — scroll state, mobile toggle, active link tracking
   ============================================================ */

const navbar = document.getElementById("navbar");
const navbarToggle = document.getElementById("navbarToggle");
const navbarLinks = document.getElementById("navbarLinks");

if (navbar) {
  const updateScrollState = () => {
    navbar.classList.toggle("is-scrolled", window.scrollY > 10);
  };
  updateScrollState();
  window.addEventListener("scroll", updateScrollState, { passive: true });
}

if (navbar && navbarToggle && navbarLinks) {
  navbarToggle.addEventListener("click", () => {
    const isOpen = navbar.classList.toggle("is-open");
    navbarToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navbarLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navbar.classList.remove("is-open");
      navbarToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      navbar.classList.remove("is-open");
      navbarToggle.setAttribute("aria-expanded", "false");
    }
  });
}

const navLinks = document.querySelectorAll(".nav-link[data-nav]");
const navSections = Array.from(navLinks)
  .map((link) => document.getElementById(link.dataset.nav))
  .filter(Boolean);

if (navLinks.length && navSections.length && "IntersectionObserver" in window) {
  const setActiveLink = (id) => {
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.nav === id);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) {
        setActiveLink(visible.target.id);
      }
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
  );

  navSections.forEach((section) => observer.observe(section));
  setActiveLink("home");
}

/* ============================================================
   Language Switcher
   Ishonchli ishlashi uchun click orqali toggle qilinadi (barcha
   qurilmalarda); desktop'da qo'shimcha hover bilan ham ochiladi.
   ============================================================ */

const langSwitcher = document.getElementById("langSwitcher");
const langCurrentBtn = document.getElementById("langCurrentBtn");
const langDropdown = document.getElementById("langDropdown");
const langCurrentLabel = document.getElementById("langCurrentLabel");

if (langSwitcher && langCurrentBtn && langDropdown) {
  langCurrentBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    const isOpen = langSwitcher.classList.toggle("is-open");
    langCurrentBtn.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!langSwitcher.contains(event.target)) {
      langSwitcher.classList.remove("is-open");
      langCurrentBtn.setAttribute("aria-expanded", "false");
    }
  });

  langDropdown.querySelectorAll(".lang-option").forEach((option) => {
    option.addEventListener("click", () => {
      langDropdown.querySelector(".is-active")?.classList.remove("is-active");
      option.classList.add("is-active");
      langCurrentLabel.textContent = option.dataset.lang.toUpperCase();
      langSwitcher.classList.remove("is-open");
      langCurrentBtn.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      langSwitcher.classList.remove("is-open");
      langCurrentBtn.setAttribute("aria-expanded", "false");
    }
  });
}

/* ============================================================
   Portfolio interactions — vanilla JS
   Subtle mouse-parallax on the antigravity hero centerpiece.
   ============================================================ */

const heroGraphic = document.querySelector(".hero-graphic");
const coreIcon = document.querySelector(".core-icon");

if (heroGraphic && coreIcon && window.matchMedia("(pointer: fine)").matches) {
  heroGraphic.addEventListener("mousemove", (event) => {
    const rect = heroGraphic.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    coreIcon.style.transform = `rotateX(${y * -18}deg) rotateY(${x * 18}deg)`;
  });

  heroGraphic.addEventListener("mouseleave", () => {
    coreIcon.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
}
