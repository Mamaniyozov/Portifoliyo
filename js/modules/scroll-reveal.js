/* ============================================================
   ScrollReveal
   Single IntersectionObserver covering both the original
   [data-reveal] nodes (skills, timeline, connect rows) and the
   new [data-scroll-reveal] nodes (projects storytelling, hero
   cinematic extras). Supports an optional data-reveal-delay
   (ms) for simple stagger without extra markup.
   ============================================================ */

export function initScrollReveal({ reducedMotion } = {}) {
  const nodes = document.querySelectorAll("[data-reveal], [data-scroll-reveal]");
  if (!nodes.length) return;

  if (reducedMotion || !("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const node = entry.target;
        const delay = node.dataset.revealDelay;
        if (delay) node.style.transitionDelay = `${delay}ms`;
        node.classList.add("is-revealed");
        obs.unobserve(node);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  nodes.forEach((node) => observer.observe(node));
}
