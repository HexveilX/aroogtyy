"use client";

/* ————————————————————————————————————————————————
   AmbientSpecks — the universe's deepest breath.

   A handful of near-invisible specks rising slowly through
   the dark, present in every room of the place — the one
   layer that never leaves her, not even in the song room.
   Two of them are not dots at all, but the tiniest heart
   and star, drifting like paper caught in still air.

   Rules it keeps:
   · fixed behind everything, never above any content
   · pointer-events: none — it has never intercepted a click
   · transform/opacity only, one keyframe set, GPU-cheap
   · reduced-motion: the specks rest where they are,
     still visible, still quiet
———————————————————————————————————————————————— */

import type { CSSProperties } from "react";

type Speck = {
  /** horizontal position in the viewport */
  left: string;
  /** start offset from the bottom of the screen */
  bottom: string;
  /** dot size in px */
  size: number;
  /** one full rise across the dark, in seconds */
  dur: number;
  /** negative — they were already mid-journey when she arrived */
  delay: string;
  /** the most visible it ever gets */
  peak: number;
  /** gentle diagonal drift over the whole journey */
  sway: string;
  /** rose instead of cream — only a few */
  rose?: boolean;
  /** a tiny shape instead of a round dot */
  shape?: "heart" | "star";
};

const SPECKS: Speck[] = [
  { left: "9%",  bottom: "-4%", size: 2.5, dur: 44, delay: "-12s", peak: 0.13, sway: "26px" },
  { left: "22%", bottom: "-6%", size: 2,   dur: 52, delay: "-30s", peak: 0.09, sway: "-18px", rose: true },
  { left: "38%", bottom: "-3%", size: 3,   dur: 38, delay: "-5s",  peak: 0.11, sway: "14px" },
  { left: "57%", bottom: "-5%", size: 2,   dur: 47, delay: "-21s", peak: 0.08, sway: "-24px" },
  { left: "71%", bottom: "-4%", size: 2.5, dur: 41, delay: "-9s",  peak: 0.13, sway: "20px", rose: true },
  { left: "88%", bottom: "-6%", size: 2,   dur: 50, delay: "-35s", peak: 0.09, sway: "-14px" },
  /* the two that are not dots — a heart and a star, the
     smallest citizens of this universe */
  { left: "31%", bottom: "-7%", size: 11,  dur: 64, delay: "-18s", peak: 0.15, sway: "30px", shape: "heart", rose: true },
  { left: "80%", bottom: "-7%", size: 9,   dur: 70, delay: "-45s", peak: 0.14, sway: "-26px", shape: "star" },
];

function SpeckDot({ s }: { s: Speck }) {
  const style: CSSProperties & Record<string, string | number> = {
    left: s.left,
    bottom: s.bottom,
    "--sp-peak": s.peak,
    "--sp-dur": `${s.dur}s`,
    "--sp-delay": s.delay,
    "--sp-sway": s.sway,
  };

  if (s.shape === "heart") {
    return (
      <span
        aria-hidden
        className="speck-rise pointer-events-none absolute"
        style={style}
      >
        <svg viewBox="0 0 24 24" className="block h-auto" width={s.size} aria-hidden>
          <path
            d="M12 20.6 C 7.8 17.0 3.8 13.5 3.8 9.3 C 3.8 6.6 5.7 4.9 7.8 4.9 C 9.4 4.9 11.0 5.8 12 7.5 C 13.0 5.8 14.6 4.9 16.2 4.9 C 18.3 4.9 20.2 6.6 20.2 9.3 C 20.2 13.5 16.2 17.0 12 20.6"
            fill={s.rose ? "#B77C8D" : "#F8F4F1"}
          />
        </svg>
      </span>
    );
  }

  if (s.shape === "star") {
    return (
      <span
        aria-hidden
        className="speck-rise pointer-events-none absolute"
        style={style}
      >
        <svg viewBox="0 0 24 24" className="block h-auto" width={s.size} aria-hidden>
          <path
            d="M12 3.2 L13.7 10.3 L20.8 12 L13.7 13.7 L12 20.8 L10.3 13.7 L3.2 12 L10.3 10.3 Z"
            fill={s.rose ? "#B77C8D" : "#F8F4F1"}
          />
        </svg>
      </span>
    );
  }

  return (
    <span
      aria-hidden
      className="speck-rise pointer-events-none absolute rounded-full"
      style={{
        ...style,
        width: s.size,
        height: s.size,
        backgroundColor: s.rose ? "#B77C8D" : "#F8F4F1",
      }}
    />
  );
}

export default function AmbientSpecks() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
    >
      {SPECKS.map((s, i) => (
        <SpeckDot key={i} s={s} />
      ))}
    </div>
  );
}
