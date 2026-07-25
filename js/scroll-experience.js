/* ============================================================
   Scroll Experience — entry point
   Wires up all scroll-driven modules. Loaded as a native ES
   module (no bundler needed for a static site); each module is
   self-contained, reusable and independently testable.
   Everything here is additive to script.js — it never redefines
   globals script.js already owns (navbar, i18n, filters, cursor,
   ribbon trail, three.js hero, loader).
   ============================================================ */

import { initScrollProgress } from "./modules/scroll-progress.js";
import { initSpiralParticles } from "./modules/spiral-particles.js";
import { initBackgroundGlow } from "./modules/background-glow.js";
import { initParallaxLayer } from "./modules/parallax-layer.js";
import { initHeroCinematic } from "./modules/hero-cinematic.js";
import { initScrollReveal } from "./modules/scroll-reveal.js";
import { initProjectsStory } from "./modules/projects-story.js";

function boot() {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bgLayer = document.querySelector(".bg-layer");

  // Always on: progress bar, reveal, hero entrance and projects
  // storytelling all degrade gracefully (instant/static) under
  // reduced motion instead of being skipped outright.
  initScrollProgress();
  initScrollReveal({ reducedMotion });
  initHeroCinematic({ reducedMotion });
  initProjectsStory({ reducedMotion });

  // Continuous/ambient motion: fully skipped under reduced motion.
  initSpiralParticles({
    canvas: document.getElementById("particleCanvas"),
    reducedMotion,
    bgLayer,
  });
  initBackgroundGlow({ reducedMotion });
  initParallaxLayer({ reducedMotion });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
