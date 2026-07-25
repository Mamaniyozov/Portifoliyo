/* ============================================================
   ParallaxLayer
   Generic, attribute-driven depth parallax: any element with
   [data-parallax="0.0-1.0"] drifts a few px against scroll based
   on its own distance from viewport center, giving each layer a
   distinct "depth". IntersectionObserver keeps offscreen nodes
   out of the per-frame update loop entirely (no wasted work when
   the hero has long scrolled away).
   ============================================================ */

export function initParallaxLayer({ reducedMotion } = {}) {
  if (reducedMotion) return;

  const nodes = Array.from(document.querySelectorAll("[data-parallax]"));
  if (!nodes.length) return;

  const active = new Set();

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) active.add(entry.target);
          else active.delete(entry.target);
        });
      },
      { rootMargin: "25% 0px 25% 0px" }
    );
    nodes.forEach((node) => io.observe(node));
  } else {
    nodes.forEach((node) => active.add(node));
  }

  let ticking = false;

  function update() {
    active.forEach((node) => {
      const speed = parseFloat(node.dataset.parallax) || 0.2;
      const rect = node.getBoundingClientRect();
      const centerOffset = rect.top + rect.height / 2 - window.innerHeight / 2;
      const shift = -centerOffset * speed * 0.12;
      node.style.transform = `translate3d(0, ${shift.toFixed(2)}px, 0)`;
    });
    ticking = false;
  }

  function requestUpdate() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  requestUpdate();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
}
