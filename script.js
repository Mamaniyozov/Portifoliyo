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

// Theme state loaded from localStorage or system preference
let isDark = false;
const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme) {
  isDark = savedTheme === "dark";
} else {
  isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
}
body.classList.toggle("dark-theme", isDark);
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
    'nav.education': "Ta'lim",
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
    'profile.langs': "EN / RU / TR",
    'profile.focus': "Asosiy yo'nalish",
    'about.title': "Men haqimda",
    'about.p1': `Men biznes jarayonlarini raqamlashtirish, ichki CRM/ERP modullarini optimallashtirish va mavjud tizimlarda xatolarni aniqlab tuzatish bilan shug'ullanadigan dasturchiman. Asosiy kuchli tomonlarim: backend logic, ma'lumotlar bazasi modeli, REST API, deploy va production muammolarini tizimli hal qilish.`,
    'about.p2': `Rezyume ma'lumotlariga ko'ra, asosiy darajadagi texnologiyalarim: Git, web-dasturlash, Python, dasturiy ta'minot ishlab chiqish, Django REST Framework va REST API. O'rta darajada Docker, PostgreSQL, Linux, Flask, HTML va DevOps bilan ishlayman.`,
    'about.langUz': "O'zbek tili: ona tili",
    'about.langEn': "Ingliz tili: B1",
    'about.langRu': "Rus tili: B1",
    'about.langTr': "Turk tili: B1",
    'skills.title': "Ko'nikmalar",
    'skills.text': "Texnologiyalar amaliy ish tajribasi va rezyume ma'lumotlari asosida guruhlandi.",
    'skills.tabFrontend': "Frontend",
    'skills.tabTools': "Asboblar & Deploy",
    'skills.backendHeader': "Backend Dasturlash",
    'skills.backendDesc': "Biznes mantiq, yuqori yuklamali REST API, xavfsizlik va ma'lumotlar ombori arxitekturasi.",
    'skills.frontendHeader': "Frontend Dasturlash",
    'skills.frontendDesc': "Responsive dizayn, interaktiv foydalanuvchi interfeyslari va mijoz tomoni logikasi.",
    'skills.toolsHeader': "DevOps & Asboblar",
    'skills.toolsDesc': "Loyiha deploymenti, konteynerlashtirish va jamoaviy versiya nazorati modullari.",
    'experience.title': "Ish tajribasi",
    'experience.currentDate': "Sep 2025 - hozir",
    'experience.currentText': "Karmed tizimida xatolarni tuzatish, mavjud funksiyalarni yaxshilash va muammoli loyihalarni qayta tiklash bo'yicha ishladim.",
    'experience.freelanceDate': "Yan 2023 - Sen 2025",
    'experience.freelanceText': "Freelance backend developer sifatida biznes uchun web loyihalar yaratdim.",
    'education.title': "Ta'lim",
    'education.tuit': "Toshkent Axborot Texnologiyalari Universiteti",
    'playground.title': "Backend Konsoli",
    'playground.text': "Python va Django backend tizimlariga oid buyruqlarni ishga tushirib ko'ring.",
    'education.degree': "Dasturiy ta'minot muhandisligi, Bakalavr",
    'education.dates': "2021 - 2025",
    'projects.title': "Loyihalar",
    'projects.filterAll': "Barchasi",
    'projects.filterFullstack': "Full-Stack",
    'projects.details': "Batafsil",
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
    'form.successTitle': "Xabar tayyorlandi!",
    'form.successText': "Xabaringiz muvaffaqiyatli saqlandi. Tez orada aloqaga chiqamiz!",
    'form.errorName': "Ismingiz kamida 2 ta belgidan iborat bo'lishi kerak",
    'form.errorEmail': "Iltimos, to'g'ri email kiriting",
    'form.errorMessage': "Xabaringiz kamida 10 ta belgidan iborat bo'lishi kerak",
    'footer.copy': "© 2026 Muhammadyusuf Mamaniyozov. Barcha huquqlar himoyalangan."
  },
  ru: {
    'nav.about': 'Обо мне',
    'nav.skills': 'Навыки',
    'nav.experience': 'Опыт',
    'nav.education': 'Образование',
    'nav.projects': 'Проекты',
    'nav.contact': 'Контакты',
    'nav.aria': 'Главная навигация',
    'brand.aria': 'Перейти на главную',
    'menu.open': 'Открыть меню',
    'language.aria': 'Выбрать язык',
    'theme.aria': 'Переключить цветовую схему',
    'hero.text': 'Я создаю надежные и масштабируемые веб-системы для бизнеса на Django, PostgreSQL и чистом JavaScript. Специализируюсь на бэкенд-архитектуре, деплое и ролевом доступе.',
    'hero.projects': 'Просмотреть проекты',
    'hero.contact': 'Связаться',
    'hero.metaAria': 'Краткая информация',
    'hero.experience': '3 года 6 месяцев опыта',
    'hero.fulltime': 'Полная занятость, без релокации',
    'profile.aria': 'Визуальная карточка портфолио',
    'profile.role': 'Разработчик',
    'profile.location': '23 года, Ташкент',
    'profile.status': 'Готов работать, удаленно или в офисе',
    'profile.years': 'Годы опыта',
    'profile.langs': 'EN / RU / TR',
    'profile.focus': 'Основное направление',
    'about.title': 'Обо мне',
    'about.p1': 'Я занимаюсь цифровизацией бизнес-процессов, оптимизацией внутренних CRM/ERP модулей и исправлением ошибок в существующих системах. Мои сильные стороны: бэкенд-логика, моделирование данных, REST API, деплой и системное решение production-проблем.',
    'about.p2': 'В резюме: Git, веб-разработка, Python, Django REST Framework и REST API. Средний уровень: Docker, PostgreSQL, Linux, Flask, HTML и DevOps.',
    'about.langUz': 'Узбекский: родной',
    'about.langEn': 'Английский: B1',
    'about.langRu': 'Русский: B1',
    'about.langTr': 'Турецкий: B1',
    'skills.title': 'Навыки',
    'skills.text': 'Технологии, сгруппированные по практическому опыту и данным резюме.',
    'skills.tabFrontend': "Фронтенд",
    'skills.tabTools': "Инструменты & Деплой",
    'skills.backendHeader': "Бэкенд Разработка",
    'skills.backendDesc': "Бизнес-логика, высоконагруженные REST API, безопасность и архитектура баз данных.",
    'skills.frontendHeader': "Фронтенд Разработка",
    'skills.frontendDesc': "Адаптивный дизайн, интерактивные интерфейсы и клиентская логика.",
    'skills.toolsHeader': "DevOps & Инструменты",
    'skills.toolsDesc': "Деплой приложений, контейнеризация и командный контроль версий.",
    'experience.title': 'Опыт работы',
    'experience.currentDate': 'Сен 2025 - настоящее время',
    'experience.currentText': 'Работал над исправлением ошибок и восстановлением устаревших модулей проекта в системе Karmed.',
    'experience.freelanceDate': 'Янв 2023 - Сен 2025',
    'experience.freelanceText': 'Фриланс бэкенд разработчик, создавал бизнес-веб-проекты.',
    'education.title': "Образование",
    'education.tuit': "Ташкентский университет информационных технологий",
    'playground.title': "Консоль Бэкенда",
    'playground.text': "Запускайте команды, связанные с бэкенд-системами на Python и Django.",
    'education.degree': "Бакалавр программной инженерии",
    'education.dates': "2021 - 2025",
    'projects.title': 'Проекты',
    'projects.filterAll': 'Все',
    'projects.filterFullstack': 'Фулстек',
    'projects.details': 'Подробнее',
    'projects.hrmm': 'Система управления персоналом для предприятия на Django + PostgreSQL.',
    'projects.demo': 'Запросить демо',
    'projects.api': 'Модули аутентификации, прав, CRUD и отчетности.',
    'projects.crm': 'Инструменты автоматизации бизнес-процессов.',
    'contact.title': 'Контакты',
    'contact.text': 'Свяжитесь для сотрудничества, предложений о работе или обсуждения проекта.',
    'form.name': 'Ваше имя',
    'form.email': 'Email',
    'form.message': 'Сообщение',
    'form.submit': 'Отправить сообщение',
    'form.sent': 'Ваше сообщение готово. Отправка будет доступна после подключения бэкенда.',
    'form.successTitle': "Сообщение готово!",
    'form.successText': "Ваше сообщение успешно сохранено. Мы свяжемся с вами в ближайшее время!",
    'form.errorName': "Ваше имя должно состоять как минимум из 2 символов",
    'form.errorEmail': "Пожалуйста, введите корректный email",
    'form.errorMessage': "Ваше сообщение должно состоять как минимум из 10 символов",
    'footer.copy': '© 2026 Muhammadyusuf Mamaniyozov. Все права защищены.'
  },
  tr: {
    'nav.about': 'Hakkımda',
    'nav.skills': 'Beceriler',
    'nav.experience': 'Deneyim',
    'nav.education': 'Eğitim',
    'nav.projects': 'Projeler',
    'nav.contact': 'İletişim',
    'nav.aria': 'Ana gezinme',
    'brand.aria': 'Anasayfaya git',
    'menu.open': 'Menüyü aç',
    'language.aria': 'Dil seçimi',
    'theme.aria': 'Renk modunu değiştir',
    'hero.text': 'Django, PostgreSQL ve sade JavaScript kullanarak işletmeler için güvenilir, ölçeklenebilir web sistemleri geliştiriyorum. Backend mimarisi, dağıtım ve role dayalı erişim kontrolü konusunda uzmanım.',
    'hero.projects': 'Projeleri görüntüle',
    'hero.contact': 'İletişime geç',
    'hero.metaAria': 'Kısa bilgiler',
    'hero.experience': '3 yıl 6 ay deneyim',
    'hero.fulltime': 'Tam zamanlı, taşınma yok',
    'profile.aria': 'Portfolyo görsel kartı',
    'profile.role': 'Yazılım geliştirici',
    'profile.location': '23 yaş, Taşkent',
    'profile.status': 'İşe hazır, uzaktan veya ofiste',
    'profile.years': 'Deneyim yılları',
    'profile.langs': 'EN / RU / TR',
    'profile.focus': 'Ana odak',
    'about.title': 'Hakkımda',
    'about.p1': 'İş süreçlerini dijitalleştiriyor, dahili CRM/ERP modüllerini optimize ediyor ve mevcut sistemlerdeki hataları gideriyorum. Güçlü yanlarım: backend mantığı, veri modelleme, REST API, dağıtım ve production sorunlarını sistematik çözme.',
    'about.p2': 'Özgeçmiş düzeyinde: Git, web geliştirme, Python, Django REST Framework ve REST API. Orta düzeyde Docker, PostgreSQL, Linux, Flask, HTML ve DevOps.',
    'about.langUz': 'Özbekçe: ana dil',
    'about.langEn': 'İngilizce: B1',
    'about.langRu': 'Rusça: B1',
    'about.langTr': 'Türkçe: B1',
    'skills.title': 'Beceriler',
    'skills.text': 'Teknolojiler, pratik deneyim ve özgeçmiş verilerine göre gruplandırıldı.',
    'skills.tabFrontend': "Frontend",
    'skills.tabTools': "Araçlar & Dağıtım",
    'skills.backendHeader': "Backend Geliştirme",
    'skills.backendDesc': "İş mantığı, yüksek yüklü REST API, güvenlik ve veritabanı mimarisi.",
    'skills.frontendHeader': "Frontend Geliştirme",
    'skills.frontendDesc': "Duyarlı tasarım, etkileşimli kullanıcı arayüzleri ve istemci tarafı mantığı.",
    'skills.toolsHeader': "DevOps & Araçlar",
    'skills.toolsDesc': "Proje dağıtımı, konteynerleştirme ve ekip sürüm kontrolü modülleri.",
    'experience.title': 'Deneyim',
    'experience.currentDate': 'Eyl 2025 - şimdi',
    'experience.currentText': 'Karmed sisteminde hata düzeltme ve eski projelerin onarımı üzerinde çalıştım.',
    'experience.freelanceDate': 'Oca 2023 - Eyl 2025',
    'experience.freelanceText': 'Freelance backend geliştirici olarak işletme web projeleri geliştirdim.',
    'education.title': "Eğitim",
    'education.tuit': "Taşkent Bilgi Teknolojileri Üniversitesi",
    'playground.title': "Backend Konsolu",
    'playground.text': "Python ve Django backend sistemleriyle ilgili komutları çalıştırıp deneyin.",
    'education.degree': "Yazılım Mühendisliği, Lisans",
    'education.dates': "2021 - 2025",
    'projects.title': 'Projeler',
    'projects.filterAll': 'Hepsi',
    'projects.filterFullstack': 'Fullstack',
    'projects.details': 'Detaylar',
    'projects.hrmm': 'Django + PostgreSQL ile oluşturulmuş Kurumsal İK Yönetim Sistemi.',
    'projects.demo': 'Demo iste',
    'projects.api': 'Kimlik doğrulama, yetki, CRUD ve raporlama modülleri.',
    'projects.crm': "KOBİ'ler için otomasyon araçları.",
    'contact.title': 'İletişim',
    'contact.text': 'İşbirliği, iş teklifleri veya proje tartışması için iletişime geçin.',
    'form.name': 'Adınız',
    'form.email': 'E-posta',
    'form.message': 'Mesaj',
    'form.submit': 'Mesaj gönder',
    'form.sent': 'Mesajınız hazır. Backend bağlandıktan sonra gönderme etkinleştirilecektir.',
    'form.successTitle': "Mesaj Hazırlandı!",
    'form.successText': "Mesajınız başarıyla kaydedildi. En kısa sürede sizinle iletişime geçeceğiz!",
    'form.errorName': "Adınız en az 2 karakter olmalıdır",
    'form.errorEmail': "Lütfen geçerli bir e-posta adresi girin",
    'form.errorMessage': "Mesajınız en az 10 karakter olmalıdır",
    'footer.copy': '© 2026 Muhammadyusuf Mamaniyozov. Tüm hakları saklıdır.'
  },
  en: {
    'nav.about': 'About',
    'nav.skills': 'Skills',
    'nav.experience': 'Experience',
    'nav.education': 'Education',
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
    'profile.langs': 'EN / RU / TR',
    'profile.focus': 'Primary focus',
    'about.title': 'About',
    'about.p1': 'I digitise business processes, optimise internal CRM/ERP modules and fix bugs in existing systems. My strengths are backend logic, data modelling, REST APIs, deployment and solving production issues systematically.',
    'about.p2': 'Resume-level skills: Git, web development, Python, Django REST Framework and REST API. Intermediate with Docker, PostgreSQL, Linux, Flask, HTML and DevOps.',
    'about.langUz': "Uzbek: native",
    'about.langEn': "English: B1",
    'about.langRu': "Russian: B1",
    'about.langTr': "Turkish: B1",
    'skills.title': 'Skills',
    'skills.text': 'Technologies grouped by practical experience and resume data.',
    'skills.tabFrontend': "Frontend",
    'skills.tabTools': "Tools & Deploy",
    'skills.backendHeader': "Backend Development",
    'skills.backendDesc': "Business logic, high-performance REST APIs, security, and database architecture.",
    'skills.frontendHeader': "Frontend Development",
    'skills.frontendDesc': "Responsive design, interactive user interfaces, and client-side logic.",
    'skills.toolsHeader': "DevOps & Tools",
    'skills.toolsDesc': "Project deployment, containerization, and team version control systems.",
    'experience.title': 'Experience',
    'experience.currentDate': 'Sep 2025 - present',
    'experience.currentText': 'Worked on bugfixing and recovery of legacy project modules in Karmed system.',
    'experience.freelanceDate': 'Jan 2023 - Sep 2025',
    'experience.freelanceText': 'Freelance backend developer building business web projects.',
    'education.title': "Education",
    'education.tuit': "Tashkent University of Information Technologies",
    'playground.title': "Backend Console",
    'playground.text': "Try running commands related to Python and Django backend systems.",
    'education.degree': "Bachelor of Science in Software Engineering",
    'education.dates': "2021 - 2025",
    'projects.title': 'Projects',
    'projects.filterAll': 'All',
    'projects.filterFullstack': 'Full-Stack',
    'projects.details': 'Details',
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
    'form.successTitle': "Message Prepared!",
    'form.successText': "Your message has been successfully saved. We will get in touch with you shortly!",
    'form.errorName': "Your name must be at least 2 characters long",
    'form.errorEmail': "Please enter a valid email address",
    'form.errorMessage': "Your message must be at least 10 characters long",
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
// Detect initial language: check localStorage first, then fallback to navigator, then HTML lang
let initialLang = localStorage.getItem("portfolio-lang");
if (!initialLang) {
  const browserLang = navigator.language || navigator.userLanguage;
  if (browserLang) {
    const langCode = browserLang.split("-")[0].toLowerCase();
    if (["uz", "en", "ru", "tr"].includes(langCode)) {
      initialLang = langCode;
    }
  }
}
if (!initialLang) {
  initialLang = document.documentElement.lang || "uz";
}

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

function updateThemeUI() {
  themeLabel.textContent = isDark ? "Dark" : "Light";
  themeIcon.innerHTML = isDark 
    ? `<svg class="theme-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`
    : `<svg class="theme-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`;
}

// Initialize Theme UI state
updateThemeUI();

themeToggle.addEventListener("click", () => {
  isDark = !isDark;
  body.classList.toggle("dark-theme", isDark);
  localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
  updateThemeUI();
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

const langButtons = [...document.querySelectorAll(".language-option")];

if (langButtons.length) {
  langButtons.forEach((btn) => {
    const lang = btn.getAttribute("data-lang");
    if (lang === initialLang) {
      btn.classList.add("is-active");
    } else {
      btn.classList.remove("is-active");
    }
    btn.addEventListener("click", () => {
      langButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");
      const selected = btn.getAttribute("data-lang");
      if (selected) {
        document.documentElement.lang = selected;
        localStorage.setItem("portfolio-lang", selected);
        applyTranslations(selected);
      }
    });
  });
}


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

  const nameVal = document.getElementById("contact-name").value.trim();
  const emailVal = document.getElementById("contact-email").value.trim();
  const messageVal = document.getElementById("contact-message").value.trim();

  // Reset note
  formNote.style.color = "var(--accent)";
  formNote.textContent = "";

  // 1. Validate name
  if (nameVal.length < 2) {
    formNote.style.color = "#f87171";
    formNote.textContent = getTranslation(lang, "form.errorName") || "Name is too short.";
    return;
  }

  // 2. Validate email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailVal)) {
    formNote.style.color = "#f87171";
    formNote.textContent = getTranslation(lang, "form.errorEmail") || "Please enter a valid email.";
    return;
  }

  // 3. Validate message
  if (messageVal.length < 10) {
    formNote.style.color = "#f87171";
    formNote.textContent = getTranslation(lang, "form.errorMessage") || "Message is too short.";
    return;
  }

  // If valid, open success modal
  const contactSuccessModal = document.getElementById("contact-success-modal");
  if (contactSuccessModal) {
    contactSuccessModal.classList.add("is-open");
    contactSuccessModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  contactForm.reset();
});

// Close success modal listener
const contactSuccessModal = document.getElementById("contact-success-modal");
const closeSuccessModalElements = [...document.querySelectorAll("[data-close-success-modal]")];

function closeSuccessModal() {
  if (!contactSuccessModal) return;
  contactSuccessModal.classList.remove("is-open");
  contactSuccessModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

if (closeSuccessModalElements.length) {
  closeSuccessModalElements.forEach((el) => {
    el.addEventListener("click", closeSuccessModal);
  });
}

window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", resizeCanvas);

// --- Interactive Skills Tab Switching & Progress Fill logic ---
const skillsTabButtons = [...document.querySelectorAll(".skills-tab-btn")];
const skillsPanels = [...document.querySelectorAll(".skills-panel")];

function animatePanelBars(panel) {
  if (!panel) return;
  const bars = panel.querySelectorAll(".bar i");
  bars.forEach((bar) => {
    bar.style.width = bar.getAttribute("data-width") || "0%";
  });
}

function resetPanelBars(panel) {
  if (!panel) return;
  const bars = panel.querySelectorAll(".bar i");
  bars.forEach((bar) => {
    bar.style.width = "0";
  });
}

if (skillsTabButtons.length) {
  skillsTabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");
      
      // Update buttons active class
      skillsTabButtons.forEach((b) => {
        b.classList.remove("is-active");
        b.setAttribute("aria-selected", "false");
      });
      btn.classList.add("is-active");
      btn.setAttribute("aria-selected", "true");
      
      // Toggle panels and animate
      skillsPanels.forEach((p) => {
        if (p.id === `tab-${tabId}`) {
          p.classList.add("is-active");
          // Small delay for fade-in transition before starting bar fill
          setTimeout(() => animatePanelBars(p), 50);
        } else {
          p.classList.remove("is-active");
          resetPanelBars(p);
        }
      });
    });
  });
}

// Observe skills section to animate default tab (backend) on first scroll
const skillsSection = document.getElementById("skills");
if (skillsSection) {
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const activePanel = document.querySelector(".skills-panel.is-active");
        animatePanelBars(activePanel);
        skillsObserver.unobserve(skillsSection);
      }
    });
  }, { threshold: 0.15 });
  skillsObserver.observe(skillsSection);
}

// --- Interactive CLI Terminal Widget Logic ---
const terminalWidget = document.querySelector(".terminal-widget");
const terminalInput = document.getElementById("terminal-input");
const terminalStdout = document.getElementById("terminal-stdout");
const terminalForm = document.getElementById("terminal-form");
const terminalTabBtns = [...document.querySelectorAll(".terminal-tab")];
const terminalPanels = [...document.querySelectorAll(".terminal-body .terminal-panel")];
const quickCmdBtns = [...document.querySelectorAll(".btn-quick")];

// Terminal Focus Helper
if (terminalWidget && terminalInput) {
  terminalWidget.addEventListener("click", (e) => {
    // Only focus if the user didn't select text
    if (window.getSelection().toString() === "") {
      terminalInput.focus();
    }
  });
}

// Terminal tab switching
if (terminalTabBtns.length) {
  terminalTabBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // prevent triggering focus event on widget click
      const tabName = btn.getAttribute("data-terminal-tab");
      terminalTabBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      terminalPanels.forEach((p) => {
        if (p.id === `panel-${tabName}`) {
          p.classList.add("is-active");
        } else {
          p.classList.remove("is-active");
        }
      });
    });
  });
}

// Localized terminal outputs helper
const terminalTranslations = {
  uz: {
    welcome: "Tizimga xush kelibsiz! Muhammadyusuf haqida ma'lumot olish uchun quyidagi buyruqlarni ishlating:",
    helpTitle: "Mavjud buyruqlar listi:",
    cmdHelp: "Yordam oynasini ko'rsatish",
    cmdSkills: "Developerning texnik ko'nikmalarini ko'rish",
    cmdTest: "Django testlar to'plamini ishga tushirish",
    cmdRun: "Django development serverini yoqish",
    cmdMigrate: "Ma'lumotlar bazasi migratsiyalarini bajarish",
    cmdClear: "Konsol ekranini tozalash",
    notFound: "bash: buyruq topilmadi: ",
    notFoundTip: ". Buyruqlar ro'yxatini ko'rish uchun 'help' deb yozing.",
    testingStart: "KarmilApp uchun test ma'lumotlar bazasi yaratilmoqda...",
    testingSystemCheck: "Tizim tekshiruvi amalga oshirildi, xatolar aniqlanmadi (0 ta yashirildi).",
    testingOk: "OK (testlar=14, xatoliklar=0, muvaffaqiyatsiz=0)",
    testingDuration: "14 ta test 0.812 soniyada muvaffaqiyatli bajarildi.",
    serverStart: "StatReloader orqali fayl o'zgarishlari kuzatilmoqda\nTizim tekshirilmoqda...\nTizim tekshiruvi yakunlandi (0 ta xato).\nStarting development server at http://127.0.0.1:8000/\nServerni o'chirish uchun CTRL-C bosing.",
    migrateStart: "Bajariladigan operatsiyalar:\n  Barcha migratsiyalarni qo'llash: admin, auth, contenttypes, sessions, developer\nMigratsiyalar ishga tushirilmoqda:\n  Applying contenttypes.0001_initial... OK\n  Applying auth.0001_initial... OK\n  Applying developer.0001_initial... OK\n  Applying developer.0002_projects... OK\nMa'lumotlar bazasi muvaffaqiyatli yangilandi!"
  },
  en: {
    welcome: "Welcome to the terminal! Use the following commands to discover Muhammadyusuf's profile details:",
    helpTitle: "Available commands:",
    cmdHelp: "Display this help message",
    cmdSkills: "View developer's technical skill JSON",
    cmdTest: "Run Django test suite",
    cmdRun: "Start Django development server mock",
    cmdMigrate: "Apply database migrations",
    cmdClear: "Clear the console screen",
    notFound: "bash: command not found: ",
    notFoundTip: ". Type 'help' to see the list of available commands.",
    testingStart: "Creating test database for alias 'default'...",
    testingSystemCheck: "System check identified no issues (0 silenced).",
    testingOk: "OK",
    testingDuration: "Ran 14 tests in 0.812s",
    serverStart: "Watching for file changes with StatReloader\nPerforming system checks...\nSystem check identified no issues (0 silenced).\nStarting development server at http://127.0.0.1:8000/\nQuit the server with CTRL-C.",
    migrateStart: "Operations to perform:\n  Apply all migrations: admin, auth, contenttypes, sessions, developer\nRunning migrations:\n  Applying contenttypes.0001_initial... OK\n  Applying auth.0001_initial... OK\n  Applying developer.0001_initial... OK\n  Applying developer.0002_projects... OK\nDatabase synchronized successfully!"
  },
  ru: {
    welcome: "Добро пожаловать в терминал! Используйте следующие команды для просмотра профиля Мухаммадюсуфа:",
    helpTitle: "Доступные команды:",
    cmdHelp: "Показать это справочное сообщение",
    cmdSkills: "Просмотреть JSON технических навыков",
    cmdTest: "Запустить тесты Django",
    cmdRun: "Запустить тестовый сервер Django",
    cmdMigrate: "Выполнить миграции базы данных",
    cmdClear: "Очистить экран консоли",
    notFound: "bash: команда не найдена: ",
    notFoundTip: ". Введите 'help' для просмотра списка команд.",
    testingStart: "Создание тестовой базы данных для псевдонима 'default'...",
    testingSystemCheck: "Проверка системы не выявила проблем (0 скрыто).",
    testingOk: "OK",
    testingDuration: "Запущено 14 тестов за 0.812 сек.",
    serverStart: "Отслеживание изменений файлов с помощью StatReloader\nВыполнение системных проверок...\nПроверка системы не выявила проблем (0 скрыто).\nStarting development server at http://127.0.0.1:8000/\nВыход из сервера по CTRL-C.",
    migrateStart: "Выполняемые операции:\n  Применить все миграции: admin, auth, contenttypes, sessions, developer\nЗапуск миграций:\n  Applying contenttypes.0001_initial... OK\n  Applying auth.0001_initial... OK\n  Applying developer.0001_initial... OK\n  Applying developer.0002_projects... OK\nБаза данных успешно синхронизирована!"
  },
  tr: {
    welcome: "Terminale hoş geldiniz! Muhammadyusuf hakkında bilgi almak için aşağıdaki komutları kullanın:",
    helpTitle: "Kullanılabilir komutlar listesi:",
    cmdHelp: "Yardım menüsünü göster",
    cmdSkills: "Geliştiricinin teknik yetenek JSON çıktısını gör",
    cmdTest: "Django test paketini çalıştır",
    cmdRun: "Django geliştirme sunucusunu başlat",
    cmdMigrate: "Veritabanı geçişlerini uygula",
    cmdClear: "Konsol ekranını temizle",
    notFound: "bash: komut bulunamadı: ",
    notFoundTip: ". Komut listesini görmek için 'help' yazın.",
    testingStart: "'default' takma adı için test veritabanı oluşturuluyor...",
    testingSystemCheck: "Sistem kontrolü hiçbir sorun tanımlamadı (0 gizlendi).",
    testingOk: "OK",
    testingDuration: "0.812 saniyede 14 test çalıştırıldı.",
    serverStart: "StatReloader ile dosya değişiklikleri izleniyor\nSistem kontrolleri gerçekleştiriliyor...\nSistem kontrolü hiçbir sorun tanımlamadı (0 gizlendi).\nStarting development server at http://127.0.0.1:8000/\nSunucuyu CTRL-C ile kapatın.",
    migrateStart: "Gerçekleştirilecek işlemler:\n  Tüm geçişleri uygula: admin, auth, contenttypes, sessions, developer\nGeçişler çalıştırılıyor:\n  Applying contenttypes.0001_initial... OK\n  Applying auth.0001_initial... OK\n  Applying developer.0001_initial... OK\n  Applying developer.0002_projects... OK\nVeritabanı başarıyla senkronize edildi!"
  }
};

function runTerminalCommand(cmd) {
  const cleanCmd = cmd.trim();
  const lowerCmd = cleanCmd.toLowerCase();
  const lang = document.documentElement.lang || "uz";
  const t = terminalTranslations[lang] || terminalTranslations["en"];

  // 1. Add user command line to stdout
  const commandLine = document.createElement("div");
  commandLine.className = "output-row";
  commandLine.innerHTML = `<span class="cyan">Guest@Mamaniyozov:~$</span> <span class="white">${cleanCmd}</span>`;
  terminalStdout.appendChild(commandLine);

  if (lowerCmd === "") {
    terminalStdout.scrollTop = terminalStdout.scrollHeight;
    return;
  }

  // 2. Clear command handles immediately
  if (lowerCmd === "clear") {
    terminalStdout.innerHTML = "";
    return;
  }

  // 3. Process commands
  const resultContainer = document.createElement("div");
  resultContainer.className = "output-row";

  if (lowerCmd === "help") {
    resultContainer.innerHTML = `
<div class="text-muted">${t.welcome}</div>
<div class="cmd-list" style="margin: 6px 0 0 14px;">
  <div><strong class="green">help</strong> - <span>${t.cmdHelp}</span></div>
  <div><strong class="green">cat skills.json</strong> - <span>${t.cmdSkills}</span></div>
  <div><strong class="green">python manage.py test</strong> - <span>${t.cmdTest}</span></div>
  <div><strong class="green">python manage.py runserver</strong> - <span>${t.cmdRun}</span></div>
  <div><strong class="green">python manage.py migrate</strong> - <span>${t.cmdMigrate}</span></div>
  <div><strong class="green">clear</strong> - <span>${t.cmdClear}</span></div>
</div>`;
  } else if (lowerCmd === "cat skills.json") {
    resultContainer.innerHTML = `<pre class="white" style="margin: 0; line-height: 1.4;">{
  <span class="keyword" style="color: #f472b6">"name"</span>: <span class="string">"Muhammadyusuf Mamaniyozov"</span>,
  <span class="keyword" style="color: #f472b6">"specialty"</span>: <span class="string">"Python / Django Full-Stack"</span>,
  <span class="keyword" style="color: #f472b6">"experience"</span>: <span class="string">"3.5+ years"</span>,
  <span class="keyword" style="color: #f472b6">"skills"</span>: {
    <span class="keyword" style="color: #f472b6">"languages"</span>: [<span class="string">"Python"</span>, <span class="string">"JavaScript"</span>, <span class="string">"SQL"</span>, <span class="string">"Bash"</span>],
    <span class="keyword" style="color: #f472b6">"frameworks"</span>: [<span class="string">"Django"</span>, <span class="string">"Django REST Framework"</span>, <span class="string">"Flask"</span>],
    <span class="keyword" style="color: #f472b6">"databases"</span>: [<span class="string">"PostgreSQL"</span>, <span class="string">"SQLite"</span>],
    <span class="keyword" style="color: #f472b6">"devops"</span>: [<span class="string">"Docker"</span>, <span class="string">"Git"</span>, <span class="string">"Linux"</span>, <span class="string">"Railway"</span>]
  }
}</pre>`;
  } else if (lowerCmd === "python manage.py test") {
    resultContainer.innerHTML = `
<div class="white">${t.testingStart}</div>
<div class="white">${t.testingSystemCheck}</div>
<div class="green" style="margin: 6px 0;">..............</div>
<div class="text-muted">----------------------------------------------------------------------</div>
<div class="white">${t.testingDuration}</div>
<div class="green" style="font-weight: bold; margin-top: 4px;">${t.testingOk}</div>`;
  } else if (lowerCmd === "python manage.py runserver") {
    const formattedText = t.serverStart.replace(/\n/g, "<br>");
    resultContainer.innerHTML = `<div class="white" style="line-height: 1.4;">${formattedText}</div>`;
  } else if (lowerCmd === "python manage.py migrate") {
    const formattedText = t.migrateStart.replace(/\n/g, "<br>");
    resultContainer.innerHTML = `<div class="white" style="line-height: 1.4;">${formattedText}</div>`;
  } else {
    resultContainer.innerHTML = `<span class="red">${t.notFound}'${cleanCmd}'${t.notFoundTip}</span>`;
  }

  terminalStdout.appendChild(resultContainer);
  
  // Auto scroll to bottom
  terminalStdout.scrollTop = terminalStdout.scrollHeight;
}

// Input submit listener
if (terminalForm) {
  terminalForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const cmd = terminalInput.value;
    runTerminalCommand(cmd);
    terminalInput.value = "";
  });
}

// Quick action buttons listener
if (quickCmdBtns.length) {
  quickCmdBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const cmd = btn.getAttribute("data-cmd");
      if (cmd) {
        runTerminalCommand(cmd);
      }
    });
  });
}

// --- Projects Filtering Logic ---
const filterButtons = [...document.querySelectorAll(".filter-btn")];
const projectCards = [...document.querySelectorAll(".project-card")];

if (filterButtons.length) {
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filterValue = btn.getAttribute("data-filter");

      // Update active class on filter buttons
      filterButtons.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      // Hide or show project cards
      projectCards.forEach((card) => {
        const categories = card.getAttribute("data-category") || "";
        const categoryArray = categories.split(" ");
        if (filterValue === "all" || categoryArray.includes(filterValue)) {
          card.classList.remove("is-hidden");
        } else {
          card.classList.add("is-hidden");
        }
      });
    });
  });
}

// --- Project Details Modal Dialog Logic ---
const projectModal = document.getElementById("project-modal");
const modalBodyContent = document.getElementById("modal-body-content");
const detailsButtons = [...document.querySelectorAll(".btn-details")];
const closeModalElements = [...document.querySelectorAll("[data-close-modal]")];

const projectDetailsData = {
  hrmm: {
    uz: {
      title: "HRMM - Enterprise HR Management System",
      subtitle: "Kompaniya xodimlarini boshqarish tizimi",
      desc: "HRMM korxona ichki resurslarini boshqarish, kadrlar hisobini yuritish, xodimlarning davomati va ish faoliyatini nazorat qilish uchun mo'ljallangan. Django va PostgreSQL integratsiyasi orqali yirik hajmdagi ma'lumotlar bilan tezkor ishlash ta'minlangan.",
      challenges: [
        "Ma'lumotlar bazasini normallashtirish va so'rovlar sonini 40% ga kamaytirish.",
        "Kompaniya rollari va huquqlarini (RBAC) xavfsiz boshqarish tizimini joriy etish.",
        "Vanilla JS yordamida interaktiv kalendar va davomat modullarini yaratish."
      ],
      metrics: [
        { val: "40%", label: "So'rovlar tezlashishi" },
        { val: "500+", label: "Aktiv foydalanuvchilar" }
      ],
      image: "assets/project_hrmm.png"
    },
    en: {
      title: "HRMM - Enterprise HR Management System",
      subtitle: "Corporate Human Resources Management Tool",
      desc: "HRMM is designed to manage internal company resources, track employee attendance, and monitor overall workflow productivity. Built with Django and PostgreSQL, it ensures rapid data transactions even with large-scale corporate records.",
      challenges: [
        "Optimized raw SQL queries and DB indexing, reducing response latency by 40%.",
        "Implemented secure Role-Based Access Control (RBAC) with granular user permissions.",
        "Built responsive, dynamic attendance calendar grids with vanilla JavaScript."
      ],
      metrics: [
        { val: "40%", label: "Query latency reduction" },
        { val: "500+", label: "Active corporate staff" }
      ],
      image: "assets/project_hrmm.png"
    },
    ru: {
      title: "HRMM - Enterprise HR Management System",
      subtitle: "Система управления персоналом предприятия",
      desc: "HRMM предназначен для управления внутренними ресурсами компании, ведения учета кадров, отслеживания посещаемости сотрудников и контроля продуктивности. Интеграция Django и PostgreSQL обеспечивает высокую скорость работы с большими базами данных.",
      challenges: [
        "Оптимизация структуры БД и сокращение количества запросов на 40%.",
        "Внедрение ролевой модели доступа (RBAC) с детальным разграничением прав.",
        "Разработка интерактивных модулей табеля успеваемости на чистом JS."
      ],
      metrics: [
        { val: "40%", label: "Ускорение запросов" },
        { val: "500+", label: "Активных сотрудников" }
      ],
      image: "assets/project_hrmm.png"
    },
    tr: {
      title: "HRMM - Enterprise HR Management System",
      subtitle: "Kurumsal İnsan Kaynakları Yönetim Sistemi",
      desc: "HRMM, şirket içi kaynakları yönetmek, personel kayıtlarını tutmak, katılım durumunu takip etmek ve iş verimliliğini izlemek için tasarlanmıştır. Django ve PostgreSQL entegrasyonu, büyük veri kümeleri üzerinde hızlı işlem sağlar.",
      challenges: [
        "Veritabanı optimizasyonu ile SQL sorgularının %40 oranında hızlandırılması.",
        "Rol tabanlı erişim kontrolü (RBAC) ile güvenli yetkilendirme altyapısı.",
        "Vanilla JS kullanarak etkileşimli çalışma takvimleri ve devam panelleri oluşturulması."
      ],
      metrics: [
        { val: "%40", label: "Sorgu performans artışı" },
        { val: "500+", label: "Aktif personel kaydı" }
      ],
      image: "assets/project_hrmm.png"
    }
  },
  api: {
    uz: {
      title: "REST API Backend Modules",
      subtitle: "Markazlashtirilgan backend xizmatlari",
      desc: "Autentifikatsiya, rollarga asoslangan ruxsatnomalar, hisobotlar va biznes logikani boshqaradigan REST API xizmatlari. Kichik va o'rta loyihalar uchun tezkor integratsiya qilinadigan backend modullari.",
      challenges: [
        "JWT va OAuth2 asosida xavfsiz token-based autentifikatsiya tizimini joriy qilish.",
        "RESTful arxitektura standartlari bo'yicha mukammal endpointlar loyihalash.",
        "Django REST Framework serializerlarini optimallashtirish orqali yuklamani kamaytirish."
      ],
      metrics: [
        { val: "100%", label: "REST standartlariga moslik" },
        { val: "250ms", label: "O'rtacha javob qaytarish vaqti" }
      ],
      image: "assets/project_api.png"
    },
    en: {
      title: "REST API Backend Modules",
      subtitle: "Centralized Backend Services & API Integrations",
      desc: "Custom REST API services managing user authentication, role-based authorization, reporting modules, and core business workflow logic. Designed for rapid integration into web and mobile client projects.",
      challenges: [
        "Integrated token-based secure authentication protocols using JWT and OAuth2.",
        "Built standardized, highly structured RESTful endpoints following strict design conventions.",
        "Reduced system response latency by optimizing DRF serializers and prefetching DB querysets."
      ],
      metrics: [
        { val: "100%", label: "REST API Standards Compliance" },
        { val: "250ms", label: "Average Response Latency" }
      ],
      image: "assets/project_api.png"
    },
    ru: {
      title: "REST API Backend Modules",
      subtitle: "Централизованные бэкенд-модули и REST API",
      desc: "Готовые модули REST API для управления аутентификацией, ролевыми доступами, CRUD-операциями и генерацией отчетов. Спроектировано для быстрой интеграции с мобильными и веб-клиентами.",
      challenges: [
        "Интеграция безопасной авторизации на базе токенов JWT и протоколов OAuth2.",
        "Разработка стандартизированных RESTful эндпоинтов с понятной структурой.",
        "Оптимизация сериализаторов Django REST Framework для снижения нагрузки на ЦП."
      ],
      metrics: [
        { val: "100%", label: "Соответствие REST стандартам" },
        { val: "250 мс", label: "Среднее время ответа API" }
      ],
      image: "assets/project_api.png"
    },
    tr: {
      title: "REST API Backend Modules",
      subtitle: "Merkezi Backend Servisleri ve REST API Yapısı",
      desc: "Kullanıcı kimlik doğrulama, rol yetkilendirmesi, CRUD ve raporlama modüllerini yöneten özel REST API servisleri. Web ve mobil projelerle hızlı entegrasyon için tasarlanmış bağımsız backend modülleri.",
      challenges: [
        "JWT ve OAuth2 altyapıları ile güvenli kimlik doğrulama modülü geliştirilmesi.",
        "RESTful mimari prensiplerine uygun, temiz ve sürdürülebilir API uç noktaları tasarlanması.",
        "DRF serializer optimizasyonları ile sunucu kaynak tüketiminin azaltılması."
      ],
      metrics: [
        { val: "%100", label: "REST Standart Uyumluluğu" },
        { val: "250ms", label: "Ortalama Sorgu Yanıt Süresi" }
      ],
      image: "assets/project_api.png"
    }
  },
  crm: {
    uz: {
      title: "Business Automation Tools",
      subtitle: "Biznes jarayonlarini raqamlashtirish modullari",
      desc: "Kichik va o'rta biznesdagi ichki operatsiyalarni avtomatlashtirishga mo'ljallangan tizim. Tizimli dashboard, ma'lumotlar modeli va formalar validatsiyasini o'z ichiga oladi.",
      challenges: [
        "Docker va Docker Compose yordamida loyihani konteynerlashtirish va deploy qilish.",
        "Foydalanuvchilar faoliyatini kuzatish uchun interaktiv dashboard panellarini loyihalash.",
        "Mijoz ma'lumotlarini to'g'ri qayta ishlash uchun vanilla JS yordamida dinamik formalar yaratish."
      ],
      metrics: [
        { val: "3 ta", label: "Avtomatlashtirilgan bo'limlar" },
        { val: "Docker", label: "Konteynerlashtirilgan muhit" }
      ],
      image: "assets/project_crm.png"
    },
    en: {
      title: "Business Automation Tools",
      subtitle: "Corporate Workflow Digitization & Dashboards",
      desc: "A collection of tools aiming to automate routine operations in small-to-medium business environments. Features structured analytical dashboards, custom data schemas, and secure client-side form logic.",
      challenges: [
        "Dockerized the application layout using Docker & Docker Compose for automated environments.",
        "Designed responsive widgets for data visualization and tracking team tasks.",
        "Created complex client-side validation logic with native JS, minimizing empty inputs."
      ],
      metrics: [
        { val: "3 Modules", label: "Automated business areas" },
        { val: "Dockerized", label: "Deployment setup type" }
      ],
      image: "assets/project_crm.png"
    },
    ru: {
      title: "Business Automation Tools",
      subtitle: "Модули автоматизации бизнес-процессов",
      desc: "Инструменты для оптимизации и автоматизации операционной деятельности малого бизнеса. Включает интерактивные панели аналитики, формы валидации и схемы импорта данных.",
      challenges: [
        "Контейнеризация и оркестрация веб-приложения с помощью Docker и Docker Compose.",
        "Создание гибких графиков аналитики и дашбордов для отслеживания KPI.",
        "Разработка динамической валидации форм ввода на JS для снижения ошибок пользователей."
      ],
      metrics: [
        { val: "3 модуля", label: "Автоматизированных отдела" },
        { val: "Docker", label: "Контейнеризация проекта" }
      ],
      image: "assets/project_crm.png"
    },
    tr: {
      title: "Business Automation Tools",
      subtitle: "İş Süreçleri Otomasyon Modülleri",
      desc: "Küçük ve orta ölçekli işletmelerin günlük rutin operasyonlarını otomatikleştiren araçlar. Analitik veri göstergeleri (dashboard), veri yapıları ve müşteri veri formları içerir.",
      challenges: [
        "Projenin Docker ve Docker Compose ile taşınabilir bir konteyner ortamında kurulması.",
        "Müşteri ve görev akışlarını takip etmek için kullanıcı dostu grafik arayüzleri tasarlanması.",
        "Dinamik form doğrulama modülleri ile kullanıcı giriş hatalarının önlenmesi."
      ],
      metrics: [
        { val: "3 Modül", label: "Otomatize edilen iş birimi" },
        { val: "Docker", label: "Dağıtım ve paketleme yapısı" }
      ],
      image: "assets/project_crm.png"
    }
  }
};

function openProjectModal(projectId) {
  if (!projectModal || !modalBodyContent) return;

  const lang = document.documentElement.lang || "uz";
  const data = projectDetailsData[projectId]?.[lang] || projectDetailsData[projectId]?.["en"];

  if (!data) return;

  // Translation helpers for sectional titles
  const achTitle = lang === "uz" ? "Asosiy yutuqlar" : (lang === "ru" ? "Ключевые достижения" : (lang === "tr" ? "Anahtar başarılar" : "Key Achievements"));

  let challengesHtml = "";
  data.challenges.forEach((ch) => {
    challengesHtml += `<li>${ch}</li>`;
  });

  let metricsHtml = "";
  data.metrics.forEach((m) => {
    metricsHtml += `
      <div class="modal-metric-card">
        <strong>${m.val}</strong>
        <span>${m.label}</span>
      </div>`;
  });

  modalBodyContent.innerHTML = `
    <h2>${data.title}</h2>
    <div class="modal-subtitle">${data.subtitle}</div>
    <img src="${data.image}" alt="${data.title}">
    <p>${data.desc}</p>
    <h4 class="modal-section-title">${achTitle}</h4>
    <ul>${challengesHtml}</ul>
    <div class="modal-metrics-grid">${metricsHtml}</div>
  `;

  // Toggle modal state
  projectModal.classList.add("is-open");
  projectModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden"; // disable background scrolling
}

function closeProjectModal() {
  if (!projectModal) return;
  projectModal.classList.remove("is-open");
  projectModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = ""; // enable background scrolling
}

if (detailsButtons.length) {
  detailsButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const projectId = btn.getAttribute("data-project-id");
      if (projectId) {
        openProjectModal(projectId);
      }
    });
  });
}

if (closeModalElements.length) {
  closeModalElements.forEach((el) => {
    el.addEventListener("click", closeProjectModal);
  });
}

// Close modal on Escape key press
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeProjectModal();
  }
});

resizeCanvas();
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  drawWebBackground();
} else if (animationFrame) {
  cancelAnimationFrame(animationFrame);
}
updateHeader();
