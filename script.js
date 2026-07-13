/* ============================================================
   Portfolio interactions — vanilla JS
   Subtle mouse-parallax on the antigravity hero centerpiece.
   ============================================================ */

const heroGraphic = document.querySelector(".hero-graphic");
const coreIcon = document.querySelector(".core-icon");

if (heroGraphic && coreIcon && window.matchMedia("(pointer: fine)").matches) {
  heroGraphic.addEventListener("mousemove", (event) => {
    const rect = heroGraphic.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    coreIcon.style.transform = `rotateX(${y * -18}deg) rotateY(${x * 18}deg)`;
  });

  heroGraphic.addEventListener("mouseleave", () => {
    coreIcon.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
}
