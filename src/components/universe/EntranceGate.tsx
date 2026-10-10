"use client";

/* ————————————————————————————————————————————————
   the entrance — one sealed aged-ivory envelope on the
   dark wine, held shut by a matte deep-burgundy wax
   seal. A treasured old letter kept in a wooden drawer:
   the paper is muted parchment (#e8ddd3), the folds
   only slightly lighter, the shadows dusty taupe. The
   right word cracks the seal, the flap folds open into
   warm paper light, and Home begins.
———————————————————————————————————————————————— */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { useContent, useLang } from "./Lang";
import ScrapbookDoodles from "./ScrapbookDoodles";
import { BackdropMarks } from "./ScrapbookBackdrop";
import { lsSet } from "@/lib/localStorage";
import { startSiteSong } from "@/lib/realAudio";
import { cn } from "@/lib/utils";

/* a few wandering dust motes in the dark — visible
   enough now to read as air, not noise */
const DUST = [
  { left: "18%", top: "22%", dx: "9px", delay: "1.2s", dur: "11s" },
  { left: "74%", top: "18%", dx: "-8px", delay: "3.6s", dur: "12s" },
  { left: "30%", top: "72%", dx: "7px", delay: "5.4s", dur: "10.5s" },
  { left: "84%", top: "64%", dx: "-10px", delay: "7.8s", dur: "12.5s" },
  { left: "12%", top: "48%", dx: "8px", delay: "2.4s", dur: "13s" },
  { left: "62%", top: "82%", dx: "-6px", delay: "6.6s", dur: "11.5s" },
  { left: "46%", top: "10%", dx: "6px", delay: "4.2s", dur: "10s" },
  { left: "22%", top: "38%", dx: "-7px", delay: "0.6s", dur: "12.8s" },
];

/* the cover's great ink washes — two soft regions of
   deep burgundy drifting through the sealed dark, the
   way ink keeps moving through paper long after the
   pen has gone. Each on its own very long rhythm, in
   its own direction, so the cover never reads as a
   looping wallpaper */
interface GateWash {
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
  w: string;
  h: string;
  rgb: string;
  alpha: number;
  wdx: string;
  wdy: string;
  dur: string;
  delay: string;
}

const WASHES: GateWash[] = [
  {
    left: "-14%",
    top: "-18%",
    w: "w-[420px] sm:w-[620px]",
    h: "h-[380px] sm:h-[540px]",
    rgb: "101, 28, 45",
    alpha: 0.2,
    wdx: "26px",
    wdy: "20px",
    dur: "96s",
    delay: "-30s",
  },
  {
    right: "-16%",
    bottom: "-14%",
    w: "w-[400px] sm:w-[600px]",
    h: "h-[360px] sm:h-[520px]",
    rgb: "122, 38, 56",
    alpha: 0.17,
    wdx: "-30px",
    wdy: "-18px",
    dur: "112s",
    delay: "-64s",
  },
];

/* a few paper flecks sinking slowly past the cover —
   dust and scraps falling through candle-lit air, each
   at its own pace and its own angle, visible within
   the first seconds of the scene being still */
const FLECKS = [
  { left: "14%", sway: "22px", peak: 0.22, dur: "24s", delay: "0.8s", w: 7, h: 9 },
  { left: "68%", sway: "-30px", peak: 0.26, dur: "31s", delay: "5.5s", w: 8, h: 11 },
  { left: "41%", sway: "18px", peak: 0.18, dur: "27s", delay: "11s", w: 6, h: 8 },
  { left: "86%", sway: "-24px", peak: 0.2, dur: "34s", delay: "17s", w: 7, h: 10 },
  { left: "27%", sway: "-16px", peak: 0.16, dur: "37s", delay: "23s", w: 5, h: 7 },
];

const EASE = [0.22, 1, 0.36, 1] as const;

/* when the language changes, the words on the letter soften
   and rewrite themselves — nothing else moves */
function FadeLang({ children }: { children: React.ReactNode }) {
  const { lang } = useLang();
  return (
    <motion.span
      key={lang}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="inline"
    >
      {children}
    </motion.span>
  );
}

/** the deep-burgundy wax — one matte, tactile blob, split by the crack */
function WaxBlob() {
  return (
    <div
      className={[
        "flex h-full w-full rotate-[-3deg] items-center justify-center",
        "rounded-[46%_54%_52%_48%/54%_46%_52%_48%]",
        "bg-[linear-gradient(135deg,#62202f_0%,#521627_50%,#3c0f1f_100%)]",
        "shadow-[0_2px_7px_-2px_rgba(28,10,15,0.38),inset_0_1px_3px_rgba(232,204,210,0.15),inset_0_-2px_4px_rgba(20,5,10,0.32)]",
      ].join(" ")}
    >
      <Heart
        className="h-[18px] w-[18px] text-[#e8ccd2]"
        fill="currentColor"
        strokeWidth={0}
        aria-hidden
      />
    </div>
  );
}

export default function EntranceGate({
  onUnlocked,
}: {
  onUnlocked: () => void;
}) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [stay, setStay] = useState(false);
  const [focused, setFocused] = useState(false);
  /** the seal cracks, the flap opens, the light rises */
  const [opening, setOpening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const reduce = useReducedMotion();
  const { gate, song } = useContent();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  /* if the keyboard ever crowds the input, bring it home */
  const handleFocus = () => {
    setFocused(true);
    const el = inputRef.current;
    if (!el) return;
    window.setTimeout(() => {
      const r = el.getBoundingClientRect();
      const vh = window.visualViewport?.height ?? window.innerHeight;
      if (r.bottom > vh - 96 || r.top < 40) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
      }
    }, 250);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (opening) return;
    if (value.trim().toLowerCase() === gate.password.trim().toLowerCase()) {
      if (stay) lsSet("unlocked", true);
      /* the song of this little universe rises with the open
         letter — tried here, inside her own keypress, because
         this is the one moment the browser still listens.
         If it refuses, it refuses quietly: the little scrap
         downstairs keeps its play button breathing instead */
      startSiteSong(song.siteSong.audioUrl);
      setOpening(true);
      /* the letter opens into light, then Home begins */
      window.setTimeout(() => onUnlocked(), reduce ? 80 : 1320);
    } else {
      setError(true);
      setValue("");
      window.setTimeout(() => setError(false), 2200);
      inputRef.current?.focus();
    }
  };

  /* the envelope itself — placed, shaken, or dissolving */
  const envelopeAnimate = opening
    ? { opacity: 0, x: 0, y: reduce ? 0 : -7, rotate: -0.55, scale: 1.015 }
    : error
      ? {
          opacity: 1,
          y: 0,
          scale: 1,
          x: reduce ? 0 : [0, -7, 7, -5, 5, -3, 0],
          rotate: reduce ? -0.55 : [0, -0.8, 0.8, -0.5, 0.5, -0.3, 0],
        }
      : { opacity: 1, x: 0, y: 0, rotate: -0.55, scale: 1 };

  const envelopeTransition = opening
    ? { duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.85, ease: "easeInOut" as const }
    : error
      ? { duration: reduce ? 0 : 0.5, ease: "easeInOut" as const }
      : { duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.18, ease: EASE };

  return (
    <motion.div
      /* the cover leaving the scrapbook — not a plain
         fade: the whole sealed page lifts away and grows
         a breath as it goes, like the cover of a book
         being taken off to one side. The seal has already
         cracked, the flap has already opened into light;
         this is the last physical gesture of the opening */
      exit={{
        opacity: 0,
        y: reduce ? 0 : -34,
        scale: reduce ? 1 : 1.045,
        rotate: reduce ? 0 : -0.6,
        transition: { duration: reduce ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] },
      }}
      className="fixed inset-0 z-50 overflow-y-auto overflow-x-clip"
      style={{ backgroundColor: "#120b0e" }}
    >
      {/* ——— the quiet dark: a subtle burgundy vignette ——— */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.6 }}
        className="pointer-events-none fixed inset-0"
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(130% 100% at 50% 38%, transparent 42%, rgba(90,23,41,0.15) 74%, rgba(18,11,14,0.6) 100%)",
          }}
        />
        {/* the living dark — the same hand-drawn marks that
            live inside the universe, drawn here quieter still,
            so the sealed stage does not feel dead. When the
            right word is found, they lift and warm, like the
            page itself waking up to let her in */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          initial={false}
          animate={{
            y: opening && !reduce ? -16 : 0,
            filter: opening ? "brightness(1.45)" : "brightness(1)",
          }}
          transition={{ duration: reduce ? 0 : 1.15, ease: "easeOut" }}
        >
          {/* the cover's great ink washes, drifting — deep
              burgundy moving slowly through the sealed dark */}
          {WASHES.map((w, i) => (
            <div
              key={`wash-${i}`}
              aria-hidden
              className={cn(
                "gate-wash pointer-events-none absolute rounded-[100%]",
                w.w,
                w.h,
              )}
              style={
                {
                  left: w.left,
                  right: w.right,
                  top: w.top,
                  bottom: w.bottom,
                  background: `radial-gradient(closest-side, rgba(${w.rgb}, ${w.alpha}) 0%, rgba(${w.rgb}, ${w.alpha * 0.45}) 48%, transparent 74%)`,
                  "--wdx": w.wdx,
                  "--wdy": w.wdy,
                  "--wd-dur": w.dur,
                  "--wd-delay": w.delay,
                } as React.CSSProperties
              }
            />
          ))}
          <ScrapbookDoodles variant="gate" />
          {/* the larger faint composition marks — an oversized
              heart half off the edge, an unclosed circle, a
              quiet constellation: the sealed stage already
              belongs to the decorated universe, and wakes with
              it when the right word is found */}
          <BackdropMarks variant="gate" />
          {/* a second line of handwriting, high on the left —
              too faint to read, surfacing and sinking on its
              own slow rhythm, like a thought passing through
              the paper while she looks for the word */}
          <svg
            viewBox="0 0 150 24"
            aria-hidden
            className="doodle-fade pointer-events-none absolute left-[4%] top-[14%] hidden h-6 w-[150px] sm:block"
            style={{ "--d-min": 0.08, "--d-max": 0.34, "--d-dur": "13s", "--d-delay": "-4s" } as React.CSSProperties}
          >
            <path
              d="M4 15 C 10 5, 16 5, 18 13 C 20 20, 27 19, 32 10 C 37 3, 45 4, 47 12 C 49 19, 57 18, 63 9 C 68 2, 76 3, 78 11 C 80 18, 89 17, 95 8 C 100 2, 108 3, 110 10 C 112 16, 121 15, 127 7 C 132 2, 140 3, 144 9"
              stroke="#B77C8D"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </motion.div>
        {/* one faint warm breath behind the letter — and it
            breathes: swelling and easing over nine slow
            seconds, the candle-glow of the room this letter
            is waiting to be read in */}
        <div
          aria-hidden
          className={cn(
            "absolute left-1/2 top-[40%] h-[380px] w-[320px] -translate-x-1/2 rounded-full bg-[#7a2438]/18 blur-[90px]",
            !reduce && "gate-glow",
          )}
        />
        {/* the paper flecks, sinking past the cover through
            the candle-lit air — the scene is alive from its
            very first seconds */}
        {FLECKS.map((f, i) => (
          <span
            key={`fleck-${i}`}
            aria-hidden
            className={cn(
              "pointer-events-none absolute top-0 rounded-[1.5px]",
              !reduce && "fleck-fall",
            )}
            style={
              {
                left: f.left,
                width: f.w,
                height: f.h,
                background: "rgba(236,225,216,0.85)",
                boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
                "--fl-sway": f.sway,
                "--fl-peak": f.peak,
                "--fl-dur": f.dur,
                "--fl-delay": f.delay,
              } as React.CSSProperties
            }
          />
        ))}
        {/* the door, quietly opening: a tiny warm light rising
            from the letter across the whole dark — never a
            flash, only the page brightening by a breath */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: opening ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : 0.95, delay: reduce ? 0 : 0.35, ease: "easeOut" }}
          style={{
            background:
              "radial-gradient(120% 90% at 50% 42%, rgba(242,206,160,0.1) 0%, rgba(122,38,56,0.05) 45%, transparent 72%)",
          }}
        />
        {DUST.map((d, i) => (
          <span
            key={i}
            aria-hidden
            className="gate-dust absolute h-[3px] w-[3px] rounded-full bg-cream"
            style={
              {
                left: d.left,
                top: d.top,
                "--dx": d.dx,
                "--dust-peak": 0.09,
                animationDuration: d.dur,
                animationDelay: d.delay,
              } as React.CSSProperties
            }
          />
        ))}
      </motion.div>

      <div className="relative flex min-h-svh flex-col items-center justify-center px-5 pt-[max(2.5rem,env(safe-area-inset-top))] pb-[max(2.5rem,env(safe-area-inset-bottom))]">
        <motion.div
          initial={{
            opacity: 0,
            y: reduce ? 0 : 26,
            rotate: reduce ? -0.55 : 1.2,
            scale: reduce ? 1 : 0.985,
          }}
          animate={envelopeAnimate}
          transition={envelopeTransition}
          className="relative z-10 w-full max-w-[19.5rem] sm:max-w-sm"
        >
          {/* the letter lifts a breath when the word is being written */}
          <div
            className={[
              "relative transition-all duration-500 ease-out",
              focused
                ? "-translate-y-[2px] [box-shadow:0_22px_46px_-16px_rgba(22,11,14,0.66),0_7px_16px_rgba(22,11,14,0.34),inset_0_0_22px_rgba(74,37,48,0.06)]"
                : "[box-shadow:0_16px_36px_-14px_rgba(22,11,14,0.58),0_5px_12px_rgba(22,11,14,0.3),inset_0_0_22px_rgba(74,37,48,0.06)]",
            ].join(" ")}
          >
            {/* a second sheet, tucked just inside the mouth of the envelope */}
            <div
              aria-hidden
              className="absolute -top-[5px] left-5 right-6 h-3 rotate-[0.7deg] rounded-t-[6px] bg-[#f1e8e1] shadow-[0_-1px_3px_rgba(36,16,22,0.18)]"
            />

            {/* ——— the envelope ——— */}
            <div className="relative rounded-[10px_14px_12px_9px] bg-[#e8ddd3] ring-1 ring-[#241016]/10">
              {/* faint paper shading, only on the letter */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[10px_14px_12px_9px] opacity-[0.05] [background-image:radial-gradient(circle_at_18%_12%,rgba(74,37,48,0.5),transparent_55%),radial-gradient(circle_at_84%_88%,rgba(74,37,48,0.4),transparent_50%)]"
              />
              {/* barely visible warm paper tooth — aged ivory grain */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[10px_14px_12px_9px] opacity-[0.05]"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='gn'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23gn)' opacity='0.7'/%3E%3C/svg%3E\")",
                  filter: "sepia(45%)",
                }}
              />

              {/* ——— the flap, folded down over the top ——— */}
              <div className="relative h-40 sm:h-44" style={{ perspective: "900px" }}>
                {/* warm paper light, rising from inside as it opens */}
                {opening && (
                  <motion.div
                    aria-hidden
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: reduce ? 0 : 0.85, delay: reduce ? 0 : 0.25, ease: "easeOut" }}
                    className="absolute inset-x-4 top-2 h-44"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 62%, rgba(242,206,160,0.9) 0%, rgba(226,170,128,0.36) 40%, rgba(122,38,56,0.1) 68%, transparent 84%)",
                    }}
                  />
                )}
                {/* the letter inside, catching that light */}
                {opening && (
                  <motion.div
                    aria-hidden
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.35, ease: EASE }}
                    className="absolute inset-x-11 top-4 h-24 rounded-[3px] bg-[#efe5db] shadow-[0_2px_8px_rgba(36,16,22,0.18)]"
                  />
                )}
                {/* the fold's soft shadow cast onto the face */}
                <motion.div
                  aria-hidden
                  initial={false}
                  animate={{ opacity: opening ? 0 : 0.55 }}
                  transition={{ duration: 0.3 }}
                  className="pointer-events-none absolute inset-x-0 top-[5px] h-full [clip-path:polygon(0_0,100%_0,50%_100%)] bg-[#4a2530]/[0.16] blur-[3px]"
                />
                {/* the flap itself — it swings open around the top fold */}
                <motion.div
                  aria-hidden
                  initial={false}
                  animate={
                    opening
                      ? { rotateX: reduce ? 0 : -167, opacity: reduce ? 0 : 0.15 }
                      : { rotateX: 0, opacity: 1 }
                  }
                  transition={
                    opening
                      ? { duration: 0.9, delay: 0.25, ease: EASE }
                      : { duration: 0.3 }
                  }
                  className="absolute inset-0 [clip-path:polygon(0_0,100%_0,50%_100%)]"
                  style={{
                    transformPerspective: 900,
                    background:
                      "linear-gradient(178deg,#f1e8e1 0%,#ece1d8 58%,#e2d6ca 100%)",
                    transformOrigin: "50% 0%",
                    filter: "drop-shadow(0 1.5px 1px rgba(36,16,22,0.14))",
                  }}
                />
              </div>

              {/* ——— the wax seal, holding the flap to the letter ——— */}
              <div className="absolute left-1/2 top-[132px] -translate-x-1/2 sm:top-[148px]">
                <div className="relative h-14 w-14">
                  {/* a warm glow while the little word is being written */}
                  <span
                    aria-hidden
                    className={[
                      "pointer-events-none absolute -inset-4 rounded-full blur-lg transition-opacity duration-500",
                      focused ? "opacity-100" : "opacity-0",
                    ].join(" ")}
                    style={{
                      background:
                        "radial-gradient(circle, rgba(236,172,131,0.32) 0%, rgba(236,172,131,0.1) 45%, transparent 70%)",
                    }}
                  />
                  {!opening ? (
                    <>
                      {/* its resting halo — barely there */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -inset-2 rounded-full bg-burgundy/15 blur-md"
                      />
                      <div className="seal-pulse relative h-full w-full">
                        <WaxBlob />
                      </div>
                    </>
                  ) : (
                    <>
                      {/* the seal, cracked through the heart — two halves parting */}
                      <div
                        aria-hidden
                        className="absolute inset-0"
                        style={{
                          clipPath: "inset(-30% 51% -30% -10%)",
                          animation: reduce
                            ? undefined
                            : "seal-left 0.55s cubic-bezier(0.22,1,0.36,1) forwards",
                          ...(reduce ? { opacity: 0 } : {}),
                        }}
                      >
                        <WaxBlob />
                      </div>
                      <div
                        aria-hidden
                        className="absolute inset-0"
                        style={{
                          clipPath: "inset(-30% -10% -30% 51%)",
                          animation: reduce
                            ? undefined
                            : "seal-right 0.55s cubic-bezier(0.22,1,0.36,1) forwards",
                          ...(reduce ? { opacity: 0 } : {}),
                        }}
                      >
                        <WaxBlob />
                      </div>
                      {/* one tiny burgundy paper heart, set free by the opening */}
                      {!reduce && (
                        <motion.div
                          aria-hidden
                          initial={{ y: 10, opacity: 0, rotate: -10, scale: 0.75 }}
                          animate={{ y: -44, opacity: [0, 1, 1, 0], rotate: 7, scale: 1 }}
                          transition={{
                            duration: 0.95,
                            delay: 0.4,
                            times: [0, 0.18, 0.72, 1],
                            ease: "easeOut",
                          }}
                          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
                        >
                          <Heart
                            className="h-4 w-4 text-[#8a3a4e]"
                            fill="currentColor"
                            strokeWidth={0}
                          />
                        </motion.div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* ——— the face of the letter ——— */}
              <div className="relative px-7 pb-8 pt-12 text-center sm:px-9">
                <motion.div
                  initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.5, ease: EASE }}
                >
                  <h1 className="font-display text-[13px] font-medium uppercase leading-[1.7] tracking-[0.18em] text-ink text-balance sm:text-[15px]">
                    <FadeLang>{gate.title}</FadeLang>
                  </h1>
                  {/* the thin burgundy thread, drawing itself beneath the title */}
                  <svg
                    viewBox="0 0 240 12"
                    aria-hidden
                    className="thread-draw mx-auto mt-2 block h-3 w-40 sm:w-48"
                  >
                    <path
                      d="M4 7 C 52 3.4, 96 10.4, 148 6.4 S 208 4.2, 236 6.8"
                      fill="none"
                      stroke="#5a1729"
                      strokeWidth="1.3"
                      strokeLinecap="round"
                      opacity="0.75"
                    />
                  </svg>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.62, ease: EASE }}
                  className="mt-4 font-display text-[1.05rem] italic leading-snug text-ink-soft/90 sm:text-lg"
                >
                  “<FadeLang>{gate.quote}</FadeLang>”
                </motion.p>

                <motion.form
                  onSubmit={submit}
                  noValidate
                  className="group mt-7"
                  initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.72, ease: EASE }}
                >
                  <motion.label
                    htmlFor="gate-code"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.85, ease: "easeOut" }}
                    className="block text-[10px] uppercase tracking-[0.3em] text-[#8a4a5c] transition-colors duration-300 group-focus-within:text-[#7a3244]"
                  >
                    <FadeLang>{gate.label}</FadeLang>
                  </motion.label>

                  <motion.div
                    className="gate-input-wrapper relative mt-2.5"
                    initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 0.95, ease: EASE }}
                  >
                    <input
                      ref={inputRef}
                      id="gate-code"
                      type="password"
                      dir="ltr"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      onFocus={handleFocus}
                      onBlur={() => setFocused(false)}
                      autoComplete="off"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      placeholder="••••"
                      aria-invalid={error}
                      aria-describedby="gate-error"
                      className="w-full border-b-2 border-[#8a4a5c]/50 bg-transparent py-2.5 text-center text-2xl tracking-[0.45em] text-ink caret-[#7a2438] outline-none transition-colors duration-300 placeholder:text-[#8a4a5c]/40 focus:border-burgundy"
                    />
                    {/* a soft burgundy ember under the ink line while writing */}
                    <span
                      aria-hidden
                      className="gate-input-glow pointer-events-none absolute inset-x-[12%] bottom-0 h-[3px] rounded-full bg-burgundy/50 opacity-0 blur-[7px] transition-opacity duration-300"
                    />
                  </motion.div>

                  <div className="h-8">
                    <AnimatePresence>
                      {error && !opening && (
                        <motion.p
                          id="gate-error"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="pt-2.5 font-hand text-lg leading-tight text-[#8a4a5c]"
                          role="alert"
                        >
                          <FadeLang>{gate.error}</FadeLang>
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: reduce ? 0 : 0.55, delay: reduce ? 0 : 1.12, ease: EASE }}
                  >
                    <motion.button
                      type="submit"
                      whileHover={reduce ? undefined : { scale: 1.025 }}
                      whileTap={reduce ? undefined : { scale: 0.955 }}
                      transition={{ type: "spring", stiffness: 380, damping: 20 }}
                      className="group/btn relative rounded-full bg-[#5a1729] px-9 py-3 text-sm tracking-wide text-[#f1e8e1] shadow-[0_2px_8px_-2px_rgba(28,10,15,0.45)] transition-colors duration-300 hover:bg-[#6d2133] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/70"
                    >
                      {/* a soft rose halo, gathering behind the wax
                          as her cursor considers it */}
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -inset-1.5 rounded-full opacity-0 blur-md transition-opacity duration-500 group-hover/btn:opacity-100"
                        style={{
                          background:
                            "radial-gradient(closest-side, rgba(183,124,141,0.42), rgba(101,28,45,0.14) 62%, transparent 78%)",
                        }}
                      />
                      <span className="relative">
                        <FadeLang>{gate.unsealLabel}</FadeLang>
                      </span>
                    </motion.button>
                  </motion.div>
                </motion.form>
              </div>
            </div>
          </div>
        </motion.div>

        <label
          className="relative z-10 mt-7 flex cursor-pointer select-none items-center justify-center gap-2.5 text-xs text-rose-soft/80"
        >
          <span className="relative flex h-[18px] w-[18px] items-center justify-center">
            <input
              type="checkbox"
              checked={stay}
              onChange={(e) => setStay(e.target.checked)}
              className="peer sr-only"
            />
            <span className="h-[18px] w-[18px] rounded-[5px] border border-rose/40 transition-colors peer-checked:border-rose peer-checked:bg-burgundy/70" />
            <Heart
              className="absolute h-2.5 w-2.5 text-cream opacity-0 transition-opacity peer-checked:opacity-100"
              fill="currentColor"
              strokeWidth={0}
            />
          </span>
          <FadeLang>{gate.stayUnlockedLabel}</FadeLang>
        </label>
      </div>
    </motion.div>
  );
}
