# Keyingi qadamlar

Holat: `feat/topology-background` branch, **commit qilinmagan**.
Oxirgi yangilanish: 2026-07-31

---

## 0. Darhol qilish kerak (menda hal bo'lmadi)

### 0.1 Performance'ni haqiqiy brauzerda tekshirish — BLOKER

Playwright orqali o'lchaganda 1440×900 da 1 fps chiqdi. Sababini qidirib
ko'rdim: mask, backdrop-filter, glow blur, cursor, hatto canvas'ning
o'zini ham o'chirib ko'rdim — hech biri o'zgartirmadi. `PerformanceObserver`
**nol** ta long task ko'rsatdi, ya'ni main thread bo'sh edi.

Nazorat tajribasi masalani yopdi: bo'sh `about:blank` sahifaga faqat
bitta bo'sh WebGL canvas qo'yib, har frameda `gl.clear()` chaqirsam ham
61 → 2 fps tushdi. Bo'sh `clear()` hech narsa turmaydi, demak bu raqam
Playwright harness'ini o'lchayapti, sahifani emas.

**Shuning uchun menda ishonchli performance raqami yo'q.**

Qilish kerak:

```bash
npm run dev          # yoki: npx serve -s . -l 4321
```

O'z Chrome'ingda och, DevTools → Performance → record qil, 5 soniya
scroll qil. Qara: FPS 55+ bo'ldimi?

Agar sekin bo'lsa, birinchi tugma — `js/modules/topology/graph.js:38`:

```js
const NODES_PER_WEIGHT = 9;   // hozir 351 node. 6 ga tushir → 234 node
```

Keyingisi — `system-topology.js` dagi `FOCUS_RANGE` (kamaytirsang,
kamroq cluster bir vaqtda ekranda bo'ladi).

### 0.2 `prefers-reduced-motion` yo'lini tekshirish

Kod bitta static frame chizib, loop'ni ishga tushirmasdan qaytadi —
lekin men buni brauzerda **sinab ko'rmadim**.

Chrome DevTools → Rendering → "Emulate CSS prefers-reduced-motion:
reduce" → sahifani yangila. Tekshir:
- Topology ko'rinadimi (harakatsiz holda)?
- Loader qotib qolmaydimi?
- Hero matni ko'rinadimi (`opacity: 1` bo'lishi kerak)?

### 0.3 HRMM havolasi — men TODO'ni o'chirdim, lekin havolani tuzatmadim

`index.html:461` da `<!-- TODO: HRMM repozitoriysi havolasini qo'ying -->`
kommenti bor edi. Men uni o'chirdim, ammo havolaning o'zi hali ham
umumiy profilga ketyapti:

```html
<a href="https://github.com/Mamaniyozov">   <!-- HRMM repo emas -->
```

Bu mening xatoyim — belgini olib tashlab, muammoni qoldirdim. HRMM repo
URL'ini ber, yoki agar repo private bo'lsa, o'sha kartadagi "GitHub'da
ko'rish" havolasini butunlay olib tashlash kerak (ishlamaydigan havola
yo'qidan yomonroq).

---

## 1. Commit qilish

Ish tekshirilgandan keyin:

```bash
git add -A
git commit   # taklif qilingan bo'linish quyida
```

Mantiqiy uchta commit:

1. `feat: replace ambient FX with WebGL service-topology background`
   — `js/modules/system-topology.js`, `topology/*`, o'chirilgan modullar,
   `index.html` va `style.css` dagi tegishli qismlar
2. `fix: accessibility, reduced-motion and locale findings`
   — `color-scheme`, `aria-describedby`, lang dropdown, denylist,
   safe-area, `navigator.languages`
3. `perf: remove forced layout in parallax, move hover transitions to transform`
   — `parallax-layer.js`, `.connect-row`, `.link-arrow`, cursor

---

## 2. Audit'dan qolgan topilmalar (hali qilinmagan)

Bular birinchi audit'da topilgan, ammo bu sessiyada qo'l tegmagan:

| Joy | Muammo | Nega qoldi |
|---|---|---|
| `index.html:12-15` | `hreflang` alternate'lar hammasi bir xil URL'ga ketadi | Endi `?lang=uz\|en\|ru` ishlaydi, shuning uchun ularni `?lang=` bilan yangilash mumkin. `sitemap.xml` ham. |
| `index.html:621` | Web3Forms access key git'da | Web3Forms uchun bu public key — texnik jihatdan xavfsiz, lekin repo public bo'lsa spam uchun ishlatilishi mumkin. Rotate qilish arzon. |
| `index.html:41` | Google Fonts render-blocking, preload yo'q | `<link rel="preload" as="font" crossorigin>` qo'shish. FOUT'ni kamaytiradi. |
| butun sahifa | Brand/kod tokenlarida `translate="no"` yo'q | Google Translate "Django"ni tarjima qilib yuborishi mumkin. |
| `script.js` contact form | Yozilgan matn bor holda sahifadan chiqishda ogohlantirish yo'q | `beforeunload`. Portfolio formasi uchun past prioritet. |
| `projects-story.js:47` | Filter aktiv kartani yashirsa, sticky panel eski loyihada qolib ketadi | Empty state qo'shdim, lekin sticky panel sinxronlanmaydi. Faqat ≥1024px da ko'rinadi. |
| `style.css` `.navbar` | `padding` transition qilinadi (layout) | **Ataylab qoldirdim.** `position: fixed`, layout faqat navbar ichida qoladi, va scroll holati o'zgarganda bir marta ishlaydi — doimiy emas. Guideline'ning bu o'rinda false positive'i. |

---

## 3. Mobil / past quvvatli qurilmalar

Hozir topology mobil'da ham to'liq ishlaydi. Tekshirilmagan risk:
arzon Android telefonda 351 node + har frame buffer upload issiqlik va
batareya yeyishi mumkin.

Ko'rib chiqish kerak:

- `navigator.connection.saveData` yoki `deviceMemory < 4` bo'lsa node
  sonini kamaytirish yoki topology'ni butunlay o'chirish
- `< 640px` da `NODES_PER_WEIGHT` ni avtomatik pasaytirish
- Batareya holatini emas — bu over-engineering bo'ladi

---

## 4. Dizayn bo'yicha ochiq savollar

Bular xato emas — qaror talab qiladigan narsalar.

**4.1 `.connect-row` dagi `01–06` raqamlari.** Frontend-design skill
aynan shuni so'roq ostiga qo'yadi: raqamlash faqat tartib ma'no
tashiganda o'rinli. Skills ro'yxatida o'rinli (tier bo'yicha tartiblangan).
Kontakt qatorlarida esa Telegram LinkedIn'dan "oldin" emas — bu shunchaki
bezak. Olib tashlashni tavsiya qilaman.

**4.2 Loader hali ham 30 gacha sanaydi.** Endi u haqiqiy gate (font +
WebGL kutadi), ammo `/30` raqami o'zboshimcha. Agar sanoq haqiqatan
nimanidir o'lchashini istasang — masalan, yuklangan cluster sonini
(10 ta) ko'rsatish mantiqiyroq bo'lardi.

**4.3 Marquee.** Skills marquee endi topology bilan bir xil ma'noni
takrorlaydi (stack nomlari). Ikkalasi ham "mening stack'im" deydi.
Bittasi ortiqcha bo'lishi mumkin.

---

## 5. Keyingi bosqich g'oyalari (hozir kerak emas)

- Har bir loyiha kartasi hover qilinganda topology'da o'sha loyihaga mos
  cluster'ni yoritish — hozir graph va content bog'lanmagan
- `window.__topologyGraph` global'ini almashtirish: `script.js` ni ham
  module qilsak, import ishlaydi va global kerak emas
- OG rasmni topology'ning haqiqiy frame'idan generatsiya qilish

---

## Bajarilgan (ma'lumot uchun)

- WebGL2 service-topology background — stack'dan derive qilingan graph,
  scroll bo'yicha kamera, pointer gravity, request pulse'lar
- 5 ta ambient tizim o'chirildi (ribbon, GeoShape, spiral particles,
  float dots, code fragments) + allaqachon o'lik bo'lgan CSS
- `color-scheme: dark`, `aria-describedby`, lang dropdown hover/ARIA
  desync, reduced-motion denylist, safe-area, `touch-action`
- Tipografika: `…`, qo'shtirnoq, `tabular-nums`, `text-wrap: balance`
- Til aniqlash: `?lang=` → saqlangan → `navigator.languages` → `uz`
- Filter'lar URL'ga sinxron, back tugmasi ishlaydi, live region matn
  bilan e'lon qiladi, empty state qo'shildi
- `parallax-layer.js`: har frame'dagi forced layout olib tashlandi
  (va o'zini-o'zi o'lchash feedback bug'i tuzatildi)
- Hover transition'lar `padding`/`gap`/`width` dan `transform` ga
