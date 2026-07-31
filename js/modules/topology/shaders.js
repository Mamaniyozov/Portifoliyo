/* ============================================================
   Topology shaders + camera constants
   Split out of system-topology.js purely for file size; the two
   are a single unit conceptually. The camera constants live here
   rather than in the renderer because they are baked into the
   GLSL at template-expansion time — keeping them next to the code
   that interpolates them is what stops the shader maths and the
   JS-side projection (used for cursor proximity) from drifting
   apart silently.
   ============================================================ */

/* ---------- camera (world units) ---------- */

export const FOCAL = 1000;
export const FOCUS_DIST = 1250;
/** Wide enough that three or four clusters share the frame — one
    sharp, the rest blooming out. A narrow range made the graph read
    as a single lonely blob with darkness either side. */
export const FOCUS_RANGE = 1150;

/* ---------- shared GLSL ---------- */

const PROJECT_GLSL = /* glsl */ `
  uniform vec2  uResolution;
  uniform float uCameraZ;
  uniform float uDpr;
  uniform vec2  uCameraSway;
  uniform float uScrollVelocity;

  // Senior WebGL perspective divide with Z-warp tunnel and 3D camera sway
  vec4 project(vec3 world, out float depth, out float persp, out float blur) {
    vec3 warpedWorld = world;
    // Spatial hyper-warp along Z depth on fast scroll
    warpedWorld.z += (world.z - uCameraZ) * uScrollVelocity * 0.22;
    // Dynamic 3D camera sway & pitch
    warpedWorld.xy += uCameraSway * (1.0 - clamp(abs(world.z - uCameraZ) / 3800.0, 0.0, 0.75));

    depth = max(warpedWorld.z - uCameraZ, 40.0);
    persp = ${FOCAL}.0 / depth;
    blur  = clamp(abs(depth - ${FOCUS_DIST}.0) / ${FOCUS_RANGE}.0, 0.0, 1.0);
    vec2 screen = warpedWorld.xy * persp;
    return vec4(screen / (uResolution * 0.5), 0.0, 1.0);
  }

  // Fade in as geometry clears the near plane, out as it recedes.
  float depthFade(float depth, float blur) {
    float near = smoothstep(70.0, 430.0, depth);
    float far  = 1.0 - smoothstep(
      ${FOCUS_DIST}.0 + ${FOCUS_RANGE}.0 * 1.7,
      ${FOCUS_DIST}.0 + ${FOCUS_RANGE}.0 * 3.2,
      depth
    );
    return near * far;
  }
`;

export const NODE_VS = /* glsl */ `#version 300 es
  in vec3  aPosition;
  in float aSize;
  in float aTone;
  ${PROJECT_GLSL}
  out float vBlur;
  out float vTone;
  out float vAlpha;

  void main() {
    float depth, persp, blur;
    gl_Position = project(aPosition, depth, persp, blur);

    vBlur  = blur;
    vTone  = aTone;
    // Defocused nodes swell and dim — cheap, convincing bokeh.
    vAlpha = depthFade(depth, blur) / (1.0 + blur * 2.0);
    // Clamped: a node passing very close to the near plane would
    // otherwise request a point size the driver silently rejects.
    gl_PointSize = clamp(aSize * persp * uDpr * (1.0 + blur * 5.0) * 4.2, 1.0, 190.0);
  }
`;

export const NODE_FS = /* glsl */ `#version 300 es
  precision highp float;
  in float vBlur;
  in float vTone;
  in float vAlpha;
  uniform vec3  uCore;
  uniform vec3  uWarm;
  uniform float uIntensity;
  uniform float uTime;
  out vec4 fragColor;

  void main() {
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float r = dot(uv, uv);
    if (r > 1.0) discard;

    // Liquid chromatic shift
    float shift = sin(uv.x * 4.0 + uTime * 3.5) * 0.07;
    float falloffR = pow(clamp(1.0 - (r + shift), 0.0, 1.0), mix(3.2, 1.05, vBlur));
    float falloffG = pow(clamp(1.0 - r, 0.0, 1.0), mix(3.2, 1.05, vBlur));
    float falloffB = pow(clamp(1.0 - (r - shift), 0.0, 1.0), mix(3.2, 1.05, vBlur));

    vec3 color = mix(uWarm, uCore, vTone);
    vec3 chromColor = vec3(color.r * falloffR * 1.12, color.g * falloffG, color.b * falloffB * 1.12);

    fragColor = vec4(chromColor, falloffG * vAlpha * uIntensity);
  }
`;

export const EDGE_VS = /* glsl */ `#version 300 es
  in vec3 aPosition;
  ${PROJECT_GLSL}
  out float vAlpha;

  void main() {
    float depth, persp, blur;
    gl_Position = project(aPosition, depth, persp, blur);
    vAlpha = depthFade(depth, blur) * (1.0 - blur * 0.72);
  }
`;

export const EDGE_FS = /* glsl */ `#version 300 es
  precision highp float;
  in float vAlpha;
  uniform vec3  uColor;
  uniform float uOpacity;
  uniform float uIntensity;
  out vec4 fragColor;

  void main() {
    fragColor = vec4(uColor * vAlpha, vAlpha * uOpacity * uIntensity);
  }
`;

export const PULSE_VS = /* glsl */ `#version 300 es
  in vec3  aPosition;
  in float aTone;
  ${PROJECT_GLSL}
  out float vTone;
  out float vAlpha;

  void main() {
    float depth, persp, blur;
    gl_Position = project(aPosition, depth, persp, blur);
    vTone = aTone;
    vAlpha = depthFade(depth, blur) / (1.0 + blur * 2.0);
    gl_PointSize = clamp(persp * uDpr * (5.5 + blur * 16.0), 1.0, 160.0);
  }
`;

export const PULSE_FS = /* glsl */ `#version 300 es
  precision highp float;
  in float vTone;
  in float vAlpha;
  uniform vec3  uOk;
  uniform vec3  uWarn;
  uniform float uIntensity;
  uniform float uTime;
  out vec4 fragColor;

  void main() {
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float r = dot(uv, uv);
    if (r > 1.0) discard;

    float shift = sin(uv.y * 5.0 + uTime * 4.2) * 0.08;
    float falloffR = pow(clamp(1.0 - (r + shift), 0.0, 1.0), 2.2);
    float falloffG = pow(clamp(1.0 - r, 0.0, 1.0), 2.2);
    float falloffB = pow(clamp(1.0 - (r - shift), 0.0, 1.0), 2.2);

    vec3 color = mix(uWarn, uOk, vTone);
    vec3 chromColor = vec3(color.r * falloffR * 1.15, color.g * falloffG, color.b * falloffB * 1.15);

    fragColor = vec4(chromColor, falloffG * vAlpha * mix(0.55, 1.0, uIntensity));
  }
`;
