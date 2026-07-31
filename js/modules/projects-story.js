/* ============================================================
   ProjectsStory
   Sticky/pinned storytelling for the Projects section. Instead of
   duplicating each project's banner/terminal markup in a separate
   data attribute (which would drift out of sync as projects are
   edited), the active card's real .project-banner or
   .terminal-panel node is cloned into the sticky preview — single
   source of truth, zero maintenance overhead for future projects.

   Desktop (>=1024px): IntersectionObserver watches each card and
   swaps the sticky panel to whichever card is most visible.
   Mobile: the sticky panel is hidden by CSS and the observer is
   disconnected via matchMedia, so there's no wasted work.
   ============================================================ */

const ACCENT_MAP = {
  cyan: "var(--cyan)",
  violet: "var(--violet)",
  green: "var(--neon-green)",
  indigo: "var(--indigo)",
};

export function initProjectsStory({ reducedMotion } = {}) {
  const track = document.querySelector(".projects-story-track");
  const frame = document.querySelector(".projects-story-frame");
  const mediaEl = document.getElementById("projectsStoryMedia");
  const countEl = document.getElementById("projectsStoryCount");
  const titleEl = document.getElementById("projectsStoryTitle");
  const tagEl = document.getElementById("projectsStoryTag");
  const dotsWrap = document.getElementById("projectsStoryDots");

  if (!track || !frame || !mediaEl) return;

  const cards = Array.from(track.querySelectorAll(".project-card"));
  if (!cards.length) return;

  if (dotsWrap) {
    dotsWrap.innerHTML = cards
      .map((_, i) => `<span class="story-dot${i === 0 ? " is-active" : ""}"></span>`)
      .join("");
  }
  const dots = dotsWrap ? Array.from(dotsWrap.children) : [];

  let activeIndex = -1;
  let swapTimer = null;

  function setActive(index) {
    if (index === activeIndex || !cards[index]) return;
    activeIndex = index;
    const card = cards[index];
    const media = card.querySelector(".project-banner, .terminal-panel");
    const title = card.querySelector(".card-title")?.textContent || "";
    const tags = Array.from(card.querySelectorAll(".tag"))
      .map((tag) => tag.textContent)
      .join(" · ");
    const accentKey = card.dataset.storyAccent;
    const accent = ACCENT_MAP[accentKey] || "var(--cyan)";

    frame.style.setProperty("--story-accent", accent);
    if (countEl) countEl.textContent = String(index + 1).padStart(2, "0");
    if (titleEl) titleEl.textContent = title;
    if (tagEl) tagEl.textContent = tags;
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));

    const swap = () => {
      mediaEl.innerHTML = "";
      if (media) mediaEl.appendChild(media.cloneNode(true));
      mediaEl.classList.remove("is-swapping");
    };

    if (reducedMotion) {
      swap();
      return;
    }

    mediaEl.classList.add("is-swapping");
    clearTimeout(swapTimer);
    swapTimer = setTimeout(swap, 220);
  }

  setActive(0);

  if (!("IntersectionObserver" in window)) return;

  const mq = window.matchMedia("(min-width: 1024px)");
  let observer = null;

  function connect() {
    if (observer || !mq.matches) return;
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const index = cards.indexOf(visible.target);
          if (index !== -1) setActive(index);
        }
      },
      { threshold: [0.3, 0.5, 0.7], rootMargin: "-20% 0px -20% 0px" }
    );
    cards.forEach((card) => observer.observe(card));
  }

  function disconnect() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  connect();
  mq.addEventListener("change", () => (mq.matches ? connect() : disconnect()));

  document.addEventListener("projectsfiltered", () => {
    const firstVisibleIndex = cards.findIndex((card) => !card.classList.contains("is-hidden"));
    if (firstVisibleIndex !== -1) {
      setActive(firstVisibleIndex);
    }
  });

  // 3D Card Hover Tilt & Multi-layer Poster Parallax
  if (!reducedMotion) {
    cards.forEach((card) => {
      const bannerImg = card.querySelector(".project-banner img");
      card.addEventListener("pointermove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const rx = -y * 0.06;
        const ry = x * 0.06;

        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(28px)`;
        if (bannerImg) {
          bannerImg.style.transform = `scale(1.06) translate3d(${x * 0.03}px, ${y * 0.03}px, 20px)`;
        }
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
        if (bannerImg) bannerImg.style.transform = "";
      });
    });
  }

  // 3D Stage View Toggle
  const toggleBtn = document.getElementById("stageViewToggle");
  const storyContainer = document.querySelector(".projects-story");
  if (toggleBtn && storyContainer) {
    toggleBtn.addEventListener("click", () => {
      const isStage = storyContainer.classList.toggle("is-3d-stage");
      toggleBtn.classList.toggle("is-active", isStage);
      if (window.__audioSynth) window.__audioSynth.playClick();
    });
  }
}
