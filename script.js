/* ============================================================
   Portfolio interactions — vanilla JS
   i18n (uz/en/ru/tr), theme toggle, mobile nav,
   scroll reveal, project modal, contact form.
   ============================================================ */

const body = document.body;
const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const themeToggle = document.querySelector("[data-theme-toggle]");
const themeIcon = themeToggle.querySelector(".theme-icon");
const navLinks = [...document.querySelectorAll(".nav-menu a")];
const sections = [...document.querySelectorAll("main section[id]")];
const revealItems = document.querySelectorAll(".reveal");
const contactForm = document.querySelector(".contact-form");
const formNote = document.querySelector("[data-form-note]");

/* ---------- Theme (dark default; light scaffold ready) ---------- */
let isDark = true;
const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme) {
  isDark = savedTheme === "dark";
} else {
  isDark = !window.matchMedia("(prefers-color-scheme: light)").matches;
}
function applyTheme() {
  body.classList.toggle("dark-theme", isDark);
  body.classList.toggle("light-theme", !isDark);
  themeIcon.innerHTML = isDark
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
}
applyTheme();
themeToggle.addEventListener("click", () => {
  isDark = !isDark;
  localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
  applyTheme();
});

/* ---------- Header scroll state ---------- */
function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}
window.addEventListener("scroll", updateHeader, { passive: true });

/* ---------- Lightweight client-side i18n ---------- */
const i18nElements = [...document.querySelectorAll("[data-i18n]")];
const i18nAttrElements = [...document.querySelectorAll("[data-i18n-attr]")];

i18nElements.forEach((el) => {
  if (!el.dataset.i18nDefault) el.dataset.i18nDefault = el.textContent;
});
i18nAttrElements.forEach((el) => {
  if (!el.dataset.i18nAttrDefault) el.dataset.i18nAttrDefault = el.getAttribute("aria-label") || "";
});

const translations = {
  uz: {
    "a11y.skip": "Asosiy kontentga o'tish",
    "nav.about": "Men haqimda",
    "nav.skills": "Ko'nikmalar",
    "nav.projects": "Loyihalar",
    "nav.contact": "Aloqa",
    "nav.aria": "Asosiy navigatsiya",
    "brand.aria": "Bosh sahifaga o'tish",
    "menu.open": "Menyuni ochish",
    "language.aria": "Tilni tanlash",
    "theme.aria": "Rang rejimini almashtirish",
    "modal.close": "Modalni yopish",
    "hero.available": "Ishga tayyor · Remote / Ofis",
    "hero.role": "Full-Stack Developer",
    "hero.text": "Django, DRF, PostgreSQL va vanilla JavaScript asosida biznes uchun ishonchli, kengayadigan web tizimlar yarataman. Backend arxitekturasi, deployment va rollarga asoslangan access control bo'yicha ixtisoslashganman.",
    "hero.projects": "Loyihalarni ko'rish",
    "hero.contact": "Bog'lanish",
    "hero.metaAria": "Qisqa statistika",
    "hero.statYears": "yil tajriba",
    "hero.statProjects": "yirik loyiha",
    "hero.statLangs": "til (UZ/EN/RU/TR)",
    "skills.eyebrow": "Tech Stack",
    "skills.title": "Ko'nikmalar",
    "skills.text": "Amaliy ish tajribasi asosida guruhlangan texnologiyalar.",
    "skills.backendTitle": "Backend",
    "skills.backendDesc": "Biznes mantiq, REST API, xavfsizlik va ma'lumotlar ombori arxitekturasi.",
    "skills.frontendTitle": "Frontend",
    "skills.frontendDesc": "Responsive, interaktiv interfeyslar va mijoz tomoni logikasi.",
    "skills.devopsTitle": "DevOps & Deploy",
    "skills.devopsDesc": "Konteynerlashtirish, deployment va production qo'llab-quvvatlash.",
    "skills.toolsTitle": "Tools",
    "skills.toolsDesc": "Versiya nazorati, hisobot generatsiyasi va integratsiyalar.",
    "projects.eyebrow": "Ishlar",
    "projects.title": "Loyihalar",
    "projects.text": "Ishlab chiqarilgan ikkita real tizim.",
    "projects.details": "Batafsil",
    "projects.live": "Live · Railway",
    "projects.private": "Private loyiha",
    "projects.privateNote": "Kod yopiq (NDA)",
    "projects.hrmmSub": "Human Resource Management System",
    "projects.hrmmDesc": "Xodimlarni boshqarish tizimi: JWT autentifikatsiya, ko'p tilli (i18n) interfeys, dark/light tema, arxivlash tizimi va Telegram bot integratsiyasi. Django 5.2 + DRF backend, vanilla JS frontend, Railway'da deploy qilingan.",
    "projects.rbysSub": "Dorixona / ombor boshqaruv tizimi",
    "projects.rbysDesc": "Inventarizatsiya hisobotlari, murakkab SQL (CTE'lar, ko'p jadvalli join'lar) va FastReport orqali hisobot generatsiyasi. ASP.NET/IIS + PostgreSQL asosida qurilgan.",
    "about.eyebrow": "Profil",
    "about.title": "Men haqimda",
    "about.role": "Full-Stack Developer · Toshkent",
    "about.p1": "Biznes jarayonlarini raqamlashtirish, ichki CRM/ERP modullarini optimallashtirish va mavjud tizimlardagi xatolarni tizimli hal qilish bilan shug'ullanaman. Kuchli tomonlarim: backend logic, ma'lumotlar bazasi modeli, REST API va production muammolarini hal qilish.",
    "about.p2": "Backend va frontend'ni birga olib boradigan full-stack yondashuvda ishlayman: aniq arxitektura, o'qiladigan kod va ishonchli deploy.",
    "about.langUz": "O'zbek: ona tili",
    "about.langEn": "English: B1",
    "about.langRu": "Русский: B1",
    "about.langTr": "Türkçe: B1",
    "experience.title": "Tajriba",
    "experience.currentDate": "Sen 2025 — hozir",
    "experience.currentText": "Karmed tizimida bugfixing, funksiyalarni yaxshilash va muammoli loyihalarni tiklash.",
    "experience.freelanceDate": "Yan 2023 — Sen 2025",
    "experience.freelanceRole": "Freelance Backend Developer",
    "experience.freelanceText": "Biznes uchun web loyihalar, backend dasturlash va mavjud kodni tahlil qilish.",
    "education.title": "Ta'lim",
    "education.tuit": "Toshkent Axborot Texnologiyalari Universiteti",
    "education.degree": "Dasturiy ta'minot muhandisligi, Bakalavr",
    "education.dates": "2021 — 2025",
    "contact.eyebrow": "Aloqa",
    "contact.title": "Bog'lanish",
    "contact.text": "Hamkorlik, ish taklifi yoki loyiha muhokamasi uchun yozing.",
    "form.name": "Ismingiz",
    "form.email": "Email",
    "form.message": "Xabar",
    "form.submit": "Xabar yuborish",
    "form.successTitle": "Xabar tayyorlandi!",
    "form.successText": "Xabaringiz muvaffaqiyatli saqlandi. Tez orada aloqaga chiqamiz!",
    "form.errorName": "Ismingiz kamida 2 ta belgidan iborat bo'lishi kerak",
    "form.errorEmail": "Iltimos, to'g'ri email kiriting",
    "form.errorMessage": "Xabaringiz kamida 10 ta belgidan iborat bo'lishi kerak",
    "footer.copy": "© 2026 Muhammadyusuf Mamaniyozov. Barcha huquqlar himoyalangan.",
    "modal.achievements": "Asosiy yutuqlar"
  },
  en: {
    "a11y.skip": "Skip to main content",
    "nav.about": "About",
    "nav.skills": "Skills",
    "nav.projects": "Projects",
    "nav.contact": "Contact",
    "nav.aria": "Main navigation",
    "brand.aria": "Go to home",
    "menu.open": "Open menu",
    "language.aria": "Choose language",
    "theme.aria": "Toggle color scheme",
    "modal.close": "Close modal",
    "hero.available": "Available for work · Remote / Office",
    "hero.role": "Full-Stack Developer",
    "hero.text": "I build reliable, scalable web systems for business using Django, DRF, PostgreSQL and vanilla JavaScript. I specialise in backend architecture, deployment and role-based access control.",
    "hero.projects": "View projects",
    "hero.contact": "Contact",
    "hero.metaAria": "Quick stats",
    "hero.statYears": "years of experience",
    "hero.statProjects": "major projects",
    "hero.statLangs": "languages (UZ/EN/RU/TR)",
    "skills.eyebrow": "Tech Stack",
    "skills.title": "Skills",
    "skills.text": "Technologies grouped by practical work experience.",
    "skills.backendTitle": "Backend",
    "skills.backendDesc": "Business logic, REST APIs, security and database architecture.",
    "skills.frontendTitle": "Frontend",
    "skills.frontendDesc": "Responsive, interactive interfaces and client-side logic.",
    "skills.devopsTitle": "DevOps & Deploy",
    "skills.devopsDesc": "Containerization, deployment and production support.",
    "skills.toolsTitle": "Tools",
    "skills.toolsDesc": "Version control, report generation and integrations.",
    "projects.eyebrow": "Work",
    "projects.title": "Projects",
    "projects.text": "Two real systems shipped to production.",
    "projects.details": "Details",
    "projects.live": "Live · Railway",
    "projects.private": "Private project",
    "projects.privateNote": "Closed source (NDA)",
    "projects.hrmmSub": "Human Resource Management System",
    "projects.hrmmDesc": "Employee management system: JWT authentication, multilingual (i18n) interface, dark/light theme, archiving system and Telegram bot integration. Django 5.2 + DRF backend, vanilla JS frontend, deployed on Railway.",
    "projects.rbysSub": "Pharmacy / warehouse management system",
    "projects.rbysDesc": "Inventory reports, complex SQL (CTEs, multi-table joins) and report generation via FastReport. Built on ASP.NET/IIS + PostgreSQL.",
    "about.eyebrow": "Profile",
    "about.title": "About",
    "about.role": "Full-Stack Developer · Tashkent",
    "about.p1": "I digitise business processes, optimise internal CRM/ERP modules and systematically resolve bugs in existing systems. My strengths: backend logic, data modelling, REST APIs and solving production issues.",
    "about.p2": "I work as a full-stack developer combining backend and frontend: clean architecture, readable code and reliable deployment.",
    "about.langUz": "Uzbek: native",
    "about.langEn": "English: B1",
    "about.langRu": "Russian: B1",
    "about.langTr": "Turkish: B1",
    "experience.title": "Experience",
    "experience.currentDate": "Sep 2025 — present",
    "experience.currentText": "Bugfixing, feature improvements and recovery of legacy projects in the Karmed system.",
    "experience.freelanceDate": "Jan 2023 — Sep 2025",
    "experience.freelanceRole": "Freelance Backend Developer",
    "experience.freelanceText": "Business web projects, backend development and analysis of existing code.",
    "education.title": "Education",
    "education.tuit": "Tashkent University of Information Technologies",
    "education.degree": "Bachelor of Science in Software Engineering",
    "education.dates": "2021 — 2025",
    "contact.eyebrow": "Contact",
    "contact.title": "Get in touch",
    "contact.text": "Reach out for collaboration, job offers or project discussion.",
    "form.name": "Your name",
    "form.email": "Email",
    "form.message": "Message",
    "form.submit": "Send message",
    "form.successTitle": "Message prepared!",
    "form.successText": "Your message has been saved successfully. We will get in touch shortly!",
    "form.errorName": "Your name must be at least 2 characters long",
    "form.errorEmail": "Please enter a valid email address",
    "form.errorMessage": "Your message must be at least 10 characters long",
    "footer.copy": "© 2026 Muhammadyusuf Mamaniyozov. All rights reserved.",
    "modal.achievements": "Key achievements"
  },
  ru: {
    "a11y.skip": "Перейти к основному содержимому",
    "nav.about": "Обо мне",
    "nav.skills": "Навыки",
    "nav.projects": "Проекты",
    "nav.contact": "Контакты",
    "nav.aria": "Главная навигация",
    "brand.aria": "Перейти на главную",
    "menu.open": "Открыть меню",
    "language.aria": "Выбрать язык",
    "theme.aria": "Переключить цветовую схему",
    "modal.close": "Закрыть окно",
    "hero.available": "Готов к работе · Удалённо / Офис",
    "hero.role": "Full-Stack Developer",
    "hero.text": "Создаю надёжные и масштабируемые веб-системы для бизнеса на Django, DRF, PostgreSQL и чистом JavaScript. Специализируюсь на бэкенд-архитектуре, деплое и ролевом доступе.",
    "hero.projects": "Смотреть проекты",
    "hero.contact": "Связаться",
    "hero.metaAria": "Краткая статистика",
    "hero.statYears": "года опыта",
    "hero.statProjects": "крупных проекта",
    "hero.statLangs": "языка (UZ/EN/RU/TR)",
    "skills.eyebrow": "Технологии",
    "skills.title": "Навыки",
    "skills.text": "Технологии, сгруппированные по практическому опыту работы.",
    "skills.backendTitle": "Бэкенд",
    "skills.backendDesc": "Бизнес-логика, REST API, безопасность и архитектура баз данных.",
    "skills.frontendTitle": "Фронтенд",
    "skills.frontendDesc": "Адаптивные, интерактивные интерфейсы и клиентская логика.",
    "skills.devopsTitle": "DevOps и Деплой",
    "skills.devopsDesc": "Контейнеризация, деплой и поддержка production.",
    "skills.toolsTitle": "Инструменты",
    "skills.toolsDesc": "Контроль версий, генерация отчётов и интеграции.",
    "projects.eyebrow": "Работы",
    "projects.title": "Проекты",
    "projects.text": "Две реальные системы в production.",
    "projects.details": "Подробнее",
    "projects.live": "Live · Railway",
    "projects.private": "Приватный проект",
    "projects.privateNote": "Закрытый код (NDA)",
    "projects.hrmmSub": "Система управления персоналом",
    "projects.hrmmDesc": "Система управления сотрудниками: JWT-аутентификация, многоязычный (i18n) интерфейс, тёмная/светлая тема, система архивации и интеграция с Telegram-ботом. Бэкенд Django 5.2 + DRF, фронтенд на чистом JS, задеплоено на Railway.",
    "projects.rbysSub": "Система управления аптекой / складом",
    "projects.rbysDesc": "Отчёты по инвентаризации, сложный SQL (CTE, многотабличные join'ы) и генерация отчётов через FastReport. Построено на ASP.NET/IIS + PostgreSQL.",
    "about.eyebrow": "Профиль",
    "about.title": "Обо мне",
    "about.role": "Full-Stack Developer · Ташкент",
    "about.p1": "Занимаюсь цифровизацией бизнес-процессов, оптимизацией внутренних CRM/ERP модулей и системным исправлением ошибок. Сильные стороны: бэкенд-логика, моделирование данных, REST API и решение production-проблем.",
    "about.p2": "Работаю как full-stack разработчик, совмещая бэкенд и фронтенд: чёткая архитектура, читаемый код и надёжный деплой.",
    "about.langUz": "Узбекский: родной",
    "about.langEn": "Английский: B1",
    "about.langRu": "Русский: B1",
    "about.langTr": "Турецкий: B1",
    "experience.title": "Опыт",
    "experience.currentDate": "Сен 2025 — настоящее",
    "experience.currentText": "Исправление ошибок, улучшение функций и восстановление устаревших проектов в системе Karmed.",
    "experience.freelanceDate": "Янв 2023 — Сен 2025",
    "experience.freelanceRole": "Фриланс Backend Developer",
    "experience.freelanceText": "Бизнес веб-проекты, бэкенд-разработка и анализ существующего кода.",
    "education.title": "Образование",
    "education.tuit": "Ташкентский университет информационных технологий",
    "education.degree": "Бакалавр программной инженерии",
    "education.dates": "2021 — 2025",
    "contact.eyebrow": "Контакты",
    "contact.title": "Связаться",
    "contact.text": "Пишите для сотрудничества, предложений о работе или обсуждения проекта.",
    "form.name": "Ваше имя",
    "form.email": "Email",
    "form.message": "Сообщение",
    "form.submit": "Отправить сообщение",
    "form.successTitle": "Сообщение готово!",
    "form.successText": "Ваше сообщение успешно сохранено. Мы свяжемся с вами в ближайшее время!",
    "form.errorName": "Имя должно содержать минимум 2 символа",
    "form.errorEmail": "Пожалуйста, введите корректный email",
    "form.errorMessage": "Сообщение должно содержать минимум 10 символов",
    "footer.copy": "© 2026 Muhammadyusuf Mamaniyozov. Все права защищены.",
    "modal.achievements": "Ключевые достижения"
  },
  tr: {
    "a11y.skip": "Ana içeriğe geç",
    "nav.about": "Hakkımda",
    "nav.skills": "Beceriler",
    "nav.projects": "Projeler",
    "nav.contact": "İletişim",
    "nav.aria": "Ana gezinme",
    "brand.aria": "Anasayfaya git",
    "menu.open": "Menüyü aç",
    "language.aria": "Dil seçimi",
    "theme.aria": "Renk modunu değiştir",
    "modal.close": "Pencereyi kapat",
    "hero.available": "İşe hazır · Uzaktan / Ofis",
    "hero.role": "Full-Stack Developer",
    "hero.text": "Django, DRF, PostgreSQL ve sade JavaScript kullanarak işletmeler için güvenilir, ölçeklenebilir web sistemleri geliştiriyorum. Backend mimarisi, dağıtım ve role dayalı erişim kontrolü konusunda uzmanım.",
    "hero.projects": "Projeleri görüntüle",
    "hero.contact": "İletişime geç",
    "hero.metaAria": "Kısa istatistikler",
    "hero.statYears": "yıl deneyim",
    "hero.statProjects": "büyük proje",
    "hero.statLangs": "dil (UZ/EN/RU/TR)",
    "skills.eyebrow": "Teknolojiler",
    "skills.title": "Beceriler",
    "skills.text": "Pratik iş deneyimine göre gruplandırılmış teknolojiler.",
    "skills.backendTitle": "Backend",
    "skills.backendDesc": "İş mantığı, REST API, güvenlik ve veritabanı mimarisi.",
    "skills.frontendTitle": "Frontend",
    "skills.frontendDesc": "Duyarlı, etkileşimli arayüzler ve istemci tarafı mantığı.",
    "skills.devopsTitle": "DevOps & Dağıtım",
    "skills.devopsDesc": "Konteynerleştirme, dağıtım ve production desteği.",
    "skills.toolsTitle": "Araçlar",
    "skills.toolsDesc": "Sürüm kontrolü, rapor üretimi ve entegrasyonlar.",
    "projects.eyebrow": "İşler",
    "projects.title": "Projeler",
    "projects.text": "Production'a çıkarılmış iki gerçek sistem.",
    "projects.details": "Detaylar",
    "projects.live": "Live · Railway",
    "projects.private": "Özel proje",
    "projects.privateNote": "Kapalı kaynak (NDA)",
    "projects.hrmmSub": "İnsan Kaynakları Yönetim Sistemi",
    "projects.hrmmDesc": "Personel yönetim sistemi: JWT kimlik doğrulama, çok dilli (i18n) arayüz, koyu/açık tema, arşivleme sistemi ve Telegram bot entegrasyonu. Django 5.2 + DRF backend, vanilla JS frontend, Railway üzerinde dağıtıldı.",
    "projects.rbysSub": "Eczane / depo yönetim sistemi",
    "projects.rbysDesc": "Envanter raporları, karmaşık SQL (CTE'ler, çok tablolu join'ler) ve FastReport ile rapor üretimi. ASP.NET/IIS + PostgreSQL üzerine kurulu.",
    "about.eyebrow": "Profil",
    "about.title": "Hakkımda",
    "about.role": "Full-Stack Developer · Taşkent",
    "about.p1": "İş süreçlerini dijitalleştiriyor, dahili CRM/ERP modüllerini optimize ediyor ve mevcut sistemlerdeki hataları sistematik olarak çözüyorum. Güçlü yanlarım: backend mantığı, veri modelleme, REST API ve production sorunlarını çözme.",
    "about.p2": "Backend ve frontend'i birlikte yürüten full-stack yaklaşımıyla çalışıyorum: net mimari, okunabilir kod ve güvenilir dağıtım.",
    "about.langUz": "Özbekçe: ana dil",
    "about.langEn": "İngilizce: B1",
    "about.langRu": "Rusça: B1",
    "about.langTr": "Türkçe: B1",
    "experience.title": "Deneyim",
    "experience.currentDate": "Eyl 2025 — şimdi",
    "experience.currentText": "Karmed sisteminde hata düzeltme, özellik iyileştirme ve eski projelerin onarımı.",
    "experience.freelanceDate": "Oca 2023 — Eyl 2025",
    "experience.freelanceRole": "Freelance Backend Developer",
    "experience.freelanceText": "İşletme web projeleri, backend geliştirme ve mevcut kod analizi.",
    "education.title": "Eğitim",
    "education.tuit": "Taşkent Bilgi Teknolojileri Üniversitesi",
    "education.degree": "Yazılım Mühendisliği, Lisans",
    "education.dates": "2021 — 2025",
    "contact.eyebrow": "İletişim",
    "contact.title": "İletişime geç",
    "contact.text": "İşbirliği, iş teklifleri veya proje görüşmesi için yazın.",
    "form.name": "Adınız",
    "form.email": "E-posta",
    "form.message": "Mesaj",
    "form.submit": "Mesaj gönder",
    "form.successTitle": "Mesaj hazırlandı!",
    "form.successText": "Mesajınız başarıyla kaydedildi. En kısa sürede sizinle iletişime geçeceğiz!",
    "form.errorName": "Adınız en az 2 karakter olmalıdır",
    "form.errorEmail": "Lütfen geçerli bir e-posta adresi girin",
    "form.errorMessage": "Mesajınız en az 10 karakter olmalıdır",
    "footer.copy": "© 2026 Muhammadyusuf Mamaniyozov. Tüm hakları saklıdır.",
    "modal.achievements": "Anahtar başarılar"
  }
};

function getTranslation(lang, key) {
  return (translations[lang] && translations[lang][key]) || (translations.en && translations.en[key]) || null;
}

function applyTranslations(lang) {
  i18nElements.forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const txt = getTranslation(lang, key);
    el.textContent = txt != null ? txt : (el.dataset.i18nDefault || el.textContent);
  });
  i18nAttrElements.forEach((el) => {
    const parts = el.getAttribute("data-i18n-attr").split(":");
    if (parts.length === 2) {
      const attr = parts[0].trim();
      const val = getTranslation(lang, parts[1].trim());
      if (val != null) el.setAttribute(attr, val);
      else if (el.dataset.i18nAttrDefault) el.setAttribute(attr, el.dataset.i18nAttrDefault);
    }
  });
  document.documentElement.lang = lang;
}

let initialLang = localStorage.getItem("portfolio-lang");
if (!initialLang) {
  const browserLang = (navigator.language || "").split("-")[0].toLowerCase();
  if (["uz", "en", "ru", "tr"].includes(browserLang)) initialLang = browserLang;
}
if (!initialLang) initialLang = document.documentElement.lang || "uz";
applyTranslations(initialLang);

const langButtons = [...document.querySelectorAll(".lang-option")];
langButtons.forEach((btn) => {
  btn.classList.toggle("is-active", btn.getAttribute("data-lang") === initialLang);
  btn.addEventListener("click", () => {
    const selected = btn.getAttribute("data-lang");
    langButtons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    localStorage.setItem("portfolio-lang", selected);
    applyTranslations(selected);
  });
});

/* ---------- Mobile nav ---------- */
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
navLinks.forEach((link) => link.addEventListener("click", closeMenu));

/* ---------- Scroll reveal ---------- */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (prefersReducedMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealItems.forEach((item) => revealObserver.observe(item));
}

/* ---------- Active nav on scroll ---------- */
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
    });
  });
}, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
sections.forEach((section) => sectionObserver.observe(section));

/* ---------- Contact form ---------- */
const contactSuccessModal = document.getElementById("contact-success-modal");

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const lang = document.documentElement.lang || initialLang;
  const nameVal = document.getElementById("contact-name").value.trim();
  const emailVal = document.getElementById("contact-email").value.trim();
  const messageVal = document.getElementById("contact-message").value.trim();

  formNote.style.color = "var(--danger)";
  formNote.textContent = "";

  if (nameVal.length < 2) {
    formNote.textContent = getTranslation(lang, "form.errorName");
    return;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailVal)) {
    formNote.textContent = getTranslation(lang, "form.errorEmail");
    return;
  }
  if (messageVal.length < 10) {
    formNote.textContent = getTranslation(lang, "form.errorMessage");
    return;
  }

  openModal(contactSuccessModal);
  contactForm.reset();
});

/* ---------- Modal helpers ---------- */
function openModal(modal) {
  if (!modal) return;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.querySelectorAll("[data-close-success-modal]").forEach((el) =>
  el.addEventListener("click", () => closeModal(contactSuccessModal))
);

/* ---------- Project detail modal ---------- */
const projectModal = document.getElementById("project-modal");
const modalBodyContent = document.getElementById("modal-body-content");
const detailsButtons = [...document.querySelectorAll(".btn-details")];

const projectDetailsData = {
  hrmm: {
    tags: ["Django 5.2", "DRF", "PostgreSQL", "JavaScript", "Railway", "Docker"],
    image: "assets/project_hrmm.png",
    uz: {
      title: "HRMM", subtitle: "Human Resource Management System",
      desc: "Korxona xodimlarini boshqarish tizimi. Django 5.2 + DRF backend va vanilla JS frontend asosida qurilgan, Railway'da deploy qilingan.",
      challenges: [
        "JWT asosida xavfsiz autentifikatsiya va rollarga asoslangan access control (RBAC).",
        "Ko'p tilli (i18n) interfeys hamda dark/light tema qo'llab-quvvatlash.",
        "Arxivlash tizimi va Telegram bot integratsiyasi orqali bildirishnomalar."
      ],
      metrics: [{ val: "i18n", label: "Ko'p tilli interfeys" }, { val: "JWT", label: "Xavfsiz autentifikatsiya" }]
    },
    en: {
      title: "HRMM", subtitle: "Human Resource Management System",
      desc: "Enterprise employee management system built with a Django 5.2 + DRF backend and vanilla JS frontend, deployed on Railway.",
      challenges: [
        "Secure JWT authentication and role-based access control (RBAC).",
        "Multilingual (i18n) interface with dark/light theme support.",
        "Archiving system and Telegram bot integration for notifications."
      ],
      metrics: [{ val: "i18n", label: "Multilingual UI" }, { val: "JWT", label: "Secure auth" }]
    },
    ru: {
      title: "HRMM", subtitle: "Система управления персоналом",
      desc: "Корпоративная система управления сотрудниками на бэкенде Django 5.2 + DRF и фронтенде на чистом JS, задеплоено на Railway.",
      challenges: [
        "Безопасная JWT-аутентификация и ролевой доступ (RBAC).",
        "Многоязычный (i18n) интерфейс с тёмной/светлой темой.",
        "Система архивации и интеграция с Telegram-ботом для уведомлений."
      ],
      metrics: [{ val: "i18n", label: "Многоязычный UI" }, { val: "JWT", label: "Безопасная авторизация" }]
    },
    tr: {
      title: "HRMM", subtitle: "İnsan Kaynakları Yönetim Sistemi",
      desc: "Django 5.2 + DRF backend ve vanilla JS frontend ile kurulan, Railway üzerinde dağıtılan kurumsal personel yönetim sistemi.",
      challenges: [
        "Güvenli JWT kimlik doğrulama ve rol tabanlı erişim kontrolü (RBAC).",
        "Çok dilli (i18n) arayüz ve koyu/açık tema desteği.",
        "Arşivleme sistemi ve bildirimler için Telegram bot entegrasyonu."
      ],
      metrics: [{ val: "i18n", label: "Çok dilli arayüz" }, { val: "JWT", label: "Güvenli kimlik doğrulama" }]
    }
  },
  rbys: {
    tags: ["ASP.NET", "PostgreSQL", "IIS", "FastReport", "SQL"],
    image: "assets/project_api.png",
    uz: {
      title: "RBYS", subtitle: "Dorixona / ombor boshqaruv tizimi",
      desc: "Dorixona va ombor uchun inventarizatsiya va hisobot tizimi. ASP.NET/IIS + PostgreSQL asosida qurilgan (private, NDA).",
      challenges: [
        "Murakkab SQL: CTE'lar va ko'p jadvalli join'lar bilan inventarizatsiya hisobotlari.",
        "FastReport orqali chop etiladigan hisobotlar generatsiyasi.",
        "IIS'da deploy va production muhitini qo'llab-quvvatlash."
      ],
      metrics: [{ val: "CTE", label: "Murakkab SQL" }, { val: "FastReport", label: "Hisobot generatsiyasi" }]
    },
    en: {
      title: "RBYS", subtitle: "Pharmacy / warehouse management system",
      desc: "Inventory and reporting system for pharmacy and warehouse operations. Built on ASP.NET/IIS + PostgreSQL (private, NDA).",
      challenges: [
        "Complex SQL: inventory reports using CTEs and multi-table joins.",
        "Printable report generation via FastReport.",
        "Deployment on IIS and production environment support."
      ],
      metrics: [{ val: "CTE", label: "Complex SQL" }, { val: "FastReport", label: "Report generation" }]
    },
    ru: {
      title: "RBYS", subtitle: "Система управления аптекой / складом",
      desc: "Система инвентаризации и отчётности для аптеки и склада. Построена на ASP.NET/IIS + PostgreSQL (приватный, NDA).",
      challenges: [
        "Сложный SQL: отчёты по инвентаризации с CTE и многотабличными join'ами.",
        "Генерация печатных отчётов через FastReport.",
        "Деплой на IIS и поддержка production-окружения."
      ],
      metrics: [{ val: "CTE", label: "Сложный SQL" }, { val: "FastReport", label: "Генерация отчётов" }]
    },
    tr: {
      title: "RBYS", subtitle: "Eczane / depo yönetim sistemi",
      desc: "Eczane ve depo operasyonları için envanter ve raporlama sistemi. ASP.NET/IIS + PostgreSQL üzerine kurulu (özel, NDA).",
      challenges: [
        "Karmaşık SQL: CTE'ler ve çok tablolu join'lerle envanter raporları.",
        "FastReport ile yazdırılabilir rapor üretimi.",
        "IIS üzerinde dağıtım ve production ortamı desteği."
      ],
      metrics: [{ val: "CTE", label: "Karmaşık SQL" }, { val: "FastReport", label: "Rapor üretimi" }]
    }
  }
};

function openProjectModal(projectId) {
  if (!projectModal || !modalBodyContent) return;
  const project = projectDetailsData[projectId];
  if (!project) return;

  const lang = document.documentElement.lang || "uz";
  const data = project[lang] || project.en;
  const achTitle = getTranslation(lang, "modal.achievements");

  const challengesHtml = data.challenges.map((ch) => `<li>${ch}</li>`).join("");
  const metricsHtml = data.metrics
    .map((m) => `<div class="modal-metric-card"><strong>${m.val}</strong><span>${m.label}</span></div>`)
    .join("");
  const tagsHtml = project.tags.map((t) => `<span>${t}</span>`).join("");

  modalBodyContent.innerHTML = `
    <h2 id="modal-title">${data.title}</h2>
    <div class="modal-subtitle">${data.subtitle}</div>
    <img src="${project.image}" alt="${data.title}">
    <div class="modal-tags">${tagsHtml}</div>
    <p>${data.desc}</p>
    <h4 class="modal-section-title">${achTitle}</h4>
    <ul>${challengesHtml}</ul>
    <div class="modal-metrics-grid">${metricsHtml}</div>
  `;
  openModal(projectModal);
}

detailsButtons.forEach((btn) => {
  btn.addEventListener("click", () => openProjectModal(btn.getAttribute("data-project-id")));
});
document.querySelectorAll("[data-close-modal]").forEach((el) =>
  el.addEventListener("click", () => closeModal(projectModal))
);

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal(projectModal);
    closeModal(contactSuccessModal);
  }
});

/* ---------- Init ---------- */
updateHeader();
