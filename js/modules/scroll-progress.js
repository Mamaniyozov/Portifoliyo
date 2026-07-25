/* ============================================================
   ScrollProgress
   Single source of truth for scroll state. Computes progress
   (0..1), velocity and direction once per scroll-triggered frame,
   writes them to CSS vars (--scroll-progress / --scroll-velocity)
   and to the #scrollProgressBar width. Other modules import
   `scrollState` and read it inside their own render loop instead
   of re-computing scroll math or adding their own scroll listener.
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

  if (progressBarEl) {
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
