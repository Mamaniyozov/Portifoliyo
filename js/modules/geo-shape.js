/* ============================================================
   GeoShape
   A single canvas-rendered geometric wireframe — hexagonal
   "cube" core, counter-rotating rings, orbiting particles and a
   soft halo — that travels from the top of the page to the
   bottom as the whole document is scrolled. It's the site's
   persistent "living" highlight: a single character moving
   downward, natural and unhurried.

   - Vertical position is scroll-scrubbed via GSAP ScrollTrigger
     (scrub smoothing = the only easing on that axis, so motion
     never snaps or jerks with fast scrolling/trackpad flicks).
   - Rotation / ring-rotation / scale run as independent, infinite
     GSAP tweens so the shape keeps breathing even while the user
     holds still — that's what reads as "alive" rather than a
     scroll-bound puppet.
   - A single gsap.ticker callback reads the animated state and
     redraws the canvas — no extra requestAnimationFrame loop
     competing with GSAP's own.
   ============================================================ */

const COLORS = {
  cyan: "#00f2fe",
  blue: "#3b82f6",
  violet: "#7c3aed",
};

const PARTICLE_COUNT = 7;

export function initGeoShape({ canvas, reducedMotion } = {}) {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!canvas || !canvas.getContext || !gsap) return null;

  const ctx = canvas.getContext("2d");
  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let travelStart = 0;
  let travelEnd = 0;

  const state = {
    yProgress: 0,
    rotation: 0,
    ringRotation: 0,
    scale: 1,
    x: 0,
  };

  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    angle: (i / PARTICLE_COUNT) * Math.PI * 2,
    radius: 70 + (i % 3) * 14,
    speed: 0.25 + (i % 4) * 0.08,
    size: 1.6 + (i % 3) * 0.6,
    color: i % 2 === 0 ? COLORS.cyan : COLORS.violet,
  }));

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    state.x = width / 2;
    travelStart = height * 0.16;
    travelEnd = height * 0.84;
  }

  function drawHexagonPath(r) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 2;
      const px = Math.cos(angle) * r;
      const py = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    const fadeIn = gsap.utils.clamp(0, 1, state.yProgress / 0.08);
    const fadeOut = gsap.utils.clamp(0, 1, (1 - state.yProgress) / 0.16);
    const opacity = reducedMotion ? 1 : Math.min(fadeIn, fadeOut);
    if (opacity <= 0.01) return;

    const y = travelStart + (travelEnd - travelStart) * state.yProgress;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.translate(state.x, y);

    // Soft halo behind the shape — depth cue, travels with it.
    const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, 150);
    halo.addColorStop(0, "rgba(79, 70, 229, 0.35)");
    halo.addColorStop(1, "rgba(79, 70, 229, 0)");
    ctx.fillStyle = halo;
    ctx.beginPath();
    ctx.arc(0, 0, 150, 0, Math.PI * 2);
    ctx.fill();

    // Concentric rings, counter-rotating slowly for depth.
    ctx.save();
    ctx.rotate(state.ringRotation);
    [58, 78, 100].forEach((r, i) => {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(124, 58, 237, ${0.32 - i * 0.08})`;
      ctx.lineWidth = 1;
      ctx.stroke();
    });
    ctx.restore();

    // Orbiting particles.
    particles.forEach((p) => {
      const angle = p.angle + state.rotation * p.speed;
      const px = Math.cos(angle) * p.radius;
      const py = Math.sin(angle) * p.radius;
      ctx.beginPath();
      ctx.arc(px, py, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Core hexagonal "cube" wireframe.
    ctx.save();
    ctx.rotate(state.rotation);
    ctx.scale(state.scale, state.scale);

    ctx.shadowColor = COLORS.blue;
    ctx.shadowBlur = 16;
    ctx.strokeStyle = COLORS.blue;
    ctx.lineWidth = 1.4;
    drawHexagonPath(42);
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.strokeStyle = "rgba(124, 58, 237, 0.55)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -42);
    ctx.lineTo(0, 42);
    ctx.moveTo(-36, -21);
    ctx.lineTo(36, 21);
    ctx.moveTo(36, -21);
    ctx.lineTo(-36, 21);
    ctx.stroke();
    ctx.restore();

    // Core glow.
    const core = ctx.createRadialGradient(0, 0, 0, 0, 0, 22);
    core.addColorStop(0, "rgba(59, 130, 246, 0.9)");
    core.addColorStop(1, "rgba(59, 130, 246, 0)");
    ctx.fillStyle = core;
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  resize();

  let resizeTimer = null;
  const onResize = () => {
    resize();
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => ScrollTrigger && ScrollTrigger.refresh(), 150);
  };
  window.addEventListener("resize", onResize);

  if (reducedMotion || !ScrollTrigger) {
    // Static, centered, fully visible — no scroll coupling, no
    // ambient tweens, single frame drawn once.
    state.yProgress = 0.32;
    draw();
    return () => window.removeEventListener("resize", onResize);
  }

  gsap.registerPlugin(ScrollTrigger);

  const scrollTween = gsap.to(state, {
    yProgress: 1,
    ease: "none",
    scrollTrigger: {
      trigger: document.documentElement,
      start: "top top",
      end: "bottom bottom",
      scrub: 1.1,
    },
  });

  const rotationTween = gsap.to(state, {
    rotation: `+=${Math.PI * 2}`,
    duration: 22,
    ease: "none",
    repeat: -1,
  });

  const ringTween = gsap.to(state, {
    ringRotation: `-=${Math.PI * 2}`,
    duration: 34,
    ease: "none",
    repeat: -1,
  });

  const scaleTween = gsap.to(state, {
    scale: 1.08,
    duration: 4.2,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });

  gsap.ticker.add(draw);

  const onVisibility = () => {
    if (document.hidden) gsap.ticker.remove(draw);
    else gsap.ticker.add(draw);
  };
  document.addEventListener("visibilitychange", onVisibility);

  return function cleanup() {
    gsap.ticker.remove(draw);
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("resize", onResize);
    scrollTween.scrollTrigger?.kill();
    scrollTween.kill();
    rotationTween.kill();
    ringTween.kill();
    scaleTween.kill();
  };
}
