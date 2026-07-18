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
    "skills.security": "Xavfsizlik",
    "projects.eyebrow": "// FEATURED PROJECTS",
    "projects.title": "Loyihalarim",
    "filter.all": "Hammasi",
    "filter.django": "Django / DRF",
    "filter.flutter": "Flutter",
    "proj.hrmm.text": "Xodimlar bazasi, davomat, ta'til arizalari, hisobotlar va Telegram-bot xizmatlarini birlashtirgan to'liq funksional HR tizimi. JWT, 2FA/OTP autentifikatsiya va audit jurnali bilan.",
    "proj.finance.text": "Django REST API backend va Flutter mobil klient asosida qurilgan shaxsiy moliyaviy kuzatuv tizimi: xarajatlar tahlili, oylik hisobotlar, maqsadlar va xavfsiz tranzaksiyalar.",
    "proj.doctor.text": "Kasalxona xodimlari uchun rollarga asoslangan REST API: kasb navbatlari, real vaqt chat, PDF generatsiya va Swagger hujjatlashtirish.",
    "proj.lady.text": "Kurslar, modullar, progress kuzatuvi, yangiliklar va PDF sertifikatlarni birlashtirgan ta'lim platformasi backend qismi. JWT blacklist logout bilan.",
    "proj.view_project": "Loyihani ko'rish",
    "proj.view_github": "GitHub'da ko'rish",
    "contact.eyebrow": "// CONNECT",
    "contact.title": "Bog'lanish",
    "contact.text": "Loyiha bo'yicha bog'lanish uchun yozing — 24 soat ichida javob beraman.",
  },
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.skills": "Skills",
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
    "skills.security": "Security",
    "projects.eyebrow": "// FEATURED PROJECTS",
    "projects.title": "My Projects",
    "filter.all": "All",
    "filter.django": "Django / DRF",
    "filter.flutter": "Flutter",
    "proj.hrmm.text": "A fully functional HR system combining an employee database, attendance, leave requests, reports and Telegram bot services. Built with JWT, 2FA/OTP authentication and an audit log.",
    "proj.finance.text": "A personal finance tracker built on a Django REST API backend and a Flutter mobile client: expense analytics, monthly reports, goals and secure transactions.",
    "proj.doctor.text": "A role-based REST API for hospital staff: profession queues, real-time chat, PDF generation and Swagger documentation.",
    "proj.lady.text": "The backend of a coding-education platform combining courses, modules, progress tracking, news and PDF certificates, with JWT blacklist logout.",
    "proj.view_project": "View project",
    "proj.view_github": "View on GitHub",
    "contact.eyebrow": "// CONNECT",
    "contact.title": "Get in Touch",
    "contact.text": "Write to me about your project — I'll reply within 24 hours.",
  },
  ru: {
    "nav.home": "Главная",
    "nav.about": "Обо мне",
    "nav.skills": "Навыки",
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
    "skills.security": "Безопасность",
    "projects.eyebrow": "// ИЗБРАННЫЕ ПРОЕКТЫ",
    "projects.title": "Мои проекты",
    "filter.all": "Все",
    "filter.django": "Django / DRF",
    "filter.flutter": "Flutter",
    "proj.hrmm.text": "Полнофункциональная HR-система: база сотрудников, учёт посещаемости, заявки на отпуск, отчёты и сервисы Telegram-бота. С JWT, 2FA/OTP аутентификацией и журналом аудита.",
    "proj.finance.text": "Система учёта личных финансов на базе Django REST API и мобильного клиента Flutter: анализ расходов, ежемесячные отчёты, цели и безопасные транзакции.",
    "proj.doctor.text": "REST API для персонала больницы на основе ролей: очереди по специальностям, чат в реальном времени, генерация PDF и документация Swagger.",
    "proj.lady.text": "Backend образовательной платформы по программированию: курсы, модули, отслеживание прогресса, новости и PDF-сертификаты, с выходом по JWT blacklist.",
    "proj.view_project": "Смотреть проект",
    "proj.view_github": "Смотреть на GitHub",
    "contact.eyebrow": "// СВЯЗЬ",
    "contact.title": "Связаться",
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
    if (dict[key]) node.textContent = dict[key];
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
