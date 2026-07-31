/* ============================================================
   Cybernetic Audio Synthesizer (Web Audio API)
   Generates real-time procedural sound effects for UI interactions:
   hovers, clicks, filter switches, and WebGL shockwaves.
   0kb external audio assets, pure browser synthesis.
   ============================================================ */

let audioCtx = null;
let isMuted = true;
let activePreset = localStorage.getItem("sound_preset") || "cyber"; // cyber, retro, soft

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) audioCtx = new AudioContext();
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function setSoundPreset(preset) {
  if (["cyber", "retro", "soft"].includes(preset)) {
    activePreset = preset;
    localStorage.setItem("sound_preset", preset);
    if (!isMuted) playPulseSound();
    return activePreset;
  }
  return activePreset;
}

export function getSoundPreset() {
  return activePreset;
}

export function playHoverSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = activePreset === "retro" ? "square" : activePreset === "soft" ? "sine" : "sine";
    const baseFreq = activePreset === "soft" ? 440 : 880;
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.6, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(activePreset === "soft" ? 0.01 : 0.015, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch (e) {}
}

export function playClickSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = activePreset === "retro" ? "square" : activePreset === "soft" ? "sine" : "triangle";
    const baseFreq = activePreset === "soft" ? 220 : 320;
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.035, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  } catch (e) {}
}

export function playPulseSound() {
  if (isMuted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = activePreset === "retro" ? "square" : "sine";
    const baseFreq = activePreset === "soft" ? 350 : 520;
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 2.3, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.12);
  } catch (e) {}
}

export function toggleAudio(forceState) {
  if (typeof forceState === "boolean") {
    isMuted = !forceState;
  } else {
    isMuted = !isMuted;
  }
  localStorage.setItem("audio_enabled", String(!isMuted));
  if (!isMuted) {
    getAudioContext();
    playPulseSound();
  }
  return !isMuted;
}

export function isAudioEnabled() {
  return !isMuted;
}

export function initAudioState() {
  const saved = localStorage.getItem("audio_enabled");
  if (saved === "true") {
    isMuted = false;
  } else {
    isMuted = true;
  }
  return !isMuted;
}
