/* ============================================================
   BackgroundGlow
   Adds scroll-linked depth to the ambient background: the two
   ambient glow blobs drift/scale on separate wrapper elements
   (so they don't fight the existing CSS floatAnimation on the
   inner .glow nodes), and .bg-layer gets a subtle hue-rotate +
   glow-intensity boost tied to scroll progress/velocity.
   All motion is expressed through CSS custom properties consumed
   by transitions in style.css, so the browser compositor (not JS)
   handles the actual interpolation — cheap on mobile.
   ============================================================ */

import { scrollState } from "./scroll-progress.js";

export function initBackgroundGlow({ reducedMotion } = {}) {
  if (reducedMotion) return;

  const bgLayer = document.querySelector(".bg-layer");
  const violetWrap = document.querySelector(".glow-scroll-violet");
  const indigoWrap = document.querySelector(".glow-scroll-indigo");

  if (!bgLayer && !violetWrap && !indigoWrap) return;

  let ticking = false;

  function update() {
    const p = scrollState.progress;
    const v = scrollState.velocity;

    if (violetWrap) {
      violetWrap.style.transform = `translate3d(${(-p * 90).toFixed(1)}px, ${(p * 140).toFixed(1)}px, 0) scale(${(1 + p * 0.22).toFixed(3)})`;
    }
    if (indigoWrap) {
      indigoWrap.style.transform = `translate3d(${(p * 110).toFixed(1)}px, ${(-p * 100).toFixed(1)}px, 0) scale(${(1 + p * 0.18).toFixed(3)})`;
    }
    if (bgLayer) {
      bgLayer.style.setProperty("--bg-hue", (p * 34).toFixed(1));
      bgLayer.style.setProperty("--bg-glow-boost", (1 + v * 0.5).toFixed(2));
    }

    ticking = false;
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  update();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
}
