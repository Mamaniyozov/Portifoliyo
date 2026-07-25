/* ============================================================
   HeroCinematic
   Staggered hero entrance. Adds `.is-cinematic-ready` (which is
   the ONLY thing that hides the hero children via CSS) right
   before playing, so if this script fails to load for any reason
   the hero simply stays in its normal, fully visible static state
   — no flash-of-invisible-content risk.
   Waits for the loader's `loaderdone` event (dispatched from
   script.js) so the entrance plays right as the loader fades.
   ============================================================ */

export function initHeroCinematic({ reducedMotion } = {}) {
  const hero = document.querySelector(".hero");
  if (!hero || reducedMotion) return;

  hero.classList.add("is-cinematic-ready");

  const play = () => {
    requestAnimationFrame(() => hero.classList.add("is-cinematic-in"));
  };

  const loader = document.getElementById("loader");
  if (loader && !loader.classList.contains("is-done")) {
    document.addEventListener("loaderdone", play, { once: true });
  } else {
    play();
  }
}
