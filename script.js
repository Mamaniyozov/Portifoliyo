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
   Language Switcher — UZ / EN / RU
   translations[lang][key] is applied to every [data-i18n] node's
   textContent. Proper nouns (names, tech, endpoints) stay as-is
   because they simply have no data-i18n attribute.
   ============================================================ */

const translations = {
  uz: {
    "nav.home": "Bosh sahifa",
    "nav.about": "Men haqimda",
    "nav.skills": "Ko'nikmalar",
    "nav.experience": "Tajriba",
    "nav.projects": "Loyihalar",
    "nav.contact": "Bog'lanish",
    "hero.status_sub": "(Ishga tayyor · Remote / Ofis)",
    "hero.sub": "ANTIGRAVITY DEVELOPER",
    "hero.desc": "Full-Stack Django & ASP.NET dasturchi — ishonchli backend arxitektura va sezilarli darajada silliq interfeyslar quraman.",
    "hero.cta_projects": "Loyihalarni ko'rish",
    "hero.cta_contact": "Bog'lanish",
    "about.eyebrow": "// ABOUT ME",
    "about.title": "Men haqimda",
    "about.hello": "Salom, men Muhammadyusufman",
    "about.text": "Django va ASP.NET texnologiyalari asosida to'liq funksional web tizimlar quraman: REST API, ma'lumotlar bazasi arxitekturasi va production darajasidagi deployment. Har bir loyihada tozalik, tezlik va barqarorlikka e'tibor qarataman.",
    "about.cv_btn": "CV yuklab olish",
    "about.exp_eyebrow": "// EXPERIENCE",
    "about.stat_years": "Yillik tajriba",
    "about.stat_projects": "Bajarilgan loyiha",
    "about.stat_clients": "Mamnun mijoz",
    "about.mini_text": "\"RIO vs RIATM\" tibbiyot muassasasida backend, ma'lumotlar bazasi va Telegram botlarni qo'llab-quvvatlash bo'yicha ishlayman. Xavfsiz autentifikatsiya (JWT, 2FA, OTP) va production'ga tayyor tizimlar — asosiy yo'nalishim.",
    "about.contact_link": "Men bilan bog'laning",
    "skills.eyebrow": "// TECH STACK",
    "skills.title": "Ko'nikmalar",
    "skills.security": "JWT / 2FA / OTP",
    "exp.eyebrow": "// EXPERIENCE TIMELINE",
    "exp.title": "Ish tajribam",
    "exp.rio.date": "2025 — hozirgi kunda",
    "exp.rio.role": "Backend qo'llab-quvvatlash",
    "exp.rio.text": "Karmed tibbiy tizimini qo'llab-quvvatlash: xatoliklarni tuzatish, PostgreSQL ma'lumotlarini chiqarish/tahrirlash, FastReport hujjatlari, backend va Telegram botlarni tiklash.",
    "exp.freelance.date": "2023 — 2025",
    "exp.freelance.role": "Freelance Full-Stack dasturchi",
    "exp.freelance.text": "To'liq loyihalar qurish, xatoliklarni tahlil qilish, PostgreSQL, FastReport va Telegram integratsiyalari.",
    "exp.edu.date": "2025",
    "exp.edu.role": "Bakalavr — IT Engineer",
    "exp.edu.text": "Axborot texnologiyalari muhandisligi yo'nalishi bo'yicha bakalavr darajasi.",
    "projects.eyebrow": "// FEATURED PROJECTS",
    "projects.title": "Loyihalarim",
    "filter.all": "Hammasi",
    "filter.django": "Django / DRF",
    "filter.flutter": "Flutter",
    "filter.backend": "Backend API",
    "proj.hrmm.text": "Xodimlar bazasi, davomat, ta'til arizalari, hisobotlar va Telegram-bot xizmatlarini birlashtirgan to'liq funksional HR tizimi. JWT, 2FA/OTP autentifikatsiya va audit jurnali bilan.",
    "proj.finance.text": "Django REST API backend va Flutter mobil klient asosida qurilgan shaxsiy moliyaviy kuzatuv tizimi: xarajatlar tahlili, oylik hisobotlar, maqsadlar va xavfsiz tranzaksiyalar.",
    "proj.doctor.text": "Kasalxona xodimlari uchun rollarga asoslangan REST API: kasb navbatlari, real vaqt chat, PDF generatsiya va Swagger hujjatlashtirish.",
    "proj.lady.text": "Kurslar, modullar, progress kuzatuvi, yangiliklar va PDF sertifikatlarni birlashtirgan ta'lim platformasi backend qismi. JWT blacklist logout bilan.",
    "proj.view_project": "Loyihani ko'rish",
    "proj.view_github": "GitHub'da ko'rish",
    "contact.eyebrow": "// CONNECT",
    "contact.title": "Bog'lanish",
    "contact.headline": "Keling, birga nimadir quramiz",
    "contact.cta_telegram": "Telegram orqali yozish",
    "contact.email": "Email",
    "contact.phone": "Telefon",
    "contact.text": "Loyiha bo'yicha bog'lanish uchun yozing — 24 soat ichida javob beraman.",
  },
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.skills": "Skills",
    "nav.experience": "Experience",
    "nav.projects": "Projects",
    "nav.contact": "Contact",
    "hero.status_sub": "(Available · Remote / On-site)",
    "hero.sub": "ANTIGRAVITY DEVELOPER",
    "hero.desc": "Full-Stack Django & ASP.NET developer — I build reliable backend architecture and noticeably smooth interfaces.",
    "hero.cta_projects": "View projects",
    "hero.cta_contact": "Get in touch",
    "about.eyebrow": "// ABOUT ME",
    "about.title": "About Me",
    "about.hello": "Hi, I'm Muhammadyusuf",
    "about.text": "I build fully functional web systems on Django and ASP.NET: REST APIs, database architecture and production-grade deployment. I care about clean code, speed and reliability in every project.",
    "about.cv_btn": "Download CV",
    "about.exp_eyebrow": "// EXPERIENCE",
    "about.stat_years": "Years of experience",
    "about.stat_projects": "Completed projects",
    "about.stat_clients": "Satisfied clients",
    "about.mini_text": "I work on backend, database and Telegram bot support at the \"RIO vs RIATM\" medical facility. Secure authentication (JWT, 2FA, OTP) and production-ready systems are my main focus.",
    "about.contact_link": "Get in touch with me",
    "skills.eyebrow": "// TECH STACK",
    "skills.title": "Skills",
    "skills.security": "JWT / 2FA / OTP",
    "exp.eyebrow": "// EXPERIENCE TIMELINE",
    "exp.title": "Work Experience",
    "exp.rio.date": "2025 — present",
    "exp.rio.role": "Backend Support Engineer",
    "exp.rio.text": "Supporting the Karmed medical system: fixing errors, extracting/editing PostgreSQL data, FastReport documents, and restoring backend and Telegram bot services.",
    "exp.freelance.date": "2023 — 2025",
    "exp.freelance.role": "Freelance Full-Stack Developer",
    "exp.freelance.text": "Building full projects end-to-end, bug analysis, PostgreSQL, FastReport and Telegram integrations.",
    "exp.edu.date": "2025",
    "exp.edu.role": "Bachelor's — IT Engineer",
    "exp.edu.text": "Bachelor's degree in Information Technology Engineering.",
    "projects.eyebrow": "// FEATURED PROJECTS",
    "projects.title": "My Projects",
    "filter.all": "All",
    "filter.django": "Django / DRF",
    "filter.flutter": "Flutter",
    "filter.backend": "Backend API",
    "proj.hrmm.text": "A fully functional HR system combining an employee database, attendance, leave requests, reports and Telegram bot services. Built with JWT, 2FA/OTP authentication and an audit log.",
    "proj.finance.text": "A personal finance tracker built on a Django REST API backend and a Flutter mobile client: expense analytics, monthly reports, goals and secure transactions.",
    "proj.doctor.text": "A role-based REST API for hospital staff: profession queues, real-time chat, PDF generation and Swagger documentation.",
    "proj.lady.text": "The backend of a coding-education platform combining courses, modules, progress tracking, news and PDF certificates, with JWT blacklist logout.",
    "proj.view_project": "View project",
    "proj.view_github": "View on GitHub",
    "contact.eyebrow": "// CONNECT",
    "contact.title": "Get in Touch",
    "contact.headline": "Let's build something together",
    "contact.cta_telegram": "Message me on Telegram",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.text": "Write to me about your project — I'll reply within 24 hours.",
  },
  ru: {
    "nav.home": "Главная",
    "nav.about": "Обо мне",
    "nav.skills": "Навыки",
    "nav.experience": "Опыт",
    "nav.projects": "Проекты",
    "nav.contact": "Контакты",
    "hero.status_sub": "(Готов к работе · Удалённо / Офис)",
    "hero.sub": "ANTIGRAVITY DEVELOPER",
    "hero.desc": "Full-Stack разработчик на Django и ASP.NET — создаю надёжную backend-архитектуру и заметно плавные интерфейсы.",
    "hero.cta_projects": "Смотреть проекты",
    "hero.cta_contact": "Связаться",
    "about.eyebrow": "// ОБО МНЕ",
    "about.title": "Обо мне",
    "about.hello": "Привет, я Мухаммадюсуф",
    "about.text": "Создаю полнофункциональные веб-системы на Django и ASP.NET: REST API, архитектуру баз данных и деплой уровня production. В каждом проекте забочусь о чистоте кода, скорости и стабильности.",
    "about.cv_btn": "Скачать резюме",
    "about.exp_eyebrow": "// ОПЫТ",
    "about.stat_years": "Лет опыта",
    "about.stat_projects": "Завершённых проектов",
    "about.stat_clients": "Довольных клиентов",
    "about.mini_text": "Работаю над backend, базами данных и поддержкой Telegram-ботов в медицинском учреждении «RIO vs RIATM». Безопасная аутентификация (JWT, 2FA, OTP) и готовые к production системы — моё основное направление.",
    "about.contact_link": "Связаться со мной",
    "skills.eyebrow": "// ТЕХНОЛОГИИ",
    "skills.title": "Навыки",
    "skills.security": "JWT / 2FA / OTP",
    "exp.eyebrow": "// ОПЫТ РАБОТЫ",
    "exp.title": "Мой опыт работы",
    "exp.rio.date": "2025 — по настоящее время",
    "exp.rio.role": "Поддержка backend-систем",
    "exp.rio.text": "Поддержка медицинской системы Karmed: исправление ошибок, выгрузка/редактирование данных PostgreSQL, документы FastReport, восстановление backend и Telegram-ботов.",
    "exp.freelance.date": "2023 — 2025",
    "exp.freelance.role": "Freelance Full-Stack разработчик",
    "exp.freelance.text": "Разработка полноценных проектов, анализ ошибок, интеграции с PostgreSQL, FastReport и Telegram.",
    "exp.edu.date": "2025",
    "exp.edu.role": "Бакалавр — IT Engineer",
    "exp.edu.text": "Степень бакалавра по направлению «Информационные технологии».",
    "projects.eyebrow": "// ИЗБРАННЫЕ ПРОЕКТЫ",
    "projects.title": "Мои проекты",
    "filter.all": "Все",
    "filter.django": "Django / DRF",
    "filter.flutter": "Flutter",
    "filter.backend": "Backend API",
    "proj.hrmm.text": "Полнофункциональная HR-система: база сотрудников, учёт посещаемости, заявки на отпуск, отчёты и сервисы Telegram-бота. С JWT, 2FA/OTP аутентификацией и журналом аудита.",
    "proj.finance.text": "Система учёта личных финансов на базе Django REST API и мобильного клиента Flutter: анализ расходов, ежемесячные отчёты, цели и безопасные транзакции.",
    "proj.doctor.text": "REST API для персонала больницы на основе ролей: очереди по специальностям, чат в реальном времени, генерация PDF и документация Swagger.",
    "proj.lady.text": "Backend образовательной платформы по программированию: курсы, модули, отслеживание прогресса, новости и PDF-сертификаты, с выходом по JWT blacklist.",
    "proj.view_project": "Смотреть проект",
    "proj.view_github": "Смотреть на GitHub",
    "contact.eyebrow": "// СВЯЗЬ",
    "contact.title": "Связаться",
    "contact.headline": "Давайте создадим что-то вместе",
    "contact.cta_telegram": "Написать в Telegram",
    "contact.email": "Email",
    "contact.phone": "Телефон",
    "contact.text": "Напишите мне о своём проекте — отвечу в течение 24 часов.",
  },
};

const langSwitcher = document.getElementById("langSwitcher");
const langCurrentBtn = document.getElementById("langCurrentBtn");
const langDropdown = document.getElementById("langDropdown");
const langCurrentLabel = document.getElementById("langCurrentLabel");
const i18nNodes = document.querySelectorAll("[data-i18n]");

function applyLanguage(lang) {
  const dict = translations[lang] || translations.uz;
  i18nNodes.forEach((node) => {
    const key = node.dataset.i18n;
    if (dict[key]) {
      node.textContent = dict[key];
      if (node.classList.contains("scramble-text")) {
        node.dataset.scramble = dict[key];
      }
    }
  });
  document.documentElement.lang = lang;
  if (langCurrentLabel) langCurrentLabel.textContent = lang.toUpperCase();
  if (langDropdown) {
    langDropdown.querySelector(".is-active")?.classList.remove("is-active");
    langDropdown.querySelector(`[data-lang="${lang}"]`)?.classList.add("is-active");
  }
  document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
}

const savedLang = localStorage.getItem("lang");
if (savedLang && translations[savedLang]) {
  applyLanguage(savedLang);
}

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
      const lang = option.dataset.lang;
      applyLanguage(lang);
      localStorage.setItem("lang", lang);
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
   Project filters — Django/DRF, Flutter, Hammasi
   ============================================================ */

const filterPills = document.querySelectorAll(".filter-pill");
const projectCards = document.querySelectorAll(".project-card");

if (filterPills.length && projectCards.length) {
  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      filterPills.forEach((p) => {
        p.classList.remove("is-active");
        p.setAttribute("aria-selected", "false");
      });
      pill.classList.add("is-active");
      pill.setAttribute("aria-selected", "true");

      const filter = pill.dataset.filter;
      projectCards.forEach((card) => {
        const stacks = (card.dataset.stack || "").split(" ");
        const show = filter === "all" || stacks.includes(filter);
        card.classList.toggle("is-hidden", !show);
      });
    });
  });
}

/* ============================================================
   Antigravity background parallax
   Background layer (glows, floating dots, code fragments) drifts
   slower than scroll for a weightless depth effect.
   ============================================================ */

const bgLayer = document.querySelector(".bg-layer");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (bgLayer && !prefersReducedMotion) {
  let parallaxTicking = false;
  const updateParallax = () => {
    bgLayer.style.transform = `translateY(${window.scrollY * 0.28}px)`;
    parallaxTicking = false;
  };
  window.addEventListener(
    "scroll",
    () => {
      if (!parallaxTicking) {
        requestAnimationFrame(updateParallax);
        parallaxTicking = true;
      }
    },
    { passive: true }
  );
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

const pointerFine = window.matchMedia("(pointer: fine)").matches;

/* ============================================================
   Scramble text — matrix-style character scramble on hover
   ============================================================ */

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#________";

function runScramble(node) {
  const target = node.dataset.scramble || node.textContent;
  if (node._scrambleTimer) {
    clearInterval(node._scrambleTimer);
  }
  const length = target.length;
  let iteration = 0;
  node._scrambleTimer = setInterval(() => {
    node.textContent = target
      .split("")
      .map((char, index) => {
        if (char === " ") return " ";
        if (index < iteration) return target[index];
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
      })
      .join("");

    if (iteration >= length) {
      clearInterval(node._scrambleTimer);
      node._scrambleTimer = null;
      node.textContent = target;
    }
    iteration += length / 14;
  }, 30);
}

document.querySelectorAll(".scramble-text[data-scramble]").forEach((node) => {
  node.addEventListener("mouseenter", () => runScramble(node));
});

/* ============================================================
   Loading screen — /00 -> /30 counter, then fade + hero decode
   ============================================================ */

const loader = document.getElementById("loader");
const loaderCount = document.getElementById("loaderCount");
const heroSub = document.querySelector(".hero-sub.is-decoding");

function decodeHeroSub() {
  if (!heroSub) return;
  const text = heroSub.dataset.decode || heroSub.textContent;
  if (prefersReducedMotion) {
    heroSub.textContent = text;
    return;
  }
  heroSub.dataset.scramble = text;
  runScramble(heroSub);
}

if (loader && loaderCount) {
  if (prefersReducedMotion) {
    loader.classList.add("is-done");
    decodeHeroSub();
    document.dispatchEvent(new CustomEvent("loaderdone"));
  } else {
    const total = 30;
    const durationMs = 1700;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const value = Math.floor(progress * total);
      loaderCount.textContent = String(value).padStart(2, "0");
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        loaderCount.textContent = String(total).padStart(2, "0");
        setTimeout(() => {
          loader.classList.add("is-done");
          decodeHeroSub();
          document.dispatchEvent(new CustomEvent("loaderdone"));
        }, 260);
      }
    };
    requestAnimationFrame(tick);
  }
} else {
  decodeHeroSub();
  document.dispatchEvent(new CustomEvent("loaderdone"));
}

/* ============================================================
   Custom neon cursor — outer ring (inertia) + inner dot
   Only on fine-pointer devices; native cursor hidden via CSS.
   ============================================================ */

if (pointerFine) {
  const cursorRing = document.getElementById("cursorRing");
  const cursorDot = document.getElementById("cursorDot");

  if (cursorRing && cursorDot) {
    document.body.classList.add("has-custom-cursor");

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener(
      "mousemove",
      (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      },
      { passive: true }
    );

    const renderRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(renderRing);
    };
    requestAnimationFrame(renderRing);

    const hoverSelector = "a, button, [data-hoverable]";
    document.addEventListener("mouseover", (event) => {
      if (event.target.closest && event.target.closest(hoverSelector)) {
        cursorRing.classList.add("is-hover");
        cursorDot.classList.add("is-hover");
      }
    });
    document.addEventListener("mouseout", (event) => {
      if (event.target.closest && event.target.closest(hoverSelector)) {
        cursorRing.classList.remove("is-hover");
        cursorDot.classList.remove("is-hover");
      }
    });
  }
}

/* ============================================================
   Scroll progress bar + [data-reveal] IntersectionObserver are
   now owned by the ScrollProgress / ScrollReveal modules
   (js/modules/scroll-progress.js, js/modules/scroll-reveal.js).
   See js/scroll-experience.js for wiring.
   ============================================================ */

/* ============================================================
   Count-up utility — [data-count-to] (+ optional data-suffix)
   Drives About stats and Skills percentages; skill rows also
   fill their progress bar at the same trigger point.
   ============================================================ */

const countNodes = document.querySelectorAll("[data-count-to]");

function animateCount(node) {
  const target = parseFloat(node.dataset.countTo);
  const suffix = node.dataset.suffix || "";
  const isDecimal = String(node.dataset.countTo).includes(".");
  const durationMs = 1400;
  const start = performance.now();

  const step = (now) => {
    const progress = Math.min((now - start) / durationMs, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;
    node.textContent = `${isDecimal ? value.toFixed(1) : Math.round(value)}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      node.textContent = `${isDecimal ? target.toFixed(1) : target}${suffix}`;
    }
  };
  requestAnimationFrame(step);

  const skillRow = node.closest(".skill-row");
  if (skillRow) {
    const fill = skillRow.querySelector(".skill-bar-fill");
    if (fill) {
      requestAnimationFrame(() => {
        fill.style.width = `${skillRow.dataset.level || target}%`;
      });
    }
  }
}

if (countNodes.length && "IntersectionObserver" in window) {
  if (prefersReducedMotion) {
    countNodes.forEach((node) => {
      const target = parseFloat(node.dataset.countTo);
      const suffix = node.dataset.suffix || "";
      const isDecimal = String(node.dataset.countTo).includes(".");
      node.textContent = `${isDecimal ? target.toFixed(1) : target}${suffix}`;
      const skillRow = node.closest(".skill-row");
      if (skillRow) {
        const fill = skillRow.querySelector(".skill-bar-fill");
        if (fill) fill.style.width = `${skillRow.dataset.level}%`;
      }
    });
  } else {
    const countObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    countNodes.forEach((node) => countObserver.observe(node));
  }
}

/* ============================================================
   Particle constellation / spiral canvas is now driven by the
   SpiralParticles module (js/modules/spiral-particles.js), which
   blends this ambient field with scroll-progress-based spiral
   motion. See js/scroll-experience.js for wiring.
   ============================================================ */

/* ============================================================
   Ribbon mouse-trail — flowing streamers along movement
   direction; stroke color cycles through the palette every 10s.
   ============================================================ */

const ribbonCanvas = document.getElementById("ribbonCanvas");

if (ribbonCanvas && pointerFine && !prefersReducedMotion) {
  const rctx = ribbonCanvas.getContext("2d");
  const ribbonColors = ["#00f2fe", "#7c3aed", "#4f46e5"];
  let colorIndex = 0;
  let lastColorSwap = performance.now();

  function resizeRibbon() {
    ribbonCanvas.width = window.innerWidth;
    ribbonCanvas.height = window.innerHeight;
  }
  resizeRibbon();
  window.addEventListener("resize", resizeRibbon);

  let trail = [];
  let lastPoint = null;

  window.addEventListener(
    "mousemove",
    (event) => {
      const point = { x: event.clientX, y: event.clientY, life: 1 };
      if (lastPoint) {
        const dx = point.x - lastPoint.x;
        const dy = point.y - lastPoint.y;
        const speed = Math.sqrt(dx * dx + dy * dy);
        if (speed > 2) {
          trail.push(point);
        }
      } else {
        trail.push(point);
      }
      lastPoint = point;
      if (trail.length > 40) trail.shift();
    },
    { passive: true }
  );

  function stepRibbon(now) {
    rctx.clearRect(0, 0, ribbonCanvas.width, ribbonCanvas.height);

    if (now - lastColorSwap > 10000) {
      colorIndex = (colorIndex + 1) % ribbonColors.length;
      lastColorSwap = now;
    }

    trail.forEach((p) => (p.life -= 0.035));
    trail = trail.filter((p) => p.life > 0);

    if (trail.length > 1) {
      for (let i = 1; i < trail.length; i++) {
        const a = trail[i - 1];
        const b = trail[i];
        rctx.beginPath();
        rctx.moveTo(a.x, a.y);
        rctx.lineTo(b.x, b.y);
        rctx.strokeStyle = ribbonColors[colorIndex];
        rctx.globalAlpha = Math.max(b.life, 0) * 0.5;
        rctx.lineWidth = Math.max(b.life * 6, 0.5);
        rctx.lineCap = "round";
        rctx.stroke();
      }
      rctx.globalAlpha = 1;
    }

    requestAnimationFrame(stepRibbon);
  }
  requestAnimationFrame(stepRibbon);
}

/* ============================================================
   Three.js hero object — particle sphere + wireframe icosahedron
   Mouse parallax + scroll-driven rotation.
   ============================================================ */

const heroCanvas = document.getElementById("heroCanvas");

if (heroCanvas && window.THREE && !prefersReducedMotion) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const sphereGeometry = new THREE.BufferGeometry();
  const SPHERE_POINTS = 2600;
  const positions = new Float32Array(SPHERE_POINTS * 3);
  for (let i = 0; i < SPHERE_POINTS; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const r = 1.6;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  sphereGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const sphereMaterial = new THREE.PointsMaterial({
    color: 0x00f2fe,
    size: 0.018,
    transparent: true,
    opacity: 0.85,
  });
  const sphere = new THREE.Points(sphereGeometry, sphereMaterial);
  scene.add(sphere);

  const icoGeometry = new THREE.IcosahedronGeometry(2.2, 0);
  const icoMaterial = new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true, transparent: true, opacity: 0.5 });
  const ico = new THREE.Mesh(icoGeometry, icoMaterial);
  scene.add(ico);

  function resizeHero() {
    const rect = heroCanvas.parentElement.getBoundingClientRect();
    const w = Math.max(rect.width, 1);
    const h = Math.max(rect.height, 1);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resizeHero();
  window.addEventListener("resize", resizeHero);

  let heroMouseX = 0;
  let heroMouseY = 0;
  if (pointerFine && heroGraphic) {
    heroGraphic.addEventListener("mousemove", (event) => {
      const rect = heroGraphic.getBoundingClientRect();
      heroMouseX = (event.clientX - rect.left) / rect.width - 0.5;
      heroMouseY = (event.clientY - rect.top) / rect.height - 0.5;
    });
    heroGraphic.addEventListener("mouseleave", () => {
      heroMouseX = 0;
      heroMouseY = 0;
    });
  }

  const clock = new THREE.Clock();

  function renderHero() {
    const elapsed = clock.getElapsedTime();
    const breathe = 1 + Math.sin(elapsed * 0.6) * 0.06;
    sphere.scale.setScalar(breathe);

    sphere.rotation.y = elapsed * 0.08 + window.scrollY * 0.0006;
    sphere.rotation.x = elapsed * 0.04;
    ico.rotation.y = -elapsed * 0.12 + window.scrollY * 0.001;
    ico.rotation.x = elapsed * 0.06;

    camera.position.x += (heroMouseX * 1.2 - camera.position.x) * 0.05;
    camera.position.y += (-heroMouseY * 1.2 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
    requestAnimationFrame(renderHero);
  }
  requestAnimationFrame(renderHero);
}
