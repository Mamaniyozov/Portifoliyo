/* ============================================================
   SpiralParticles
   Reuses the existing #particleCanvas constellation field and
   blends it with scroll progress:
     - angular speed increases with scroll
     - orbit radius contracts toward the canvas center
     - opacity fades and a CSS blur var ramps up
     - connecting lines fade out as the spiral tightens
     - mouse-repel stays active early, fades out deeper in scroll
   Ambient drift + mouse repel preserve the original "alive"
   background feel at the top of the page; the spiral becomes the
   dominant motion the further the user scrolls.
   ============================================================ */

import { scrollState } from "./scroll-progress.js";

export function initSpiralParticles({ canvas, reducedMotion, bgLayer } = {}) {
  if (!canvas || !canvas.getContext) return;

  const ctx = canvas.getContext("2d");
  const isMobile = window.innerWidth <= 640;
  const POINT_COUNT = isMobile ? 46 : 90;
  const LINK_DIST = 120;
  const mouse = { x: -9999, y: -9999 };

  let width = 0;
  let height = 0;
  let cx = 0;
  let cy = 0;
  let points = [];
  let rafId = null;

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    cx = width / 2;
    cy = height / 2;
  }

  function initPoints() {
    points = Array.from({ length: POINT_COUNT }, () => {
      const maxSpan = Math.max(width, height);
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        angle: Math.random() * Math.PI * 2,
        baseRadius: 30 + Math.random() * maxSpan * 0.55,
        angularSpeed: (0.35 + Math.random() * 0.4) * (Math.random() < 0.5 ? -1 : 1),
        drawX: 0,
        drawY: 0,
      };
    });
  }

  function getBgParallaxY() {
    if (!bgLayer) return 0;
    const match = /translateY\(([-\d.]+)px\)/.exec(bgLayer.style.transform || "");
    return match ? parseFloat(match[1]) : 0;
  }

  function renderFrame() {
    const p = scrollState.progress;
    ctx.clearRect(0, 0, width, height);

    points.forEach((pt) => {
      const driftDamp = 1 - p * 0.55;
      pt.x += pt.vx * driftDamp;
      pt.y += pt.vy * driftDamp;
      if (pt.x < 0 || pt.x > width) pt.vx *= -1;
      if (pt.y < 0 || pt.y > height) pt.vy *= -1;

      const dx = pt.x - mouse.x;
      const dy = pt.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100 && dist > 0.001) {
        const force = ((100 - dist) / 100) * (1 - p * 0.7);
        pt.x += (dx / dist) * force * 1.6;
        pt.y += (dy / dist) * force * 1.6;
      }

      pt.angle += 0.0035 * pt.angularSpeed * (1 + p * 7);
      const targetRadius = pt.baseRadius * (1 - p * 0.72);
      const spiralX = cx + Math.cos(pt.angle) * targetRadius;
      const spiralY = cy + Math.sin(pt.angle) * targetRadius;

      pt.drawX = pt.x + (spiralX - pt.x) * p;
      pt.drawY = pt.y + (spiralY - pt.y) * p;

      const opacity = Math.max(0.55 - p * 0.4, 0.1);
      ctx.beginPath();
      ctx.arc(pt.drawX, pt.drawY, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 242, 254, ${opacity})`;
      ctx.fill();
    });

    const linkAlpha = 1 - p * 1.5;
    if (linkAlpha > 0) {
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].drawX - points[j].drawX;
          const dy = points[i].drawY - points[j].drawY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(points[i].drawX, points[i].drawY);
            ctx.lineTo(points[j].drawX, points[j].drawY);
            ctx.strokeStyle = `rgba(0, 242, 254, ${0.12 * (1 - dist / LINK_DIST) * linkAlpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    canvas.style.setProperty("--spiral-blur", (p * 2.4).toFixed(2));
    canvas.style.setProperty("--spiral-saturate", (1 + p * 0.35).toFixed(2));
  }

  function loop() {
    renderFrame();
    rafId = requestAnimationFrame(loop);
  }

  resize();
  initPoints();

  if (reducedMotion) {
    renderFrame();
    window.addEventListener("resize", () => {
      resize();
      initPoints();
      renderFrame();
    });
    return;
  }

  rafId = requestAnimationFrame(loop);

  window.addEventListener("resize", () => {
    resize();
    initPoints();
  });

  window.addEventListener(
    "mousemove",
    (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY - getBgParallaxY();
    },
    { passive: true }
  );

  window.addEventListener("mouseleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!document.hidden && !rafId) {
      rafId = requestAnimationFrame(loop);
    }
  });
}
