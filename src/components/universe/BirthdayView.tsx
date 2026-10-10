"use client";

/* ————————————————————————————————————————————————
   Your 19th, kept here forever.
   The birthday ritual: make a wish (press & hold),
   keep it to yourself, then swipe up to blow out
   the two number candles — 1 and 9. Or, optionally,
   blow for real into the microphone.
———————————————————————————————————————————————— */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart, Mic, MicOff, Play, RotateCcw } from "lucide-react";
import type { ViewId } from "@/content/arooqtyContent";
import { useContent, useLang } from "./Lang";
import { daysUntil } from "@/lib/timeTogether";
import { lsGet, lsSet } from "@/lib/localStorage";
import { tryStartRealAudio, useRealAudioPlayer } from "@/lib/realAudio";
import { playCandleWhoosh, playWishChime } from "@/lib/softSounds";
import { Ltr, Reveal, SectionHeading, TapeStrip } from "./Shared";
import ScrapbookDoodles, {
  HeartOutline,
  PenStar,
  Sparkle,
} from "./ScrapbookDoodles";
import BirthdaySongCard from "./BirthdaySongCard";
import ChapterNav from "./ChapterNav";
import { cn } from "@/lib/utils";

const CONFETTI_COLORS = ["#F8F4F1", "#B77C8D", "#651C2D", "#9C5464", "#E7CDD4"];

/** how long she must hold the cake to finish her wish (ms) */
const HOLD_MS = 2000;
/** upward distance (px) that counts as blowing out the candles */
const SWIPE_PX = 34;

type CakePhase = "wishing" | "holding" | "lit" | "blowing" | "done";

/* one piece of the quiet celebration — paper confetti
   drifting down, hand-drawn hearts and pen stars rising
   gently beside the cake, sparkles twinkling once */
type CelebratePiece =
  | {
      kind: "confetti";
      x: number;
      dx: number;
      dy: number;
      rot: number;
      dur: number;
      delay: number;
      color: string;
      size: number;
    }
  | {
      kind: "riseHeart" | "riseStar";
      x: number;
      bottom: number;
      wx: number;
      wrise: number;
      wrot: number;
      wpeak: number;
      dur: number;
      delay: number;
      color: string;
      size: number;
    }
  | {
      kind: "sparkle";
      x: number;
      top: number;
      dur: number;
      delay: number;
      color: string;
      size: number;
    };

function IcingDrips({
  widths,
}: {
  widths: { w: number; h: number }[];
}) {
  return (
    <span aria-hidden className="absolute inset-x-0 top-0 flex justify-between">
      {widths.map((d, i) => (
        <span
          key={i}
          className="rounded-b-full bg-burgundy"
          style={{ width: d.w, height: d.h }}
        />
      ))}
    </span>
  );
}

/* ————— one elegant number candle —————
   The flame is a real DOM element that exists only while
   it burns: once blown out it is removed entirely (not
   dimmed, not faded) and the wick stays charred. */
function NumberCandle({
  digit,
  flameVisible,
  flameScale,
  charred,
  smoke,
}: {
  digit: string;
  /** whether the flame element exists at all */
  flameVisible: boolean;
  /** 0..1 — how far the flame has emerged while she holds */
  flameScale: number;
  /** the wick has been blown out — dark and bent */
  charred: boolean;
  /** grey curls rising from the wick, just after blow-out */
  smoke: boolean;
}) {
  const isOne = digit === "1";
  return (
    <div className="relative flex flex-col items-center">
      {/* the flame — rendered only while it exists; gone means gone */}
      <span className="relative block h-[22px] w-[18px]">
        {flameVisible && (
          <span className="absolute bottom-0 left-1/2 block h-[19px] w-[13px] -translate-x-1/2">
            <span
              aria-hidden
              className="block h-full w-full origin-bottom animate-flame rounded-[50%_50%_50%_50%/62%_62%_38%_38%]"
              style={{
                background:
                  "radial-gradient(circle at 50% 72%, #fff7e8 0%, #ffd9a0 38%, #e8934f 72%, transparent 80%)",
                filter: "blur(0.4px)",
                opacity: Math.max(flameScale, 0.05),
                transform: `scale(${Math.max(flameScale, 0.05)})`,
                transition: "opacity 240ms ease-out, transform 240ms ease-out",
              }}
            />
          </span>
        )}
      </span>

      {/* two–three tiny grey curls, fading in about a second */}
      {smoke && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[13px] block h-0 w-0"
        >
          <span
            className="smoke-curl absolute left-[-2px] top-0 block h-[10px] w-[4px] rounded-full bg-[#cbb7bc]/35"
            style={{ "--sx": "-5px" } as React.CSSProperties}
          />
          <span
            className="smoke-curl absolute left-[-2px] top-0 block h-[12px] w-[4px] rounded-full bg-[#cbb7bc]/30"
            style={{
              "--sx": "3px",
              animationDelay: "130ms",
            } as React.CSSProperties}
          />
          <span
            className="smoke-curl absolute left-[-1.5px] top-0 block h-[9px] w-[3px] rounded-full bg-[#cbb7bc]/25"
            style={{
              "--sx": "9px",
              animationDelay: "260ms",
            } as React.CSSProperties}
          />
        </span>
      )}

      {/* the wick — dark and slightly bent once charred */}
      <span
        aria-hidden
        className={cn(
          "block h-[7px] w-[2.5px] rounded-full transition-colors duration-500",
          charred ? "bg-[#160b10]" : "bg-[#3a1e28]/80"
        )}
        style={charred ? { transform: "rotate(9deg)" } : undefined}
      />

      {/* the wax numeral itself */}
      <span
        className={cn(
          "relative block font-display text-[56px] leading-[0.9] text-[#f3e9e4]",
          isOne ? "-rotate-[2deg]" : "rotate-[2deg]"
        )}
        style={{
          textShadow:
            "0 1.5px 0 #d9c3c9, 0 2.5px 0 #c9aeb6, 0 12px 22px rgba(0,0,0,0.5)",
        }}
      >
        {digit}
        {/* soft wax drip on the numeral */}
        <span
          aria-hidden
          className="absolute -bottom-[3px] left-1/2 h-[6px] w-[7px] -translate-x-[70%] rounded-b-full bg-[#e7cdd4]/90"
        />
      </span>

      {/* little wax pool where the candle meets the icing */}
      <span
        aria-hidden
        className="mt-[2px] block h-[5px] w-[44px] rounded-[50%] bg-[#e7cdd4]/45"
      />
    </div>
  );
}

/* ————— the optional microphone path — always quieter than the swipe ————— */
function MicBlowOption({ onBlow }: { onBlow: () => void }) {
  const { content } = useLang();
  const mic = content.birthday.ritual.mic;
  const [state, setState] = useState<"idle" | "listening" | "denied" | "timeout">(
    "idle"
  );
  const cleanupRef = useRef<(() => void) | null>(null);

  /* stop the mic whenever the option goes away */
  useEffect(() => () => cleanupRef.current?.(), []);

  const stop = useCallback(() => {
    cleanupRef.current?.();
    cleanupRef.current = null;
  }, []);

  const start = useCallback(async () => {
    stop();
    setState("listening");
    let raf = 0;
    let done = false;
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setState("denied");
        return;
      }
      const AC =
        window.AudioContext ??
        (
          window as unknown as {
            webkitAudioContext?: typeof AudioContext;
          }
        ).webkitAudioContext;
      if (!AC) {
        setState("denied");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AC();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      const buf = new Float32Array(analyser.fftSize);

      const readRms = () => {
        analyser.getFloatTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
        return Math.sqrt(sum / buf.length);
      };

      /* ——— brief calibration: learn the room's quiet ——— */
      let ambient = 0;
      let calFrames = 0;
      const CAL_MS = 620;
      const calStart = performance.now();

      /* ——— sustained breath — several consecutive breathy ———
         frames, or one unmistakable blow — never a single
         tiny spike */
      let hot = 0;
      const listen = (threshold: number) => {
        if (done) return;
        const rms = readRms();
        if (rms > threshold) hot += 1;
        else hot = Math.max(0, hot - 1);
        const sustained = hot >= 5; /* ≈ 80ms of real breath */
        const unmistakable = rms > threshold * 3.4 && rms > 0.2;
        if (sustained || unmistakable) {
          finish();
          onBlow();
          return;
        }
        raf = requestAnimationFrame(() => listen(threshold));
      };

      const calibrate = () => {
        if (done) return;
        ambient += readRms();
        calFrames++;
        if (performance.now() - calStart < CAL_MS) {
          raf = requestAnimationFrame(calibrate);
          return;
        }
        ambient = calFrames > 0 ? ambient / calFrames : 0;
        /* a breath must clear the room by a wide, honest margin */
        listen(Math.max(ambient * 3.4, 0.055));
      };

      const timer = window.setTimeout(() => {
        if (!done) {
          finish();
          setState("timeout");
        }
      }, 12000);

      const finish = () => {
        done = true;
        window.clearTimeout(timer);
        cancelAnimationFrame(raf);
        try {
          stream.getTracks().forEach((t) => t.stop());
        } catch {
          /* already gone */
        }
        try {
          void ctx.close();
        } catch {
          /* already closed */
        }
        cleanupRef.current = null;
      };
      cleanupRef.current = finish;

      calibrate();
    } catch {
      cleanupRef.current?.();
      cleanupRef.current = null;
      setState("denied");
    }
  }, [onBlow, stop]);

  return (
    <div className="mt-3 flex min-h-[28px] items-center justify-center gap-2 text-center">
      {state === "idle" && (
        <button
          onClick={() => void start()}
          className="inline-flex items-center gap-1.5 rounded-sm text-[10px] uppercase tracking-[0.22em] text-rose-soft/75 transition-colors hover:text-rose-soft focus:outline-none focus-visible:ring-1 focus-visible:ring-rose/60"
        >
          <Mic className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
          {mic.optionLabel}
        </button>
      )}

      {state === "listening" && (
        <>
          <span className="inline-flex animate-soft-glow items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] text-rose/75">
            <Mic className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
            {mic.listeningHint}
          </span>
          <button
            onClick={() => {
              stop();
              setState("idle");
            }}
            aria-label={mic.stopLabel}
            className="rounded-sm p-1 text-rose-soft/70 transition-colors hover:text-rose-soft focus:outline-none focus-visible:ring-1 focus-visible:ring-rose/60"
          >
            <MicOff className="h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />
          </button>
        </>
      )}

      {state === "denied" && (
        <p className="font-hand text-lg text-rose-soft/85">{mic.deniedLine}</p>
      )}

      {state === "timeout" && (
        <span className="inline-flex items-center gap-2">
          <p className="font-hand text-lg text-rose-soft/85">{mic.timeoutLine}</p>
          <button
            onClick={() => void start()}
            className="rounded-sm text-[10px] uppercase tracking-[0.22em] text-rose-soft/75 transition-colors hover:text-rose-soft focus:outline-none focus-visible:ring-1 focus-visible:ring-rose/60"
          >
            <Mic className="inline h-3.5 w-3.5" strokeWidth={1.6} aria-hidden />{" "}
            {mic.optionLabel}
          </button>
        </span>
      )}
    </div>
  );
}

/* ————— the ritual —————
   A small explicit state machine:
   wishing → holding → lit → blowing → done.
   `flameOut` is the source of truth for the candles: once
   true, the flame element is removed from the DOM entirely
   and the wick stays charred. `done` is persisted, so a
   refresh never relights the candles.

   The sequence after a successful blow is one breath, not
   a list of features: the flames give in (0ms / 430ms), the
   room holds a tiny quiet beat, the words begin arriving
   (~700ms), the room quietly agrees (~1050ms), and her
   birthday song rises out of the wish itself (~1550ms) —
   never before it, never without it. */
function CakeScene({
  onQuiet,
  onWishSong,
  songFallback,
}: {
  onQuiet: (quiet: boolean) => void;
  /** the cue that starts her birthday song — fired once per
      successful blow, about 1.5s in, as the words settle */
  onWishSong: () => void;
  /** the gentle fallback button, rendered inside the reveal
      only if the browser refused the song's own entrance */
  songFallback: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const { lang } = useLang();
  const { birthday, ui } = useContent();
  const [phase, setPhase] = useState<CakePhase>(() =>
    lsGet<boolean>("birthdayWishSent", false) ? "done" : "wishing"
  );
  const [progress, setProgress] = useState(0);
  /* which flames are out — [the 1, the 9]. When the ritual is
     already complete (persisted), both start out: blown. */
  const [flameOut, setFlameOut] = useState<[boolean, boolean]>(() =>
    lsGet<boolean>("birthdayWishSent", false)
      ? [true, true]
      : [false, false]
  );
  const [smoke, setSmoke] = useState<[boolean, boolean]>([false, false]);
  const [burst, setBurst] = useState(0);
  const [showSwipe, setShowSwipe] = useState(false);

  const holdStart = useRef<number | null>(null);
  const rafId = useRef<number | null>(null);
  const timeouts = useRef<number[]>([]);
  const swipeStartY = useRef<number | null>(null);
  const pointerDown = useRef(false);
  const lastY = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    rafId.current = null;
    holdStart.current = null;
    timeouts.current.forEach((t) => window.clearTimeout(t));
    timeouts.current = [];
  }, []);

  useEffect(() => () => clearTimers(), [clearTimers]);

  /* —— the wish: press & hold —— */
  const completeWish = useCallback(() => {
    clearTimers();
    onQuiet(false);
    setProgress(1);
    setPhase("lit");
    // if her finger never left the cake, let the same continuous
    // gesture carry on into the blow-out swipe
    if (pointerDown.current && lastY.current !== null) {
      swipeStartY.current = lastY.current;
    }
    // "keep it to yourself" first, then invite the swipe
    timeouts.current.push(
      window.setTimeout(() => setShowSwipe(true), 2400)
    );
  }, [clearTimers, onQuiet]);

  const tickHold = useRef<(p: number) => void>(() => {});
  tickHold.current = (p: number) => {
    if (p >= 1) {
      completeWish();
      return;
    }
    rafId.current = requestAnimationFrame(() => runHold());
  };

  const runHold = useCallback(() => {
    if (holdStart.current === null) return;
    const p = Math.min(1, (performance.now() - holdStart.current) / HOLD_MS);
    setProgress(p);
    tickHold.current(p);
  }, []);

  const startHold = useCallback(() => {
    if (phase !== "wishing") return;
    holdStart.current = performance.now() - progress * HOLD_MS;
    setPhase("holding");
    onQuiet(true);
    rafId.current = requestAnimationFrame(() => runHold());
  }, [phase, progress, runHold, onQuiet]);

  const endHold = useCallback(() => {
    if (phase !== "holding") return;
    // let go too soon — the wish needs a little more time
    clearTimers();
    onQuiet(false);
    setPhase("wishing");
    setProgress(0);
  }, [phase, clearTimers, onQuiet]);

  /* —— the blow: the flames are removed, not dimmed — and
         everything that follows belongs to the same moment —— */
  const blowOut = useCallback(() => {
    if (phase !== "lit") return;
    setPhase("blowing");
    setShowSwipe(false);
    // a soft breath of air
    playCandleWhoosh();
    // the 1 goes out first — flame removed, wick charred, smoke curls —
    setFlameOut([true, false]);
    setSmoke([true, false]);
    // then the 9, one beat behind
    timeouts.current.push(
      window.setTimeout(() => {
        setFlameOut([true, true]);
        setSmoke([true, true]);
      }, 430)
    );
    // the curls fade after about a second
    timeouts.current.push(
      window.setTimeout(() => setSmoke([false, false]), 1600)
    );
    // the quiet little moment — then his words begin arriving
    timeouts.current.push(
      window.setTimeout(() => {
        setPhase("done");
        lsSet("birthdayWishSent", true);
      }, 650)
    );
    // a small bell, agreeing with the wish — and the room's
    // own quiet celebration (the bloom, the rising hearts)
    timeouts.current.push(
      window.setTimeout(() => {
        setBurst((b) => b + 1);
        playWishChime();
      }, 1050)
    );
    // her birthday song — part of the same breath. It rises
    // just after the words have begun, never before them;
    // relighting clears this timer, so it only ever follows
    // a real, completed blow
    timeouts.current.push(
      window.setTimeout(() => onWishSong(), 1550)
    );
  }, [phase, onWishSong]);

  /* —— light them again —— */
  const relight = () => {
    clearTimers();
    onQuiet(false);
    setFlameOut([false, false]);
    setSmoke([false, false]);
    setShowSwipe(false);
    setProgress(0);
    setPhase("wishing");
  };

  /* —— keyboard fallbacks —— */
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    e.preventDefault();
    if (e.repeat) return;
    if (phase === "wishing") {
      // gentle auto-hold for keyboard visitors
      holdStart.current = performance.now() - progress * HOLD_MS;
      setPhase("holding");
      onQuiet(true);
      rafId.current = requestAnimationFrame(() => runHold());
    } else if (phase === "lit") {
      blowOut();
    }
  };

  /* —— pointer wiring —— */
  const onPointerDown = (e: React.PointerEvent) => {
    // capture the pointer so drags that wander off the cake (mouse) or
    // above the candles (touch) still report their movement here
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* older browsers — touch still works via implicit capture */
    }
    pointerDown.current = true;
    lastY.current = e.clientY;
    if (phase === "wishing") {
      swipeStartY.current = null;
      startHold();
    } else if (phase === "lit") {
      swipeStartY.current = e.clientY;
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    lastY.current = e.clientY;
    if (phase !== "lit" || swipeStartY.current === null) return;
    const dy = swipeStartY.current - e.clientY;
    if (dy > SWIPE_PX) {
      swipeStartY.current = null;
      blowOut();
    }
  };

  const onPointerUp = () => {
    pointerDown.current = false;
    swipeStartY.current = null;
    endHold();
  };

  /* —— the quiet celebration: when the wish is kept safe,
         a few hand-drawn hearts and pen stars rise gently
         beside the cake, tiny sparkles twinkle once near
         the candles, and a little paper confetti drifts
         down — under two seconds of soft agreement, and
         then the room is calm again. Nothing explodes,
         nothing covers the cake or her words —— */
  const celebration = useMemo<CelebratePiece[]>(() => {
    if (burst === 0 || reduce) return [];
    const out: CelebratePiece[] = [];
    /* paper confetti — a gentle few, drifting down */
    for (let i = 0; i < 7; i++) {
      out.push({
        kind: "confetti",
        x: 18 + Math.random() * 64,
        dx: (Math.random() - 0.5) * 170,
        dy: 150 + Math.random() * 90,
        rot: (Math.random() - 0.5) * 300,
        dur: 1.7 + Math.random() * 0.6,
        delay: Math.random() * 0.28,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        size: 6 + Math.random() * 2.5,
      });
    }
    /* hand-drawn hearts, rising beside the cake */
    [9, 87, 19].forEach((x, i) => {
      out.push({
        kind: "riseHeart",
        x: x + (Math.random() - 0.5) * 4,
        bottom: 24 + Math.random() * 8,
        wx: (Math.random() - 0.5) * 18,
        wrise: 80 + Math.random() * 50,
        wrot: (Math.random() - 0.5) * 26,
        wpeak: 0.68 + Math.random() * 0.2,
        dur: 1.6 + Math.random() * 0.5,
        delay: 0.05 + Math.random() * 0.3,
        color: i === 1 ? "#E7CDD4" : "#B77C8D",
        size: 11 + Math.random() * 4,
      });
    });
    /* tiny pen stars, rising the other side */
    [85, 13, 73].forEach((x, i) => {
      out.push({
        kind: "riseStar",
        x: x + (Math.random() - 0.5) * 4,
        bottom: 26 + Math.random() * 8,
        wx: (Math.random() - 0.5) * 16,
        wrise: 70 + Math.random() * 45,
        wrot: (Math.random() - 0.5) * 30,
        wpeak: 0.62 + Math.random() * 0.2,
        dur: 1.55 + Math.random() * 0.5,
        delay: 0.1 + Math.random() * 0.35,
        color: i === 0 ? "#F8F4F1" : "#E7CDD4",
        size: 9 + Math.random() * 4,
      });
    });
    /* three small sparkles, twinkling once near the flames */
    for (let i = 0; i < 3; i++) {
      out.push({
        kind: "sparkle",
        x: 24 + Math.random() * 52,
        top: 2 + Math.random() * 12,
        dur: 1.3 + Math.random() * 0.45,
        delay: 0.15 + Math.random() * 0.45,
        color: i === 1 ? "#E7CDD4" : "#F8F4F1",
        size: 9 + Math.random() * 4,
      });
    }
    return out;
  }, [burst, reduce]);

  const hintMain =
    phase === "wishing" || phase === "holding"
      ? birthday.ritual.wishPrompt
      : phase === "lit"
        ? showSwipe
          ? birthday.ritual.swipePrompt
          : birthday.ritual.wishKept
        : phase === "blowing"
          ? birthday.ritual.wishKept
          : birthday.ritual.wishSent;

  /* his words, split where he broke the lines — each one
     arrives on its own, like ink settling into paper */
  const postWishLines = useMemo(
    () => birthday.ritual.postWish.split("\n"),
    [birthday.ritual.postWish],
  );

  const hintSub =
    phase === "wishing"
      ? birthday.ritual.holdHint
      : phase === "holding"
        ? birthday.ritual.holdingHint
        : phase === "lit" && showSwipe
          ? birthday.ritual.keyboardHint
          : null;

  const cakeLabel =
    phase === "wishing" || phase === "holding"
      ? ui.birthdayUi.cakeAria
      : phase === "lit"
        ? ui.birthdayUi.candlesAria
        : ui.birthdayUi.completeAria;

  return (
    <div className="relative mx-auto mt-12 w-[240px] select-none">
      {/* the room's breathing warmth behind the cake — a soft
          burgundy-candle light that swells and eases on its
          own slow rhythm, the air around a cake someone just
          carried in. It sits first in the paint order, so it
          is atmosphere, never a veil over the cake itself */}
      {!reduce && (
        <span
          aria-hidden
          className="cake-breathe pointer-events-none absolute left-1/2 top-[70px] block h-[280px] w-[330px] -translate-x-1/2 rounded-full blur-[64px]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(122,38,56,0.5) 0%, rgba(45,11,21,0.22) 55%, transparent 76%)",
          }}
        />
      )}
      {/* two small pen stars keeping the ritual company —
          twinkling at the cake's sides, each on its own
          rhythm, quiet enough to stay elegant */}
      {!reduce && (
        <>
          <span
            aria-hidden
            className="doodle-twinkle pointer-events-none absolute -left-10 top-[92px] block h-3.5 w-3.5"
            style={
              {
                "--d-min": 0.14,
                "--d-max": 0.55,
                "--d-dur": "5.4s",
                "--d-delay": "-1.6s",
              } as React.CSSProperties
            }
          >
            <PenStar color="#E7CDD4" />
          </span>
          <span
            aria-hidden
            className="doodle-twinkle pointer-events-none absolute -right-11 top-[168px] block h-3 w-3"
            style={
              {
                "--d-min": 0.12,
                "--d-max": 0.5,
                "--d-dur": "6.6s",
                "--d-delay": "-4s",
              } as React.CSSProperties
            }
          >
            <PenStar color="#B77C8D" />
          </span>
        </>
      )}
      {/* the quiet celebration — a few hand-drawn hearts and
          pen stars rising beside the cake, sparkles twinkling
          once near the flames, paper confetti drifting down.
          Every piece is pointer-transparent and gone within
          two seconds; the wish was quietly sealed away */}
      {burst > 0 && !reduce && (
        /* the wish's own warm bloom — the room itself
           agreeing, a breath of candlelight swelling out
           from the cake and easing away, once */
        <motion.div
          key={`wish-bloom-${burst}`}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[110px] z-0 h-[320px] w-[320px] -translate-x-1/2 rounded-full blur-[46px]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(242,190,140,0.3) 0%, rgba(122,38,56,0.2) 48%, transparent 72%)",
          }}
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.88, 1.07, 1.16] }}
          transition={{ duration: 1.9, times: [0, 0.32, 1], ease: "easeOut" }}
        />
      )}
      {celebration.map((p, i) => {
        if (p.kind === "confetti") {
          return (
            <span
              key={`${burst}-f${i}`}
              aria-hidden
              className="confetti-piece pointer-events-none"
              style={
                {
                  left: `${p.x}%`,
                  background: p.color,
                  width: p.size,
                  height: p.size + 3,
                  animationDuration: `${p.dur}s`,
                  animationDelay: `${p.delay}s`,
                  "--dx": `${p.dx}px`,
                  "--dy": `${p.dy}px`,
                  "--rot": `${p.rot}deg`,
                } as React.CSSProperties
              }
            />
          );
        }
        if (p.kind === "sparkle") {
          return (
            <span
              key={`${burst}-s${i}`}
              aria-hidden
              className="wish-twinkle pointer-events-none absolute block"
              style={
                {
                  left: `${p.x}%`,
                  top: `${p.top}%`,
                  width: p.size,
                  height: p.size,
                  "--w-dur": `${p.dur}s`,
                  "--w-delay": `${p.delay}s`,
                } as React.CSSProperties
              }
            >
              <Sparkle color={p.color} />
            </span>
          );
        }
        return (
          <span
            key={`${burst}-r${i}`}
            aria-hidden
            className="wish-rise pointer-events-none absolute block"
            style={
              {
                left: `${p.x}%`,
                bottom: `${p.bottom}%`,
                width: p.size,
                height: p.size,
                opacity: 0,
                "--wx": `${p.wx}px`,
                "--wrise": `${p.wrise}px`,
                "--wrot": `${p.wrot}deg`,
                "--w-peak": p.wpeak,
                "--w-dur": `${p.dur}s`,
                "--w-delay": `${p.delay}s`,
              } as React.CSSProperties
            }
          >
            {p.kind === "riseHeart" ? (
              <HeartOutline color={p.color} />
            ) : (
              <PenStar color={p.color} />
            )}
          </span>
        );
      })}

      <div
        role="button"
        tabIndex={0}
        aria-label={cakeLabel}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerLeave={onPointerUp}
        className="relative block w-full cursor-pointer touch-pan-y rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60"
      >
        {/* the candles — swipe zone & the slow-appearing flames.
            dir="ltr" is structural, not cosmetic: the pair must read
            1 → 9 from left, even when the whole page is Arabic RTL —
            without it, flex follows the page direction and the pair
            visually flips to 9 1. Numbers stay LTR inside this box
            while everything around it remains fully RTL. */}
        <div
          dir="ltr"
          className="relative z-10 mx-auto flex w-fit items-end gap-2.5 pb-[1px]"
          style={{ touchAction: "none" }}
        >
          {/* progress ring around the wish, drawn while she holds */}
          <svg
            viewBox="0 0 120 120"
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[124px] w-[124px] -translate-x-1/2 -translate-y-[62%] opacity-70"
            style={{ transition: "opacity 500ms ease" }}
          >
            <circle
              cx="60"
              cy="60"
              r="56"
              fill="none"
              stroke="rgba(183,124,141,0.16)"
              strokeWidth="1.5"
            />
            <circle
              cx="60"
              cy="60"
              r="56"
              fill="none"
              stroke="#B77C8D"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 56}
              strokeDashoffset={2 * Math.PI * 56 * (1 - progress)}
              transform="rotate(-90 60 60)"
              style={{ transition: "stroke-dashoffset 120ms linear" }}
            />
          </svg>

          {/* warm glow that grows with the wish — and leaves
              with the last flame */}
          <span
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-26px] h-[72px] w-[110px] -translate-x-1/2 rounded-full blur-[26px]"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(255,205,140,0.4), rgba(232,147,79,0.14) 60%, transparent 75%)",
              opacity:
                phase === "wishing"
                  ? 0
                  : phase === "holding"
                    ? progress
                    : flameOut[0] && flameOut[1]
                      ? 0
                      : 1,
              transition: "opacity 300ms ease",
            }}
          />

          {/* a tiny pen-drawn star, doodled beside the candles */}
          <span
            aria-hidden
            className="pointer-events-none absolute -end-9 top-1 block"
            style={{
              width: 13,
              height: 13,
              opacity: 0.4,
              transform: "rotate(14deg)",
            }}
          >
            <PenStar color="#E7CDD4" />
          </span>

          <NumberCandle
            digit="1"
            flameVisible={
              (phase === "holding" && progress > 0) ||
              phase === "lit" ||
              (phase === "blowing" && !flameOut[0])
            }
            flameScale={phase === "holding" ? progress : 1}
            charred={flameOut[0]}
            smoke={smoke[0]}
          />
          <NumberCandle
            digit="9"
            flameVisible={
              (phase === "holding" && progress > 0) ||
              phase === "lit" ||
              (phase === "blowing" && !flameOut[1])
            }
            flameScale={phase === "holding" ? progress : 1}
            charred={flameOut[1]}
            smoke={smoke[1]}
          />
        </div>

        {/* top tier */}
        <div className="relative mx-auto w-[150px] pt-[3px]">
          <div className="relative h-[46px] overflow-hidden rounded-t-lg bg-gradient-to-b from-[#f3e9e4] to-[#e9d8d3]">
            <span className="absolute inset-x-0 top-0 h-[7px] bg-burgundy" />
            <div className="absolute inset-x-0 top-[16px] flex justify-center gap-2.5">
              <Heart className="h-2.5 w-2.5 text-burgundy/40" fill="currentColor" strokeWidth={0} aria-hidden />
              <Heart className="h-3 w-3 text-burgundy/60" fill="currentColor" strokeWidth={0} aria-hidden />
              <Heart className="h-2.5 w-2.5 text-burgundy/40" fill="currentColor" strokeWidth={0} aria-hidden />
            </div>
          </div>
          <IcingDrips
            widths={[
              { w: 12, h: 12 },
              { w: 9, h: 17 },
              { w: 13, h: 10 },
              { w: 10, h: 15 },
              { w: 12, h: 11 },
            ]}
          />
        </div>

        {/* bottom tier */}
        <div className="relative mx-auto w-[186px]">
          <div className="relative h-[54px] overflow-hidden rounded-t-md bg-gradient-to-b from-[#f6efe9] to-[#eadbd4]">
            <span className="absolute inset-x-0 top-0 h-[7px] bg-burgundy" />
            <div className="absolute inset-x-0 top-[16px] flex justify-center gap-3">
              <Heart className="h-3 w-3 text-burgundy/60" fill="currentColor" strokeWidth={0} aria-hidden />
              <Heart className="h-3 w-3 text-burgundy/40" fill="currentColor" strokeWidth={0} aria-hidden />
              <Heart className="h-3 w-3 text-burgundy/60" fill="currentColor" strokeWidth={0} aria-hidden />
            </div>
          </div>
          <IcingDrips
            widths={[
              { w: 14, h: 13 },
              { w: 11, h: 19 },
              { w: 15, h: 11 },
              { w: 12, h: 16 },
              { w: 14, h: 12 },
              { w: 11, h: 18 },
              { w: 13, h: 11 },
            ]}
          />
        </div>

        {/* plate */}
        <div className="mx-auto mt-[-2px] h-[14px] w-[228px] rounded-[50%] border-t border-rose/25 bg-gradient-to-b from-[#241019] to-[#160a10]" />
      </div>

      {/* the ritual's quiet words */}
      <div className="mt-6 min-h-[3.6em] text-center" aria-live="polite">
        <p className="font-hand text-xl text-rose/85">{hintMain}</p>
        {hintSub && (
          <motion.p
            key={hintSub}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduce ? 0 : 0.5 }}
            className="mt-0.5 text-[10px] uppercase tracking-[0.22em] text-rose-soft/75"
          >
            {hintSub}
          </motion.p>
        )}
      </div>

      {/* the blow-out paths — offered only once the candles are lit:
          the mic option, and the quiet accessible fallback */}
      {phase === "lit" && (
        <>
          <MicBlowOption onBlow={blowOut} />
          <div className="mt-1 flex min-h-[24px] items-center justify-center">
            <button
              onClick={blowOut}
              aria-label={ui.birthdayUi.ritualAria}
              className="rounded-sm font-hand text-[13px] text-rose-soft/65 underline decoration-rose/30 underline-offset-4 transition-colors duration-300 hover:text-rose-soft focus:outline-none focus-visible:ring-1 focus-visible:ring-rose/60"
            >
              {birthday.ritual.wishMadeFallback}
            </button>
          </div>
        </>
      )}

      {/* the reveal — his words, kept for after the candles.
          The lines arrive one by one, soft and a little
          blurred at first, the way handwriting settles; the
          last sentence follows a beat later, once the room
          has gone quiet again */}
      {phase === "done" && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-[380px]"
        >
          <div className="relative rotate-[-1deg] rounded-lg bg-cream px-6 py-6 polaroid-shadow sm:px-7">
            <TapeStrip className="-top-2.5 left-1/2 w-14 -translate-x-1/2" />
            <div
              dir={lang === "en" ? "rtl" : undefined}
              lang={lang === "en" ? "ar" : undefined}
              className={cn(
                "text-ink",
                lang === "en"
                  ? "font-arabic text-[1.15rem] leading-[2.2]"
                  : "font-hand text-[1.4rem] leading-[1.95]",
              )}
            >
              {postWishLines.map((line, i) => (
                <motion.p
                  key={i}
                  initial={
                    reduce ? { opacity: 0 } : { opacity: 0, y: 10, filter: "blur(2.5px)" }
                  }
                  animate={
                    reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }
                  }
                  transition={{
                    duration: reduce ? 0.25 : 0.75,
                    delay: reduce ? i * 0.08 : 0.18 + i * 0.42,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  {line}
                </motion.p>
              ))}

              {/* the last sentence — a beat after the words settle */}
              <motion.div
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
                animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
                transition={{
                  duration: reduce ? 0.3 : 0.7,
                  delay: reduce ? 0.45 : 2.9,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="mt-4"
              >
                <div
                  aria-hidden
                  className="mx-auto mb-3.5 flex w-24 items-center gap-2 opacity-50"
                >
                  <span className="h-px flex-1 bg-burgundy/50" />
                  <Heart
                    className="h-2 w-2 shrink-0 text-burgundy/70"
                    fill="currentColor"
                    strokeWidth={0}
                  />
                  <span className="h-px flex-1 bg-burgundy/50" />
                </div>
                <p
                  className={cn(
                    "text-center text-burgundy",
                    lang === "en"
                      ? "font-arabic text-[1.35rem]"
                      : "font-hand text-[1.55rem]",
                  )}
                >
                  {birthday.ritual.postWishFinal}
                </p>
              </motion.div>
            </div>
          </div>

          {/* the song's gentle fallback — only if the browser
              refused to let the wish start it by itself */}
          {songFallback}

          {/* light them again — for any ordinary day she wants the ritual back */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={relight}
              className="group inline-flex min-h-[44px] items-center gap-2.5 rounded-[10px] border border-rose/30 bg-wine/40 px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-rose/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose/60 hover:bg-wine/70 hover:text-rose"
            >
              <RotateCcw
                className="h-3.5 w-3.5 transition-transform duration-500 group-hover:-rotate-180"
                strokeWidth={1.6}
                aria-hidden
              />
              {birthday.ritual.lightAgain}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function BirthdayView({
  onNavigate,
}: {
  onNavigate: (v: ViewId) => void;
}) {
  const { birthday, relationship, ui } = useContent();
  const reduce = useReducedMotion();
  const now = new Date();
  const daysLeft = daysUntil(birthday.date, now, relationship.timezone);
  const [quiet, setQuiet] = useState(false);

  /* the wish's own cue — her birthday song rises out of the
     completed ritual, never on room entry. One attempt is
     made for her the moment the words have begun; if the
     browser refuses it, a small elegant button appears
     inside the reveal instead of any error. The song itself
     is the one that has always lived here — same file, same
     little card, same everything */
  const [songBlocked, setSongBlocked] = useState(false);
  const wishSong = useRealAudioPlayer("birthday", birthday.song.audioUrl);
  const onWishSong = useCallback(() => {
    void tryStartRealAudio("birthday", birthday.song.audioUrl).then((ok) => {
      if (!ok) setSongBlocked(true);
    });
  }, [birthday.song.audioUrl]);

  /* the fallback — her one tap, if the browser held the door
     shut. It hides itself the moment the song is singing,
     however it got started */
  const songFallback =
    songBlocked && !wishSong.playing ? (
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: reduce ? 0 : 0.5,
          delay: reduce ? 0 : 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
        onClick={() => {
          setSongBlocked(false);
          void tryStartRealAudio("birthday", birthday.song.audioUrl);
        }}
        aria-label={birthday.ritual.songFallback}
        className="mx-auto mt-5 flex min-h-[44px] items-center gap-2.5 rounded-full bg-burgundy px-6 py-2.5 font-hand text-[17px] leading-none text-cream shadow-[0_10px_24px_-8px_rgba(101,28,45,0.85)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#7d2c3f] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60"
      >
        <Play
          className="h-3.5 w-3.5 shrink-0"
          fill="currentColor"
          strokeWidth={0}
          aria-hidden
        />
        {birthday.ritual.songFallback}
      </motion.button>
    ) : null;

  return (
    <div className="relative isolate">
      {/* the page around the room — a few quiet marks,
          sparser than the room itself */}
      <ScrapbookDoodles variant="birthdayPage" />
      <SectionHeading
        overline={ui.sections.birthday.overline}
        title={birthday.title}
      />

      {/* dark burgundy birthday room */}
      <div className="relative mt-10 overflow-hidden rounded-3xl border border-burgundy/30 bg-[radial-gradient(120%_90%_at_50%_0%,#3a1220_0%,#20090f_72%)] px-4 pb-12 pt-10 sm:px-8">
        {/* the room's own atmosphere — the one place allowed
            to feel noticeably magical: a few more hearts, pen
            stars, twinkling sparkles and paper marks, fading
            in first, like the room remembering it's a birthday */}
        <ScrapbookDoodles variant="birthdayRoom" className="z-0" enterFade />
        {/* THE ROOM WARMING — the birthday room's own first
            gesture: on arrival, a breath of candle-warm
            light blooms across the room and eases away,
            like someone just carried the cake in. It plays
            once, before anything else — the sequence the
            room tells: the warmth arrives, the date settles,
            the card shows itself, the cake, then the song.
            z-0, after the doodles and before all content:
            the light washes the room's atmosphere, never a
            word of the letter itself */}
        {!reduce && (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(120% 85% at 50% 18%, rgba(242,190,140,0.14) 0%, rgba(122,38,56,0.16) 38%, rgba(22,7,9,0) 72%)",
            }}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: [0, 1, 0.45, 0], scale: [1.04, 1, 0.99, 1] }}
            transition={{
              duration: 2.4,
              times: [0, 0.3, 0.66, 1],
              ease: "easeOut",
            }}
          />
        )}

        {/* while she holds her wish, the room falls quieter */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] bg-[#160709] transition-opacity duration-700"
          style={{ opacity: quiet ? 0.35 : 0 }}
        />

        <div className="relative">
          {/* the arrival sequence — like opening a birthday
              letter: the date settles first, the card shows
              itself, then the cake, and the little song is
              found last, further down the room */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduce ? 0 : 0.6,
              delay: reduce ? 0 : 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {daysLeft > 0 ? (
              /* the countdown line alone — the date itself lives
                 once, stamped on the birthday card below, so the
                 room never says the same date twice */
              <p className="text-center font-hand text-xl text-rose/85">
                {birthday.upcomingTemplate.replace("{days}", String(daysLeft))}
              </p>
            ) : daysLeft === 0 ? (
              <p className="text-center font-hand text-xl text-rose/85 animate-soft-glow">
                {birthday.todayLine}
              </p>
            ) : (
              <p className="text-center font-hand text-xl text-rose/85">
                {birthday.keepsakeLine}
              </p>
            )}
          </motion.div>

          {/* the cream birthday card — dims a little during the wish */}
          <div
            className="mx-auto mt-9 max-w-md transition-opacity duration-700"
            style={{ opacity: quiet ? 0.45 : 1 }}
          >
            <Reveal delay={reduce ? 0 : 0.32}>
              <div className="relative rotate-[-1.2deg] rounded-lg bg-cream p-7 text-ink polaroid-shadow sm:p-9">
                <TapeStrip className="-top-2.5 left-8 w-12 rotate-[-6deg]" />
                <TapeStrip className="-top-2.5 right-8 w-12 rotate-[5deg]" />

                <p className="flex items-center justify-center gap-2 text-center text-[10px] uppercase tracking-[0.3em] text-[#8a4a5c]">
                  {/* the date stamp — while the day is still coming or
                      here; once it has passed, the keepsake line above
                      carries the date, and the card keeps only its heart */}
                  {daysLeft >= 0 && <Ltr>{birthday.prettyDate}</Ltr>}
                  {/* a small hand-drawn heart, beside the date */}
                  <span
                    aria-hidden
                    className="inline-block h-[11px] w-[11px] rotate-[10deg] opacity-60"
                  >
                    <HeartOutline color="#651C2D" />
                  </span>
                </p>
                <p className="mt-4 text-center font-display text-[92px] leading-none text-burgundy">
                  {birthday.age}
                </p>
                <p className="mt-1 text-center text-[11px] uppercase tracking-[0.3em] text-ink-soft/70">
                  {ui.birthdayUi.yearsOfYou}
                </p>
                <p className="mt-5 text-center font-display text-xl italic text-ink">
                  {birthday.message}
                </p>

                <ul className="mx-auto mt-6 max-w-[300px] space-y-2.5">
                  {birthday.wishes.map((w) => (
                    <li
                      key={w}
                      className="flex items-start gap-2.5 text-start font-body text-[15px] leading-relaxed text-ink-soft"
                    >
                      <Heart
                        className="mt-[7px] h-3 w-3 shrink-0 text-burgundy"
                        fill="currentColor"
                        strokeWidth={0}
                        aria-hidden
                      />
                      {w}
                    </li>
                  ))}
                </ul>

                <div className="mt-8 flex justify-center">
                  <div className="relative rotate-[2deg]">
                    <TapeStrip className="-top-2.5 left-1/2 w-14 -translate-x-1/2" />
                    <img
                      src={birthday.photo}
                      alt={birthday.photoAlt}
                      loading="lazy"
                      className="w-52 rounded-[2px] border-[10px] border-[#fffdfb] polaroid-shadow"
                    />
                    <p className="mt-1.5 text-center font-hand text-lg text-ink-soft">
                      {birthday.photoCaption}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* the little cake, and the ritual */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.48 }}
          >
            <CakeScene
              onQuiet={setQuiet}
              onWishSong={onWishSong}
              songFallback={songFallback}
            />
          </motion.div>

          {/* the little birthday song — a private gift hidden
              in the room, found after the cake. It reveals
              itself only when she reaches it, and it never
              follows her out of this room */}
          <BirthdaySongCard />
        </div>
      </div>

      <ChapterNav current="birthday" onNavigate={onNavigate} />
    </div>
  );
}
