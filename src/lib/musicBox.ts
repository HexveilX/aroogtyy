"use client";

/* ————————————————————————————————————————————————
   A tiny music box, built with Web Audio.
   Two sides to the tape: side A plays a soft original
   waltz arrangement of "our song"; side B hums a small
   original lullaby that lives only in here. Never
   autoplays — it always waits for her press.
———————————————————————————————————————————————— */

import { create } from "zustand";
import { lsGet, lsSet } from "@/lib/localStorage";
import {
  pauseRealAudio,
  registerMusicBoxPauser,
  setRealAudioMuted,
} from "@/lib/realAudio";

export type MusicSide = "a" | "b";

type Arrangement = { events: Ev[]; loopDuration: number };

/* ————— side A — the waltz ————— */

const BPM_A = 84;
const BEAT_A = 60 / BPM_A;
const BAR_A = BEAT_A * 3; // gentle 3/4 waltz

type Ev = { t: number; midi: number; vel: number; dur: number };

const N = {
  Bb2: 46, C3: 48, D3: 50, F3: 53, G3: 55, A3: 57, Bb3: 58,
  C4: 60, D4: 62, E4: 64, F4: 65, G4: 67, A4: 69, Bb4: 70,
  C5: 72, D5: 74, E5: 76, F5: 77,
} as const;

/** melody: [bar, beat(0-based), note, length-in-beats] */
const MELODY_A: [number, number, number, number][] = [
  [0, 0, N.C5, 2], [0, 2, N.A4, 1],
  [1, 0, N.Bb4, 2], [1, 2, N.G4, 1],
  [2, 0, N.A4, 1], [2, 1, N.G4, 1], [2, 2, N.F4, 1],
  [3, 0, N.G4, 3],
  [4, 0, N.F5, 2], [4, 2, N.D5, 1],
  [5, 0, N.C5, 2], [5, 2, N.A4, 1],
  [6, 0, N.Bb4, 1], [6, 1, N.A4, 1], [6, 2, N.G4, 1],
  [7, 0, N.F4, 3],
  [8, 0, N.C5, 1], [8, 1, N.D5, 1], [8, 2, N.C5, 1],
  [9, 0, N.A4, 2], [9, 2, N.F4, 1],
  [10, 0, N.G4, 1], [10, 1, N.A4, 1], [10, 2, N.Bb4, 1],
  [11, 0, N.C5, 3],
  [12, 0, N.D5, 1], [12, 1, N.C5, 1], [12, 2, N.Bb4, 1],
  [13, 0, N.A4, 2], [13, 2, N.G4, 1],
  [14, 0, N.F4, 1], [14, 1, N.G4, 1], [14, 2, N.A4, 1],
  [15, 0, N.F4, 3],
];

/** chords per bar: [root, fifth] */
const CHORDS_A: [number, number][] = [
  [N.F3, N.C4], [N.F3, N.C4], [N.Bb2, N.F3], [N.C3, N.G3],
  [N.F3, N.C4], [N.D3, N.A3], [N.C3, N.G3], [N.F3, N.C4],
  [N.F3, N.C4], [N.D3, N.A3], [N.Bb2, N.F3], [N.C3, N.G3],
  [N.Bb2, N.F3], [N.C3, N.G3], [N.C3, N.G3], [N.F3, N.C4],
];

function buildSideA(): Arrangement {
  const events: Ev[] = [];
  for (const [bar, beat, midi, len] of MELODY_A) {
    events.push({ t: (bar * 3 + beat) * BEAT_A, midi, vel: 0.3, dur: len * BEAT_A });
  }
  CHORDS_A.forEach(([root, fifth], bar) => {
    events.push({ t: bar * BAR_A, midi: root, vel: 0.1, dur: BEAT_A });
    events.push({ t: bar * BAR_A + BEAT_A, midi: fifth, vel: 0.085, dur: BEAT_A });
    events.push({ t: bar * BAR_A + BEAT_A * 2, midi: root + 12, vel: 0.07, dur: BEAT_A });
  });
  events.sort((a, b) => a.t - b.t);
  return { events, loopDuration: 16 * BAR_A };
}

/* ————— side B — the quiet hours, a small lullaby in 4 ————— */

const BPM_B = 72;
const BEAT_B = 60 / BPM_B;
const BAR_B = BEAT_B * 4; // slow 4/4, counting-sheep tempo

/** melody: [bar, beat(0-based), note, length-in-beats] */
const MELODY_B: [number, number, number, number][] = [
  [0, 0, N.A4, 2], [0, 2, N.G4, 1], [0, 3, N.F4, 1],
  [1, 0, N.G4, 2], [1, 2, N.A4, 2],
  [2, 0, N.C5, 2], [2, 2, N.A4, 1], [2, 3, N.G4, 1],
  [3, 0, N.F4, 4],
  [4, 0, N.D5, 2], [4, 2, N.C5, 2],
  [5, 0, N.A4, 2], [5, 2, N.C5, 2],
  [6, 0, N.Bb4, 2], [6, 2, N.A4, 1], [6, 3, N.G4, 1],
  [7, 0, N.F4, 4],
  [8, 0, N.A4, 2], [8, 2, N.G4, 1], [8, 3, N.F4, 1],
  [9, 0, N.G4, 2], [9, 2, N.A4, 2],
  [10, 0, N.C5, 2], [10, 2, N.D5, 1], [10, 3, N.C5, 1],
  [11, 0, N.A4, 4],
  [12, 0, N.G4, 1], [12, 1, N.A4, 1], [12, 2, N.Bb4, 2],
  [13, 0, N.C5, 2], [13, 2, N.A4, 2],
  [14, 0, N.G4, 2], [14, 2, N.F4, 2],
  [15, 0, N.F4, 4],
];

/** chords per bar: [root, fifth] — sparser than side A, a lullaby breathes */
const CHORDS_B: [number, number][] = [
  [N.F3, N.C4], [N.Bb2, N.F3], [N.C3, N.G3], [N.F3, N.C4],
  [N.D3, N.A3], [N.F3, N.C4], [N.Bb2, N.F3], [N.F3, N.C4],
  [N.F3, N.C4], [N.Bb2, N.F3], [N.C3, N.G3], [N.F3, N.C4],
  [N.Bb2, N.F3], [N.F3, N.C4], [N.C3, N.G3], [N.F3, N.C4],
];

function buildSideB(): Arrangement {
  const events: Ev[] = [];
  for (const [bar, beat, midi, len] of MELODY_B) {
    events.push({ t: (bar * 4 + beat) * BEAT_B, midi, vel: 0.24, dur: len * BEAT_B });
  }
  CHORDS_B.forEach(([root, fifth], bar) => {
    events.push({ t: bar * BAR_B, midi: root, vel: 0.085, dur: BEAT_B });
    events.push({ t: bar * BAR_B + BEAT_B * 2, midi: fifth, vel: 0.06, dur: BEAT_B });
  });
  events.sort((a, b) => a.t - b.t);
  return { events, loopDuration: 16 * BAR_B };
}

const SIDE_A = buildSideA();
const SIDE_B = buildSideB();
export const MUSIC_LOOP_SECONDS = SIDE_A.loopDuration;
export const MUSIC_LOOP_SECONDS_B = SIDE_B.loopDuration;

class MusicBoxEngine {
  private ctx: AudioContext | null = null;
  private bus: GainNode | null = null;
  private master: GainNode | null = null;
  private timer: ReturnType<typeof setInterval> | null = null;
  private events: Ev[] = SIDE_A.events;
  private loopDuration = SIDE_A.loopDuration;
  private playStart = 0;
  private offset = 0;
  private idx = 0;
  private loops = 0;
  playing = false;
  muted = false;
  side: MusicSide = "a";

  private ensureCtx() {
    if (this.ctx) return;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const bus = ctx.createGain();
    bus.gain.value = 1;

    const master = ctx.createGain();
    master.gain.value = this.muted ? 0 : 0.5;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 5200;

    // soft echo, like a music box in a quiet room
    const delay = ctx.createDelay(1);
    delay.delayTime.value = 0.31;
    const feedback = ctx.createGain();
    feedback.gain.value = 0.22;
    const wet = ctx.createGain();
    wet.gain.value = 0.14;

    bus.connect(master);
    master.connect(lowpass);
    lowpass.connect(ctx.destination);
    bus.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(lowpass);

    this.ctx = ctx;
    this.bus = bus;
    this.master = master;
  }

  get loopSeconds() {
    return this.loopDuration;
  }

  get currentSide(): MusicSide {
    return this.side;
  }

  /* flip the tape — swaps the arrangement; if the box was
     singing, it keeps singing from the top of the new side */
  setSide(side: MusicSide) {
    if (side === this.side) return;
    this.side = side;
    const next = side === "a" ? SIDE_A : SIDE_B;
    this.events = next.events;
    this.loopDuration = next.loopDuration;
    this.offset = 0;
    this.idx = 0;
    this.loops = 0;
    if (this.playing && this.ctx) {
      /* restart the scheduler on the new side without a gap */
      this.playStart = this.ctx.currentTime + 0.06;
      this.tick();
    }
  }

  get progress() {
    if (!this.ctx || !this.playing) return this.offset / this.loopDuration;
    const v =
      (this.offset + (this.ctx.currentTime - this.playStart)) %
      this.loopDuration;
    return v / this.loopDuration;
  }

  get elapsedSeconds() {
    if (!this.ctx || !this.playing) return this.offset;
    return (
      this.offset + (this.ctx.currentTime - this.playStart)
    ) % this.loopDuration;
  }

  private scheduleNote(when: number, midi: number, vel: number, dur: number) {
    if (!this.ctx || !this.bus) return;
    const ctx = this.ctx;
    const f = 440 * Math.pow(2, (midi - 69) / 12);
    const g = ctx.createGain();
    const decay = Math.min(2.2, Math.max(0.9, dur * 2.1));
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(vel, when + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, when + decay);
    g.connect(this.bus);
    // music-box partials
    const partials: [number, number][] = [
      [1, 1],
      [4, 0.16],
      [6.7, 0.05],
    ];
    for (const [mult, amp] of partials) {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = f * mult;
      const og = ctx.createGain();
      og.gain.value = amp;
      o.connect(og);
      og.connect(g);
      o.start(when);
      o.stop(when + decay + 0.35);
    }
  }

  private tick = () => {
    if (!this.ctx || !this.playing || this.events.length === 0) return;
    const lookahead = 1.7;
    const virtualNow = this.offset + (this.ctx.currentTime - this.playStart);
    while (true) {
      const ev = this.events[this.idx];
      const evT = ev.t + this.loops * this.loopDuration;
      if (evT > virtualNow + lookahead) break;
      const when = this.playStart + (evT - this.offset);
      if (when > this.ctx.currentTime - 0.08) {
        this.scheduleNote(
          Math.max(when, this.ctx.currentTime + 0.01),
          ev.midi,
          ev.vel,
          ev.dur
        );
      }
      this.idx += 1;
      if (this.idx >= this.events.length) {
        this.idx = 0;
        this.loops += 1;
      }
    }
  };

  play() {
    this.ensureCtx();
    if (!this.ctx || this.playing || this.events.length === 0) return;
    if (this.ctx.state === "suspended") void this.ctx.resume();
    this.playStart = this.ctx.currentTime + 0.08;
    this.loops = 0;
    const startIdx = this.events.findIndex((e) => e.t >= this.offset);
    if (startIdx === -1) {
      this.idx = 0;
      this.loops = 1;
    } else {
      this.idx = startIdx;
    }
    this.playing = true;
    this.tick();
    this.timer = setInterval(this.tick, 400);
  }

  pause() {
    if (!this.ctx || !this.playing) return;
    this.offset =
      (this.offset + (this.ctx.currentTime - this.playStart)) %
      this.loopDuration;
    this.playing = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    void this.ctx.suspend();
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (this.master && this.ctx) {
      this.master.gain.setTargetAtTime(
        muted ? 0 : 0.5,
        this.ctx.currentTime,
        0.06
      );
    }
  }
}

const engine = new MusicBoxEngine();

interface MusicState {
  isPlaying: boolean;
  isMuted: boolean;
  side: MusicSide;
  toggle: () => void;
  setMuted: (m: boolean) => void;
  setSide: (s: MusicSide) => void;
}

export const useMusic = create<MusicState>((set, get) => ({
  isPlaying: false,
  isMuted: false,
  side: "a",
  toggle: () => {
    if (engine.playing) {
      engine.pause();
      set({ isPlaying: false });
    } else {
      /* the little box yields the room to a real recording —
         only one of them may sing at a time */
      pauseRealAudio();
      engine.setMuted(get().isMuted);
      engine.play();
      set({ isPlaying: true });
    }
  },
  setMuted: (m: boolean) => {
    engine.setMuted(m);
    /* one hush for the whole music room — the recordings
       quiet down with the music box */
    setRealAudioMuted(m);
    set({ isMuted: m });
    lsSet("audioMuted", m);
  },
  setSide: (s) => {
    engine.setSide(s);
    set({ side: s });
    lsSet("musicSide", s);
  },
}));

/* when a real recording starts, it calls this so the little
   box steps aside mid-waltz — state stays honest either way */
registerMusicBoxPauser(() => {
  if (engine.playing) {
    engine.pause();
    useMusic.setState({ isPlaying: false });
  }
});

export function getMusicEngineProgress() {
  return engine.progress;
}

export function getMusicEngineElapsed() {
  return engine.elapsedSeconds;
}

export function getMusicEngineLoop() {
  return engine.loopSeconds;
}

/** restore the muted + last-side preferences (call once on the client) */
export function initMusicPreferences() {
  const muted = lsGet<boolean>("audioMuted", false);
  engine.muted = muted;
  const side = lsGet<MusicSide>("musicSide", "a");
  engine.setSide(side === "b" ? "b" : "a");
  useMusic.setState({ isMuted: muted, side: engine.currentSide });
  /* the recordings start the session already hushed if she
     left the room muted last time */
  setRealAudioMuted(muted);
}
