/* ============================================================
   WebGL2 micro-helpers
   Just enough surface to compile programs and push buffers.
   Deliberately not a framework: the topology scene draws points
   and lines only, so a full 3D library would ship hundreds of
   kilobytes to use a fraction of it — and this project promises
   "no build step" in package.json.

   Every function returns null rather than throwing. A background
   effect must never be able to take the page down with it, so
   callers treat a null as "render nothing" and the CSS backdrop
   stays exactly as it was.
   ============================================================ */

/**
 * Acquire a WebGL2 context tuned for an additive, non-interactive
 * background layer.
 *
 * `alpha: true` + `premultipliedAlpha: false` lets the canvas
 * composite over the CSS background instead of replacing it, so
 * the existing --bg colour still shows through the dark regions.
 */
export function createContext(canvas) {
  if (!canvas) return null;

  const attributes = {
    alpha: true,
    premultipliedAlpha: false,
    antialias: true,
    depth: false,
    stencil: false,
    // The scene is redrawn every frame; preserving the previous
    // one only costs bandwidth.
    preserveDrawingBuffer: false,
    // Integrated GPUs render this fine and it keeps laptops cool.
    powerPreference: "low-power",
    failIfMajorPerformanceCaveat: false,
  };

  try {
    return canvas.getContext("webgl2", attributes);
  } catch {
    return null;
  }
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // Surfaced only in dev consoles; never thrown at the visitor.
    console.warn("[topology] shader compile failed:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

/**
 * Compile + link a program, then discard the shader objects (the
 * linked program keeps its own copy of the compiled code).
 * Returns { program, uniforms, attributes } with locations already
 * resolved, so the render loop never calls getUniformLocation —
 * that is a synchronous driver query and has no business running
 * at 60fps.
 */
export function createProgram(gl, vertexSource, fragmentSource, names = {}) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn("[topology] program link failed:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  const uniforms = {};
  (names.uniforms || []).forEach((name) => {
    uniforms[name] = gl.getUniformLocation(program, name);
  });

  const attributes = {};
  (names.attributes || []).forEach((name) => {
    attributes[name] = gl.getAttribLocation(program, name);
  });

  return { program, uniforms, attributes };
}

/**
 * Create a DYNAMIC_DRAW buffer sized for `capacity` floats.
 * Allocating once up front and refilling with bufferSubData each
 * frame avoids reallocating GPU memory 60 times a second.
 */
export function createDynamicBuffer(gl, capacity) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, capacity * 4, gl.DYNAMIC_DRAW);
  return buffer;
}

/** Upload `count` floats from `data` into an existing buffer. */
export function uploadBuffer(gl, buffer, data, count) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferSubData(gl.ARRAY_BUFFER, 0, data, 0, count);
}

/**
 * Bind a float attribute. `stride` and `offset` are in floats, not
 * bytes — the ×4 conversion lives here so call sites read in the
 * same units the shader declares.
 */
export function bindAttribute(gl, location, buffer, size, stride = 0, offset = 0) {
  if (location === undefined || location < 0) return;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, size, gl.FLOAT, false, stride * 4, offset * 4);
}

/**
 * Resize the drawing buffer to match CSS size × DPR.
 * Returns true when the size actually changed, so callers can skip
 * redundant gl.viewport calls.
 *
 * DPR is capped at 2: beyond that the extra fragments are invisible
 * on a blurred, additive background but the fill cost is real.
 */
export function resizeToDisplay(gl, canvas, maxDpr = 2) {
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  const width = Math.round(canvas.clientWidth * dpr);
  const height = Math.round(canvas.clientHeight * dpr);

  if (width === 0 || height === 0) return false;
  if (canvas.width === width && canvas.height === height) return false;

  canvas.width = width;
  canvas.height = height;
  gl.viewport(0, 0, width, height);
  return true;
}
