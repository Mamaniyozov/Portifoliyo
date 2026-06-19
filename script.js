const body = document.body;
const webCanvas = document.getElementById("web-canvas");
const webCtx = webCanvas.getContext("2d");
const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeLabel = themeToggle.querySelector(".theme-label");
const themeIcon = themeToggle.querySelector(".theme-icon");
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

// --------- Lightweight client-side i18n ---------
const i18nElements = [...document.querySelectorAll('[data-i18n]')];
const i18nAttrElements = [...document.querySelectorAll('[data-i18n-attr]')];

// store default text for fallback
i18nElements.forEach((el) => {
  if (!el.dataset.i18nDefault) el.dataset.i18nDefault = el.textContent.trim();
});
i18nAttrElements.forEach((el) => {
  if (!el.dataset.i18nAttrDefault) el.dataset.i18nAttrDefault = el.getAttribute('aria-label') || '';
});

const translations = {
  uz: {
    'nav.about': "Men haqimda",
    'nav.skills': "Ko'nikmalar",
    'nav.experience': "Tajriba",
    'nav.projects': "Loyihalar",
    'nav.contact': "Aloqa",
    'nav.aria': "Asosiy navigatsiya",
    'brand.aria': "Bosh sahifaga o'tish",
    'menu.open': "Menyuni ochish",
    'language.aria': "Tilni tanlash",
    'theme.aria': "Rang rejimini almashtirish",
    'hero.text': `Django, PostgreSQL va vanilla JavaScript asosida biznes uchun ishonchli, kengayadigan web tizimlar yarataman. Backend arxitekturasi, deployment va rollarga asoslangan access control bilan ishlashga ixtisoslashganman.`,
    'hero.projects': "Loyihalarni ko'rish",
    'hero.contact': "Bog'lanish",
    'hero.metaAria': "Qisqa ma'lumotlar",
    'hero.experience': "3 yil 6 oy tajriba",
    'hero.fulltime': "Full-time, relokatsiyasiz",
    'profile.aria': "Portfolio vizual kartasi",
    'profile.role': "Programmist-razrabotchik",
    'profile.location': "23 yosh, Toshkent",
    'profile.status': "Ishga tayyor, remote yoki ofis",
    'profile.years': "Yil tajriba",
    'profile.focus': "Asosiy yo'nalish",
    'about.title': "Men haqimda",
    'about.p1': `Men biznes jarayonlarini raqamlashtirish, ichki CRM/ERP modullarini optimallashtirish va mavjud tizimlarda xatolarni aniqlab tuzatish bilan shug'ullanadigan dasturchiman. Asosiy kuchli tomonlarim: backend logic, ma'lumotlar bazasi modeli, REST API, deploy va production muammolarini tizimli hal qilish.`,
    'about.p2': `Rezyume ma'lumotlariga ko'ra, asosiy darajadagi texnologiyalarim: Git, web-dasturlash, Python, dasturiy ta'minot ishlab chiqish, Django REST Framework va REST API. O'rta darajada Docker, PostgreSQL, Linux, Flask, HTML va DevOps bilan ishlayman.`,
    'about.langUz': "O'zbek tili: native",
    'skills.title': "Ko'nikmalar",
    'skills.text': "Texnologiyalar amaliy ish tajribasi va rezyume ma'lumotlari asosida guruhlandi.",
    'experience.title': "Ish tajribasi",
    'experience.currentDate': "Sep 2025 - hozir",
    'experience.currentText': "Karmed tizimida xatolarni tuzatish, mavjud funksiyalarni yaxshilash va muammoli loyihalarni qayta tiklash bo'yicha ishladim.",
    'experience.freelanceDate': "Yan 2023 - Sen 2025",
    'experience.freelanceText': "Freelance backend developer sifatida biznes uchun web loyihalar yaratdim.",
    'projects.title': "Loyihalar",
    'projects.hrmm': "Korxona xodimlarini boshqarish uchun Django + PostgreSQL asosidagi tizim.",
    'projects.demo': "Demo so'rash",
    'projects.api': "Authentication, permission, CRUD va reporting modullari.",
    'projects.crm': "Ichki jarayonlarni avtomatlashtirish uchun biznes vositalari.",
    'contact.title': "Aloqa",
    'contact.text': "Hamkorlik, ish taklifi yoki loyiha muhokamasi uchun bog'lanishingiz mumkin.",
    'form.name': "Ismingiz",
    'form.email': "Email",
    'form.message': "Xabar",
    'form.submit': "Xabar yuborish",
      'form.sent': "Xabaringiz tayyor. Backend ulangandan keyin yuborish faollashadi.",
      'footer.copy': "© 2026 Muhammadyusuf Mamaniyozov. Barcha huquqlar himoyalangan."
  },
  en: {
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.experience': 'Experience',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'nav.aria': 'Main navigation',
    'brand.aria': 'Go to home',
    'menu.open': 'Open menu',
    'language.aria': 'Choose language',
    'theme.aria': 'Toggle color scheme',
    'hero.text': 'I build reliable, scalable web systems for business using Django, PostgreSQL and vanilla JavaScript. I specialise in backend architecture, deployment and role-based access control.',
    'hero.projects': 'View projects',
    'hero.contact': 'Contact',
    'hero.metaAria': 'Short details',
    'hero.experience': '3 years 6 months experience',
    'hero.fulltime': 'Full-time, no relocation',
    'profile.aria': 'Portfolio visual card',
    'profile.role': 'Software developer',
    'profile.location': '23 years, Tashkent',
    'profile.status': 'Available for work, remote or office',
    'profile.years': 'Years of experience',
    'profile.focus': 'Primary focus',
    'about.title': 'About',
    'about.p1': 'I digitise business processes, optimise internal CRM/ERP modules and fix bugs in existing systems. My strengths are backend logic, data modelling, REST APIs, deployment and solving production issues systematically.',
    'about.p2': 'Resume-level skills: Git, web development, Python, Django REST Framework and REST API. Intermediate with Docker, PostgreSQL, Linux, Flask, HTML and DevOps.',
    'about.langUz': "Uzbek: native",
    'skills.title': 'Skills',
    'skills.text': 'Technologies grouped by practical experience and resume data.',
    'experience.title': 'Experience',
    'experience.currentDate': 'Sep 2025 - present',
    'experience.currentText': 'Worked on bugfixing and recovery of legacy project modules in Karmed system.',
    'experience.freelanceDate': 'Jan 2023 - Sep 2025',
    'experience.freelanceText': 'Freelance backend developer building business web projects.',
    'projects.title': 'Projects',
    'projects.hrmm': 'Enterprise HR Management System built with Django + PostgreSQL.',
    'projects.demo': 'Request demo',
    'projects.api': 'Authentication, permission, CRUD and reporting modules.',
    'projects.crm': 'Automation tools for small and medium businesses.',
    'contact.title': 'Contact',
    'contact.text': 'Get in touch for collaboration, job offers or project discussion.',
    'form.name': 'Your name',
    'form.email': 'Email',
    'form.message': 'Message',
    'form.submit': 'Send message',
    'form.sent': 'Your message is ready. Sending will be enabled once backend is connected.',
    'footer.copy': '© 2026 Muhammadyusuf Mamaniyozov. All rights reserved.'
  }
};

function getTranslation(lang, key) {
  return (translations[lang] && translations[lang][key]) || (translations['en'] && translations['en'][key]) || null;
}

function applyTranslations(lang) {
  i18nElements.forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const txt = getTranslation(lang, key);
    if (txt != null) el.textContent = txt;
    else el.textContent = el.dataset.i18nDefault || el.textContent;
  });

  i18nAttrElements.forEach((el) => {
    const raw = el.getAttribute('data-i18n-attr');
    // format: "attr:key"
    const parts = raw.split(':');
    if (parts.length === 2) {
      const attr = parts[0].trim();
      const key = parts[1].trim();
      const val = getTranslation(lang, key);
      if (val != null) el.setAttribute(attr, val);
      else if (el.dataset.i18nAttrDefault) el.setAttribute(attr, el.dataset.i18nAttrDefault);
    }
  });

  // Update HTML lang attribute
  document.documentElement.lang = lang;
}

// Apply initial language from <html lang="..."> or fallback to 'uz'
const initialLang = document.documentElement.lang || 'uz';
applyTranslations(initialLang);
// ------------------------------------------------

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
  themeIcon.textContent = isDark ? "🌙" : "☀️";
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

// Language icon buttons: toggle active state and expose selected language via dataset
const langButtons = [...document.querySelectorAll('.language-option')];
langButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    langButtons.forEach((b) => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const selected = btn.getAttribute('data-lang');
    applyTranslations(selected);
    console.log('Language selected:', selected);
  });
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
  const lang = document.documentElement.lang || initialLang;
  formNote.textContent = getTranslation(lang, 'form.sent') || "Xabaringiz tayyor.";
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
