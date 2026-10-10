"use client";

/* ————————————————————————————————————————————————
   softSounds — two tiny gestures of sound for the
   birthday ritual: a breath of air for the candles,
   and a small bell when the wish is sent.
   Very quiet. Never plays if she has muted our song.
———————————————————————————————————————————————— */

import { useMusic } from "@/lib/musicBox";

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!ctx) {
      const AC =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
    }
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

/** a soft breath of air — for blowing out the candles */
export function playCandleWhoosh() {
  if (useMusic.getState().isMuted) return;
  const ac = getCtx();
  if (!ac) return;
  try {
    const dur = 0.7;

    // filtered noise = a gentle breath
    const noiseBuffer = ac.createBuffer(1, Math.ceil(ac.sampleRate * dur), ac.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) {
      // fade in and out, like a real puff of air
      const t = i / data.length;
      const envelope = Math.sin(Math.PI * t) ** 2;
      data[i] = (Math.random() * 2 - 1) * envelope;
    }

    const noise = ac.createBufferSource();
    noise.buffer = noiseBuffer;

    // low-pass sweep — starts airy, settles to quiet
    const filter = ac.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1400, ac.currentTime);
    filter.frequency.exponentialRampToValueAtTime(320, ac.currentTime + dur);
    filter.Q.value = 0.7;

    const gain = ac.createGain();
    gain.gain.setValueAtTime(0.0001, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.11, ac.currentTime + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);

    noise.connect(filter).connect(gain).connect(ac.destination);
    noise.start();
    noise.stop(ac.currentTime + dur + 0.05);
  } catch {
    /* sound is a garnish — never break the ritual over it */
  }
}

/** a single small bell — for "wish officially sent" */
export function playWishChime() {
  if (useMusic.getState().isMuted) return;
  const ac = getCtx();
  if (!ac) return;
  try {
    // a soft F-major bloom: F5, A5, C6 — like a music box agreeing
    const notes: [number, number][] = [
      [698.46, 0.0],   // F5
      [880.0, 0.07],   // A5
      [1046.5, 0.14],  // C6
    ];
    for (const [freq, offset] of notes) {
      const start = ac.currentTime + offset;
      const end = start + 1.6;

      const osc = ac.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;

      // one quiet harmonic for a music-box shimmer
      const shimmer = ac.createOscillator();
      shimmer.type = "sine";
      shimmer.frequency.value = freq * 3;
      const shimmerGain = ac.createGain();
      shimmerGain.gain.setValueAtTime(0.0001, start);
      shimmerGain.gain.exponentialRampToValueAtTime(0.012, start + 0.02);
      shimmerGain.gain.exponentialRampToValueAtTime(0.0001, start + 0.5);

      const gain = ac.createGain();
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.055, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);

      osc.connect(gain).connect(ac.destination);
      shimmer.connect(shimmerGain).connect(ac.destination);
      osc.start(start);
      osc.stop(end);
      shimmer.start(start);
      shimmer.stop(start + 0.6);
    }
  } catch {
    /* again — garnish, never the meal */
  }
}
