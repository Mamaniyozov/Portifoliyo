/* ============================================================
   ScrollProgress
   Single source of truth for scroll state. Computes progress
   (0..1), velocity and direction once per scroll-triggered frame,
   writes them to CSS vars (--scroll-progress / --scroll-velocity)
   and to the #scrollProgressBar width.

   Feature detection: if the browser supports CSS scroll-driven
   animations (animation-timeline: scroll()), the progress bar
   width is owned by CSS — skipping the JS DOM write avoids a
   style conflict where JS and CSS fight over the same property.
   Other modules still read scrollState for their own logic.
   ============================================================ */

export const scrollState = {
  progress: 0,
  velocity: 0,
  direction: 0,
  scrollY: 0,
};

let progressBarEl = null;
let lastProgress = 0;
let lastTime = typeof performance !== "undefined" ? performance.now() : Date.now();
let ticking = false;

/* True when CSS owns the progress bar via animation-timeline: scroll() */
const CSS_SCROLL_DRIVEN = CSS.supports("animation-timeline", "scroll()");

function computeProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const raw = scrollable > 0 ? window.scrollY / scrollable : 0;
  return Math.min(Math.max(raw, 0), 1);
}

function update() {
  const now = performance.now();
  const dt = Math.max(now - lastTime, 1);
  const progress = computeProgress();
  const delta = progress - lastProgress;

  scrollState.scrollY = window.scrollY;
  scrollState.progress = progress;
  scrollState.direction = delta > 0.0005 ? 1 : delta < -0.0005 ? -1 : 0;
  scrollState.velocity = Math.min(Math.abs(delta / dt) * 1000, 1);

  lastProgress = progress;
  lastTime = now;
  ticking = false;

  const root = document.documentElement;
  root.style.setProperty("--scroll-progress", progress.toFixed(4));
  root.style.setProperty("--scroll-velocity", scrollState.velocity.toFixed(4));

  /* Let CSS own the bar when scroll-driven animations are supported. */
  if (progressBarEl && !CSS_SCROLL_DRIVEN) {
    progressBarEl.style.width = `${(progress * 100).toFixed(2)}%`;
  }
}

function requestUpdate() {
  if (!ticking) {
    ticking = true;
    requestAnimationFrame(update);
  }
}

export function initScrollProgress() {
  progressBarEl = document.getElementById("scrollProgressBar");
  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  return scrollState;
}
