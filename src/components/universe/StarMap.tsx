"use client";

/* ————————————————————————————————————————————————
   "the sky that night —" a small canvas of stars:
   the sky above Cairo, 19 May 2026, with a heart
   constellation quietly drawn between them. Tap the
   sky (or the little button) to catch a falling star.
———————————————————————————————————————————————— */

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useContent } from "./Lang";
import { isArabic } from "@/lib/isArabic";
import { Reveal } from "./Shared";
import { Sparkle as SparkleGlyph } from "./ScrapbookDoodles";

/* deterministic PRNG — the sky is the same every visit */
function mulberry32(seed: number) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Star = {
  x: number;
  y: number;
  r: number;
  a: number;
  tw: number;
  ph: number;
  rose: boolean;
  bright: boolean;
};

type Pt = { x: number; y: number };

/* the heart curve — sampled where it bends */
const HEART_T = [0, 0.75, 1.45, 2.3, 2.9, Math.PI, -2.9, -2.3, -1.45, -0.75];

function heartPoints(w: number, h: number, jitter: () => number): Pt[] {
  const raw = HEART_T.map((t) => ({
    x: 16 * Math.pow(Math.sin(t), 3),
    y: -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)),
  }));
  const cx = w * 0.5;
  const cy = h * 0.52;
  const scale = Math.min(w * 0.0105, h * 0.0102);
  return raw.map((p) => ({
    x: cx + (p.x + (jitter() - 0.5) * 2.2) * scale,
    y: cy + (p.y + 2.5 + (jitter() - 0.5) * 2.2) * scale,
  }));
}

export default function StarMap() {
  const reduce = useReducedMotion();
  const { starMap } = useContent();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  /* the label is redrawn every frame from this ref, so it can
     follow the language without tearing down the sky */
  const heartLabelRef = useRef(starMap.heartLabel);
  useEffect(() => {
    heartLabelRef.current = starMap.heartLabel;
  }, [starMap.heartLabel]);
  const [wished, setWished] = useState(false);
  const [showCaughtLine, setShowCaughtLine] = useState(false);
  const hideTimer = useRef<number | null>(null);
  const fallRef = useRef<{
    t0: number;
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  } | null>(null);
  const startedRef = useRef(false);
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let disposed = false;
    let raf = 0;
    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let heart: Pt[] = [];
    let t0 = 0;
    let labelAlpha = 0;

    const build = () => {
      const rect = canvas.getBoundingClientRect();
      w = Math.max(1, rect.width);
      h = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      /* the same sky every time — seeded by the date */
      const rand = mulberry32(20260519);
      stars = [];
      const count = Math.round((w * h) / 2500);
      for (let i = 0; i < count; i++) {
        const bright = rand() < 0.06;
        stars.push({
          x: rand() * w,
          y: rand() * h,
          r: bright ? 1.1 + rand() * 0.9 : 0.35 + rand() * 1.05,
          a: bright ? 0.8 + rand() * 0.2 : 0.22 + rand() * 0.6,
          tw: 0.35 + rand() * 1.05,
          ph: rand() * Math.PI * 2,
          rose: rand() < 0.12,
          bright,
        });
      }
      heart = heartPoints(w, h, rand);

      if (reduce && startedRef.current) {
        progressRef.current = 1;
        draw(performance.now());
      }
    };

    const draw = (time: number) => {
      /* deep night gradient */
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, "#0a0608");
      sky.addColorStop(0.55, "#150a10");
      sky.addColorStop(1, "#1d0d15");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      /* the field of stars */
      for (const s of stars) {
        const twinkle = reduce
          ? 1
          : 0.7 + 0.3 * Math.sin(time * 0.001 * s.tw + s.ph);
        const alpha = Math.max(0, Math.min(1, s.a * twinkle));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.rose
          ? `rgba(183,124,141,${alpha})`
          : `rgba(248,244,241,${alpha})`;
        ctx.fill();
        if (s.bright) {
          ctx.strokeStyle = `rgba(248,244,241,${alpha * 0.3})`;
          ctx.lineWidth = 0.6;
          const L = s.r * 4.2;
          ctx.beginPath();
          ctx.moveTo(s.x - L, s.y);
          ctx.lineTo(s.x + L, s.y);
          ctx.moveTo(s.x, s.y - L);
          ctx.lineTo(s.x, s.y + L);
          ctx.stroke();
        }
      }

      /* the heart, drawing itself in */
      const p = progressRef.current;
      const segs = heart.length;
      const full = p * segs;
      ctx.strokeStyle = "rgba(183,124,141,0.5)";
      ctx.lineWidth = 1;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let i = 0; i < segs; i++) {
        if (i >= full) break;
        const a = heart[i];
        const b = heart[(i + 1) % segs];
        if (i === 0) ctx.moveTo(a.x, a.y);
        else ctx.lineTo(a.x, a.y);
        const frac = Math.min(1, full - i);
        ctx.lineTo(a.x + (b.x - a.x) * frac, a.y + (b.y - a.y) * frac);
      }
      ctx.stroke();

      /* its stars, arriving as the thread reaches them */
      heart.forEach((pt, i) => {
        const a = Math.max(0, Math.min(1, full - i + 0.35));
        if (a <= 0) return;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 1.9, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(248,244,241,${0.95 * a})`;
        ctx.fill();
        const g = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, 7);
        g.addColorStop(0, `rgba(183,124,141,${0.32 * a})`);
        g.addColorStop(1, "rgba(183,124,141,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 7, 0, Math.PI * 2);
        ctx.fill();
      });

      /* the little handwritten label, once the heart is done */
      if (p >= 0.995) {
        labelAlpha = Math.min(1, labelAlpha + 0.03);
        let font = '"Segoe Script", cursive';
        try {
          const v = getComputedStyle(canvas)
            .getPropertyValue("--font-hand")
            .trim();
          if (v) font = v;
        } catch {
          /* fallback stays */
        }
        const maxX = heart.reduce((m, q) => (q.x > m.x ? q : m), heart[0]);
        const label = heartLabelRef.current;
        ctx.font = `500 ${Math.max(14, Math.round(w * 0.045))}px ${font}`;
        ctx.fillStyle = `rgba(183,124,141,${0.9 * labelAlpha})`;
        ctx.textBaseline = "middle";
        if (isArabic(label)) {
          /* the Arabic label reads right-to-left — anchor its right
             edge at the constellation so it extends leftward */
          ctx.textAlign = "right";
          ctx.fillText(label, maxX.x - 10, maxX.y - 4);
        } else {
          ctx.textAlign = "left";
          ctx.fillText(label, maxX.x + 10, maxX.y - 4);
        }
      }

      /* a falling star, if she asked for one */
      if (fallRef.current) {
        const f = fallRef.current;
        const q = (time - f.t0) / 950;
        if (q >= 1) {
          fallRef.current = null;
        } else {
          const ease = q * q * (3 - 2 * q); // smoothstep
          const x = f.x0 + (f.x1 - f.x0) * ease;
          const y = f.y0 + (f.y1 - f.y0) * ease;
          const qTail = Math.max(0, q - 0.16);
          const tx = f.x0 + (f.x1 - f.x0) * qTail;
          const ty = f.y0 + (f.y1 - f.y0) * qTail;
          const grad = ctx.createLinearGradient(tx, ty, x, y);
          grad.addColorStop(0, "rgba(248,244,241,0)");
          grad.addColorStop(1, "rgba(248,244,241,0.9)");
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(x, y);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(x, y, 1.9, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(248,244,241,0.95)";
          ctx.fill();
        }
      }
    };

    const loop = (time: number) => {
      if (disposed) return;
      if (startedRef.current) {
        const dur = 2400;
        const t = Math.min(1, (time - t0) / dur);
        progressRef.current = reduce ? 1 : 1 - Math.pow(1 - t, 3);
      }
      draw(time);
      raf = requestAnimationFrame(loop);
    };

    build();

    if (reduce) {
      /* still and quiet — the whole sky at once */
      startedRef.current = true;
      progressRef.current = 1;
      draw(performance.now());
      const ro = new ResizeObserver(() => {
        build();
      });
      ro.observe(canvas);
      return () => {
        disposed = true;
        ro.disconnect();
      };
    }

    /* the constellation starts drawing itself when the sky
       first scrolls into view — a small quiet performance */
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && !startedRef.current) {
          startedRef.current = true;
          t0 = performance.now();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      build();
      draw(performance.now());
    });
    ro.observe(canvas);

    raf = requestAnimationFrame(loop);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [reduce]);

  const makeWish = useCallback(() => {
    setWished(true);
    setShowCaughtLine(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(
      () => setShowCaughtLine(false),
      4200
    );

    if (reduce) return; // the line above is the whole show

    const canvas = canvasRef.current;
    if (!canvas || fallRef.current) return;
    const rect = canvas.getBoundingClientRect();
    const fromLeft = Math.random() < 0.5;
    const x0 = fromLeft
      ? rect.width * (0.04 + Math.random() * 0.18)
      : rect.width * (0.78 + Math.random() * 0.18);
    const y0 = rect.height * (0.06 + Math.random() * 0.22);
    fallRef.current = {
      t0: performance.now(),
      x0,
      y0,
      x1: x0 + (fromLeft ? 1 : -1) * rect.width * (0.26 + Math.random() * 0.18),
      y1: y0 + rect.height * (0.3 + Math.random() * 0.22),
    };
  }, [reduce]);

  return (
    <div className="mx-auto mt-16 max-w-xl">
      <Reveal>
        <div className="rounded-2xl border border-rose/10 bg-paper-card/50 px-4 py-8 sm:px-7">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.32em] text-rose/70">
              {starMap.overline}
            </p>
            <h3 className="mt-2.5 font-display text-2xl text-cream sm:text-[1.7rem]">
              {starMap.title}
            </h3>
            <p className="mt-1.5 font-hand text-lg text-rose/75">
              {starMap.sub}
            </p>
          </div>

          {/* the sky itself */}
          <div className="relative mt-6 h-[280px] w-full overflow-hidden rounded-xl ring-1 ring-rose/10 sm:h-[330px]">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={starMap.ariaLabel}
              onClick={makeWish}
              className="h-full w-full"
            />
            {/* two tiny sparkles, breathing at the sky's corners —
                the room's quiet way of being alive; never near
                the center, so they never compete with a star */}
            {!reduce && (
              <>
                <span
                  aria-hidden
                  className="doodle-twinkle pointer-events-none absolute left-[7%] top-[12%] block h-3.5 w-3.5"
                  style={{
                    "--d-min": 0.08,
                    "--d-max": 0.45,
                    "--d-dur": "4.8s",
                    "--d-delay": "-1.4s",
                    "--d-rot": "0deg",
                  } as React.CSSProperties}
                >
                  <SparkleGlyph color="#F8F4F1" />
                </span>
                <span
                  aria-hidden
                  className="doodle-twinkle pointer-events-none absolute bottom-[14%] right-[9%] block h-3 w-3"
                  style={{
                    "--d-min": 0.06,
                    "--d-max": 0.38,
                    "--d-dur": "5.6s",
                    "--d-delay": "-3.1s",
                    "--d-rot": "12deg",
                  } as React.CSSProperties}
                >
                  <SparkleGlyph color="#B77C8D" />
                </span>
              </>
            )}
            {/* a soft vignette, so the sky feels held — it deepens
                for a moment when a star is falling, the room
                going quiet so the star has the dark to itself */}
            <motion.div
              aria-hidden
              initial={false}
              animate={{ opacity: wished && !reduce ? 1 : 0.74 }}
              transition={{ duration: reduce ? 0 : 0.9, ease: "easeOut" }}
              className="pointer-events-none absolute inset-0 rounded-xl"
              style={{
                background:
                  "radial-gradient(ellipse at center, transparent 46%, rgba(7,5,6,0.72) 100%)",
              }}
            />
          </div>

          {/* the wish button + the caught line */}
          <div className="mt-5 flex flex-col items-center gap-3">
            <button
              onClick={makeWish}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-rose/30 px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] text-rose transition-all duration-300 hover:-translate-y-0.5 hover:border-rose/60 hover:bg-wine/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60"
            >
              <Sparkles className="h-4 w-4" strokeWidth={1.6} aria-hidden />
              {wished ? starMap.wishAgainLabel : starMap.wishLabel}
            </button>
            <AnimatePresence>
              {showCaughtLine && (
                <motion.p
                  initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.45 }}
                  className="font-hand text-lg text-rose/80"
                >
                  {starMap.wishCaughtLine}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
