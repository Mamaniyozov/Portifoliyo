/* ============================================================
   Scroll-reveal is owned entirely by js/modules/scroll-reveal.js
   ([data-scroll-reveal] / [data-reveal]). The AOS CDN bundle was
   removed — it duplicated that module and cost two extra network
   requests, one of them render-blocking CSS.
   ============================================================ */

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
    "a11y.skip": "Asosiy kontentga o'tish",
    "nav.home": "Bosh sahifa",
    "nav.about": "Men haqimda",
    "nav.skills": "Ko'nikmalar",
    "nav.experience": "Tajriba",
    "nav.projects": "Loyihalar",
    "nav.contact": "Bog'lanish",
    "hero.status_sub": "(Ishga tayyor · Remote / Ofis)",
    "hero.sub": "BACKEND / FULL-STACK DEVELOPER",
    "hero.desc": "Django, DRF va ASP.NET asosida production darajasidagi backend tizimlar quraman — REST API, xavfsiz autentifikatsiya va real foydalanuvchilar ishlatadigan integratsiyalar.",
    "hero.cta_projects": "Loyihalarni ko'rish",
    "hero.cta_contact": "Bog'lanish",
    "about.eyebrow": "// ABOUT ME",
    "about.title": "Men haqimda",
    "about.hello": "Salom, men Muhammadyusufman",
    "about.text": "Django va ASP.NET ekotizimida ishlaydigan backend dasturchiman. Kunlik ishim — REST API loyihalash, ma'lumotlar bazasi sxemasini tuzish va tizimlarni production'ga chiqarish. Har bir loyihada uch narsaga e'tibor beraman: ma'lumot yaxlitligi, autentifikatsiya xavfsizligi va deploydan keyin ham tushunarli qoladigan kod.",
    "about.cv_btn": "CV yuklab olish",
    "about.github_btn": "GitHub profil",
    "about.exp_eyebrow": "// SNAPSHOT",
    "about.stat_years": "Yillik tijorat tajribasi",
    "about.stat_projects": "Ochiq kodli loyiha",
    "about.stat_response": "Javob berish vaqti",
    "about.mini_text": "Hozir “RIO vs RIATM” onkologiya markazida Karmed tibbiy tizimini qo'llab-quvvatlayman: backend xatoliklari, PostgreSQL ma'lumotlari, FastReport hujjatlari va Telegram botlar. Bu ish menga real foydalanuvchilar har kuni ishlatadigan tizimda xatoning narxi qanchaligini o'rgatdi.",
    "about.fact_loc_k": "Joylashuv",
    "about.fact_loc_v": "Samarqand, O'zbekiston · UTC+5",
    "about.fact_lang_k": "Tillar",
    "about.fact_lang_v": "O'zbek (ona tili) · Rus · Ingliz (texnik)",
    "about.fact_avail_k": "Bandlik",
    "about.fact_avail_v": "Remote yoki ofis · to'liq stavka / kontrakt",
    "about.contact_link": "Men bilan bog'laning",
    "skills.eyebrow": "// TECH STACK",
    "skills.title": "Ko'nikmalar",
    "skills.lede": "Foizlar o'rniga — har bir texnologiyani qayerda va qanday ishlatganim.",
    "skills.name.api": "REST API dizayni",
    "skills.name.auth": "Autentifikatsiya — JWT / 2FA / OTP",
    "skills.ctx.django": "HRMM · Doctor-Direct · LadyCoders · Finance App",
    "skills.ctx.python": "Backend logikasi, avtomatlashtirish skriptlari, bot xizmatlari",
    "skills.ctx.pg": "Sxema dizayni, migratsiyalar, so'rovlarni tahlil qilish va tuzatish",
    "skills.ctx.api": "Versiyalash, rol asosidagi ruxsatlar, Swagger/OpenAPI hujjatlari",
    "skills.ctx.auth": "SimpleJWT, blacklist bilan logout, audit jurnali",
    "skills.ctx.tg": "Bildirishnoma botlari va xizmat botlarini tiklash / qo'llab-quvvatlash",
    "skills.ctx.aspnet": "Karmed tibbiy tizimini qo'llab-quvvatlash va xatoliklarni tuzatish",
    "skills.ctx.docker": "Konteynerlash va Railway'ga deployment",
    "skills.ctx.git": "Kundalik versiya nazorati, server administratsiyasi",
    "skills.ctx.flutter": "Finance App mobil klienti — API integratsiyasi va ekranlar",
    "skills.tier.core": "Asosiy",
    "skills.tier.regular": "Muntazam",
    "skills.tier.working": "Ishlaganman",
    "exp.eyebrow": "// EXPERIENCE TIMELINE",
    "exp.title": "Ish tajribam",
    "exp.rio.date": "2025 — hozirgi kunda",
    "exp.rio.role": "Backend qo'llab-quvvatlash muhandisi",
    "exp.rio.text": "Karmed tibbiy tizimini kundalik qo'llab-quvvatlash: backend xatoliklarini topish va tuzatish, PostgreSQL ma'lumotlarini chiqarish va to'g'rilash, FastReport hisobot shablonlari, ishdan chiqqan Telegram botlarni tiklash. Klinika xodimlari har kuni ishlatadigan tizim — shuning uchun har bir o'zgarish oldindan tekshiriladi.",
    "exp.freelance.date": "2023 — 2025",
    "exp.freelance.role": "Freelance Full-Stack dasturchi",
    "exp.freelance.text": "Loyihalarni boshidan oxirigacha olib bordim: talablarni yig'ish, ma'lumotlar bazasi sxemasi, Django backend, deployment va topshiriqdan keyingi qo'llab-quvvatlash. PostgreSQL, FastReport va Telegram integratsiyalari bilan ishladim.",
    "exp.edu.date": "2025",
    "exp.edu.role": "Bakalavr — Axborot texnologiyalari muhandisi",
    "exp.edu.text": "Axborot texnologiyalari muhandisligi yo'nalishi bo'yicha bakalavr darajasi.",
    "projects.eyebrow": "// FEATURED PROJECTS",
    "projects.title": "Loyihalarim",
    "projects.lede": "Har bir loyiha uchun: qanday muammo bor edi, nima qurdim va natijada nima o'zgardi.",
    "filter.all": "Hammasi",
    "filter.django": "Django / DRF",
    "filter.flutter": "Flutter",
    "filter.backend": "Backend API",
    "filter.status": "{filter} — {total} tadan {n} ta loyiha ko'rsatilmoqda",
    "projects.empty": "Bu filtr bo'yicha loyiha topilmadi. Boshqa filtrni tanlang.",
    "case.problem": "Muammo",
    "case.solution": "Yechim",
    "case.result": "Natija",
    "proj.hrmm.kind": "HR PLATFORMA",
    "proj.hrmm.problem": "Xodimlar ma'lumotlari, davomat va ta'til arizalari alohida jadvallar va qog'ozlarda tarqoq edi. Har oylik hisobot qo'lda yig'ilar, kim nimani o'zgartirgani esa hech qayerda qayd etilmasdi.",
    "proj.hrmm.solution": "Django + DRF asosida yagona tizim qurdim: xodimlar bazasi, davomat, ta'til arizalari oqimi va avtomatik hisobotlar. Telegram bot xodimlarga bildirishnoma yuboradi, JWT + 2FA/OTP kirishni himoyalaydi, audit jurnali esa har bir o'zgarishni kim va qachon qilganini yozib boradi.",
    "proj.hrmm.result": "HR jarayonlari bitta tizimga ko'chdi: hisobot qo'lda yig'ilmaydi, ta'til arizasi Telegram orqali keladi va ketadi, har bir yozuv o'zgarishi kuzatiladi.",
    "proj.finance.kind": "API + MOBIL",
    "proj.finance.problem": "Shaxsiy xarajatlar bir necha ilova va daftarga bo'lingan edi. Oy oxirida “pul qayerga ketdi” degan savolga javob topish uchun hamma narsani qo'lda yig'ish kerak bo'lardi.",
    "proj.finance.solution": "Django REST Framework backend va Flutter mobil klientdan iborat tizim. Kategoriyalar bo'yicha xarajat tahlili, oylik hisobotlar va jamg'arma maqsadlari. Tranzaksiya API'si SimpleJWT bilan himoyalangan, asosiy oqimlar Pytest bilan qoplangan.",
    "proj.finance.result": "Xarajat kiritish telefondan bir necha soniyada bajariladi, oylik ko'rinish esa qo'lda hisoblashsiz avtomatik shakllanadi.",
    "proj.doctor.kind": "TIBBIY API",
    "proj.doctor.problem": "Kasalxona ichida navbat taqsimoti va shifokorlar o'rtasidagi muloqot telefon qo'ng'iroqlari va qog'oz ro'yxatlar orqali kechardi. Kim qaysi bemorni qabul qilayotgani markazlashgan holda ko'rinmasdi.",
    "proj.doctor.solution": "Rollarga asoslangan REST API: kasb bo'yicha navbatlar, real vaqtda ishlaydigan chat xonalari va PDF hisobot generatsiyasi. Butun API Swagger orqali hujjatlashtirilgan, shuning uchun frontend jamoasi hech kimdan so'ramasdan integratsiya qila oladi.",
    "proj.doctor.result": "Navbat va muloqot bitta API ortida birlashdi; hisobotlar PDF ko'rinishida to'g'ridan-to'g'ri tizimdan olinadi.",
    "proj.lady.kind": "TA'LIM PLATFORMASI",
    "proj.lady.problem": "Kurs materiallari, o'quvchilar progressi va sertifikatlar qo'lda boshqarilardi. Kim qaysi modulni tugatgani aniq emas, sertifikat esa har safar alohida tayyorlanardi.",
    "proj.lady.solution": "Kurs → modul ierarxiyasi ustiga qurilgan backend: foydalanuvchi progressini avtomatik kuzatish, yangiliklar lentasi va tugatilgan kurs uchun PDF sertifikat generatsiyasi. Logout JWT blacklist orqali amalga oshiriladi, ya'ni chiqilgan token qayta ishlatilmaydi.",
    "proj.lady.result": "Progress va sertifikat jarayoni to'liq avtomatlashdi; o'qituvchi qo'lda ro'yxat yuritmaydi.",
    "proj.view_project": "Loyihani ko'rish",
    "proj.view_github": "GitHub'da ko'rish",
    "contact.eyebrow": "// CONNECT",
    "contact.title": "Bog'lanish",
    "contact.headline": "Keling, birga nimadir quramiz",
    "contact.cta_telegram": "Telegram orqali yozish",
    "contact.email": "Email",
    "contact.phone": "Telefon",
    "contact.text": "Loyiha, vakansiya yoki texnik savol — yozing, 24 soat ichida javob beraman.",
    "form.eyebrow": "// SEND A MESSAGE",
    "form.title": "To'g'ridan-to'g'ri xabar yuboring",
    "form.name": "Ismingiz",
    "form.email": "Email",
    "form.message": "Xabar",
    "form.submit": "Xabarni yuborish",
    "form.sending": "Yuborilmoqda…",
    "form.ph_name": "Ism Familiya",
    "form.ph_email": "siz@example.com",
    "form.ph_message": "Loyiha yoki vakansiya haqida qisqacha…",
    "form.err_name": "Ismingizni kiriting.",
    "form.err_email": "To'g'ri email manzil kiriting.",
    "form.err_message": "Xabar matnini yozing (kamida 10 belgi).",
    "form.ok": "Rahmat! Xabaringiz yuborildi — 24 soat ichida javob beraman.",
    "form.fail": "Yuborishda xatolik. Iltimos, Telegram yoki email orqali yozing.",
    "form.mailto": "Email klientingiz ochildi — xabarni yuborish uchun \"Send\" tugmasini bosing.",
    "footer.note": "Django · DRF · ASP.NET · PostgreSQL — Samarqand, O'zbekiston",
    "footer.rights": "Barcha huquqlar himoyalangan",
    "footer.top": "Yuqoriga",
  },
  en: {
    "a11y.skip": "Skip to main content",
    "nav.home": "Home",
    "nav.about": "About",
    "nav.skills": "Skills",
    "nav.experience": "Experience",
    "nav.projects": "Projects",
    "nav.contact": "Contact",
    "hero.status_sub": "(Available · Remote / On-site)",
    "hero.sub": "BACKEND / FULL-STACK DEVELOPER",
    "hero.desc": "I build production-grade backend systems with Django, DRF and ASP.NET — REST APIs, secure authentication, and integrations that real users depend on every day.",
    "hero.cta_projects": "View projects",
    "hero.cta_contact": "Get in touch",
    "about.eyebrow": "// ABOUT ME",
    "about.title": "About Me",
    "about.hello": "Hi, I'm Muhammadyusuf",
    "about.text": "I'm a backend developer working in the Django and ASP.NET ecosystems. Day to day that means designing REST APIs, modelling database schemas, and shipping systems to production. Three things I optimise for on every project: data integrity, authentication security, and code that still makes sense months after deploy.",
    "about.cv_btn": "Download CV",
    "about.github_btn": "GitHub profile",
    "about.exp_eyebrow": "// SNAPSHOT",
    "about.stat_years": "Years of commercial experience",
    "about.stat_projects": "Open-source projects",
    "about.stat_response": "Response time",
    "about.mini_text": "I currently support the Karmed medical system at the “RIO vs RIATM” oncology centre: backend bugs, PostgreSQL data, FastReport documents and Telegram bots. Working on a system clinic staff use daily taught me exactly what a bug costs.",
    "about.fact_loc_k": "Location",
    "about.fact_loc_v": "Samarkand, Uzbekistan · UTC+5",
    "about.fact_lang_k": "Languages",
    "about.fact_lang_v": "Uzbek (native) · Russian · English (technical)",
    "about.fact_avail_k": "Availability",
    "about.fact_avail_v": "Remote or on-site · full-time / contract",
    "about.contact_link": "Get in touch with me",
    "skills.eyebrow": "// TECH STACK",
    "skills.title": "Skills",
    "skills.lede": "No percentages — just where and how I've actually used each technology.",
    "skills.name.api": "REST API design",
    "skills.name.auth": "Authentication — JWT / 2FA / OTP",
    "skills.ctx.django": "HRMM · Doctor-Direct · LadyCoders · Finance App",
    "skills.ctx.python": "Backend logic, automation scripts, bot services",
    "skills.ctx.pg": "Schema design, migrations, query analysis and tuning",
    "skills.ctx.api": "Versioning, role-based permissions, Swagger/OpenAPI docs",
    "skills.ctx.auth": "SimpleJWT, blacklist logout, audit logging",
    "skills.ctx.tg": "Notification and service bots — building and restoring them",
    "skills.ctx.aspnet": "Supporting and debugging the Karmed medical system",
    "skills.ctx.docker": "Containerisation and Railway deployment",
    "skills.ctx.git": "Daily version control, server administration",
    "skills.ctx.flutter": "Finance App mobile client — API integration and screens",
    "skills.tier.core": "Core",
    "skills.tier.regular": "Regular",
    "skills.tier.working": "Working knowledge",
    "exp.eyebrow": "// EXPERIENCE TIMELINE",
    "exp.title": "Work Experience",
    "exp.rio.date": "2025 — present",
    "exp.rio.role": "Backend Support Engineer",
    "exp.rio.text": "Day-to-day support for the Karmed medical system: finding and fixing backend bugs, extracting and correcting PostgreSQL data, FastReport report templates, and restoring Telegram bots that go down. Clinic staff use it every day, so every change gets verified before it ships.",
    "exp.freelance.date": "2023 — 2025",
    "exp.freelance.role": "Freelance Full-Stack Developer",
    "exp.freelance.text": "Ran projects end to end: requirements gathering, database schema, Django backend, deployment and post-handover support. Worked with PostgreSQL, FastReport and Telegram integrations.",
    "exp.edu.date": "2025",
    "exp.edu.role": "Bachelor's — Information Technology Engineer",
    "exp.edu.text": "Bachelor's degree in Information Technology Engineering.",
    "projects.eyebrow": "// FEATURED PROJECTS",
    "projects.title": "My Projects",
    "projects.lede": "For each project: what the problem was, what I built, and what changed as a result.",
    "filter.all": "All",
    "filter.django": "Django / DRF",
    "filter.flutter": "Flutter",
    "filter.backend": "Backend API",
    "filter.status": "{filter} — showing {n} of {total} projects",
    "projects.empty": "No projects match this filter. Try another one.",
    "case.problem": "Problem",
    "case.solution": "Solution",
    "case.result": "Result",
    "proj.hrmm.kind": "HR PLATFORM",
    "proj.hrmm.problem": "Employee records, attendance and leave requests were scattered across separate spreadsheets and paper forms. Monthly reports were assembled by hand, and nothing recorded who changed what.",
    "proj.hrmm.solution": "I built a single system on Django + DRF: employee database, attendance, a leave-request workflow and automated reports. A Telegram bot pushes notifications to staff, JWT + 2FA/OTP protects sign-in, and an audit log records who changed what and when.",
    "proj.hrmm.result": "HR processes moved into one system: reports are no longer assembled by hand, leave requests flow through Telegram, and every record change is traceable.",
    "proj.finance.kind": "API + MOBILE",
    "proj.finance.problem": "Personal spending was split across several apps and notebooks. Answering “where did the money go” at month end meant collecting everything manually.",
    "proj.finance.solution": "A Django REST Framework backend paired with a Flutter mobile client. Category-level expense analytics, monthly reports and savings goals. The transaction API is protected with SimpleJWT and the core flows are covered by Pytest.",
    "proj.finance.result": "Logging an expense takes seconds from the phone, and the monthly view builds itself with no manual arithmetic.",
    "proj.doctor.kind": "HEALTHCARE API",
    "proj.doctor.problem": "Inside the hospital, queue allocation and doctor-to-doctor communication ran on phone calls and paper lists. There was no central view of who was seeing which patient.",
    "proj.doctor.solution": "A role-based REST API: queues by profession, real-time chat rooms and PDF report generation. The whole API is documented through Swagger, so the frontend team can integrate without asking anyone.",
    "proj.doctor.result": "Queueing and communication now sit behind one API, and reports come straight out of the system as PDFs.",
    "proj.lady.kind": "EDUCATION PLATFORM",
    "proj.lady.problem": "Course material, student progress and certificates were managed by hand. Nobody could say who had finished which module, and every certificate was prepared individually.",
    "proj.lady.solution": "A backend built on a course → module hierarchy: automatic progress tracking, a news feed, and PDF certificate generation on course completion. Logout goes through a JWT blacklist, so a signed-out token can't be reused.",
    "proj.lady.result": "Progress tracking and certificates are fully automated; instructors no longer keep manual lists.",
    "proj.view_project": "View project",
    "proj.view_github": "View on GitHub",
    "contact.eyebrow": "// CONNECT",
    "contact.title": "Get in Touch",
    "contact.headline": "Let's build something together",
    "contact.cta_telegram": "Message me on Telegram",
    "contact.email": "Email",
    "contact.phone": "Phone",
    "contact.text": "A project, a role, or a technical question — write to me and I'll reply within 24 hours.",
    "form.eyebrow": "// SEND A MESSAGE",
    "form.title": "Send a message directly",
    "form.name": "Your name",
    "form.email": "Email",
    "form.message": "Message",
    "form.submit": "Send message",
    "form.sending": "Sending…",
    "form.ph_name": "First and last name",
    "form.ph_email": "you@example.com",
    "form.ph_message": "A few lines about the project or role…",
    "form.err_name": "Please enter your name.",
    "form.err_email": "Please enter a valid email address.",
    "form.err_message": "Please write a message (at least 10 characters).",
    "form.ok": "Thank you! Your message was sent — I'll reply within 24 hours.",
    "form.fail": "Something went wrong. Please reach me on Telegram or by email.",
    "form.mailto": "Your email client is open — press Send to deliver the message.",
    "footer.note": "Django · DRF · ASP.NET · PostgreSQL — Samarkand, Uzbekistan",
    "footer.rights": "All rights reserved",
    "footer.top": "Back to top",
  },
  ru: {
    "a11y.skip": "Перейти к основному содержанию",
    "nav.home": "Главная",
    "nav.about": "Обо мне",
    "nav.skills": "Навыки",
    "nav.experience": "Опыт",
    "nav.projects": "Проекты",
    "nav.contact": "Контакты",
    "hero.status_sub": "(Готов к работе · Удалённо / Офис)",
    "hero.sub": "BACKEND / FULL-STACK DEVELOPER",
    "hero.desc": "Создаю backend-системы production-уровня на Django, DRF и ASP.NET — REST API, безопасная аутентификация и интеграции, которыми пользуются каждый день.",
    "hero.cta_projects": "Смотреть проекты",
    "hero.cta_contact": "Связаться",
    "about.eyebrow": "// ОБО МНЕ",
    "about.title": "Обо мне",
    "about.hello": "Привет, я Мухаммадюсуф",
    "about.text": "Backend-разработчик в экосистемах Django и ASP.NET. Ежедневная работа — проектирование REST API, схем баз данных и вывод систем в production. В каждом проекте оптимизирую три вещи: целостность данных, безопасность аутентификации и код, который остаётся понятным спустя месяцы после деплоя.",
    "about.cv_btn": "Скачать резюме",
    "about.github_btn": "Профиль GitHub",
    "about.exp_eyebrow": "// SNAPSHOT",
    "about.stat_years": "Лет коммерческого опыта",
    "about.stat_projects": "Проектов с открытым кодом",
    "about.stat_response": "Время ответа",
    "about.mini_text": "Сейчас поддерживаю медицинскую систему Karmed в онкоцентре «RIO vs RIATM»: ошибки backend, данные PostgreSQL, документы FastReport и Telegram-боты. Работа с системой, которой персонал клиники пользуется ежедневно, наглядно показала цену ошибки.",
    "about.fact_loc_k": "Локация",
    "about.fact_loc_v": "Самарканд, Узбекистан · UTC+5",
    "about.fact_lang_k": "Языки",
    "about.fact_lang_v": "Узбекский (родной) · Русский · Английский (технический)",
    "about.fact_avail_k": "Занятость",
    "about.fact_avail_v": "Удалённо или офис · full-time / контракт",
    "about.contact_link": "Связаться со мной",
    "skills.eyebrow": "// ТЕХНОЛОГИИ",
    "skills.title": "Навыки",
    "skills.lede": "Без процентов — только где и как я реально применял каждую технологию.",
    "skills.name.api": "Проектирование REST API",
    "skills.name.auth": "Аутентификация — JWT / 2FA / OTP",
    "skills.ctx.django": "HRMM · Doctor-Direct · LadyCoders · Finance App",
    "skills.ctx.python": "Backend-логика, скрипты автоматизации, сервисы ботов",
    "skills.ctx.pg": "Проектирование схем, миграции, анализ и оптимизация запросов",
    "skills.ctx.api": "Версионирование, ролевые права, документация Swagger/OpenAPI",
    "skills.ctx.auth": "SimpleJWT, выход через blacklist, журнал аудита",
    "skills.ctx.tg": "Боты уведомлений и сервисные боты — разработка и восстановление",
    "skills.ctx.aspnet": "Поддержка и отладка медицинской системы Karmed",
    "skills.ctx.docker": "Контейнеризация и деплой на Railway",
    "skills.ctx.git": "Ежедневный контроль версий, администрирование серверов",
    "skills.ctx.flutter": "Мобильный клиент Finance App — интеграция с API и экраны",
    "skills.tier.core": "Основное",
    "skills.tier.regular": "Регулярно",
    "skills.tier.working": "Есть опыт",
    "exp.eyebrow": "// ОПЫТ РАБОТЫ",
    "exp.title": "Мой опыт работы",
    "exp.rio.date": "2025 — по настоящее время",
    "exp.rio.role": "Инженер поддержки backend",
    "exp.rio.text": "Ежедневная поддержка медицинской системы Karmed: поиск и исправление ошибок backend, выгрузка и корректировка данных PostgreSQL, шаблоны отчётов FastReport, восстановление упавших Telegram-ботов. Системой пользуется персонал клиники каждый день, поэтому каждое изменение проверяется до выката.",
    "exp.freelance.date": "2023 — 2025",
    "exp.freelance.role": "Freelance Full-Stack разработчик",
    "exp.freelance.text": "Вёл проекты от начала до конца: сбор требований, схема базы данных, Django-backend, деплой и поддержка после сдачи. Работал с PostgreSQL, FastReport и интеграциями Telegram.",
    "exp.edu.date": "2025",
    "exp.edu.role": "Бакалавр — инженер информационных технологий",
    "exp.edu.text": "Степень бакалавра по направлению «Информационные технологии».",
    "projects.eyebrow": "// ИЗБРАННЫЕ ПРОЕКТЫ",
    "projects.title": "Мои проекты",
    "projects.lede": "По каждому проекту: какая была проблема, что я построил и что изменилось в результате.",
    "filter.all": "Все",
    "filter.django": "Django / DRF",
    "filter.flutter": "Flutter",
    "filter.backend": "Backend API",
    "filter.status": "{filter} — показано {n} из {total} проектов",
    "projects.empty": "По этому фильтру проектов нет. Выберите другой.",
    "case.problem": "Проблема",
    "case.solution": "Решение",
    "case.result": "Результат",
    "proj.hrmm.kind": "HR-ПЛАТФОРМА",
    "proj.hrmm.problem": "Данные сотрудников, посещаемость и заявки на отпуск были разбросаны по отдельным таблицам и бумажным формам. Ежемесячные отчёты собирались вручную, а кто что изменил — нигде не фиксировалось.",
    "proj.hrmm.solution": "Собрал единую систему на Django + DRF: база сотрудников, посещаемость, процесс заявок на отпуск и автоматические отчёты. Telegram-бот отправляет уведомления, JWT + 2FA/OTP защищают вход, а журнал аудита фиксирует, кто и когда внёс изменение.",
    "proj.hrmm.result": "HR-процессы перешли в одну систему: отчёты не собираются вручную, заявки на отпуск проходят через Telegram, а любое изменение записи отслеживается.",
    "proj.finance.kind": "API + МОБИЛЬНОЕ",
    "proj.finance.problem": "Личные расходы были разделены между несколькими приложениями и блокнотами. В конце месяца ответ на вопрос «куда ушли деньги» требовал ручного сведения всех данных.",
    "proj.finance.solution": "Backend на Django REST Framework в связке с мобильным клиентом на Flutter. Аналитика расходов по категориям, ежемесячные отчёты и цели накоплений. API транзакций защищён SimpleJWT, ключевые сценарии покрыты Pytest.",
    "proj.finance.result": "Запись расхода занимает секунды с телефона, а месячная картина формируется автоматически, без ручных подсчётов.",
    "proj.doctor.kind": "МЕДИЦИНСКОЕ API",
    "proj.doctor.problem": "Внутри больницы распределение очереди и общение между врачами шли через телефонные звонки и бумажные списки. Не было центрального представления о том, кто какого пациента принимает.",
    "proj.doctor.solution": "REST API на основе ролей: очереди по специальностям, чат-комнаты в реальном времени и генерация PDF-отчётов. Всё API задокументировано через Swagger, поэтому frontend-команда может интегрироваться без дополнительных вопросов.",
    "proj.doctor.result": "Очереди и коммуникация объединились за одним API, а отчёты выгружаются из системы напрямую в PDF.",
    "proj.lady.kind": "ОБРАЗОВАТЕЛЬНАЯ ПЛАТФОРМА",
    "proj.lady.problem": "Материалы курсов, прогресс учащихся и сертификаты велись вручную. Кто какой модуль завершил — неясно, а сертификат каждый раз готовился отдельно.",
    "proj.lady.solution": "Backend на иерархии курс → модуль: автоматическое отслеживание прогресса, лента новостей и генерация PDF-сертификата по завершении курса. Выход реализован через JWT blacklist, поэтому отозванный токен нельзя переиспользовать.",
    "proj.lady.result": "Отслеживание прогресса и сертификаты полностью автоматизированы; преподаватель больше не ведёт списки вручную.",
    "proj.view_project": "Смотреть проект",
    "proj.view_github": "Смотреть на GitHub",
    "contact.eyebrow": "// СВЯЗЬ",
    "contact.title": "Связаться",
    "contact.headline": "Давайте создадим что-то вместе",
    "contact.cta_telegram": "Написать в Telegram",
    "contact.email": "Email",
    "contact.phone": "Телефон",
    "contact.text": "Проект, вакансия или технический вопрос — напишите, отвечу в течение 24 часов.",
    "form.eyebrow": "// SEND A MESSAGE",
    "form.title": "Написать напрямую",
    "form.name": "Ваше имя",
    "form.email": "Email",
    "form.message": "Сообщение",
    "form.submit": "Отправить сообщение",
    "form.sending": "Отправка…",
    "form.ph_name": "Имя и фамилия",
    "form.ph_email": "you@example.com",
    "form.ph_message": "Несколько строк о проекте или вакансии…",
    "form.err_name": "Пожалуйста, введите имя.",
    "form.err_email": "Введите корректный email-адрес.",
    "form.err_message": "Напишите сообщение (минимум 10 символов).",
    "form.ok": "Спасибо! Сообщение отправлено — отвечу в течение 24 часов.",
    "form.fail": "Не удалось отправить. Напишите, пожалуйста, в Telegram или на email.",
    "form.mailto": "Открыт ваш почтовый клиент — нажмите «Отправить», чтобы доставить сообщение.",
    "footer.note": "Django · DRF · ASP.NET · PostgreSQL — Самарканд, Узбекистан",
    "footer.rights": "Все права защищены",
    "footer.top": "Наверх",
  },
};

const langSwitcher = document.getElementById("langSwitcher");
const langCurrentBtn = document.getElementById("langCurrentBtn");
const langDropdown = document.getElementById("langDropdown");
const langCurrentLabel = document.getElementById("langCurrentLabel");
const i18nNodes = document.querySelectorAll("[data-i18n]");
const i18nPlaceholderNodes = document.querySelectorAll("[data-i18n-placeholder]");

let currentLang = "uz";

function t(key) {
  const dict = translations[currentLang] || translations.uz;
  return dict[key] ?? translations.uz[key] ?? "";
}

function applyLanguage(lang) {
  const dict = translations[lang] || translations.uz;
  currentLang = translations[lang] ? lang : "uz";

  i18nNodes.forEach((node) => {
    const key = node.dataset.i18n;
    if (dict[key]) {
      node.textContent = dict[key];
      if (node.classList.contains("scramble-text")) {
        node.dataset.scramble = dict[key];
      }
    }
  });

  i18nPlaceholderNodes.forEach((node) => {
    const value = dict[node.dataset.i18nPlaceholder];
    if (value) node.placeholder = value;
  });

  document.documentElement.lang = currentLang;
  if (langCurrentLabel) langCurrentLabel.textContent = currentLang.toUpperCase();
  if (langDropdown) {
    langDropdown.querySelectorAll(".lang-option").forEach((option) => {
      const isActive = option.dataset.lang === currentLang;
      option.classList.toggle("is-active", isActive);
      option.setAttribute("aria-selected", String(isActive));
    });
  }
  document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: currentLang } }));
}

/* ---- Initial language resolution ----
   Order: explicit ?lang= in the URL → a previously saved choice →
   the browser's own language list → Uzbek.

   The browser step is the one that matters: the site ships full EN
   and RU translations, and availability is stated as "Remote /
   On-site", so a recruiter arriving from outside Uzbekistan used to
   land on Uzbek and have to find the switcher in the navbar. A
   saved preference always wins, so anyone who picks a language
   keeps it.

   To go back to Uzbek-always, delete the detectLanguage() branch. */

function normaliseLang(tag) {
  if (!tag) return null;
  const base = String(tag).toLowerCase().split("-")[0];
  return translations[base] ? base : null;
}

function detectLanguage() {
  const list = navigator.languages && navigator.languages.length
    ? navigator.languages
    : [navigator.language];
  for (const tag of list) {
    const match = normaliseLang(tag);
    if (match) return match;
  }
  return null;
}

const urlLang = normaliseLang(new URLSearchParams(window.location.search).get("lang"));
const savedLang = normaliseLang(localStorage.getItem("lang"));
const initialLang = urlLang || savedLang || detectLanguage() || "uz";

if (initialLang !== "uz") applyLanguage(initialLang);
else document.documentElement.lang = "uz";

// An explicit ?lang= is a deliberate choice — remember it so the
// hreflang alternates in <head> resolve to a stable experience.
if (urlLang) localStorage.setItem("lang", urlLang);

if (langSwitcher && langCurrentBtn && langDropdown) {
  const options = Array.from(langDropdown.querySelectorAll(".lang-option"));

  const closeLangMenu = ({ focusTrigger = false } = {}) => {
    if (!langSwitcher.classList.contains("is-open")) return;
    langSwitcher.classList.remove("is-open");
    langCurrentBtn.setAttribute("aria-expanded", "false");
    if (focusTrigger) langCurrentBtn.focus();
  };

  const openLangMenu = () => {
    langSwitcher.classList.add("is-open");
    langCurrentBtn.setAttribute("aria-expanded", "true");
    (options.find((o) => o.classList.contains("is-active")) || options[0])?.focus();
  };

  langCurrentBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    if (langSwitcher.classList.contains("is-open")) closeLangMenu();
    else openLangMenu();
  });

  langCurrentBtn.addEventListener("keydown", (event) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      openLangMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (!langSwitcher.contains(event.target)) closeLangMenu();
  });

  options.forEach((option, index) => {
    option.addEventListener("click", () => {
      const lang = option.dataset.lang;
      applyLanguage(lang);
      localStorage.setItem("lang", lang);
      closeLangMenu({ focusTrigger: true });
    });

    // Roving arrow-key navigation inside the listbox.
    option.addEventListener("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        options[(index + 1) % options.length].focus();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        options[(index - 1 + options.length) % options.length].focus();
      } else if (event.key === "Home") {
        event.preventDefault();
        options[0].focus();
      } else if (event.key === "End") {
        event.preventDefault();
        options[options.length - 1].focus();
      } else if (event.key === "Tab") {
        closeLangMenu();
      }
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeLangMenu({ focusTrigger: true });
  });
}

/* ============================================================
   Project filters — Django/DRF, Flutter, Backend, all
   Buttons act as a toggle group (aria-pressed), not tabs: there
   are no tabpanels here, so role="tab" would have been a lie to
   screen readers. A visually hidden live region announces how
   many projects remain after each filter.
   ============================================================ */

const filterPills = document.querySelectorAll(".filter-pill");
const projectCards = document.querySelectorAll(".project-card");
const filterStatus = document.getElementById("filterStatus");

const projectsEmpty = document.getElementById("projectsEmpty");

if (filterPills.length && projectCards.length) {
  /**
   * @param {string} filter
   * @param {boolean} pushUrl  false while restoring from the URL, so
   *   replaying history does not append another entry.
   */
  function applyFilter(filter, pushUrl = true) {
    let matched = null;
    filterPills.forEach((p) => {
      const isActive = p.dataset.filter === filter;
      p.classList.toggle("is-active", isActive);
      p.setAttribute("aria-pressed", String(isActive));
      if (isActive) matched = p;
    });
    if (!matched) return applyFilter("all", pushUrl);

    let shown = 0;
    projectCards.forEach((card) => {
      const stacks = (card.dataset.stack || "").split(" ");
      const show = filter === "all" || stacks.includes(filter);
      if (show) shown += 1;
      card.classList.toggle("is-hidden", !show);
    });

    // Empty state. No current filter produces zero results, but a
    // filter added later could, and a silently blank section reads
    // as a broken page rather than an empty one.
    if (projectsEmpty) projectsEmpty.hidden = shown > 0;

    if (filterStatus) {
      // Words, not "2 / 4" — a live region announcing "two slash
      // four" tells a screen-reader user nothing about what changed.
      const label = matched.textContent.trim();
      filterStatus.textContent = t("filter.status")
        .replace("{n}", String(shown))
        .replace("{total}", String(projectCards.length))
        .replace("{filter}", label);
    }

    // URL reflects state, so a filtered view is linkable and the
    // back button behaves the way the browser chrome promises.
    if (pushUrl) {
      const url = new URL(window.location.href);
      if (filter === "all") url.searchParams.delete("stack");
      else url.searchParams.set("stack", filter);
      history.pushState({ stack: filter }, "", url);
    }
  }

  filterPills.forEach((pill) => {
    pill.addEventListener("click", () => applyFilter(pill.dataset.filter));
  });

  window.addEventListener("popstate", () => {
    const stack = new URLSearchParams(window.location.search).get("stack") || "all";
    applyFilter(stack, false);
  });

  const initialFilter =
    new URLSearchParams(window.location.search).get("stack") || "all";
  if (initialFilter !== "all") applyFilter(initialFilter, false);

  // Keep the announcement in the visitor's language.
  document.addEventListener("langchange", () => {
    const active = document.querySelector(".filter-pill.is-active");
    if (active) applyFilter(active.dataset.filter, false);
  });
}

/* ============================================================
   Footer year — keeps the copyright honest without a build step
   ============================================================ */

const footerYear = document.getElementById("footerYear");
if (footerYear) footerYear.textContent = String(new Date().getFullYear());

/* ============================================================
   Contact form
   Posts to Web3Forms when an access key is configured. If the key
   is left blank the form degrades to a prefilled mailto: draft
   instead of failing — the visitor always has a working path.
   ============================================================ */

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  const statusEl = document.getElementById("formStatus");
  const submitBtn = contactForm.querySelector(".form-submit");
  const submitLabel = contactForm.querySelector(".form-submit-label");
  const accessKey = (document.getElementById("formAccessKey")?.value || "").trim();

  const fields = [
    { el: contactForm.querySelector("#formName"), valid: (v) => v.trim().length > 0 },
    { el: contactForm.querySelector("#formEmail"), valid: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) },
    { el: contactForm.querySelector("#formMessage"), valid: (v) => v.trim().length >= 10 },
  ].filter((f) => f.el);

  function setFieldState(field) {
    const ok = field.valid(field.el.value);
    field.el.closest(".form-field")?.classList.toggle("has-error", !ok);
    field.el.setAttribute("aria-invalid", String(!ok));
    return ok;
  }

  fields.forEach((field) => {
    field.el.addEventListener("blur", () => setFieldState(field));
    field.el.addEventListener("input", () => {
      if (field.el.closest(".form-field")?.classList.contains("has-error")) {
        setFieldState(field);
      }
    });
  });

  function setStatus(messageKey, tone) {
    if (!statusEl) return;
    statusEl.textContent = t(messageKey);
    statusEl.dataset.tone = tone;
  }

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Honeypot: bots fill every field they find, humans never see this one.
    if (contactForm.querySelector('[name="botcheck"]')?.checked) return;

    let firstInvalid = null;
    fields.forEach((field) => {
      const ok = setFieldState(field);
      if (!ok && !firstInvalid) firstInvalid = field.el;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    const name = contactForm.querySelector("#formName").value.trim();
    const email = contactForm.querySelector("#formEmail").value.trim();
    const message = contactForm.querySelector("#formMessage").value.trim();

    // No Web3Forms key configured → hand off to the visitor's mail client.
    if (!accessKey) {
      const subject = encodeURIComponent(`Portfolio — ${name}`);
      const body = encodeURIComponent(`${message}\n\n—\n${name}\n${email}`);
      window.location.href = `mailto:mamaniyozovmuhammadyusuf5@gmail.com?subject=${subject}&body=${body}`;
      setStatus("form.mailto", "ok");
      return;
    }

    submitBtn.disabled = true;
    if (submitLabel) submitLabel.textContent = t("form.sending");

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      contactForm.reset();
      setStatus("form.ok", "ok");
    } catch (error) {
      setStatus("form.fail", "error");
    } finally {
      submitBtn.disabled = false;
      if (submitLabel) submitLabel.textContent = t("form.submit");
    }
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
   ============================================================ */

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

/* The counter is a real progress gate, not theatre on a timer.
   It advances toward 30 but holds just short until the things the
   first frame actually depends on have landed — fonts (which
   otherwise reflow the hero right after reveal) and the WebGL
   background. On a fast connection the wait is imperceptible; on a
   slow one the visitor stops seeing the page reflow under them.

   Every gate is failsafe. A hard 4s ceiling releases the loader
   regardless, so no missing font file or absent WebGL context can
   strand a visitor behind a black screen — the page always
   arrives, the counter just stops claiming to measure anything. */

function runLoader() {
  if (!loader || !loaderCount) {
    decodeHeroSub();
    document.dispatchEvent(new CustomEvent("loaderdone"));
    return;
  }

  const finish = () => {
    if (loader.classList.contains("is-done")) return;
    loaderCount.textContent = "30";
    loader.classList.add("is-done");
    decodeHeroSub();
    document.dispatchEvent(new CustomEvent("loaderdone"));
  };

  if (prefersReducedMotion) {
    finish();
    return;
  }

  let ready = false;
  const readySignals = [];

  readySignals.push(
    document.fonts && document.fonts.ready
      ? document.fonts.ready.catch(() => {})
      : Promise.resolve()
  );

  readySignals.push(
    new Promise((resolve) => {
      // scroll-experience.js fires this whether or not WebGL is
      // available, so this never hangs on an unsupported browser.
      document.addEventListener("topologyready", resolve, { once: true });
      setTimeout(resolve, 2600);
    })
  );

  Promise.all(readySignals).then(() => {
    ready = true;
  });

  const total = 30;
  const minMs = 900;
  const ceilingMs = 4000;
  const start = performance.now();

  const tick = (now) => {
    const elapsed = now - start;

    // Ease toward 27 on time alone; the last three tick over only
    // once the real work is done. A bar that sits at 99% is a lie
    // people recognise, so it never parks at the top.
    const timed = Math.min(elapsed / minMs, 1) * 27;
    const value = ready ? Math.min(27 + (elapsed - minMs) / 40, total) : timed;
    loaderCount.textContent = String(Math.floor(Math.min(value, total))).padStart(2, "0");

    if ((ready && value >= total && elapsed >= minMs) || elapsed >= ceilingMs) {
      setTimeout(finish, 180);
      return;
    }
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

runLoader();

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

    // The -50% centring now lives on the ::after pseudo-element, so
    // these writes carry position only. Keeping the two on separate
    // elements means the idle-position transform and the hover
    // scale never overwrite each other.
    window.addEventListener(
      "mousemove",
      (event) => {
        mouseX = event.clientX;
        mouseY = event.clientY;
        cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      },
      { passive: true }
    );

    /* ---- Proximity to the topology field ----
       The ring reacts when it passes near a live node, so the cursor
       reads as part of the same system rather than an overlay on top
       of it. Sampled on a timer rather than per frame: the graph
       drifts slowly and 10Hz is indistinguishable from 60Hz here,
       at a sixth of the cost. */
    let topologyGraph = null;
    let nearField = false;

    document.addEventListener("topologyready", () => {
      // The module hands its graph to window for exactly this.
      topologyGraph = window.__topologyGraph || null;
    });

    const PROXIMITY_PX = 90;

    function sampleProximity() {
      if (!topologyGraph || !topologyGraph.screen) return;
      const { screen, screenCount } = topologyGraph;
      let near = false;
      for (let i = 0; i < screenCount; i++) {
        const dx = screen[i * 2] - mouseX;
        const dy = screen[i * 2 + 1] - mouseY;
        if (dx * dx + dy * dy < PROXIMITY_PX * PROXIMITY_PX) {
          near = true;
          break;
        }
      }
      if (near !== nearField) {
        nearField = near;
        cursorRing.classList.toggle("is-near", near);
      }
    }

    setInterval(sampleProximity, 100);

    const renderRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
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
   Ambient background is owned entirely by the SystemTopology
   module (js/modules/system-topology.js, wired in
   js/scroll-experience.js). The ribbon mouse-trail, spiral
   particle field and GeoShape centrepiece that used to live here
   were removed rather than ported: they were three separate
   ambient systems competing with each other, and the ribbon in
   particular duplicated the custom cursor's job.
   ============================================================ */
