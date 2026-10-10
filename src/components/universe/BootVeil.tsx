"use client";

/* ————————————————————————————————————————————————
   BootVeil — the first half-second of her visit.

   Not a loader: a private scrapbook being opened. Two deep
   burgundy covers, layered like a real book's page block,
   holding a thin warm seam of light down the middle. On the
   closed cover, in handwriting, the only two lines that
   matter before anything else: her name, and "one moment —
   our little world is getting ready for you."

   Then the covers part — the outer page first, the inner
   ones a beat behind, like a hand flipping past the first
   few pages — and whatever she was coming back to (the
   sealed envelope, or the rooms themselves) is already
   arriving underneath.

   No spinner, no progress, no numbers. It stays only as
   long as the first paint needs to settle, and it never
   gets stuck: one timer, always cleared, always fired.
———————————————————————————————————————————————— */

import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { PenStar } from "./ScrapbookDoodles";

/* the strong cinematic ease of covers parting */
const PART: [number, number, number, number] = [0.76, 0, 0.24, 1];
const SOFT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* one side of the closed book — three layers of burgundy
   paper, stepped back from the seam like a real page block.
   The cover is widest; each inner page recedes a little,
   so the seam reads as stacked paper edges, not one flat
   slab. `side` is the OUTER edge ("left" | "right") */
function BookHalf({ side }: { side: "left" | "right" }) {
  const reduce = useReducedMotion();
  const isLeft = side === "left";

  /* each layer: [width class, gradient, exit delay] — the
     cover peels first, the inner pages follow a beat behind,
     like pages being flipped past on the way in. DOM order
     is the stack: cover first, inner pages over it */
  const layers = [
    {
      width: "w-1/2",
      delay: 0.22,
      gradient: isLeft
        ? "linear-gradient(100deg, #190710 0%, #2D0B15 58%, #34101c 100%)"
        : "linear-gradient(260deg, #190710 0%, #2D0B15 58%, #34101c 100%)",
    },
    {
      width: "w-[calc(50%-6px)]",
      delay: 0.34,
      gradient: isLeft
        ? "linear-gradient(100deg, #230a14 0%, #33121f 62%, #3f1626 100%)"
        : "linear-gradient(260deg, #230a14 0%, #33121f 62%, #3f1626 100%)",
    },
    {
      width: "w-[calc(50%-12px)]",
      delay: 0.46,
      gradient: isLeft
        ? "linear-gradient(100deg, #290d18 0%, #381021 62%, #46152a 100%)"
        : "linear-gradient(260deg, #290d18 0%, #381021 62%, #46152a 100%)",
    },
  ];

  return (
    <>
      {layers.map((L, i) => (
        <motion.div
          key={i}
          aria-hidden
          className={`absolute inset-y-0 ${isLeft ? "left-0" : "right-0"} ${L.width}`}
          initial={reduce ? { opacity: 0 } : { x: isLeft ? "-1.5%" : "1.5%", opacity: 0 }}
          animate={
            reduce
              ? { opacity: 1, transition: { duration: 0.3, delay: i * 0.05 } }
              : { x: "0%", opacity: 1, transition: { duration: 0.7, delay: i * 0.06, ease: SOFT } }
          }
          exit={
            reduce
              ? { opacity: 0, transition: { duration: 0.35, delay: i * 0.06 } }
              : {
                  x: isLeft ? "-102%" : "102%",
                  transition: { duration: 0.85, delay: L.delay, ease: PART },
                }
          }
          style={{
            background: L.gradient,
            /* the paper grain — tiny cream specks over the wine,
               the texture of a cover that has been held */
            backgroundImage:
              "radial-gradient(rgba(248,244,241,0.05) 1px, transparent 1.3px), " +
              L.gradient,
            backgroundSize: "22px 22px, cover",
            backgroundRepeat: "repeat, no-repeat",
          }}
        />
      ))}
    </>
  );
}

export default function BootVeil() {
  const reduce = useReducedMotion();

  /* four tiny pen stars, keeping the closed cover company —
     each on its own slow rhythm, quiet enough to stay a
     paper doodle rather than a sparkle show */
  const stars: {
    left: string;
    top?: string;
    bottom?: string;
    dur: string;
    delay: string;
    color: string;
    size: number;
  }[] = [
    { left: "19%", top: "25%", dur: "5.2s", delay: "-1.2s", color: "#E7CDD4", size: 12 },
    { left: "72%", top: "31%", dur: "6.4s", delay: "-3.4s", color: "#B77C8D", size: 9 },
    { left: "24%", bottom: "21%", dur: "5.8s", delay: "-2.1s", color: "#B77C8D", size: 10 },
    { left: "70%", bottom: "27%", dur: "6.9s", delay: "-4.8s", color: "#E7CDD4", size: 12 },
  ];

  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-[110] overflow-hidden"
      /* the veil holds still while the covers part, then lets
         go of whatever remains in the last quiet moment */
      exit={
        reduce
          ? { opacity: 0, transition: { duration: 0.4, delay: 0.35 } }
          : {
              opacity: [1, 1, 0],
              transition: { duration: 1.35, times: [0, 0.85, 1], ease: "linear" },
            }
      }
    >
      <BookHalf side="left" />
      <BookHalf side="right" />

      {/* the seam — a thin warm light down the middle of the
          closed cover, the promise of what is inside. It eases
          away the moment the covers begin to part */}
      <motion.div
        aria-hidden
        className="absolute inset-y-0 left-1/2 w-[26px] -translate-x-1/2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.9, delay: 0.2 } }}
        exit={{ opacity: 0, transition: { duration: 0.3 } }}
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(248,244,241,0.05) 22%, rgba(242,205,160,0.16) 50%, rgba(248,244,241,0.05) 78%, transparent 100%)",
        }}
      />

      {/* the words, and everything that lives with them — they
          fade together, just before the covers part */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay: 0.12, ease: SOFT },
        }}
        exit={{ opacity: 0, y: reduce ? 0 : -6, transition: { duration: 0.3 } }}
      >
        {/* the room's warmth, breathing behind the words */}
        {!reduce && (
          <span
            aria-hidden
            className="gate-glow pointer-events-none absolute left-1/2 top-1/2 block h-[300px] w-[300px] -translate-x-1/2 -translate-y-[56%] rounded-full blur-[60px]"
            style={{
              background:
                "radial-gradient(closest-side, rgba(122,38,56,0.4) 0%, rgba(45,11,21,0.18) 58%, transparent 78%)",
            }}
          />
        )}

        {!reduce && (
          <>
            {stars.map((s, i) => (
              <span
                key={i}
                aria-hidden
                className="doodle-twinkle pointer-events-none absolute block"
                style={
                  {
                    left: s.left,
                    top: s.top,
                    bottom: s.bottom,
                    width: s.size,
                    height: s.size,
                    "--d-min": 0.12,
                    "--d-max": 0.5,
                    "--d-dur": s.dur,
                    "--d-delay": s.delay,
                  } as React.CSSProperties
                }
              >
                <PenStar color={s.color} />
              </span>
            ))}
          </>
        )}

        <p className="relative font-display text-[1.7rem] italic tracking-wide text-cream/90 sm:text-[2rem]">
          for Aroogty
        </p>

        {/* a small ink flourish between the two languages */}
        <div
          aria-hidden
          className="relative my-3.5 flex w-32 items-center gap-2 opacity-60"
        >
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-burgundy-mid/70" />
          <Heart
            className="h-2.5 w-2.5 shrink-0 text-rose-soft/80"
            fill="currentColor"
            strokeWidth={0}
          />
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-burgundy-mid/70" />
        </div>

        <p className="relative font-hand text-[1.2rem] leading-relaxed text-rose-soft/85 sm:text-[1.35rem]">
          ثواني بس…
        </p>
        <p className="relative mt-1 font-hand text-[1.2rem] leading-relaxed text-rose-soft/70 sm:text-[1.35rem]">
          عالمنا الصغير بيجهزلك ♡
        </p>
      </motion.div>
    </motion.div>
  );
}
