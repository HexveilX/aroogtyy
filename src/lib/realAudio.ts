"use client";

/* ————————————————————————————————————————————————
   realAudio — the real recordings of this place.

   There are exactly four: the site song (مكانك), the
   two sides of the personal tape (Ziad + Arooga,
   twice over), and the little birthday song — a
   private gift that lives only inside the birthday
   room and always goes back to its drawer when she
   leaves. Each gets ONE HTMLAudioElement for the
   whole lifetime of the page — created lazily, never
   duplicated, never destroyed.

   Only one thing may sing at a time: starting any
   recording pauses the other three and the music box;
   the music box returns the courtesy.

   No autoplay, ever. Everything waits for her press.
———————————————————————————————————————————————— */

import { useCallback, useEffect, useState } from "react";

export type RealPlayerId = "makanak" | "oursong" | "oursongb" | "birthday";

export type RealAudioStatus = "idle" | "loading" | "ready" | "error";

/* ————— the singletons ————— */

const elements = new Map<RealPlayerId, HTMLAudioElement>();

function safeNumber(v: number) {
  return Number.isFinite(v) && v > 0 ? v : 0;
}

export function getRealAudioElement(id: RealPlayerId, src: string) {
  if (typeof window === "undefined" || !src) return null;
  let el = elements.get(id);
  if (!el) {
    el = new Audio();
    el.preload = "metadata";
    el.src = src;
    el.muted = realMuted;
    elements.set(id, el);
  }
  return el;
}

/* ————— shared mute (one hush for the whole room) ————— */

let realMuted = false;

export function setRealAudioMuted(muted: boolean) {
  realMuted = muted;
  elements.forEach((el) => {
    el.muted = muted;
  });
}

/** is the whole place hushed right now? (the site song never
     lifts its voice into a room she asked to keep quiet) */
export function isRealAudioMuted() {
  return realMuted;
}

/** keep a volume inside the honest 0–1 range */
function safeVolume(v: number) {
  if (!Number.isFinite(v)) return 1;
  return Math.min(1, Math.max(0, v));
}

/* ————— the site song, rising with the open letter ————— */

/**
 * Called the instant the gate accepts her word — the one
 * moment the browser still remembers her touch, so the song
 * of this little universe may rise while the envelope opens.
 *
 * If the browser refuses, it refuses quietly: nothing breaks,
 * no error is shown, and the little scrap that follows her
 * through the rooms simply keeps its play button breathing
 * until she taps it herself.
 *
 * Never called before the password is accepted. Never forces
 * anything — one attempt, one gentle fallback.
 */
export function startSiteSong(src: string) {
  /* she hushed this place on an earlier visit — the song
     waits for her to lift the hush herself */
  if (realMuted) return;
  const el = getRealAudioElement("makanak", src);
  if (!el) return;
  claimRealAudio("makanak");
  el.muted = realMuted;
  el.play().catch(() => {
    /* autoplay refused — not an error, just a door held
       shut; the global control will invite her instead */
  });
}

/* ————— one voice at a time ————— */

/* the music box registers its pause here (musicBox imports
   this module — never the other way around) */
let pauseMusicBoxFn: (() => void) | null = null;

export function registerMusicBoxPauser(fn: () => void) {
  pauseMusicBoxFn = fn;
}

/** pause every real recording (optionally sparing one) */
export function pauseRealAudio(except?: RealPlayerId) {
  elements.forEach((el, id) => {
    if (id !== except && !el.paused) el.pause();
  });
}

/** a recording is about to start — silence everything else */
function claimRealAudio(id: RealPlayerId) {
  pauseRealAudio(id);
  pauseMusicBoxFn?.();
}

/* ————— the wish's cue ————— */

/**
 * Starts one of the real recordings from OUTSIDE its player —
 * the birthday song's cue, the moment the candles give in.
 * Semantics mirror the player's own play(): a song already
 * singing is left alone (never restarted mid-breath); a
 * finished song is rewound to its beginning; the claim on the
 * room (everything else falls quiet) is honored the same way.
 *
 * The promise tells the caller whether sound actually began,
 * so a browser that refuses the late autoplay can be met with
 * a gentle fallback instead of a silent failure. Never throws.
 */
export async function tryStartRealAudio(
  id: RealPlayerId,
  src: string,
): Promise<boolean> {
  if (!src) return false;
  const el = getRealAudioElement(id, src);
  if (!el) return false;
  /* already singing — this cue would only interrupt it */
  if (!el.paused && !el.ended) return true;
  if (el.error) el.load(); /* one quiet retry after a failure */
  claimRealAudio(id);
  const d = safeNumber(el.duration);
  /* replay after the song has finished — never auto-loop */
  if (el.ended || (d > 0 && el.currentTime >= d - 0.05)) {
    try {
      el.currentTime = 0;
    } catch {
      /* not seekable yet — plays from wherever it rests */
    }
  }
  el.muted = realMuted;
  try {
    await el.play();
    return true;
  } catch {
    /* the browser held the door shut — her tap will open it */
    return false;
  }
}

/* ————— time that never lies ————— */

export function formatClock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/* ————— the player hook ————— */

export interface RealAudioPlayer {
  status: RealAudioStatus;
  playing: boolean;
  ended: boolean;
  current: number;
  duration: number;
  /** how loudly this recording sings, 0–1 (kept per song) */
  volume: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (t: number) => void;
  setVolume: (v: number) => void;
}

type RealAudioState = {
  status: RealAudioStatus;
  playing: boolean;
  ended: boolean;
  current: number;
  duration: number;
  volume: number;
};

const IDLE: RealAudioState = {
  status: "idle",
  playing: false,
  ended: false,
  current: 0,
  duration: 0,
  volume: 1,
};

/* read everything the element currently knows about itself —
   never a NaN, never an Infinity, never a guess */
function snapshot(el: HTMLAudioElement): RealAudioState {
  return {
    status: el.error
      ? "error"
      : /* metadata already in hand — the number is real */
        Number.isFinite(el.duration) && el.duration > 0
        ? "ready"
        : /* started buffering but not finished — loading, not broken */
          "loading",
    playing: !el.paused && !el.ended,
    ended: el.ended,
    current: safeNumber(el.currentTime),
    duration: safeNumber(el.duration),
    volume: safeVolume(el.volume),
  };
}

/**
 * Drives one of the real recordings. `src` empty → the
 * hook stays inert (controls become no-ops) so callers can
 * fall back to other behavior without branching their JSX.
 *
 * `opts.stopOnLeave` — for songs that BELONG to one room
 * (the birthday song): leaving the room stops the song
 * and puts it away at 0:00, instead of resting in place
 * the way the site song and the tape do. Default false —
 * every existing player keeps its exact behavior.
 */
export function useRealAudioPlayer(
  id: RealPlayerId,
  src: string,
  opts?: { stopOnLeave?: boolean },
): RealAudioPlayer {
  /* the element may persist across visits — wake up already
     knowing where the song was left (read-only peek; the
     element itself is only created inside the effect) */
  const [state, setState] = useState<RealAudioState>(() => {
    const el =
      typeof window !== "undefined" && src ? elements.get(id) : undefined;
    return el ? snapshot(el) : IDLE;
  });

  useEffect(() => {
    const el = getRealAudioElement(id, src);
    if (!el) return;
    const stopOnLeave = opts?.stopOnLeave === true;

    const patch = (p: Partial<RealAudioState>) => setState((s) => ({ ...s, ...p }));

    const onLoadedMetadata = () =>
      patch({ status: "ready", duration: safeNumber(el.duration) });
    const onDurationChange = () =>
      patch({
        status: el.error
          ? "error"
          : Number.isFinite(el.duration) && el.duration > 0
            ? "ready"
            : "loading",
        duration: safeNumber(el.duration),
      });
    const onTimeUpdate = () => patch({ current: safeNumber(el.currentTime) });
    const onPlay = () => patch({ playing: true, ended: false });
    const onPause = () => patch({ playing: false });
    const onEnded = () =>
      patch({
        playing: false,
        ended: true,
        current: safeNumber(el.duration) || safeNumber(el.currentTime),
      });
    const onWaiting = () => {
      if (!Number.isFinite(el.duration) || el.duration <= 0) patch({ status: "loading" });
    };
    const onPlaying = () => patch({ status: "ready" });
    const onError = () => patch({ status: "error", playing: false });
    const onVolumeChange = () => patch({ volume: safeVolume(el.volume) });

    el.addEventListener("loadedmetadata", onLoadedMetadata);
    el.addEventListener("durationchange", onDurationChange);
    el.addEventListener("timeupdate", onTimeUpdate);
    el.addEventListener("play", onPlay);
    el.addEventListener("pause", onPause);
    el.addEventListener("ended", onEnded);
    el.addEventListener("waiting", onWaiting);
    el.addEventListener("playing", onPlaying);
    el.addEventListener("error", onError);
    el.addEventListener("volumechange", onVolumeChange);

    return () => {
      el.removeEventListener("loadedmetadata", onLoadedMetadata);
      el.removeEventListener("durationchange", onDurationChange);
      el.removeEventListener("timeupdate", onTimeUpdate);
      el.removeEventListener("play", onPlay);
      el.removeEventListener("pause", onPause);
      el.removeEventListener("ended", onEnded);
      el.removeEventListener("waiting", onWaiting);
      el.removeEventListener("playing", onPlaying);
      el.removeEventListener("error", onError);
      el.removeEventListener("volumechange", onVolumeChange);
      /* leaving the room puts the song down gently — the
         element (and her exact position) stays for later.
         Room-owned songs (the birthday gift) go fully back
         in their drawer: paused, rewound to 0:00, so the
         room never leaks music into the rest of the place
         and never resumes on its own when she returns */
      if (stopOnLeave) {
        if (!el.paused) el.pause();
        try {
          el.currentTime = 0;
        } catch {
          /* not seekable yet — nothing to rewind */
        }
      } else if (!el.paused) {
        el.pause();
      }
    };
  }, [id, src, opts?.stopOnLeave]);

  const play = useCallback(() => {
    if (!src) return;
    const el = getRealAudioElement(id, src);
    if (!el) return;
    if (el.error) el.load(); /* one quiet retry after a failure */
    claimRealAudio(id);
    const d = safeNumber(el.duration);
    /* replay after the song has finished — never auto-loop */
    if (el.ended || (d > 0 && el.currentTime >= d - 0.05)) {
      el.currentTime = 0;
      setState((s) => ({ ...s, ended: false, current: 0 }));
    }
    el.muted = realMuted;
    void el.play().catch(() => setState((s) => ({ ...s, status: "error", playing: false })));
  }, [id, src]);

  const pause = useCallback(() => {
    if (!src) return;
    const el = getRealAudioElement(id, src);
    if (el) el.pause(); /* the element keeps its position */
  }, [id, src]);

  const toggle = useCallback(() => {
    if (!src) return;
    const el = getRealAudioElement(id, src);
    if (el && !el.paused && !el.ended) pause();
    else play();
  }, [id, src, pause, play]);

  const seek = useCallback(
    (t: number) => {
      if (!src) return;
      const el = getRealAudioElement(id, src);
      if (!el) return;
      const d = safeNumber(el.duration);
      const target = d > 0 ? Math.min(Math.max(0, t), d - 0.01) : 0;
      el.currentTime = target;
      setState((s) => ({ ...s, current: target, ended: false }));
    },
    [id, src],
  );

  /* how loudly this one recording sings — 0 to 1, kept where
     the element keeps it, so it survives rooms and renders */
  const setVolume = useCallback(
    (v: number) => {
      if (!src) return;
      const el = getRealAudioElement(id, src);
      if (!el) return;
      el.volume = safeVolume(v);
      setState((s) => ({ ...s, volume: safeVolume(v) }));
    },
    [id, src],
  );

  return { ...state, play, pause, toggle, seek, setVolume };
}
