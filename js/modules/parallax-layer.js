/* ============================================================
   ParallaxLayer
   Attribute-driven depth parallax: any element with
   [data-parallax="0.0-1.0"] drifts a few px against scroll based
   on its distance from viewport centre, giving each layer its own
   apparent depth.

   Two things this module deliberately does NOT do:

   1. It never reads layout inside the animation frame. Positions
      are measured once (and again on resize), cached in document
      space, and every frame is pure arithmetic against scrollY.
      The earlier version called getBoundingClientRect() and wrote
      style.transform in the same loop, so each write invalidated
      layout and forced a synchronous reflow for the next read —
      one forced reflow per node, per frame.

   2. It never measures an element while its own transform is
      applied. getBoundingClientRect() reports the *transformed*
      box, so feeding that back in made each frame's input depend
      on the previous frame's output — a slow drift feedback loop
      on top of the performance cost. Measurement clears the
      transform first, so the cached value is the true layout
      position.
   ============================================================ */

export function initParallaxLayer({ reducedMotion } = {}) {
  if (reducedMotion) return;

  const nodes = Array.from(document.querySelectorAll("[data-parallax]"));
  if (!nodes.length) return;

  const active = new Set();
  /** node → centre Y in document space, transform-free. */
  const centers = new WeakMap();
  const speeds = new WeakMap();

  nodes.forEach((node) => {
    speeds.set(node, parseFloat(node.dataset.parallax) || 0.2);
  });

  /**
   * Measure every node's untransformed centre. Runs on init and on
   * resize only — never per frame. Batched: all transforms cleared,
   * then all rects read, then all transforms restored, so the
   * browser performs one layout pass rather than one per node.
   */
  function measure() {
    const previous = nodes.map((node) => node.style.transform);

    nodes.forEach((node) => {
      node.style.transform = "none";
    });

    const scrollY = window.scrollY;
    const rects = nodes.map((node) => node.getBoundingClientRect());

    nodes.forEach((node, i) => {
      centers.set(node, rects[i].top + rects[i].height / 2 + scrollY);
      node.style.transform = previous[i];
    });
  }

  let ticking = false;

  function update() {
    const viewportCenter = window.innerHeight / 2 + window.scrollY;

    active.forEach((node) => {
      const center = centers.get(node);
      if (center === undefined) return;
      const shift = -(center - viewportCenter) * speeds.get(node) * 0.12;
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

  // IntersectionObserver keeps offscreen nodes out of the per-frame
  // loop entirely — no wasted work once the hero has scrolled away.
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

  let resizeTimer = null;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      measure();
      requestUpdate();
    }, 150);
  }

  measure();
  requestUpdate();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", onResize);

  // Web fonts land after first paint and reflow the hero, which
  // would leave every cached centre stale by tens of pixels.
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {
      measure();
      requestUpdate();
    });
  }
}
