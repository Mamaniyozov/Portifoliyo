/* ============================================================
   Topology graph — model + simulation
   Builds the node/edge graph that the background renders, and
   advances it one frame at a time.

   The graph is not decorative filler: its shape is derived from
   the real stack listed in the Skills section. Each technology
   becomes a cluster, and its tier ("Asosiy" / "Muntazam" /
   "Ishlaganman") sets how many nodes that cluster gets. Core
   skills therefore read as visibly denser regions of the network.
   Clusters are strung along the depth axis in the same order the
   Skills list presents them, so scrolling the page is literally
   flying through the stack.

   Everything is seeded from a fixed PRNG: the layout is identical
   on every visit and in every browser. A portfolio that reshuffles
   itself each reload looks accidental, and a stable seed makes
   visual regressions debuggable.
   ============================================================ */

/** Tier → node count multiplier. Mirrors [data-tier] in index.html. */
const TIER_WEIGHT = { core: 5, regular: 3, working: 2 };

/**
 * The stack, in Skills-section order. `id` is only used for
 * debugging//data-attribute correlation; the visual reads the tier.
 */
const STACK = [
  { id: "django", tier: "core" },
  { id: "python", tier: "core" },
  { id: "postgresql", tier: "core" },
  { id: "rest-api", tier: "core" },
  { id: "auth-jwt", tier: "core" },
  { id: "telegram", tier: "regular" },
  { id: "aspnet", tier: "regular" },
  { id: "docker", tier: "regular" },
  { id: "git-linux", tier: "regular" },
  { id: "flutter", tier: "working" },
];

/** Depth of the whole network in world units. */
export const WORLD_DEPTH = 4600;

/** Golden angle — spreads clusters without a visible repeat. */
const GOLDEN_ANGLE = 2.399963229728653;

function getNodesPerWeight() {
  if (typeof window === "undefined") return 7;
  const isMobile = window.innerWidth < 640;
  const saveData = navigator.connection && navigator.connection.saveData;
  const lowMem = navigator.deviceMemory && navigator.deviceMemory < 4;
  if (isMobile || saveData || lowMem) return 5;
  return 7;
}

/* ---------- world scale ----------
   Tuned against the rendered result, not guessed. The first pass
   used orbit 250 / spread 95, which projected each cluster to a
   ~130px blob — technically a network, visually a speck. These
   values make a cluster roughly fill the viewport's short axis at
   the focus plane, so the graph reads as an environment the page
   sits inside rather than an ornament floating beside it. */
/* Orbit is deliberately SMALLER than spread. Pushing cluster
   centres far out (orbit 620) parked them past the viewport edge
   and left the middle empty; pulling them in while widening each
   cluster makes neighbours interpenetrate, so the graph reads as
   one continuous network filling the frame rather than a ring of
   separate islands. */
const ORBIT_BASE = 340;
const ORBIT_STEP = 150;
/** Wider than tall: matches the aspect ratio of a browser window. */
const ORBIT_Y_SQUASH = 0.55;
/* Tightened from 300/34. At the wider value clusters overlapped so
   heavily the ring-and-chord mesh dissolved into an even haze, and
   "ten technologies, five of them core" stopped being legible —
   which is the entire reason the graph is shaped this way. */
const SPREAD_BASE = 150;
const SPREAD_PER_WEIGHT = 22;

/* ---------- deterministic PRNG (mulberry32) ---------- */

function makeRandom(seed) {
  let a = seed >>> 0;
  return function random() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- construction ---------- */

/**
 * Build the full graph.
 * Returns flat typed arrays wherever the render loop will touch
 * the data — an array of {x,y,z} objects would allocate garbage
 * every frame and make the GC stutter the animation.
 */
export function buildGraph(seed = 20260730) {
  const random = makeRandom(seed);

  const clusters = [];
  const nodeHome = [];
  const nodeCluster = [];
  const nodeSize = [];
  const nodeTone = [];

  STACK.forEach((entry, index) => {
    const weight = TIER_WEIGHT[entry.tier] || 2;
    const nodesPerWeight = getNodesPerWeight();
    const count = weight * nodesPerWeight;

    const angle = index * GOLDEN_ANGLE;
    const orbit = ORBIT_BASE + (index % 3) * ORBIT_STEP;
    const center = {
      x: Math.cos(angle) * orbit,
      y: Math.sin(angle) * orbit * ORBIT_Y_SQUASH,
      z: (index / (STACK.length - 1)) * WORLD_DEPTH,
    };

    const spread = SPREAD_BASE + weight * SPREAD_PER_WEIGHT;
    const first = nodeHome.length / 3;

    for (let i = 0; i < count; i++) {
      // Rejection-free spherical scatter: unit vector × cube-rooted
      // radius keeps density even instead of clumping at the core.
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      const r = spread * Math.cbrt(random());

      nodeHome.push(
        center.x + Math.sin(phi) * Math.cos(theta) * r,
        center.y + Math.sin(phi) * Math.sin(theta) * r * 0.8,
        // Stretched on Z so clusters overlap in depth rather than
        // arriving as discrete slabs — that overlap is what sells
        // the depth-of-field as a continuous space.
        center.z + Math.cos(phi) * r * 2.2
      );
      nodeCluster.push(index);
      // Core-tier nodes render slightly larger and hotter.
      nodeSize.push(1.7 + weight * 0.26 + random() * 0.7);
      nodeTone.push(entry.tier === "core" ? 1 : entry.tier === "regular" ? 0.55 : 0.25);
    }

    clusters.push({ ...entry, index, center, count, first, weight });
  });

  const nodeCount = nodeHome.length / 3;
  const edges = buildEdges(clusters, random);

  return {
    clusters,
    nodeCount,
    // Home = the rest position each node springs back toward.
    home: new Float32Array(nodeHome),
    position: new Float32Array(nodeHome),
    velocity: new Float32Array(nodeCount * 3),
    size: new Float32Array(nodeSize),
    tone: new Float32Array(nodeTone),
    cluster: new Uint8Array(nodeCluster),
    edges,
  };
}

/**
 * Edges come in two kinds, and the distinction is the whole point
 * of the image: intra-cluster links are the internals of one
 * service, backbone links are the calls between services. Only
 * backbone edges carry request pulses.
 */
function buildEdges(clusters, random) {
  const pairs = [];
  const backbone = [];

  clusters.forEach((cluster) => {
    const { first, count } = cluster;
    for (let i = 0; i < count; i++) {
      const a = first + i;
      // Ring + chords: enough structure to read as a mesh, cheap
      // enough to rebuild every frame. Two chord lengths rather
      // than one — a single chord produced a visible regular
      // polygon, two interleaved ones read as an actual mesh.
      pairs.push(a, first + ((i + 1) % count));
      if (count > 5 && i % 2 === 0) {
        pairs.push(a, first + ((i + 3) % count));
      }
      if (count > 9 && i % 3 === 0) {
        pairs.push(a, first + ((i + 5) % count));
      }
    }
  });

  // Backbone: consecutive clusters always linked (the request path
  // through the stack), plus a few skip-links so the graph doesn't
  // read as a single chain.
  for (let i = 0; i < clusters.length - 1; i++) {
    const from = clusters[i];
    const to = clusters[i + 1];
    const lanes = 2 + (i % 2);
    for (let k = 0; k < lanes; k++) {
      const a = from.first + Math.floor(random() * from.count);
      const b = to.first + Math.floor(random() * to.count);
      pairs.push(a, b);
      backbone.push(pairs.length / 2 - 1);
    }
  }

  for (let i = 0; i < clusters.length - 2; i += 2) {
    const from = clusters[i];
    const to = clusters[i + 2];
    const a = from.first + Math.floor(random() * from.count);
    const b = to.first + Math.floor(random() * to.count);
    pairs.push(a, b);
    backbone.push(pairs.length / 2 - 1);
  }

  return {
    indices: new Uint16Array(pairs),
    count: pairs.length / 2,
    backbone: new Uint16Array(backbone),
  };
}

/* ---------- simulation ---------- */

const SPRING = 0.0016;
const DAMPING = 0.93;
const FLOW_STRENGTH = 0.85;
const POINTER_RADIUS = 620;
const POINTER_PULL = 165;

/**
 * Advance node positions one frame.
 *
 * `dt` is normalised to 60fps-equivalent steps and clamped, so a
 * backgrounded tab that resumes after 5 seconds does not detonate
 * the integrator with a single enormous step.
 */
const activeShockwaves = [];

export function triggerShockwave(x = 0, y = 0, z = 0, strength = 1.0) {
  if (activeShockwaves.length > 8) activeShockwaves.shift();
  activeShockwaves.push({
    x,
    y,
    z,
    radius: 20,
    maxRadius: 1300,
    strength,
    speed: 38,
  });
}

export function simulate(graph, { time, dt, pointer, energy = 0 }) {
  const { position, velocity, home, nodeCount } = graph;
  const step = Math.min(dt, 2.5);
  const flow = FLOW_STRENGTH * (1 + energy * 2.2);

  // Advance active shockwave radii
  for (let s = activeShockwaves.length - 1; s >= 0; s--) {
    const sw = activeShockwaves[s];
    sw.radius += sw.speed * step * 60;
    if (sw.radius > sw.maxRadius) {
      activeShockwaves.splice(s, 1);
    }
  }

  for (let i = 0; i < nodeCount; i++) {
    const p = i * 3;
    const x = position[p];
    const y = position[p + 1];
    const z = position[p + 2];

    // Cheap divergence-free-ish flow field. Real curl noise would
    // look marginally better and cost roughly ten times as much;
    // at this scale and blur level the difference is invisible.
    const ax = Math.sin(y * 0.0042 + time * 0.25) * Math.cos(z * 0.0031 - time * 0.18);
    const ay = Math.cos(x * 0.0040 - time * 0.21) * Math.sin(z * 0.0035 + time * 0.15);
    const az = Math.sin(x * 0.0029 + y * 0.0033 + time * 0.12);

    let vx = velocity[p] + ax * flow * step;
    let vy = velocity[p + 1] + ay * flow * step;
    let vz = velocity[p + 2] + az * flow * 0.45 * step;

    // Spring home — without this the flow field slowly evaporates
    // the whole graph off-screen.
    vx += (home[p] - x) * SPRING * step * 60;
    vy += (home[p + 1] - y) * SPRING * step * 60;
    vz += (home[p + 2] - z) * SPRING * step * 60;

    // Pointer gravity: nodes lean toward the cursor, and because
    // edges are rebuilt from node positions the links visibly bend
    // with them.
    if (pointer && pointer.active) {
      const dx = pointer.x - x;
      const dy = pointer.y - y;
      const dz = pointer.z - z;
      const distSq = dx * dx + dy * dy + dz * dz;
      const radiusSq = POINTER_RADIUS * POINTER_RADIUS;
      if (distSq < radiusSq && distSq > 1) {
        const falloff = 1 - distSq / radiusSq;
        const pull = (POINTER_PULL * falloff * falloff * step) / Math.sqrt(distSq);
        vx += dx * pull * 0.02;
        vy += dy * pull * 0.02;
        vz += dz * pull * 0.006;
      }

      // Liquid wave velocity transfer from fast cursor movement
      if (pointer.vx || pointer.vy) {
        if (distSq < 360000) {
          const liquidFalloff = (1 - distSq / 360000);
          vx += (pointer.vx || 0) * liquidFalloff * 0.035 * step;
          vy += (pointer.vy || 0) * liquidFalloff * 0.035 * step;
        }
      }
    }

    // Active Shockwaves ring impulse
    if (activeShockwaves.length > 0) {
      for (let s = 0; s < activeShockwaves.length; s++) {
        const sw = activeShockwaves[s];
        const dx = x - sw.x;
        const dy = y - sw.y;
        const dz = z - sw.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
        const diff = Math.abs(dist - sw.radius);
        const ringWidth = 240;
        if (diff < ringWidth) {
          const ringFalloff = (1 - diff / ringWidth) * (1 - sw.radius / sw.maxRadius) * sw.strength;
          const force = ringFalloff * 28.0 * step;
          vx += (dx / dist) * force;
          vy += (dy / dist) * force;
          vz += (dz / dist) * force * 0.5;
        }
      }
    }

    const damp = Math.pow(DAMPING, step);
    vx *= damp;
    vy *= damp;
    vz *= damp;

    velocity[p] = vx;
    velocity[p + 1] = vy;
    velocity[p + 2] = vz;

    position[p] = x + vx * step;
    position[p + 1] = y + vy * step;
    position[p + 2] = z + vz * step;
  }
}

/* ---------- request pulses ---------- */

export function createPulses(max = 90) {
  return {
    max,
    active: 0,
    edge: new Uint16Array(max),
    t: new Float32Array(max),
    speed: new Float32Array(max),
    tone: new Float32Array(max),
  };
}

/**
 * Spawn and advance pulses travelling along backbone edges.
 * Spawn rate rises with scroll energy, so flicking down the page
 * makes the system visibly busier — the network is "under load"
 * exactly when the visitor is moving through it.
 */
export function updatePulses(pulses, graph, { dt, energy, random = Math.random }) {
  const backbone = graph.edges.backbone;
  if (!backbone.length) return;

  let write = 0;
  for (let i = 0; i < pulses.active; i++) {
    const next = pulses.t[i] + pulses.speed[i] * dt;
    if (next >= 1) continue;
    pulses.edge[write] = pulses.edge[i];
    pulses.t[write] = next;
    pulses.speed[write] = pulses.speed[i];
    pulses.tone[write] = pulses.tone[i];
    write++;
  }
  pulses.active = write;

  const spawnChance = (0.22 + energy * 1.5) * dt;
  if (pulses.active < pulses.max && random() < spawnChance) {
    const i = pulses.active++;
    pulses.edge[i] = backbone[Math.floor(random() * backbone.length)];
    pulses.t[i] = 0;
    pulses.speed[i] = 0.006 + random() * 0.012;
    // Most requests succeed; a minority render in the warning tone.
    pulses.tone[i] = random() < 0.82 ? 1 : 0;
  }
}

/**
 * Highlighting function: pushes cluster nodes and spawns pulses
 * for specific technology stacks when hovered/clicked in DOM.
 */
export function triggerClusterHighlight(graph, pulses, stackTags) {
  if (!graph || !graph.clusters) return;
  const tags = Array.isArray(stackTags) ? stackTags : [stackTags];

  const matchingClusters = graph.clusters.filter((c) => {
    return tags.some((tag) => {
      const t = String(tag).toLowerCase().trim();
      return c.id.toLowerCase().includes(t) || t.includes(c.id.toLowerCase());
    });
  });

  if (!matchingClusters.length) return;

  const { velocity } = graph;

  matchingClusters.forEach((cluster) => {
    const { first, count } = cluster;
    for (let i = 0; i < count; i++) {
      const p = (first + i) * 3;
      velocity[p] += (Math.random() - 0.5) * 8.0;
      velocity[p + 1] += (Math.random() - 0.5) * 8.0;
      velocity[p + 2] += (Math.random() - 0.5) * 12.0;
    }
  });

  if (pulses && graph.edges && graph.edges.backbone) {
    const backbone = graph.edges.backbone;
    const indices = graph.edges.indices;
    matchingClusters.forEach((cluster) => {
      const { first, count } = cluster;
      const last = first + count;
      for (let b = 0; b < backbone.length; b++) {
        const edgeIdx = backbone[b];
        const a = indices[edgeIdx * 2];
        const bNode = indices[edgeIdx * 2 + 1];
        if ((a >= first && a < last) || (bNode >= first && bNode < last)) {
          if (pulses.active < pulses.max) {
            const pi = pulses.active++;
            pulses.edge[pi] = edgeIdx;
            pulses.t[pi] = 0;
            pulses.speed[pi] = 0.015 + Math.random() * 0.015;
            pulses.tone[pi] = 1;
          }
        }
      }
    });
  }
}
