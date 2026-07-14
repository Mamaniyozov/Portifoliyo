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
   Language Switcher
   Hover orqali ochiladi (desktop); touch qurilmalarda tap
   orqali toggle bo'ladi (progressive enhancement).
   ============================================================ */

const langSwitcher = document.getElementById("langSwitcher");
const langCurrentBtn = document.getElementById("langCurrentBtn");
const langDropdown = document.getElementById("langDropdown");
const langCurrentLabel = document.getElementById("langCurrentLabel");

if (langSwitcher && langCurrentBtn && langDropdown) {
  const isTouch = !window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (isTouch) {
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
  }

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
