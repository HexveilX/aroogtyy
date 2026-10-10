"use client";

/* ————————————————————————————————————————————————
   The language jewel.

   Not a control, not a widget — a tiny charm from the
   universe itself, and it has a home: the first mark on
   every page, resting in the paper's start margin. It
   arrives with the page, and when she scrolls, it does
   the most natural thing in the world — it leaves, with
   the rest of the page. Nothing follows her. The
   language of this universe lives here, quietly, the
   way a date lives in the corner of a letter.

   At rest the charm is almost nothing: the name of the
   language being spoken, and one small star beside it —
   almost completely still, because stars don't fidget.
   Its life is rare rather than constant: every so often
   (nine to sixteen seconds apart, only while resting,
   never during the ceremony) a mote — three pixels of
   rose — makes one slow ellipse around the jewel, the
   way a moon passes its planet, slipping behind the
   pill at the diagonals and fading as it comes home.
   And as it passes nearest the star, the star glints
   once, softly, in answer. A minute on the page and she
   might see it twice — that is the point. It is not an
   animation added to a button; it is a small piece of
   this universe's sky that happens to live here.

   Touched — and this all happens inside a quarter
   second — the charm gives the smallest press, opens
   just wide enough for both languages to be seen, the
   star crosses to the other word on a gently curved
   flight trailing a breath of light, and the charm
   closes around the new language like a locket. The
   words change the instant she touches it; the little
   ceremony is only the ribbon.

   The star is the only metaphor: a spark that lives
   beside whichever word is being spoken — English
   carries it on its right, عربي on its left — and when
   she touches the jewel it simply travels to the other
   word. Nothing spins, nothing bounces. You almost
   don't notice it until you touch it.

   The charm never mirrors: English keeps its physical
   left, عربي keeps its physical right, in both
   directions of the universe — and because the page
   always speaks the language it shows, the word being
   spoken never has to travel when the locket opens.
———————————————————————————————————————————————— */

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLang } from "./Lang";
import { cn } from "@/lib/utils";

/* ——— the jewel's geometry, in physical pixels ———
   EN occupies a 30px page, عربي a 36px page, the star
   an 8px seat. Resting widths hug one word plus the
   star; the open width holds both words with air. */
const W_REST_EN = 68;
const W_REST_AR = 76;
const W_OPEN = 138;

const POS = {
  /* resting, speaking English — the star sleeps right of EN */
  restEn: { en: 11, ar: 76, spark: 49 },
  /* resting, speaking Arabic — the star sleeps left of عربي */
  restAr: { en: -32, ar: 28, spark: 12 },
  /* open, English holding the star */
  openEn: { en: 17, ar: 87, spark: 49 },
  /* open, Arabic holding the star */
  openAr: { en: 17, ar: 87, spark: 79 },
} as const;

/* ——— the little ceremony's clock ———
   Timers are milliseconds; framer durations are seconds
   (the classic trap — kept separate on purpose). The main
   gesture — press, open, travel, indicate — is over by
   ~300ms; the collapse and the star's one settling
   heartbeat follow. */
const MS_DWELL = 430;
const MS_BEAT = 620;

/* ——— the charm's quiet sky ———
   One mote, one slow ellipse, then stillness again. The
   pass clears the pill's ends by 12px and is flattened
   to 45% of that width, so it hugs the charm like an
   orbit rather than a circle. Direction follows the
   reading — the mote crosses the top of the jewel
   moving with the words. And the star answers exactly
   when the mote passes closest to its seat: in English
   that is late in the lap (coming home); in Arabic,
   early (on its way out) — both fall out of the same
   POS geometry, measured from the star's centre. */
const MS_PASS = 2600;
const MOTE_STEPS = 24;
const MOTE_RISE = 12;
const MOTE_SQUASH = 0.45;
const GLINT_AT = { en: 2130, ar: 840 } as const;

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const EASE_SOFT: [number, number, number, number] = [0.5, 0, 0.2, 1];
const CREAM = "#f8f1ed";
const CREAM_DIM = "rgba(248,241,237,0.45)";

/** the spark itself — still at rest; its life is in its rare glints */
function SparkGlyph() {
  return (
    <span className="block h-full w-full">
      <svg
        viewBox="0 0 10 10"
        aria-hidden
        fill="currentColor"
        className="h-full w-full text-rose drop-shadow-[0_0_3px_rgba(201,132,151,0.55)] transition-[filter] duration-300 group-hover:drop-shadow-[0_0_6px_rgba(201,132,151,0.95)]"
      >
        <path d="M5 0 C5.55 3.2, 6.8 4.45, 10 5 C6.8 5.55, 5.55 6.8, 5 10 C4.45 6.8, 3.2 5.55, 0 5 C3.2 4.45, 4.45 3.2, 5 0 Z" />
      </svg>
    </span>
  );
}

export function LangToggle({
  variant = "light",
  className,
}: {
  /** light sits on paper; dark sits on the sealed stage */
  variant?: "light" | "dark";
  className?: string;
}) {
  const { isArabic, toggle } = useLang();
  const reduce = useReducedMotion();

  /* the locket's little life: open / a breath of light /
     the star's landing — all transient, all ignorable */
  const [open, setOpen] = useState(false);
  const [sweep, setSweep] = useState(0);
  const [land, setLand] = useState(0);

  /* the quiet sky: one mote's pass, and the star's answer */
  const [mote, setMote] = useState(0);
  const [moteLive, setMoteLive] = useState(false);
  const [glint, setGlint] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const list = timers.current;
    return () => {
      list.forEach((id) => window.clearTimeout(id));
      list.length = 0;
    };
  }, []);

  /* the sky keeps its own time — a visit every nine to
     sixteen seconds, only while the charm rests, forever
     re-arming itself. The effect re-runs whenever the
     ceremony opens (or the language turns), which clears
     the pending visit and waits afresh — so a pass can
     never collide with the locket's moment; and if she
     isn't looking (tab hidden), this visit is simply
     skipped and the next is armed in its place. */
  useEffect(() => {
    if (reduce) return;
    let id: number | undefined;
    const arm = () => {
      id = window.setTimeout(visit, 9000 + Math.random() * 7000);
    };
    const visit = () => {
      if (document.hidden) {
        arm();
        return;
      }
      setMote((m) => m + 1);
      setMoteLive(true);
      /* the star answers as the mote passes closest —
         EN: arriving home at the end of the lap;
         AR: outbound, early in the lap */
      timers.current.push(
        window.setTimeout(
          () => setGlint((g) => g + 1),
          isArabic ? GLINT_AT.ar : GLINT_AT.en,
        ),
      );
      arm(); /* and the sky goes on keeping its own time */
    };
    arm();
    return () => window.clearTimeout(id);
  }, [reduce, open, isArabic]);

  const handleTap = () => {
    /* the universe rewrites itself this very instant —
       the ceremony is only the ribbon around it */
    toggle();
    if (reduce) return;
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current.length = 0;
    setMoteLive(false); /* the ceremony takes the stage; the sky waits */
    setOpen(true);
    setSweep((s) => s + 1);
    /* the locket stays open just long enough for the star
       to be seen crossing, then folds around the new word */
    timers.current.push(window.setTimeout(() => setOpen(false), MS_DWELL));
    /* and the star beats once, softly, where it settles */
    timers.current.push(window.setTimeout(() => setLand((l) => l + 1), MS_BEAT));
  };

  let pos: { en: number; ar: number; spark: number };
  if (open) pos = isArabic ? POS.openAr : POS.openEn;
  else pos = isArabic ? POS.restAr : POS.restEn;

  let capsuleWidth = W_REST_EN;
  if (open) capsuleWidth = W_OPEN;
  else if (isArabic) capsuleWidth = W_REST_AR;

  /* the mote's lap, sampled into keyframes — an ellipse
     around the resting charm, travelled with the reading */
  const moteRx = (isArabic ? W_REST_AR : W_REST_EN) / 2 + MOTE_RISE;
  const moteRy = moteRx * MOTE_SQUASH;
  const moteXs: number[] = [];
  const moteYs: number[] = [];
  for (let i = 0; i <= MOTE_STEPS; i++) {
    const th = (isArabic ? -1 : 1) * (i / MOTE_STEPS) * 2 * Math.PI;
    moteXs.push(+(moteRx * Math.cos(th)).toFixed(2));
    moteYs.push(+(moteRy * Math.sin(th)).toFixed(2));
  }

  /* reduced motion: everything settles instantly, quietly */
  const d = (ms: number) => (reduce ? 0 : ms);

  /* the star's glyph — beating where it lands after a
     tap, glinting when the mote passes, otherwise still */
  const glyph =
    land > 0 && !reduce ? (
      <motion.span
        key={`beat-${land}`}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.4, 0.94, 1.1, 1] }}
        transition={{ duration: 0.42, times: [0, 0.35, 0.6, 0.82, 1] }}
        className="block h-full w-full"
      >
        <SparkGlyph />
      </motion.span>
    ) : glint > 0 && !reduce ? (
      <motion.span
        key={`glint-pulse-${glint}`}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.32, 1] }}
        transition={{ duration: 0.7, times: [0, 0.38, 1], ease: "easeInOut" }}
        className="block h-full w-full"
      >
        <SparkGlyph />
      </motion.span>
    ) : (
      <SparkGlyph />
    );

  return (
    <motion.button
      type="button"
      onClick={handleTap}
      role="switch"
      aria-checked={isArabic}
      aria-label={
        isArabic
          ? "Switch this universe to English"
          : "بدّلي عالمها الصغير للعربية"
      }
      title={isArabic ? "English" : "العربية"}
      whileTap={reduce ? undefined : { scale: 0.94, transition: { duration: 0.08 } }}
      className={cn(
        "group relative inline-flex h-11 select-none items-center justify-start rounded-full",
        "focus-visible:outline-none",
        "[-webkit-tap-highlight-color:transparent]",
        className,
      )}
    >
      {/* the mote — the star's tiny satellite. Rendered before the
          charm and beneath it, so at the diagonals it slips behind
          the pill the way a moon slips behind its planet. It fades
          in, keeps company for one slow lap, and fades out home. */}
      {moteLive && !reduce && (
        <motion.span
          key={`mote-${mote}`}
          aria-hidden
          initial={false}
          animate={{
            x: moteXs,
            y: moteYs,
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            x: { duration: MS_PASS / 1000, ease: "linear" },
            y: { duration: MS_PASS / 1000, ease: "linear" },
            opacity: { duration: MS_PASS / 1000, times: [0, 0.12, 0.86, 1] },
          }}
          onAnimationComplete={() => setMoteLive(false)}
          className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-0 w-0"
        >
          {/* a spark of the star itself — the same four points, five
              pixels small, so it can never read as a stray pixel but
              only as something the star sent out for one slow lap */}
          <span className="block h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 text-rose drop-shadow-[0_0_4px_rgba(201,132,151,0.7)]">
            <svg
              viewBox="0 0 10 10"
              aria-hidden
              fill="currentColor"
              className="h-full w-full"
            >
              <path d="M5 0 C5.55 3.2, 6.8 4.45, 10 5 C6.8 5.55, 5.55 6.8, 5 10 C4.45 6.8, 3.2 5.55, 0 5 C3.2 4.45, 4.45 3.2, 5 0 Z" />
            </svg>
          </span>
        </motion.span>
      )}

      {/* the charm — everything lives inside it, clipped by it */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ width: capsuleWidth }}
        transition={{ duration: d(open ? 0.19 : 0.22), ease: EASE }}
        className={cn(
          "relative flex h-7 items-center overflow-hidden rounded-full border backdrop-blur-md",
          "transition-[border-color] duration-300",
          "group-focus-visible:ring-2 group-focus-visible:ring-rose/60",
          variant === "dark"
            ? "border-rose/20 bg-[#191014]/90 shadow-[0_2px_12px_-5px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(248,241,237,0.06)] group-hover:border-rose/40"
            : "border-rose/25 bg-paper-card/70 shadow-[0_3px_14px_-7px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(248,241,237,0.07)] group-hover:border-rose/45",
        )}
      >
        {/* the soft warmth behind whichever word is being spoken */}
        <motion.span
          initial={false}
          animate={{
            x: isArabic ? pos.ar : pos.en,
            opacity: open ? 0.55 : 0.38,
          }}
          transition={{
            x: { duration: d(open ? 0.19 : 0.22), ease: EASE },
            opacity: { delay: d(0.06), duration: d(0.24) },
          }}
          className="absolute top-1/2 left-0 -mt-2 h-4 w-9 rounded-full bg-rose/25 blur-[10px]"
        />

        {/* a breath of light crossing the charm as the star flies
            (it travels with the star — toward the word being chosen) */}
        {sweep > 0 && !reduce && (
          <motion.span
            key={`sweep-${sweep}`}
            initial={{ x: isArabic ? -86 : 86, opacity: 0 }}
            animate={{ x: isArabic ? 86 : -86, opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="absolute inset-y-[6px] left-1/2 -ml-6 w-12 rounded-full bg-gradient-to-r from-transparent via-cream/25 to-transparent blur-[4px]"
          />
        )}

        {/* English — the left page, never mirrored */}
        <motion.span
          initial={false}
          animate={{ x: pos.en, color: isArabic ? CREAM_DIM : CREAM }}
          transition={{
            x: { duration: d(open ? 0.19 : 0.22), ease: EASE },
            color: { delay: d(0.06), duration: d(0.24) },
          }}
          className="absolute inset-y-0 left-0 z-10 flex w-[30px] items-center justify-center font-display text-[11px] font-medium uppercase leading-none tracking-[0.15em]"
        >
          EN
        </motion.span>

        {/* عربي — the right page, never mirrored */}
        <motion.span
          initial={false}
          animate={{ x: pos.ar, color: isArabic ? CREAM : CREAM_DIM }}
          transition={{
            x: { duration: d(open ? 0.19 : 0.22), ease: EASE },
            color: { delay: d(0.06), duration: d(0.24) },
          }}
          className="absolute inset-y-0 left-0 z-10 flex w-[36px] items-center justify-center font-arabic text-[15px] leading-none"
        >
          عربي
        </motion.span>

        {/* the star — the one moving thing in the charm */}
        <motion.span
          initial={false}
          animate={{ x: pos.spark }}
          transition={{
            x: {
              delay: d(open ? 0.04 : 0),
              duration: d(open ? 0.2 : 0.22),
              ease: open ? EASE_SOFT : EASE,
            },
          }}
          className="absolute top-1/2 left-0 z-20 -mt-1 flex h-2 w-2 items-center justify-center"
        >
          {/* the bloom when the star lands — pressed into the charm */}
          {land > 0 && !reduce && (
            <motion.span
              key={`bloom-${land}`}
              initial={{ scale: 0.6, opacity: 0.5 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-rose/40 blur-[3px]"
            />
          )}

          {/* the star's answer to the passing mote — one soft glint */}
          {glint > 0 && !reduce && (
            <motion.span
              key={`glint-ring-${glint}`}
              initial={{ scale: 0.9, opacity: 0.6 }}
              animate={{ scale: 2.2, opacity: 0 }}
              transition={{ duration: 0.65, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-rose/40 blur-[2px]"
            />
          )}

          {/* each tap, the glyph rides a small arc while its seat
              slides — so the star crosses on a curve, a little
              orbit, rather than a flat slide */}
          {sweep > 0 && !reduce ? (
            <motion.span
              key={`fly-${sweep}`}
              initial={{ y: 3, opacity: 0.7 }}
              animate={{ y: [3, -4, 0], opacity: [0.7, 1, 1] }}
              transition={{ duration: 0.26, times: [0, 0.45, 1], ease: EASE_SOFT }}
              className="relative flex h-full w-full items-center justify-center"
            >
              {glyph}
            </motion.span>
          ) : (
            glyph
          )}
        </motion.span>
      </motion.span>
    </motion.button>
  );
}
