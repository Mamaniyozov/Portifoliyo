const body = document.body;
const webCanvas = document.getElementById("web-canvas");
const webCtx = webCanvas.getContext("2d");
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
let canvasWidth = 0;
let canvasHeight = 0;
let points = [];
let animationFrame = null;
const mouse = { x: 0, y: 0, active: false };

function resizeCanvas() {
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvasWidth = window.innerWidth;
  canvasHeight = window.innerHeight;
  webCanvas.width = Math.floor(canvasWidth * pixelRatio);
  webCanvas.height = Math.floor(canvasHeight * pixelRatio);
  webCanvas.style.width = `${canvasWidth}px`;
  webCanvas.style.height = `${canvasHeight}px`;
  webCtx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

  const pointCount = Math.max(34, Math.floor((canvasWidth * canvasHeight) / 26000));
  points = Array.from({ length: Math.min(pointCount, 74) }, () => ({
    x: Math.random() * canvasWidth,
    y: Math.random() * canvasHeight,
    vx: (Math.random() - 0.5) * 0.7,
    vy: (Math.random() - 0.5) * 0.7,
    size: Math.random() * 1.7 + 0.8
  }));

  mouse.x = canvasWidth / 2;
  mouse.y = canvasHeight / 2;
}

function getThemeColors() {
  const styles = getComputedStyle(body);
  const accent = styles.getPropertyValue("--accent").trim() || "#1f9f8a";
  const strong = styles.getPropertyValue("--accent-strong").trim() || "#2663ff";
  const isDarkTheme = body.classList.contains("dark-theme");

  return {
    line: isDarkTheme ? "rgba(125, 211, 252, 0.16)" : "rgba(38, 99, 255, 0.12)",
    mouseLine: isDarkTheme ? "rgba(45, 212, 191, 0.34)" : "rgba(31, 159, 138, 0.28)",
    dot: isDarkTheme ? "rgba(244, 247, 251, 0.58)" : "rgba(17, 24, 39, 0.38)",
    accent,
    strong
  };
}

function drawWebBackground() {
  const colors = getThemeColors();
  webCtx.clearRect(0, 0, canvasWidth, canvasHeight);

  points.forEach((point) => {
    const dx = mouse.x - point.x;
    const dy = mouse.y - point.y;
    const distance = Math.hypot(dx, dy);

    if (mouse.active && distance < 230) {
      const pull = (230 - distance) / 230;
      point.vx += (dx / Math.max(distance, 1)) * pull * 0.028;
      point.vy += (dy / Math.max(distance, 1)) * pull * 0.028;
    }

    point.x += point.vx;
    point.y += point.vy;
    point.vx *= 0.985;
    point.vy *= 0.985;

    if (point.x < -20) point.x = canvasWidth + 20;
    if (point.x > canvasWidth + 20) point.x = -20;
    if (point.y < -20) point.y = canvasHeight + 20;
    if (point.y > canvasHeight + 20) point.y = -20;
  });

  for (let i = 0; i < points.length; i += 1) {
    for (let j = i + 1; j < points.length; j += 1) {
      const first = points[i];
      const second = points[j];
      const distance = Math.hypot(first.x - second.x, first.y - second.y);

      if (distance < 135) {
        webCtx.beginPath();
        webCtx.strokeStyle = colors.line;
        webCtx.globalAlpha = 1 - distance / 135;
        webCtx.lineWidth = 1;
        webCtx.moveTo(first.x, first.y);
        webCtx.lineTo(second.x, second.y);
        webCtx.stroke();
      }
    }
  }

  points.forEach((point) => {
    const distanceToMouse = Math.hypot(point.x - mouse.x, point.y - mouse.y);

    if (mouse.active && distanceToMouse < 260) {
      webCtx.beginPath();
      webCtx.strokeStyle = colors.mouseLine;
      webCtx.globalAlpha = 1 - distanceToMouse / 260;
      webCtx.lineWidth = 1.2;
      webCtx.moveTo(mouse.x, mouse.y);
      webCtx.lineTo(point.x, point.y);
      webCtx.stroke();
    }

    webCtx.beginPath();
    webCtx.fillStyle = colors.dot;
    webCtx.globalAlpha = 0.9;
    webCtx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
    webCtx.fill();
  });

  if (mouse.active) {
    const glow = webCtx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 190);
    glow.addColorStop(0, `${colors.accent}33`);
    glow.addColorStop(0.55, `${colors.strong}14`);
    glow.addColorStop(1, "transparent");
    webCtx.globalAlpha = 1;
    webCtx.fillStyle = glow;
    webCtx.beginPath();
    webCtx.arc(mouse.x, mouse.y, 190, 0, Math.PI * 2);
    webCtx.fill();
  }

  webCtx.globalAlpha = 1;
  animationFrame = requestAnimationFrame(drawWebBackground);
}

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

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;
  mouse.active = true;
}, { passive: true });

window.addEventListener("mouseleave", () => {
  mouse.active = false;
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
window.addEventListener("resize", resizeCanvas);

resizeCanvas();
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  drawWebBackground();
} else if (animationFrame) {
  cancelAnimationFrame(animationFrame);
}
updateHeader();
