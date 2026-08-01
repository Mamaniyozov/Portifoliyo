/* ============================================================
   CardSpotlight (UI/UX Pro Max)
   Adds dynamic interactive cursor-following spotlight effect to
   cards across the portfolio. Uses requestAnimationFrame for
   silky 60fps tracking and sets CSS custom properties --mouse-x
   and --mouse-y on hover.
   ============================================================ */

export function initCardSpotlight({ reducedMotion } = {}) {
  if (reducedMotion) return;

  const cards = document.querySelectorAll(".card, .project-card, .contact-form-card, .projects-story-frame");
  if (!cards.length) return;

  cards.forEach((card) => {
    let ticking = false;

    card.addEventListener("mousemove", (e) => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        card.style.setProperty("--mouse-x", `${x.toFixed(1)}px`);
        card.style.setProperty("--mouse-y", `${y.toFixed(1)}px`);
        ticking = false;
      });
    }, { passive: true });
  });
}
