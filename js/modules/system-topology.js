/* ============================================================
   SystemTopology — the site's signature background
   A live service graph rendered in WebGL2: clusters of nodes
   (one per technology in the Skills list), links between them,
   and request pulses firing along the backbone.

   Why this and not an abstract particle cloud: the page belongs to
   a backend engineer. A drifting nebula would be decoration, but a
   network under load is the actual subject matter — it says
   "distributed systems" before a single line of copy is read.

   Behaviour
   - Scroll flies the camera through the stack, in Skills order.
     Depth of field means the cluster you are level with is sharp
     and the rest bloom out, so scrolling reads as focus pulling.
   - Pointer applies gravity; edges bend because they are rebuilt
     from live node positions rather than drawn as fixed geometry.
   - Scroll velocity raises the pulse spawn rate — move fast and
     the network is visibly busier.

   Degradation, in order: no WebGL2 → nothing renders and the CSS
   background stands alone; reduced motion → one static frame, no
   loop; hidden tab → loop parked; context lost → loop stops
   cleanly and restarts if the context comes back.
   ============================================================ */

import {
  createContext,
  createProgram,
  createDynamicBuffer,
  uploadBuffer,
  bindAttribute,
  resizeToDisplay,
} from "./topology/gl.js";
import {
  buildGraph,
  simulate,
  createPulses,
  updatePulses,
  triggerClusterHighlight,
  triggerShockwave,
  WORLD_DEPTH,
} from "./topology/graph.js";
import {
  FOCAL,
  FOCUS_DIST,
  FOCUS_RANGE,
  NODE_VS,
  NODE_FS,
  EDGE_VS,
  EDGE_FS,
  PULSE_VS,
  PULSE_FS,
} from "./topology/shaders.js";
import { scrollState } from "./scroll-progress.js";

/* ---------- palette, matched to style.css custom properties ---------- */

const CORE_RGB = [0.0, 0.949, 0.996];   // --cyan   #00f2fe
const WARM_RGB = [0.549, 0.325, 1.0];   // --violet #7c3aed, lifted
// Raised well above the literal --indigo. Under additive blending a
// hairline at the source colour's luminance is effectively invisible;
// the edges need to be emissive, not merely tinted.
const EDGE_RGB = [0.25, 0.55, 1.0];
const OK_RGB   = [0.133, 1.0, 0.62];    // --neon-green #22ff9e
const WARN_RGB = [1.0, 0.737, 0.18];    // amber — the minority path

/* ============================================================ */

export function initSystemTopology({ canvas, reducedMotion } = {}) {
  if (!canvas) return null;

  const gl = createContext(canvas);
  if (!gl) return null;

  const nodeProgram = createProgram(gl, NODE_VS, NODE_FS, {
    uniforms: ["uResolution", "uCameraZ", "uDpr", "uCore", "uWarm", "uIntensity"],
    attributes: ["aPosition", "aSize", "aTone"],
  });
  const edgeProgram = createProgram(gl, EDGE_VS, EDGE_FS, {
    uniforms: ["uResolution", "uCameraZ", "uDpr", "uColor", "uOpacity", "uIntensity"],
    attributes: ["aPosition"],
  });
  const pulseProgram = createProgram(gl, PULSE_VS, PULSE_FS, {
    uniforms: ["uResolution", "uCameraZ", "uDpr", "uOk", "uWarn", "uIntensity"],
    attributes: ["aPosition", "aTone"],
  });

  if (!nodeProgram || !edgeProgram || !pulseProgram) return null;

  const graph = buildGraph();
  const pulses = createPulses(90);

  // Scratch arrays, allocated once. Rebuilding these per frame is
  // what keeps the GC out of the animation loop.
  const edgeVertices = new Float32Array(graph.edges.count * 6);
  const pulsePositions = new Float32Array(pulses.max * 3);
  const pulseTones = new Float32Array(pulses.max);

  /* Screen-space (CSS px) positions of the nodes currently in sharp
     focus. Published for the custom cursor, which swells as it
     passes near a live node — the projection already exists here,
     so the cursor reads it rather than duplicating camera maths. */
  const screen = new Float32Array(graph.nodeCount * 2);
  const published = { screen, screenCount: 0 };

  const nodeBuffer = createDynamicBuffer(gl, graph.nodeCount * 3);
  const sizeBuffer = createDynamicBuffer(gl, graph.nodeCount);
  const toneBuffer = createDynamicBuffer(gl, graph.nodeCount);
  const edgeBuffer = createDynamicBuffer(gl, edgeVertices.length);
  const pulseBuffer = createDynamicBuffer(gl, pulsePositions.length);
  const pulseToneBuffer = createDynamicBuffer(gl, pulseTones.length);

  // Size and tone never change — upload once.
  uploadBuffer(gl, sizeBuffer, graph.size, graph.size.length);
  uploadBuffer(gl, toneBuffer, graph.tone, graph.tone.length);

  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  // Additive: overlapping links and nodes accumulate into glow
  // instead of occluding each other.
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
  gl.clearColor(0, 0, 0, 0);

  const pointer = { x: 0, y: 0, z: 0, active: false, screenX: 0, screenY: 0 };
  const state = {
    cameraZ: -FOCUS_DIST,
    dpr: 1,
    running: false,
    lost: false,
    intensity: 1,
  };

  let rafId = null;
  let lastTime = performance.now();
  let elapsed = 0;

  /* ---------- pointer ---------- */

  function updatePointerWorld() {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const persp = FOCAL / FOCUS_DIST;
    pointer.x = (pointer.screenX - rect.width / 2) / persp;
    pointer.y = -(pointer.screenY - rect.height / 2) / persp;
    pointer.z = state.cameraZ + FOCUS_DIST;
  }

  let lastPointerX = 0;
  let lastPointerY = 0;

  function onPointerMove(event) {
    const vx = event.clientX - lastPointerX;
    const vy = -(event.clientY - lastPointerY);
    lastPointerX = event.clientX;
    lastPointerY = event.clientY;

    pointer.screenX = event.clientX;
    pointer.screenY = event.clientY;
    pointer.active = true;
    pointer.vx = vx;
    pointer.vy = vy;
    updatePointerWorld();
  }

  function onPointerLeave() {
    pointer.active = false;
  }

  /* ---------- frame ---------- */

  function buildEdgeVertices() {
    const { indices, count } = graph.edges;
    const pos = graph.position;
    for (let i = 0; i < count; i++) {
      const a = indices[i * 2] * 3;
      const b = indices[i * 2 + 1] * 3;
      const o = i * 6;
      edgeVertices[o] = pos[a];
      edgeVertices[o + 1] = pos[a + 1];
      edgeVertices[o + 2] = pos[a + 2];
      edgeVertices[o + 3] = pos[b];
      edgeVertices[o + 4] = pos[b + 1];
      edgeVertices[o + 5] = pos[b + 2];
    }
  }

  function buildPulseVertices() {
    const { indices } = graph.edges;
    const pos = graph.position;
    for (let i = 0; i < pulses.active; i++) {
      const edge = pulses.edge[i];
      const a = indices[edge * 2] * 3;
      const b = indices[edge * 2 + 1] * 3;
      const t = pulses.t[i];
      const o = i * 3;
      pulsePositions[o] = pos[a] + (pos[b] - pos[a]) * t;
      pulsePositions[o + 1] = pos[a + 1] + (pos[b + 1] - pos[a + 1]) * t;
      pulsePositions[o + 2] = pos[a + 2] + (pos[b + 2] - pos[a + 2]) * t;
      pulseTones[i] = pulses.tone[i];
    }
  }

  function setCommonUniforms(prog) {
    // uResolution is in CSS pixels, not device pixels: world→screen
    // projection must stay DPR-independent or the whole scene would
    // render at half scale on a retina display. Device-pixel scaling
    // is applied separately, and only to gl_PointSize, via uDpr.
    gl.uniform2f(
      prog.uniforms.uResolution,
      canvas.width / state.dpr,
      canvas.height / state.dpr
    );
    gl.uniform1f(prog.uniforms.uCameraZ, state.cameraZ);
    gl.uniform1f(prog.uniforms.uDpr, state.dpr);
    gl.uniform1f(prog.uniforms.uIntensity, state.intensity);
  }

  /**
   * The hero is where the network states its case, at full strength
   * and with the centre-mask keeping the headline clear. Past the
   * hero, body copy spans the full frame and a background this
   * bright measurably hurts reading, so it steps back to a
   * supporting role. Text legibility outranks the effect.
   */
  function intensityFor(progress) {
    const HERO_END = 0.05;
    const SETTLED = 0.18;
    const FLOOR = 0.38;
    if (progress <= HERO_END) return 1;
    const t = Math.min((progress - HERO_END) / (SETTLED - HERO_END), 1);
    return 1 - (1 - FLOOR) * t;
  }

  function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    buildEdgeVertices();
    uploadBuffer(gl, edgeBuffer, edgeVertices, edgeVertices.length);

    gl.useProgram(edgeProgram.program);
    setCommonUniforms(edgeProgram);
    gl.uniform3fv(edgeProgram.uniforms.uColor, EDGE_RGB);
    gl.uniform1f(edgeProgram.uniforms.uOpacity, 0.85);
    bindAttribute(gl, edgeProgram.attributes.aPosition, edgeBuffer, 3);
    gl.drawArrays(gl.LINES, 0, graph.edges.count * 2);

    uploadBuffer(gl, nodeBuffer, graph.position, graph.position.length);

    gl.useProgram(nodeProgram.program);
    setCommonUniforms(nodeProgram);
    gl.uniform3fv(nodeProgram.uniforms.uCore, CORE_RGB);
    gl.uniform3fv(nodeProgram.uniforms.uWarm, WARM_RGB);
    bindAttribute(gl, nodeProgram.attributes.aPosition, nodeBuffer, 3);
    bindAttribute(gl, nodeProgram.attributes.aSize, sizeBuffer, 1);
    bindAttribute(gl, nodeProgram.attributes.aTone, toneBuffer, 1);
    gl.drawArrays(gl.POINTS, 0, graph.nodeCount);

    if (pulses.active > 0) {
      buildPulseVertices();
      uploadBuffer(gl, pulseBuffer, pulsePositions, pulses.active * 3);
      uploadBuffer(gl, pulseToneBuffer, pulseTones, pulses.active);

      gl.useProgram(pulseProgram.program);
      setCommonUniforms(pulseProgram);
      gl.uniform3fv(pulseProgram.uniforms.uOk, OK_RGB);
      gl.uniform3fv(pulseProgram.uniforms.uWarn, WARN_RGB);
      bindAttribute(gl, pulseProgram.attributes.aPosition, pulseBuffer, 3);
      bindAttribute(gl, pulseProgram.attributes.aTone, pulseToneBuffer, 1);
      gl.drawArrays(gl.POINTS, 0, pulses.active);
    }
  }

  function syncSize() {
    if (resizeToDisplay(gl, canvas)) {
      state.dpr = Math.min(window.devicePixelRatio || 1, 2);
    }
  }

  /**
   * Project sharp, on-screen nodes to CSS pixels. Blurred nodes are
   * skipped: reacting to a node the visitor can barely see would
   * feel arbitrary rather than responsive.
   */
  function projectToScreen() {
    const halfW = canvas.width / state.dpr / 2;
    const halfH = canvas.height / state.dpr / 2;
    const pos = graph.position;
    let count = 0;

    for (let i = 0; i < graph.nodeCount; i++) {
      const p = i * 3;
      const d = pos[p + 2] - state.cameraZ;
      if (d < 200) continue;
      if (Math.abs(d - FOCUS_DIST) / FOCUS_RANGE > 0.45) continue;

      const persp = FOCAL / d;
      const sx = halfW + pos[p] * persp;
      const sy = halfH - pos[p + 1] * persp;
      if (sx < -80 || sy < -80 || sx > halfW * 2 + 80 || sy > halfH * 2 + 80) continue;

      screen[count * 2] = sx;
      screen[count * 2 + 1] = sy;
      count++;
    }

    published.screenCount = count;
  }

  function frame(now) {
    if (state.lost) return;

    // Normalised to 60fps steps and clamped: a tab restored after
    // a long sleep must not hand the integrator a 300-frame delta.
    const dt = Math.min((now - lastTime) / 16.667, 3);
    lastTime = now;
    elapsed += dt / 60;

    syncSize();

    const energy = scrollState.velocity;
    state.cameraZ = scrollState.progress * WORLD_DEPTH - FOCUS_DIST;
    state.intensity = intensityFor(scrollState.progress);
    if (pointer.active) updatePointerWorld();

    simulate(graph, { time: elapsed, dt, pointer, energy });
    updatePulses(pulses, graph, { dt, energy });
    render();
    projectToScreen();

    rafId = requestAnimationFrame(frame);
  }

  /* ---------- lifecycle ---------- */

  function start() {
    if (state.running || state.lost) return;
    state.running = true;
    lastTime = performance.now();
    rafId = requestAnimationFrame(frame);
  }

  function stop() {
    state.running = false;
    if (rafId !== null) cancelAnimationFrame(rafId);
    rafId = null;
  }

  function onVisibility() {
    if (document.hidden) stop();
    else start();
  }

  function onContextLost(event) {
    event.preventDefault();
    state.lost = true;
    stop();
  }

  function onContextRestored() {
    state.lost = false;
    start();
  }

  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);

  syncSize();

  // Reduced motion: draw the network once, centred on the first
  // cluster, then stop. The image survives; only the movement goes.
  if (reducedMotion) {
    state.cameraZ = WORLD_DEPTH * 0.12 - FOCUS_DIST;
    state.intensity = 1;
    simulate(graph, { time: 0, dt: 0, pointer: null, energy: 0 });
    render();
    return {
      destroy() {
        canvas.removeEventListener("webglcontextlost", onContextLost);
        canvas.removeEventListener("webglcontextrestored", onContextRestored);
      },
    };
  }

  window.addEventListener("resize", syncSize);
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerleave", onPointerLeave);
  document.addEventListener("visibilitychange", onVisibility);

  const highlightClusters = (tags) => triggerClusterHighlight(graph, pulses, tags);
  const shockwave = (strength = 1.0) => triggerShockwave(pointer.x, pointer.y, pointer.z, strength);

  published.highlightClusters = highlightClusters;
  published.triggerShockwave = shockwave;
  window.__topologyGraph = published;

  start();

  return {
    /** Exposed so the cursor and interactive cards can react to the field. */
    graph,
    screen: published,
    state,
    highlightClusters,
    destroy() {
      stop();
      window.removeEventListener("resize", syncSize);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
    },
  };
}
