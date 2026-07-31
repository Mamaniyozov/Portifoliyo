/* ============================================================
   Scroll Experience — entry point
   Wires up all scroll-driven modules. Loaded as a native ES
   module (no bundler needed for a static site); each module is
   self-contained, reusable and independently testable.
   Everything here is additive to script.js — it never redefines
   globals script.js already owns (navbar, i18n, filters, cursor,
   loader).

   Ambient effects were consolidated: the ribbon trail, GeoShape,
   spiral particle field, float dots and drifting code fragments
   were all removed in favour of a single signature background
   (SystemTopology). Five competing ambient systems meant nothing
   read as *the* centrepiece; one that encodes the real stack does.
   ============================================================ */

import { initScrollProgress } from "./modules/scroll-progress.js";
import { initBackgroundGlow } from "./modules/background-glow.js";
import { initParallaxLayer } from "./modules/parallax-layer.js";
import { initHeroCinematic } from "./modules/hero-cinematic.js";
import { initScrollReveal } from "./modules/scroll-reveal.js";
import { initProjectsStory } from "./modules/projects-story.js";
import { initSystemTopology } from "./modules/system-topology.js";
import {
  initAudioState,
  toggleAudio,
  playHoverSound,
  playClickSound,
  playPulseSound,
  setSoundPreset,
  getSoundPreset,
} from "./modules/audio-synth.js";

window.__audioSynth = {
  init: initAudioState,
  toggle: toggleAudio,
  playHover: playHoverSound,
  playClick: playClickSound,
  playPulse: playPulseSound,
  setPreset: setSoundPreset,
  getPreset: getSoundPreset,
};

function boot() {
  initAudioState();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Scroll progress must initialise first: SystemTopology and
  // BackgroundGlow both read scrollState inside their render loops
  // rather than attaching scroll listeners of their own.
  initScrollProgress();

  initScrollReveal({ reducedMotion });
  initHeroCinematic({ reducedMotion });
  initProjectsStory({ reducedMotion });

  const topology = initSystemTopology({
    canvas: document.getElementById("topologyCanvas"),
    reducedMotion,
  });

  // Drives the canvas fade-in (style.css .topology-canvas). Only set
  // when a context actually exists, so a browser without WebGL2 keeps
  // the layer fully transparent rather than fading in an empty canvas.
  if (topology) document.body.classList.add("topology-ready");

  // Signals to script.js that the background is live, so the loader
  // can gate on real readiness instead of a fixed timer. Dispatched
  // even when WebGL is unavailable (topology === null) — the loader
  // must never be able to strand the page behind a missing feature.
  document.dispatchEvent(
    new CustomEvent("topologyready", { detail: { available: Boolean(topology) } })
  );

  initBackgroundGlow({ reducedMotion });
  initParallaxLayer({ reducedMotion });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
