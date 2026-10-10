"use client";

/* ————————————————————————————————————————————————
   ScrapbookBackdrop — the composition layer, alive.

   For a long time this universe's background was a
   handful of tiny marks, and it was too quiet to read
   as *decorated*. Then it gained the large faint shapes
   — oversized hearts, unclosed pen-circles, ink
   flourishes — but it still sat perfectly still while
   she scrolled, like a photograph of a scrapbook rather
   than the scrapbook itself.

   This version gives the page real depth and real
   response:

     · THREE DEPTH BANDS — the marks are no longer one
       flat layer. Far beneath the page: the ink stains,
       pressed into the deepest fibers. On the page
       itself: the drawn marks. On top of everything:
       the paper things — tape, strips, torn edges.
     · SCROLL PARALLAX — as she scrolls, each band
       travels a different distance (far drifts gently
       against the scroll like the desk beneath the
       book; near rises almost with the content). The
       layers slide past each other, and the dark stops
       being a flat photograph.
     · POINTER DEPTH (desktop, fine pointers only) —
       the bands lean a few pixels toward and away from
       her cursor, each by its own amount. Never the
       text, never a control — only the paper.
     · ROOM-TURN SETTLE — entering a room, the whole
       atmosphere settles onto the desk the way a newly
       turned page does.

   Rules it keeps, same as every ambient layer here:
     · pointer-events: none, always
     · behind all content, never above a single word
     · transform / opacity only — nothing expensive
     · motion values write transforms straight to the
       compositor; React never re-renders for them
     · most marks are perfectly still, like old ink
     · mobile keeps one or two large ghosts + the
       stains; the parallax survives, the pointer rests
     · reduced-motion: everything rests in place

   Every position is placed by hand, not scattered —
   these are composition decisions, not particles.
———————————————————————————————————————————————— */

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";
import type { ViewId } from "@/content/arooqtyContent";

export type BackdropVariant =
  | "home"
  | "beginning"
  | "things"
  | "memories"
  | "birthday"
  | "song"
  | "letters"
  | "gate";

/* the three planes of the page */
type Depth = "far" | "mid" | "near";

/* ————— the shapes —————
   Every path is drawn a little wrong on purpose —
   a hand moving across paper, not a machine. */

function GiantHeart({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 184" fill="none" aria-hidden className="block h-auto w-full">
      <path
        d="M100 164 C 60 133, 20 101, 23 60 C 25 33, 48 17, 71 22 C 85 25, 96 34, 100 46 C 104 34, 115 25, 129 22 C 152 17, 175 33, 177 60 C 180 101, 140 133, 100 164"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* a second, fainter pass — the pen went around twice */}
      <path
        d="M100 156 C 66 128, 32 100, 34 63 C 35 42, 53 28, 72 31"
        stroke={color}
        strokeWidth="1.9"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}

function RingMark({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 220 220" fill="none" aria-hidden className="block h-auto w-full">
      {/* a circle the pen never closed — twice, slightly apart */}
      <circle
        cx="110"
        cy="110"
        r="92"
        pathLength="100"
        strokeDasharray="78 22"
        strokeDashoffset="6"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        transform="rotate(-18 110 110)"
      />
      <circle
        cx="112"
        cy="109"
        r="85"
        pathLength="100"
        strokeDasharray="62 38"
        strokeDashoffset="54"
        stroke={color}
        strokeWidth="2.1"
        strokeLinecap="round"
        opacity="0.6"
        transform="rotate(40 112 109)"
      />
    </svg>
  );
}

function InkStroke({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 900 110" fill="none" aria-hidden className="block h-auto w-full">
      <path
        d="M 6 78 C 150 18, 330 96, 520 52 S 790 14, 894 46"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MarginCurve({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 70 520" fill="none" aria-hidden className="block h-auto w-full">
      <path
        d="M 34 8 C 60 130, 10 250, 38 380 C 52 450, 30 490, 36 512"
        stroke={color}
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BigStar({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 140 140" fill="none" aria-hidden className="block h-auto w-full">
      <path
        d="M70 9 L86 49 L128 52 L95 79 L106 119 L70 97 L34 119 L45 79 L12 52 L54 49 Z"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BigSparkle({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden className="block h-auto w-full">
      <path
        d="M60 8 C 63 40, 68 46, 112 60 C 68 74, 63 80, 60 112 C 57 80, 52 74, 8 60 C 52 46, 57 40, 60 8 Z"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Constellation({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 230 160" fill="none" aria-hidden className="block h-auto w-full">
      {/* the hairlines between the stars — barely there */}
      <path
        d="M30 36 L86 18 L150 44 L196 96 M196 96 L120 110 L58 128 M58 128 L30 36"
        stroke={color}
        strokeWidth="1.1"
        opacity="0.45"
      />
      {/* the stars themselves, each a slightly different size.
          Three of them are alive — each keeps its own slow
          rhythm, so the constellation never pulses in unison */}
      <g fill={color}>
        <path
          d="M30 30.5 L31.8 34.6 L36 36 L31.8 37.4 L30 41.5 L28.2 37.4 L24 36 L28.2 34.6 Z"
          className="cn-twinkle"
          style={{ "--cn-dur": "7.4s", "--cn-delay": "-2.6s" } as React.CSSProperties}
        />
        <path
          d="M86 15.6 L87.4 18.7 L90.5 20 L87.4 21.3 L86 24.4 L84.6 21.3 L81.5 20 L84.6 18.7 Z"
          opacity="0.85"
        />
        <path
          d="M150 37.5 L152.5 42.8 L158 44 L152.5 45.2 L150 50.5 L147.5 45.2 L142 44 L147.5 42.8 Z"
          className="cn-twinkle"
          style={{ "--cn-dur": "9.8s", "--cn-delay": "-5.2s" } as React.CSSProperties}
        />
        <path
          d="M196 92 L197.6 95.9 L201.5 97 L197.6 98.1 L196 102 L194.4 98.1 L190.5 97 L194.4 95.9 Z"
          opacity="0.8"
        />
        <path
          d="M120 104.5 L122.4 110 L128 111.5 L122.4 113 L120 118.5 L117.6 113 L112 111.5 L117.6 110 Z"
          className="cn-twinkle"
          style={{ "--cn-dur": "8.2s", "--cn-delay": "-0.8s" } as React.CSSProperties}
        />
        <path d="M58 124.6 L59.5 128 L62.8 129 L59.5 130 L58 133.4 L56.5 130 L53.2 129 L56.5 128 Z" opacity="0.75" />
        <circle cx="178" cy="20" r="1.6" opacity="0.6" />
        <circle cx="42" cy="86" r="1.3" opacity="0.5" />
      </g>
    </svg>
  );
}

function PaperStrip({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 520 130" fill="none" aria-hidden className="block h-auto w-full">
      {/* a strip of paper laid across the page, torn at one end */}
      <path
        d="M12 38 L440 20 L506 38 L492 58 L498 74 L486 92 L36 108 Z"
        fill={color}
        opacity="0.5"
      />
      <path
        d="M12 38 L440 20 L506 38 L492 58 L498 74 L486 92 L36 108 Z"
        stroke={color}
        strokeWidth="1"
        opacity="0.55"
      />
      {/* the fold down its middle */}
      <path d="M26 73 L466 55" stroke={color} strokeWidth="0.8" opacity="0.35" />
    </svg>
  );
}

function TornEdge({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 90 520" fill="none" aria-hidden className="block h-auto w-full">
      <path
        d="M 30 0 L 58 26 L 34 64 L 66 104 L 38 148 L 70 190 L 40 232 L 68 276 L 36 318 L 64 362 L 38 404 L 66 448 L 42 490 L 54 520 L 0 520 L 0 0 Z"
        fill={color}
        opacity="0.5"
      />
    </svg>
  );
}

function HandUnderline({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 640 26" fill="none" aria-hidden className="block h-auto w-full">
      <path
        d="M 8 15 C 96 5, 180 24, 268 13 S 432 7, 520 17 S 604 12, 632 14"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TapePair({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 150 110" fill="none" aria-hidden className="block h-auto w-full">
      {/* two strips of tape, holding a corner of the page down */}
      <path
        d="M8 44 L70 10 L82 30 L20 64 Z"
        fill={color}
        opacity="0.5"
        transform="rotate(-6 40 40)"
      />
      <path
        d="M62 96 L142 62 L150 80 L70 114 Z"
        fill={color}
        opacity="0.4"
        transform="rotate(4 100 90)"
      />
    </svg>
  );
}

function EnvelopeOutline({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 150" fill="none" aria-hidden className="block h-auto w-full">
      <path
        d="M14 26 L186 20 L190 122 L12 128 Z"
        stroke={color}
        strokeWidth="2.8"
        strokeLinejoin="round"
      />
      <path
        d="M16 28 L100 84 L184 24"
        stroke={color}
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* the postage circle, cancelled */}
      <circle cx="158" cy="46" r="8" stroke={color} strokeWidth="1.6" opacity="0.7" />
      <path d="M152 52 L164 40" stroke={color} strokeWidth="1.2" opacity="0.5" />
    </svg>
  );
}

function ConfettiScatter({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 180 160" fill="none" aria-hidden className="block h-auto w-full">
      {/* a few paper bits, scattered like after a small
          celebration — hand-cut, never a confetti cannon */}
      <rect x="18" y="26" width="10" height="14" rx="1.5" fill={color} opacity="0.7" transform="rotate(24 23 33)" />
      <rect x="96" y="12" width="8" height="11" rx="1.5" fill={color} opacity="0.55" transform="rotate(-18 100 18)" />
      <rect x="140" y="66" width="9" height="12" rx="1.5" fill={color} opacity="0.65" transform="rotate(40 144 72)" />
      <path
        d="M60 84 C 57.5 81.5, 54.5 81, 53 83.5 C 52 85.3, 54.2 87.4, 60 91 C 65.8 87.4, 68 85.3, 67 83.5 C 65.5 81, 62.5 81.5, 60 84 Z"
        fill={color}
        opacity="0.8"
        transform="rotate(-12 60 86)"
      />
      <path
        d="M124 118 C 121.8 115.8, 119 115.3, 117.6 117.6 C 116.7 119.2, 118.7 121.1, 124 124.4 C 129.3 121.1, 131.3 119.2, 130.4 117.6 C 129 115.3, 126.2 115.8, 124 118 Z"
        fill={color}
        opacity="0.6"
        transform="rotate(16 124 120)"
      />
      <circle cx="34" cy="128" r="2.2" fill={color} opacity="0.6" />
      <circle cx="160" cy="24" r="1.8" fill={color} opacity="0.5" />
      <path d="M84 146 L85.4 149.2 L88.5 150 L85.4 150.8 L84 154 L82.6 150.8 L79.5 150 L82.6 149.2 Z" fill={color} opacity="0.7" />
    </svg>
  );
}

function PageEdge({ color }: { color: string }) {
  return (
    <svg
      viewBox="0 0 16 640"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden
      className="block h-full w-full"
    >
      {/* the edge of the page itself — one wavy hairline,
          like the deckle of handmade paper */}
      <path
        d="M 8 0 C 12 80, 4 160, 9 240 C 13 320, 5 400, 10 480 C 13 540, 7 600, 9 640"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/* ————— the small handwriting of the page —————
   Where the big shapes are composition, these are the
   pen's small asides: a heart in a margin, a star by
   a corner, a line of writing too faint to read, a
   scrap that fell and stayed. Small enough to be
   handwriting, present enough to be SEEN. */

function TinyHeart({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 40 36" fill="none" aria-hidden className="block h-auto w-full">
      <path
        d="M20 32 C 12 26, 5 20, 6 13 C 6.7 8, 11 5.5, 14.7 7 C 17 8, 19 10.5, 20 13 C 21 10.5, 23 8, 25.3 7 C 29 5.5, 33.3 8, 34 13 C 35 20, 28 26, 20 32"
        stroke={color}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MiniStar({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" aria-hidden className="block h-auto w-full">
      <path
        d="M20 3 C 21.4 12.5, 23 14.5, 37 20 C 23 25.5, 21.4 27.5, 20 37 C 18.6 27.5, 17 25.5, 3 20 C 17 14.5, 18.6 12.5, 20 3 Z"
        fill={color}
      />
    </svg>
  );
}

function Scribble({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 220 40" fill="none" aria-hidden className="block h-auto w-full">
      {/* a line of writing too faint to read — the pen ran
          along the bottom of the page while thinking */}
      <path
        d="M6 26 C 12 14, 18 14, 20 24 C 22 33, 28 33, 33 22 C 38 12, 45 12, 48 23 C 51 33, 58 32, 64 20 C 68 12, 76 13, 78 22 C 80 30, 87 30, 93 21 C 98 13, 106 14, 108 22 C 110 29, 117 29, 124 20 M 132 22 C 137 14, 144 15, 146 23 C 148 30, 156 29, 162 20 C 167 13, 175 14, 177 22 C 179 29, 188 28, 196 19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PaperScrap({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 90 70" fill="none" aria-hidden className="block h-auto w-full">
      <path
        d="M8 12 L34 6 L52 14 L74 9 L84 26 L70 34 L82 48 L58 56 L40 50 L22 60 L6 46 L16 30 Z"
        fill={color}
        opacity="0.5"
      />
      <path
        d="M8 12 L34 6 L52 14 L74 9 L84 26 L70 34 L82 48 L58 56 L40 50 L22 60 L6 46 L16 30 Z"
        stroke={color}
        strokeWidth="1"
        opacity="0.55"
      />
    </svg>
  );
}

/* ————— the ink ————— */

type MarkKind =
  | "heart"
  | "ring"
  | "stroke"
  | "margin"
  | "star"
  | "sparkle"
  | "constellation"
  | "strip"
  | "torn"
  | "underline"
  | "tape"
  | "envelope"
  | "confetti"
  | "edge"
  | "tinyHeart"
  | "miniStar"
  | "scribble"
  | "scrap";

const MARK_SHAPES: Record<MarkKind, (c: string) => React.ReactNode> = {
  heart: (c) => <GiantHeart color={c} />,
  ring: (c) => <RingMark color={c} />,
  stroke: (c) => <InkStroke color={c} />,
  margin: (c) => <MarginCurve color={c} />,
  star: (c) => <BigStar color={c} />,
  sparkle: (c) => <BigSparkle color={c} />,
  constellation: (c) => <Constellation color={c} />,
  strip: (c) => <PaperStrip color={c} />,
  torn: (c) => <TornEdge color={c} />,
  underline: (c) => <HandUnderline color={c} />,
  tape: (c) => <TapePair color={c} />,
  envelope: (c) => <EnvelopeOutline color={c} />,
  confetti: (c) => <ConfettiScatter color={c} />,
  edge: (c) => <PageEdge color={c} />,
  tinyHeart: (c) => <TinyHeart color={c} />,
  miniStar: (c) => <MiniStar color={c} />,
  scribble: (c) => <Scribble color={c} />,
  scrap: (c) => <PaperScrap color={c} />,
};

interface MarkSpec {
  kind: MarkKind;
  /** physical anchors — the composition is viewport-native */
  l?: string;
  r?: string;
  t?: string;
  b?: string;
  /** width classes — responsive by Tailwind, never by JS */
  w: string;
  /** extra classes (height for the vertical marks, centering) */
  cls?: string;
  rot: number;
  /** how visible the mark ever gets — faint, always */
  op: number;
  color?: "rose" | "cream";
  motion?: "breathe" | "sway" | "twinkle" | "drift";
  dur?: number;
  delay?: number;
  lift?: number;
  /** horizontal wander for drifting marks */
  dx?: number;
  /** which plane of the page the mark lives on */
  depth?: Depth;
  /** stays on small screens (default: desktop only) */
  mobile?: boolean;
}

/* ————— the stains —————
   Not glows — ink pressed through paper from behind.
   Soft radial falloff, no blur filter, no neon. */

interface StainSpec {
  l?: string;
  r?: string;
  t?: string;
  b?: string;
  w: string;
  h: string;
  cls?: string;
  color: "burgundy" | "burgundyMid" | "rose" | "wine" | "paper" | "warm";
  alpha: number;
  motion?: boolean;
  /** the wash slowly drifts through the paper instead of
      merely breathing — ink still moving after the pen left */
  wash?: boolean;
  dur?: number;
  delay?: number;
  mobile?: boolean;
}

const STAIN_COLORS: Record<StainSpec["color"], string> = {
  burgundy: "101, 28, 45", // #651C2D
  burgundyMid: "122, 38, 56", // #7A263A — the warmer middle
  rose: "183, 124, 141", // #B77C8D
  wine: "45, 11, 21", // #2D0B15
  paper: "26, 18, 22", // #1A1216 — a fiber cloud, barely lighter
  warm: "122, 36, 56", // #7A2438 — birthday warmth
};

/* ————— each room's own composition —————
   Placed by hand, per room, like actually decorating
   the page. Nothing is scattered; every mark has a
   place it was put. */

const MARKS: Record<BackdropVariant, MarkSpec[]> = {
  /* HOME — the strongest sense of entering a world: a
     constellation holding the top-right corner, the big
     heart half off the left edge, one long flourish
     beneath the title, one slow ghost star, the top
     corner of the page held down with tape — and the
     pen's small asides: a heart in the margin, a star
     beside it, a line of writing too faint to read.
     Calibrated to be SEEN, not hunted for. */
  home: [
    {
      kind: "heart",
      l: "-15%",
      t: "24%",
      w: "w-[210px] md:w-[430px]",
      rot: -7,
      op: 0.42,
      color: "rose",
      motion: "breathe",
      dur: 54,
      delay: -22,
      depth: "near",
      mobile: true,
    },
    {
      kind: "stroke",
      l: "50%",
      t: "23%",
      w: "w-[78vw] md:w-[860px]",
      cls: "-translate-x-1/2",
      rot: -1.5,
      op: 0.2,
      color: "rose",
      depth: "mid",
    },
    {
      kind: "constellation",
      r: "4%",
      t: "8%",
      w: "w-[110px] md:w-[215px]",
      rot: 4,
      op: 0.5,
      color: "cream",
      depth: "mid",
      mobile: true,
    },
    {
      kind: "star",
      r: "8%",
      b: "16%",
      w: "w-[84px] md:w-[140px]",
      rot: 12,
      op: 0.3,
      color: "rose",
      motion: "sway",
      dur: 56,
      delay: -34,
      lift: 24,
      depth: "near",
    },
    {
      kind: "margin",
      l: "2%",
      t: "56%",
      w: "w-[34px] md:w-[46px]",
      rot: 0,
      op: 0.24,
      color: "rose",
      depth: "far",
    },
    {
      /* the corner of the first page, taped down — the
         universe begins as a physical object */
      kind: "tape",
      l: "3%",
      t: "5%",
      w: "w-[90px] md:w-[150px]",
      rot: -5,
      op: 0.2,
      color: "cream",
      depth: "near",
    },
    {
      /* a heart drawn once in the lower margin, keeping
          its own slow rhythm against the big one's breath */
      kind: "tinyHeart",
      l: "15%",
      b: "27%",
      w: "w-[24px] md:w-[34px]",
      rot: -9,
      op: 0.32,
      color: "rose",
      motion: "twinkle",
      dur: 9.5,
      delay: -3,
      depth: "mid",
      mobile: true,
    },
    {
      /* a small star, brightening and dimming where the
         title's light falls */
      kind: "miniStar",
      r: "21%",
      t: "33%",
      w: "w-[15px] md:w-[22px]",
      rot: 0,
      op: 0.38,
      color: "cream",
      motion: "twinkle",
      dur: 7.8,
      delay: -1.4,
      depth: "mid",
      mobile: true,
    },
    {
      /* the pen ran along the bottom of the page while
         thinking — writing too faint to read */
      kind: "scribble",
      r: "9%",
      b: "7%",
      w: "w-[140px] md:w-[240px]",
      rot: -2,
      op: 0.17,
      color: "rose",
      motion: "drift",
      dur: 64,
      delay: -26,
      lift: 13,
      dx: 8,
      depth: "mid",
    },
    {
      /* a second margin heart, higher, answering the first
         from across the page */
      kind: "tinyHeart",
      l: "7%",
      t: "13%",
      w: "w-[18px] md:w-[26px]",
      rot: 12,
      op: 0.28,
      color: "rose",
      motion: "drift",
      dur: 52,
      delay: -12,
      lift: 11,
      dx: 6,
      depth: "near",
      mobile: true,
    },
  ],

  /* OUR BEGINNING — the story being written onto paper:
     a hand-circled emptiness on the right, a wide written
     underline up top, a margin curve down the left, a
     note someone taped into the margin below — and the
     small asides that gather around a story being told. */
  beginning: [
    {
      kind: "ring",
      r: "-11%",
      t: "34%",
      w: "w-[240px] md:w-[460px]",
      rot: 6,
      op: 0.34,
      color: "rose",
      motion: "breathe",
      dur: 58,
      delay: -10,
      depth: "near",
      mobile: true,
    },
    {
      kind: "underline",
      l: "50%",
      t: "20%",
      w: "w-[70vw] md:w-[560px]",
      cls: "-translate-x-1/2",
      rot: -1,
      op: 0.22,
      color: "rose",
      depth: "mid",
    },
    {
      kind: "margin",
      l: "1.5%",
      t: "18%",
      w: "w-[34px] md:w-[48px]",
      rot: 0,
      op: 0.3,
      color: "cream",
      motion: "sway",
      dur: 60,
      delay: -28,
      lift: 22,
      depth: "far",
    },
    {
      kind: "star",
      l: "6%",
      b: "24%",
      w: "w-[74px] md:w-[120px]",
      rot: -14,
      op: 0.22,
      color: "cream",
      depth: "mid",
    },
    {
      /* a small note taped low on the page — the margin
         where the story keeps its asides */
      kind: "tape",
      l: "5%",
      b: "24%",
      w: "w-[86px] md:w-[140px]",
      rot: 4,
      op: 0.18,
      color: "cream",
      depth: "near",
    },
    {
      /* the story's footnotes — writing too faint to read,
         drifting along the bottom of the page */
      kind: "scribble",
      r: "5%",
      b: "10%",
      w: "w-[130px] md:w-[220px]",
      rot: 1.5,
      op: 0.17,
      color: "rose",
      motion: "drift",
      dur: 66,
      delay: -30,
      lift: 12,
      dx: 7,
      depth: "mid",
    },
    {
      /* a star above the circle, keeping the sky in the
         story's margins */
      kind: "miniStar",
      r: "25%",
      t: "13%",
      w: "w-[14px] md:w-[20px]",
      rot: 0,
      op: 0.34,
      color: "cream",
      motion: "twinkle",
      dur: 8.6,
      delay: -2.2,
      depth: "mid",
      mobile: true,
    },
    {
      /* a heart low on the left, where the story keeps
         its tenderness */
      kind: "tinyHeart",
      l: "13%",
      b: "11%",
      w: "w-[22px] md:w-[30px]",
      rot: -7,
      op: 0.3,
      color: "rose",
      motion: "twinkle",
      dur: 10.2,
      delay: -5,
      depth: "mid",
      mobile: true,
    },
  ],

  /* LITTLE THINGS — the playful page: a big sparkle, a
     tilted star, a ghost strip of paper someone taped
     down and peeled back off, a second smaller sparkle
     answering the first — and the small confetti of a
     playful pen: hearts and stars in the margins. */
  things: [
    {
      kind: "sparkle",
      l: "-7%",
      t: "15%",
      w: "w-[130px] md:w-[220px]",
      rot: 8,
      op: 0.38,
      color: "rose",
      motion: "breathe",
      dur: 44,
      delay: -16,
      depth: "near",
      mobile: true,
    },
    {
      kind: "star",
      r: "5%",
      b: "28%",
      w: "w-[90px] md:w-[160px]",
      rot: 16,
      op: 0.3,
      color: "rose",
      motion: "sway",
      dur: 48,
      delay: -30,
      lift: 26,
      depth: "near",
    },
    {
      kind: "stroke",
      r: "-14%",
      t: "52%",
      w: "w-[300px] md:w-[520px]",
      rot: 5,
      op: 0.2,
      color: "cream",
      depth: "mid",
    },
    {
      kind: "strip",
      r: "-6%",
      b: "-4%",
      w: "w-[260px] md:w-[430px]",
      rot: -11,
      op: 0.62,
      color: "cream",
      depth: "near",
    },
    {
      /* the echo — a second, smaller sparkle keeping the
         first one company across the page */
      kind: "sparkle",
      l: "8%",
      b: "10%",
      w: "w-[60px] md:w-[100px]",
      rot: -10,
      op: 0.26,
      color: "cream",
      motion: "breathe",
      dur: 52,
      delay: -18,
      depth: "mid",
    },
    {
      /* a heart the pen drew mid-thought, twinkling where
         the play keeps its warmth */
      kind: "tinyHeart",
      l: "20%",
      t: "9%",
      w: "w-[22px] md:w-[30px]",
      rot: 14,
      op: 0.32,
      color: "rose",
      motion: "twinkle",
      dur: 9.2,
      delay: -4,
      depth: "mid",
      mobile: true,
    },
    {
      /* a small answering star, low and centered */
      kind: "miniStar",
      l: "31%",
      b: "5%",
      w: "w-[14px] md:w-[20px]",
      rot: 0,
      op: 0.36,
      color: "cream",
      motion: "twinkle",
      dur: 7.4,
      delay: -1.2,
      depth: "mid",
      mobile: true,
    },
    {
      /* a scrap that fell from the making of this page
         and stayed where it landed */
      kind: "scrap",
      r: "15%",
      b: "9%",
      w: "w-[40px] md:w-[64px]",
      rot: 22,
      op: 0.3,
      color: "rose",
      motion: "drift",
      dur: 58,
      delay: -20,
      lift: 11,
      dx: 9,
      depth: "mid",
    },
  ],

  /* MEMORIES — the tactile page: paper strips and torn
     edges, tape holding a corner, a big circle enclosing
     an emptiness on the left, a constellation of tiny
     stars, one wide underline beneath the heading — and
     the small marks that gather where things are kept. */
  memories: [
    {
      kind: "ring",
      l: "-14%",
      t: "26%",
      w: "w-[230px] md:w-[480px]",
      rot: -8,
      op: 0.34,
      color: "rose",
      motion: "breathe",
      dur: 54,
      delay: -24,
      depth: "near",
      mobile: true,
    },
    {
      kind: "strip",
      r: "-8%",
      t: "8%",
      w: "w-[240px] md:w-[400px]",
      rot: -7,
      op: 0.58,
      color: "cream",
      depth: "near",
    },
    {
      kind: "tape",
      r: "7%",
      b: "20%",
      w: "w-[86px] md:w-[140px]",
      rot: 5,
      op: 0.22,
      color: "cream",
      depth: "near",
    },
    {
      kind: "torn",
      r: "-2%",
      b: "-3%",
      w: "w-[46px] md:w-[72px]",
      cls: "h-[180px] md:h-[320px]",
      rot: 0,
      op: 0.62,
      color: "rose",
      depth: "near",
    },
    {
      kind: "constellation",
      l: "5%",
      b: "10%",
      w: "w-[96px] md:w-[160px]",
      rot: -6,
      op: 0.4,
      color: "cream",
      depth: "mid",
    },
    {
      kind: "underline",
      l: "50%",
      t: "15%",
      w: "w-[66vw] md:w-[520px]",
      cls: "-translate-x-1/2",
      rot: -0.5,
      op: 0.2,
      color: "rose",
      depth: "mid",
    },
    {
      /* a heart beside the drawer, where the opened things
         gather their warmth */
      kind: "tinyHeart",
      r: "23%",
      b: "26%",
      w: "w-[24px] md:w-[34px]",
      rot: 9,
      op: 0.32,
      color: "rose",
      motion: "twinkle",
      dur: 9.8,
      delay: -3.6,
      depth: "mid",
      mobile: true,
    },
    {
      /* a star over the circle's edge, watching over the
         keepsakes */
      kind: "miniStar",
      l: "24%",
      t: "8%",
      w: "w-[14px] md:w-[20px]",
      rot: 0,
      op: 0.36,
      color: "cream",
      motion: "twinkle",
      dur: 8.2,
      delay: -2.8,
      depth: "mid",
      mobile: true,
    },
    {
      /* a line of writing beneath the drawer — someone
         listing what to keep */
      kind: "scribble",
      l: "7%",
      b: "5%",
      w: "w-[130px] md:w-[220px]",
      rot: -1,
      op: 0.16,
      color: "rose",
      motion: "drift",
      dur: 62,
      delay: -24,
      lift: 12,
      dx: 7,
      depth: "mid",
    },
  ],

  /* BIRTHDAY — the warmest page, and the most alive: a
     bigger heart near the right edge, a star, a scatter
     of paper confetti, a sparkle that breathes with the
     room, the corner of the birthday note taped down —
     and a small crowd of hearts and stars keeping the
     celebration company. All a touch more visible than
     elsewhere: this room is allowed to feel magical. */
  birthday: [
    {
      kind: "heart",
      r: "-14%",
      t: "14%",
      w: "w-[220px] md:w-[430px]",
      rot: 6,
      op: 0.46,
      color: "rose",
      motion: "breathe",
      dur: 46,
      delay: -14,
      depth: "near",
      mobile: true,
    },
    {
      kind: "star",
      l: "4%",
      t: "30%",
      w: "w-[84px] md:w-[140px]",
      rot: -10,
      op: 0.32,
      color: "cream",
      motion: "sway",
      dur: 50,
      delay: -20,
      lift: 22,
      depth: "near",
    },
    {
      kind: "confetti",
      l: "3%",
      b: "22%",
      w: "w-[92px] md:w-[150px]",
      rot: -4,
      op: 0.3,
      color: "rose",
      depth: "mid",
    },
    {
      kind: "underline",
      l: "50%",
      t: "17%",
      w: "w-[66vw] md:w-[520px]",
      cls: "-translate-x-1/2",
      rot: -0.5,
      op: 0.24,
      color: "rose",
      depth: "mid",
    },
    {
      kind: "sparkle",
      r: "9%",
      b: "12%",
      w: "w-[70px] md:w-[110px]",
      rot: -6,
      op: 0.3,
      color: "cream",
      motion: "breathe",
      dur: 44,
      delay: -8,
      depth: "mid",
    },
    {
      /* the birthday note itself, taped at its corner —
         someone pinned it there for her to find */
      kind: "tape",
      l: "4%",
      b: "8%",
      w: "w-[90px] md:w-[150px]",
      rot: -4,
      op: 0.24,
      color: "cream",
      depth: "near",
    },
    {
      /* the small crowd — hearts and stars keeping the
         celebration company, each on its own rhythm */
      kind: "tinyHeart",
      l: "18%",
      t: "8%",
      w: "w-[22px] md:w-[32px]",
      rot: -11,
      op: 0.36,
      color: "rose",
      motion: "twinkle",
      dur: 8.8,
      delay: -2.4,
      depth: "mid",
      mobile: true,
    },
    {
      kind: "miniStar",
      r: "19%",
      t: "35%",
      w: "w-[16px] md:w-[24px]",
      rot: 0,
      op: 0.42,
      color: "cream",
      motion: "twinkle",
      dur: 7.2,
      delay: -0.8,
      depth: "mid",
      mobile: true,
    },
    {
      kind: "miniStar",
      l: "9%",
      b: "14%",
      w: "w-[12px] md:w-[18px]",
      rot: 0,
      op: 0.34,
      color: "cream",
      motion: "twinkle",
      dur: 9.4,
      delay: -4.2,
      depth: "mid",
      mobile: true,
    },
    {
      /* a line of writing along the bottom — the start of
         a birthday letter, too faint to read yet */
      kind: "scribble",
      r: "5%",
      b: "5%",
      w: "w-[140px] md:w-[240px]",
      rot: 1,
      op: 0.19,
      color: "rose",
      motion: "drift",
      dur: 56,
      delay: -18,
      lift: 13,
      dx: 8,
      depth: "mid",
    },
  ],

  /* OUR SONG — the locked room. Cassette atmosphere only:
     one ghost reel-circle far left, one far star, one
     small twinkling light at the far bottom corner —
     nothing near the tape, nothing over the players,
     everything a shade quieter than the other rooms on
     purpose: the cassette stays the one focal point */
  song: [
    {
      kind: "ring",
      l: "-16%",
      t: "30%",
      w: "w-[220px] md:w-[420px]",
      rot: 0,
      op: 0.22,
      color: "rose",
      motion: "breathe",
      dur: 64,
      delay: -30,
      depth: "near",
    },
    {
      kind: "star",
      r: "6%",
      b: "18%",
      w: "w-[70px] md:w-[110px]",
      rot: 8,
      op: 0.15,
      color: "cream",
      depth: "mid",
    },
    {
      /* one small light at the far edge, twinkling on its
         own slow rhythm — the room breathes, the cassette
         stays undisturbed */
      kind: "miniStar",
      l: "9%",
      b: "9%",
      w: "w-[12px] md:w-[18px]",
      rot: 0,
      op: 0.24,
      color: "cream",
      motion: "twinkle",
      dur: 10.4,
      delay: -3,
      depth: "far",
    },
  ],

  /* LETTERS — the paper page: one big ghost envelope on
     the right, a hand-circle low on the left, a torn edge
     where a page was freed, the top corner taped — and
     the small marks that gather around waiting letters. */
  letters: [
    {
      kind: "envelope",
      r: "-5%",
      t: "30%",
      w: "w-[150px] md:w-[250px]",
      rot: 7,
      op: 0.4,
      color: "rose",
      motion: "breathe",
      dur: 50,
      delay: -18,
      depth: "near",
      mobile: true,
    },
    {
      kind: "ring",
      l: "-12%",
      b: "18%",
      w: "w-[200px] md:w-[380px]",
      rot: 10,
      op: 0.22,
      color: "cream",
      depth: "mid",
    },
    {
      kind: "torn",
      r: "-1.5%",
      b: "-2%",
      w: "w-[42px] md:w-[64px]",
      cls: "h-[160px] md:h-[280px]",
      rot: 0,
      op: 0.58,
      color: "cream",
      depth: "near",
    },
    {
      kind: "underline",
      l: "50%",
      t: "19%",
      w: "w-[64vw] md:w-[500px]",
      cls: "-translate-x-1/2",
      rot: -1,
      op: 0.22,
      color: "rose",
      depth: "mid",
    },
    {
      /* the page that waits, held at its corner */
      kind: "tape",
      l: "3%",
      t: "10%",
      w: "w-[84px] md:w-[136px]",
      rot: 6,
      op: 0.2,
      color: "cream",
      depth: "near",
    },
    {
      /* the beginnings of the next letter, drifting along
         the bottom of the page */
      kind: "scribble",
      r: "7%",
      b: "7%",
      w: "w-[140px] md:w-[230px]",
      rot: -1.5,
      op: 0.17,
      color: "rose",
      motion: "drift",
      dur: 60,
      delay: -26,
      lift: 12,
      dx: 7,
      depth: "mid",
    },
    {
      /* a heart beside the envelope — the seal it will
         eventually carry */
      kind: "tinyHeart",
      l: "14%",
      t: "12%",
      w: "w-[22px] md:w-[30px]",
      rot: 8,
      op: 0.32,
      color: "rose",
      motion: "twinkle",
      dur: 9.6,
      delay: -4.4,
      depth: "mid",
      mobile: true,
    },
    {
      /* a star over the waiting stack of pages */
      kind: "miniStar",
      l: "30%",
      b: "8%",
      w: "w-[14px] md:w-[20px]",
      rot: 0,
      op: 0.34,
      color: "cream",
      motion: "twinkle",
      dur: 8.4,
      delay: -1.8,
      depth: "mid",
      mobile: true,
    },
  ],

  /* THE GATE — the cover of the private scrapbook. The
     same hand, drawing the cover page: the big heart
     half off the edge, the unclosed circle, the quiet
     constellation — and now the cover's own small
     asides: a heart, a star, a line of writing. The
     sealed stage reads as decorated before the universe
     ever opens, and wakes when the word is found. */
  gate: [
    {
      kind: "heart",
      r: "-11%",
      t: "18%",
      w: "w-[190px] md:w-[370px]",
      rot: -6,
      op: 0.34,
      color: "rose",
      motion: "breathe",
      dur: 52,
      delay: -26,
      depth: "near",
    },
    {
      kind: "ring",
      l: "-9%",
      b: "26%",
      w: "w-[210px] md:w-[400px]",
      rot: 8,
      op: 0.2,
      color: "rose",
      depth: "mid",
    },
    {
      kind: "constellation",
      l: "5%",
      t: "10%",
      w: "w-[100px] md:w-[180px]",
      rot: -5,
      op: 0.42,
      color: "cream",
      depth: "mid",
    },
    {
      /* a heart on the cover, where her name will go */
      kind: "tinyHeart",
      r: "17%",
      b: "19%",
      w: "w-[22px] md:w-[32px]",
      rot: -8,
      op: 0.32,
      color: "rose",
      motion: "twinkle",
      dur: 9.2,
      delay: -3.4,
      depth: "mid",
      mobile: true,
    },
    {
      /* a star low on the cover, keeping the heart company */
      kind: "miniStar",
      l: "24%",
      t: "31%",
      w: "w-[14px] md:w-[20px]",
      rot: 0,
      op: 0.36,
      color: "cream",
      motion: "twinkle",
      dur: 8,
      delay: -2,
      depth: "mid",
    },
    {
      /* the first line of the letter inside, glimpsed
         through the paper — too faint to read */
      kind: "scribble",
      l: "5%",
      b: "9%",
      w: "w-[130px] md:w-[220px]",
      rot: -1,
      op: 0.16,
      color: "rose",
      motion: "drift",
      dur: 62,
      delay: -28,
      lift: 12,
      dx: 7,
      depth: "mid",
      mobile: true,
    },
  ],
};

const STAINS: Record<BackdropVariant, StainSpec[]> = {
  home: [
    {
      l: "50%",
      t: "4%",
      w: "w-[380px] md:w-[680px]",
      h: "h-[260px] md:h-[420px]",
      cls: "-translate-x-1/2",
      color: "burgundy",
      alpha: 0.28,
      mobile: true,
    },
    {
      r: "-8%",
      b: "6%",
      w: "w-[300px] md:w-[520px]",
      h: "h-[240px] md:h-[380px]",
      color: "rose",
      alpha: 0.16,
      wash: true,
      dur: 52,
      delay: -14,
      mobile: true,
    },
    {
      l: "-12%",
      b: "-14%",
      w: "w-[360px] md:w-[640px]",
      h: "h-[280px] md:h-[460px]",
      color: "wine",
      alpha: 0.6,
    },
  ],
  beginning: [
    {
      r: "-6%",
      t: "2%",
      w: "w-[320px] md:w-[560px]",
      h: "h-[260px] md:h-[400px]",
      color: "burgundy",
      alpha: 0.24,
      wash: true,
      dur: 88,
      delay: -30,
      mobile: true,
    },
    {
      l: "-10%",
      b: "4%",
      w: "w-[300px] md:w-[520px]",
      h: "h-[240px] md:h-[360px]",
      color: "wine",
      alpha: 0.58,
      mobile: true,
    },
    {
      l: "30%",
      t: "46%",
      w: "w-[300px] md:w-[480px]",
      h: "h-[200px] md:h-[300px]",
      color: "paper",
      alpha: 0.6,
      motion: true,
      dur: 58,
      delay: -20,
    },
  ],
  things: [
    {
      l: "-8%",
      b: "0%",
      w: "w-[320px] md:w-[540px]",
      h: "h-[250px] md:h-[380px]",
      color: "rose",
      alpha: 0.15,
      mobile: true,
    },
    {
      r: "6%",
      t: "0%",
      w: "w-[300px] md:w-[500px]",
      h: "h-[240px] md:h-[360px]",
      color: "burgundy",
      alpha: 0.24,
      wash: true,
      dur: 76,
      delay: -8,
    },
  ],
  memories: [
    {
      l: "-6%",
      t: "4%",
      w: "w-[340px] md:w-[580px]",
      h: "h-[280px] md:h-[420px]",
      color: "burgundy",
      alpha: 0.26,
      wash: true,
      dur: 92,
      delay: -36,
      mobile: true,
    },
    {
      r: "8%",
      b: "8%",
      w: "w-[280px] md:w-[460px]",
      h: "h-[220px] md:h-[340px]",
      color: "rose",
      alpha: 0.14,
      motion: true,
      dur: 44,
      delay: -22,
      mobile: true,
    },
    {
      l: "24%",
      t: "52%",
      w: "w-[320px] md:w-[520px]",
      h: "h-[220px] md:h-[320px]",
      color: "paper",
      alpha: 0.55,
    },
  ],
  birthday: [
    {
      l: "50%",
      t: "2%",
      w: "w-[400px] md:w-[700px]",
      h: "h-[280px] md:h-[440px]",
      cls: "-translate-x-1/2",
      color: "warm",
      alpha: 0.34,
      wash: true,
      dur: 64,
      delay: -10,
      mobile: true,
    },
    {
      r: "-6%",
      b: "4%",
      w: "w-[340px] md:w-[560px]",
      h: "h-[260px] md:h-[400px]",
      color: "rose",
      alpha: 0.19,
      wash: true,
      dur: 58,
      delay: -22,
      mobile: true,
    },
    {
      l: "-10%",
      b: "-10%",
      w: "w-[340px] md:w-[600px]",
      h: "h-[260px] md:h-[420px]",
      color: "wine",
      alpha: 0.6,
    },
  ],
  song: [
    {
      r: "-4%",
      t: "6%",
      w: "w-[300px] md:w-[500px]",
      h: "h-[240px] md:h-[360px]",
      color: "burgundy",
      alpha: 0.2,
      mobile: true,
    },
    {
      l: "-8%",
      b: "6%",
      w: "w-[280px] md:w-[480px]",
      h: "h-[220px] md:h-[340px]",
      color: "wine",
      alpha: 0.55,
      mobile: true,
    },
  ],
  letters: [
    {
      r: "-4%",
      t: "4%",
      w: "w-[320px] md:w-[540px]",
      h: "h-[250px] md:h-[380px]",
      color: "burgundy",
      alpha: 0.23,
      wash: true,
      dur: 84,
      delay: -40,
      mobile: true,
    },
    {
      l: "-8%",
      b: "2%",
      w: "w-[300px] md:w-[500px]",
      h: "h-[240px] md:h-[360px]",
      color: "rose",
      alpha: 0.15,
      motion: true,
      dur: 50,
      delay: -16,
      mobile: true,
    },
    {
      l: "28%",
      t: "48%",
      w: "w-[300px] md:w-[480px]",
      h: "h-[200px] md:h-[300px]",
      color: "paper",
      alpha: 0.55,
    },
  ],
  gate: [
    {
      l: "50%",
      t: "8%",
      w: "w-[360px] md:w-[560px]",
      h: "h-[260px] md:h-[400px]",
      cls: "-translate-x-1/2",
      color: "burgundy",
      alpha: 0.24,
      mobile: true,
    },
    {
      l: "-10%",
      b: "-8%",
      w: "w-[320px] md:w-[560px]",
      h: "h-[260px] md:h-[420px]",
      color: "wine",
      alpha: 0.6,
      mobile: true,
    },
  ],
};

/* the deckle edge of the page — one wavy hairline down
   one side, alternating per room so the pages feel
   turned, not mirrored */
const PAGE_EDGE: Record<BackdropVariant, "start" | "end"> = {
  home: "start",
  beginning: "end",
  things: "start",
  memories: "end",
  birthday: "start",
  song: "end",
  letters: "start",
  gate: "end",
};

/* ————— the light blooms —————
   One region of each page's dark that warms up and
   cools down on its own long rhythm — a slow burgundy
   breath of atmosphere, swelling over half a minute
   and easing away. Placed like everything else here:
   by hand, at the edges, never behind a block of
   text's centre. The gate keeps none of its own — the
   sealed cover already has its breathing candle-glow */
interface BloomSpec {
  l?: string;
  r?: string;
  t?: string;
  b?: string;
  w: string;
  h: string;
  cls?: string;
  color: "burgundyMid" | "warm" | "rose";
  alpha: number;
  dur: number;
  delay: number;
  mobile?: boolean;
}

const BLOOMS: Record<BackdropVariant, BloomSpec[]> = {
  home: [
    {
      r: "12%",
      b: "18%",
      w: "w-[320px] md:w-[520px]",
      h: "h-[240px] md:h-[380px]",
      color: "burgundyMid",
      alpha: 0.13,
      dur: 46,
      delay: -12,
      mobile: true,
    },
  ],
  beginning: [
    {
      l: "8%",
      t: "34%",
      w: "w-[300px] md:w-[480px]",
      h: "h-[220px] md:h-[340px]",
      color: "burgundyMid",
      alpha: 0.12,
      dur: 52,
      delay: -30,
      mobile: true,
    },
  ],
  things: [
    {
      r: "10%",
      t: "30%",
      w: "w-[280px] md:w-[440px]",
      h: "h-[210px] md:h-[320px]",
      color: "rose",
      alpha: 0.08,
      dur: 44,
      delay: -8,
      mobile: true,
    },
  ],
  memories: [
    {
      r: "16%",
      b: "10%",
      w: "w-[300px] md:w-[460px]",
      h: "h-[220px] md:h-[330px]",
      color: "burgundyMid",
      alpha: 0.12,
      dur: 50,
      delay: -22,
      mobile: true,
    },
  ],
  birthday: [
    {
      l: "50%",
      t: "26%",
      w: "w-[340px] md:w-[540px]",
      h: "h-[250px] md:h-[380px]",
      cls: "-translate-x-1/2",
      color: "warm",
      alpha: 0.15,
      dur: 40,
      delay: -6,
      mobile: true,
    },
    {
      l: "6%",
      t: "12%",
      w: "w-[240px] md:w-[380px]",
      h: "h-[180px] md:h-[280px]",
      color: "burgundyMid",
      alpha: 0.11,
      dur: 54,
      delay: -34,
    },
  ],
  song: [
    {
      r: "-6%",
      b: "30%",
      w: "w-[240px] md:w-[360px]",
      h: "h-[180px] md:h-[260px]",
      color: "burgundyMid",
      alpha: 0.07,
      dur: 56,
      delay: -18,
      mobile: true,
    },
  ],
  letters: [
    {
      l: "14%",
      t: "22%",
      w: "w-[290px] md:w-[450px]",
      h: "h-[210px] md:h-[320px]",
      color: "burgundyMid",
      alpha: 0.12,
      dur: 48,
      delay: -26,
      mobile: true,
    },
  ],
  gate: [],
};

/* ————— the depth engine —————
   One scroll source and one pointer source feed all
   three bands. Motion values never re-render React —
   they write transforms straight to the compositor,
   so three full-screen layers of parallax cost almost
   nothing. */

/* how far each plane travels over the whole page, and
   how far it leans toward her pointer. The far plane
   drifts WITH the scroll's opposite — the desk beneath
   the book — while the near plane rises almost with the
   content, just slower. That separation is what the eye
   reads as depth. */
const BANDS: Record<Depth, { travel: number; px: number; py: number }> = {
  far: { travel: 22, px: 3, py: 2 },
  mid: { travel: -30, px: 5.5, py: 3.5 },
  near: { travel: -50, px: 8, py: 5 },
};

const POINTER_QUERY = "(pointer: fine) and (min-width: 768px)";

/* the pointer's gentle lean — desktop fine pointers only.
   Two springs do all the smoothing; the raw listener is
   four arithmetic operations */
function usePointerFlow(enabled: boolean) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 40, damping: 26, mass: 0.7 });
  const sy = useSpring(py, { stiffness: 40, damping: 26, mass: 0.7 });
  useEffect(() => {
    if (!enabled) return;
    if (typeof window.matchMedia !== "function") return;
    if (!window.matchMedia(POINTER_QUERY).matches) return;
    const onMove = (e: PointerEvent) => {
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, px, py]);
  return { sx, sy };
}

function useBand(
  depth: Depth,
  prog: MotionValue<number>,
  sx: MotionValue<number>,
  sy: MotionValue<number>,
) {
  const cfg = BANDS[depth];
  /* the progress is clamped by hand: a page with no
     scrollable height (the sealed gate) reports a
     degenerate 0/0 progress, and no band should ever
     inherit a NaN or an over-travelled offset from it */
  const scrollY = useTransform(prog, (p) => {
    const t = Number.isFinite(p) ? Math.min(Math.max(p, 0), 1) : 0;
    return t * cfg.travel;
  });
  const x = useTransform(sx, (v) => v * cfg.px);
  const pointerY = useTransform(sy, (v) => v * cfg.py);
  const y = useTransform([scrollY, pointerY], ([a, b]: number[]) => a + b);
  return { x, y };
}

/* ————— renderers ————— */

function Stain({ spec }: { spec: StainSpec }) {
  const rgb = STAIN_COLORS[spec.color];
  const animated = Boolean(spec.motion) || Boolean(spec.wash);
  const style: Record<string, string | number | undefined> = {
    left: spec.l,
    right: spec.r,
    top: spec.t,
    bottom: spec.b,
    background: `radial-gradient(closest-side, rgba(${rgb}, ${spec.alpha}) 0%, rgba(${rgb}, ${spec.alpha * 0.42}) 46%, transparent 74%)`,
  };
  if (spec.motion) {
    style["--bd-op"] = "1";
    style["--bd-dur"] = `${spec.dur ?? 44}s`;
    style["--bd-delay"] = `${-(spec.delay ?? 0)}s`;
  } else if (spec.wash) {
    style["--wdx"] = "22px";
    style["--wdy"] = "16px";
    style["--wd-dur"] = `${spec.dur ?? 84}s`;
    style["--wd-delay"] = `${-(spec.delay ?? 0)}s`;
  } else {
    style.opacity = 1;
  }
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-[100%]",
        spec.w,
        spec.h,
        spec.cls,
        !spec.mobile && "hidden md:block",
        spec.motion && "backdrop-breathe",
        spec.wash && "backdrop-wash",
      )}
      style={style as React.CSSProperties}
    />
  );
}

function Bloom({ spec }: { spec: BloomSpec }) {
  const rgb = STAIN_COLORS[spec.color];
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute rounded-[100%] bd-bloom",
        spec.w,
        spec.h,
        spec.cls,
        !spec.mobile && "hidden md:block",
      )}
      style={
        {
          left: spec.l,
          right: spec.r,
          top: spec.t,
          bottom: spec.b,
          background: `radial-gradient(closest-side, rgba(${rgb}, ${spec.alpha}) 0%, rgba(${rgb}, ${spec.alpha * 0.5}) 48%, transparent 76%)`,
          "--bd-dur": `${spec.dur}s`,
          "--bd-delay": `${spec.delay}s`,
        } as React.CSSProperties
      }
    />
  );
}

function Mark({ spec }: { spec: MarkSpec }) {
  const shape = MARK_SHAPES[spec.kind];
  const color = spec.color === "cream" ? "#F8F4F1" : "#B77C8D";
  const animated = Boolean(spec.motion);
  const style: Record<string, string | number | undefined> = {
    left: spec.l,
    right: spec.r,
    top: spec.t,
    bottom: spec.b,
    rotate: `${spec.rot}deg`,
  };
  if (animated) {
    /* the keyframes own opacity while breathing; the var
       keeps them honest to the mark's own faintness */
    style["--bd-op"] = `${spec.op}`;
    style["--bd-dur"] = `${spec.dur ?? 50}s`;
    style["--bd-delay"] = `${spec.delay ?? 0}s`;
    if (spec.motion === "sway" || spec.motion === "drift") {
      style["--bd-lift"] = `${spec.lift ?? (spec.motion === "drift" ? 12 : 26)}px`;
    }
    if (spec.motion === "drift") {
      style["--bd-dx"] = `${spec.dx ?? 7}px`;
    }
  } else {
    style.opacity = spec.op;
  }
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute block select-none",
        spec.w,
        spec.cls,
        !spec.mobile && "hidden md:block",
        spec.motion === "breathe" && "backdrop-breathe",
        spec.motion === "sway" && "backdrop-sway",
        spec.motion === "twinkle" && "backdrop-twinkle",
        spec.motion === "drift" && "backdrop-drift",
      )}
      style={style as React.CSSProperties}
    >
      {shape(color)}
    </span>
  );
}

/* ————— the rare events —————
   Once in a long while the page itself does something:
   a shooting star crosses a corner, a scrap of paper
   falls the height of the page, a line of handwriting
   draws itself in a margin and fades. Rare enough to
   stay special — the first comes after a quarter
   minute of quiet, then roughly one a minute at most.
   Never the middle of the page, never near a control,
   always pointer-transparent. The song room allows
   only the far shooting star: the cassette stays the
   one thing happening there. The gate keeps its own
   richer cover-scene and wants none of these */
type EvtKind = "shoot" | "fall" | "draw";

interface EvtState {
  kind: EvtKind;
  key: number;
  left?: string;
  right?: string;
  top?: string;
  dx?: number;
  dy?: number;
  ang?: number;
  sway?: number;
  dur?: number;
}

function OccasionalEvents({ variant }: { variant: BackdropVariant }) {
  const reduce = useReducedMotion();
  const [evt, setEvt] = useState<EvtState | null>(null);

  useEffect(() => {
    if (reduce || variant === "gate") return;
    let alive = true;
    let nextTimer = 0;
    let clearTimer = 0;

    const fire = () => {
      if (!alive) return;
      const kinds: EvtKind[] =
        variant === "song" ? ["shoot"] : ["shoot", "fall", "draw"];
      const kind = kinds[Math.floor(Math.random() * kinds.length)];
      let state: EvtState;
      if (kind === "shoot") {
        const fromRight = Math.random() < 0.5;
        state = {
          kind,
          key: Date.now(),
          ...(fromRight
            ? { right: `${8 + Math.random() * 16}%` }
            : { left: `${8 + Math.random() * 16}%` }),
          top: `${8 + Math.random() * 12}%`,
          dx: fromRight ? -(230 + Math.random() * 110) : 230 + Math.random() * 110,
          dy: 130 + Math.random() * 70,
          ang: fromRight ? 210 : 30,
        };
      } else if (kind === "fall") {
        state = {
          kind,
          key: Date.now(),
          left: `${12 + Math.random() * 72}%`,
          top: "0%",
          sway: (Math.random() < 0.5 ? -1 : 1) * (24 + Math.random() * 38),
          dur: 6 + Math.random() * 2.2,
        };
      } else {
        state = {
          kind,
          key: Date.now(),
          ...(Math.random() < 0.5 ? { left: "6%" } : { right: "6%" }),
          top: `${26 + Math.random() * 44}%`,
        };
      }
      setEvt(state);
      const life =
        kind === "shoot"
          ? 1700
          : kind === "fall"
            ? (state.dur ?? 7) * 1000 + 300
            : 5400;
      clearTimer = window.setTimeout(() => {
        if (alive) setEvt(null);
      }, life);
      nextTimer = window.setTimeout(fire, 26000 + Math.random() * 38000);
    };

    /* the first event arrives after a stretch of quiet —
       long enough to prove it isn't a loop, soon enough
       that the universe shows it can */
    nextTimer = window.setTimeout(fire, 15000 + Math.random() * 15000);

    return () => {
      alive = false;
      window.clearTimeout(nextTimer);
      window.clearTimeout(clearTimer);
    };
  }, [variant, reduce]);

  if (reduce || !evt) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {evt.kind === "shoot" && (
        <span
          key={evt.key}
          className="evt-shoot absolute block"
          style={
            {
              left: evt.left,
              right: evt.right,
              top: evt.top,
              "--evt-dx": `${evt.dx ?? 240}px`,
              "--evt-dy": `${evt.dy ?? 150}px`,
              "--evt-ang": `${evt.ang ?? 30}deg`,
            } as React.CSSProperties
          }
        >
          <svg width="96" height="10" viewBox="0 0 96 10" fill="none" aria-hidden>
            <defs>
              <linearGradient
                id={`evt-trail-${evt.key}`}
                x1="0"
                y1="0"
                x2="96"
                y2="0"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#F8F4F1" stopOpacity="0" />
                <stop offset="1" stopColor="#F8F4F1" stopOpacity="0.75" />
              </linearGradient>
            </defs>
            <line
              x1="2"
              y1="5"
              x2="78"
              y2="5"
              stroke={`url(#evt-trail-${evt.key})`}
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <path
              d="M88 0.5 C 88.8 3.2, 89.8 4.2, 92.5 5 C 89.8 5.8, 88.8 6.8, 88 9.5 C 87.2 6.8, 86.2 5.8, 83.5 5 C 86.2 4.2, 87.2 3.2, 88 0.5 Z"
              fill="#F8F4F1"
              opacity="0.9"
            />
          </svg>
        </span>
      )}
      {evt.kind === "fall" && (
        <span
          key={evt.key}
          className="evt-fall absolute top-0 block h-[9px] w-[7px] rounded-[1.5px]"
          style={
            {
              left: evt.left,
              background: "rgba(236,225,216,0.9)",
              boxShadow: "0 1px 2px rgba(0,0,0,0.35)",
              "--evt-sway": `${evt.sway ?? 40}px`,
              "--evt-dur": `${evt.dur ?? 7}s`,
            } as React.CSSProperties
          }
        />
      )}
      {evt.kind === "draw" && (
        <span
          key={evt.key}
          className="absolute block h-6 w-[150px]"
          style={{ left: evt.left, right: evt.right, top: evt.top }}
        >
          <svg viewBox="0 0 150 24" fill="none" className="evt-draw h-full w-full" aria-hidden>
            <path
              d="M4 16 C 10 6, 16 6, 18 14 C 20 21, 27 20, 32 11 C 37 4, 45 5, 47 13 C 49 20, 57 19, 63 10 C 68 3, 76 4, 78 12 C 80 19, 89 18, 95 9 C 100 3, 108 4, 110 11 C 112 17, 121 16, 127 8 C 132 3, 140 4, 144 10"
              stroke="#B77C8D"
              strokeWidth="1.8"
              strokeLinecap="round"
              pathLength="200"
              strokeDasharray="200"
            />
          </svg>
        </span>
      )}
    </div>
  );
}

/* ————— the marks + stains of one room, on three planes —————
   Used by the shell (fixed, per room) and by the gate
   (absolute, sealed stage). The three bands each carry
   their own parallax — the same component gives the
   password screen a page that leans with her cursor. */
export function BackdropMarks({ variant }: { variant: BackdropVariant }) {
  const reduce = useReducedMotion();
  const marks = MARKS[variant];
  const stains = STAINS[variant];
  const edgeSide = PAGE_EDGE[variant];

  /* one scroll source, eased by a spring so the page
     glides rather than steps — and one pointer source.
     The progress is computed by hand rather than read as
     scrollYProgress: a page with nothing to scroll (the
     sealed gate) reports a degenerate progress of 1, and
     the bands must never inherit that as full travel */
  const { scrollY } = useScroll();
  const progRaw = useTransform(scrollY, (y) => {
    if (typeof document === "undefined") return 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 40 ? Math.min(Math.max(y / max, 0), 1) : 0;
  });
  const prog = useSpring(progRaw, {
    stiffness: 36,
    damping: 30,
    mass: 0.9,
  });
  const { sx, sy } = usePointerFlow(!reduce);

  const far = useBand("far", prog, sx, sy);
  const mid = useBand("mid", prog, sx, sy);
  const near = useBand("near", prog, sx, sy);

  const farMarks = marks.filter((m) => (m.depth ?? "mid") === "far");
  const midMarks = marks.filter((m) => (m.depth ?? "mid") === "mid");
  const nearMarks = marks.filter((m) => (m.depth ?? "mid") === "near");
  const blooms = BLOOMS[variant];

  const pageEdge = (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute top-0 hidden h-[72vh] w-[5px] md:block",
        edgeSide === "start" ? "left-[3%]" : "right-[3%]",
      )}
      style={{ opacity: 0.05 }}
    >
      <PageEdge color="#F8F4F1" />
    </span>
  );

  if (reduce) {
    /* the whole engine rests — every mark sits exactly
       where it was drawn, still visible, still faint */
    return (
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden select-none">
        {stains.map((s, i) => (
          <Stain key={`st${i}`} spec={s} />
        ))}
        {blooms.map((b, i) => (
          <Bloom key={`bl${i}`} spec={b} />
        ))}
        {[...farMarks, ...midMarks, ...nearMarks].map((m, i) => (
          <Mark key={`mk${i}`} spec={m} />
        ))}
        {pageEdge}
      </div>
    );
  }

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden select-none">
      {/* the far plane — ink pressed into the deepest fibers of the page,
          and the slow light blooms rising out of it */}
      <motion.div className="absolute inset-0 will-change-transform" style={far}>
        {stains.map((s, i) => (
          <Stain key={`fst${i}`} spec={s} />
        ))}
        {blooms.map((b, i) => (
          <Bloom key={`fbl${i}`} spec={b} />
        ))}
        {farMarks.map((m, i) => (
          <Mark key={`fmk${i}`} spec={m} />
        ))}
        {pageEdge}
      </motion.div>
      {/* the drawn page itself */}
      <motion.div className="absolute inset-0 will-change-transform" style={mid}>
        {midMarks.map((m, i) => (
          <Mark key={`mmk${i}`} spec={m} />
        ))}
      </motion.div>
      {/* the paper things laid on top */}
      <motion.div className="absolute inset-0 will-change-transform" style={near}>
        {nearMarks.map((m, i) => (
          <Mark key={`nmk${i}`} spec={m} />
        ))}
      </motion.div>
      {/* and, once in a long while — a star, a falling scrap,
          a line being written. The universe proving it can */}
      <OccasionalEvents variant={variant} />
    </div>
  );
}

/* the shell's copy — fixed to the viewport. Turning to
   another room no longer crossfades between two still
   lifes: the new page settles onto the desk, easing out
   of a breath of scale and height, like paper landing */
const VIEW_VARIANT: Record<ViewId, BackdropVariant> = {
  home: "home",
  beginning: "beginning",
  things: "things",
  memories: "memories",
  birthday: "birthday",
  song: "song",
  letters: "letters",
};

export default function ScrapbookBackdrop({ view }: { view: ViewId }) {
  const reduce = useReducedMotion();
  return (
    <AnimatePresence initial={false}>
      <motion.div
        key={view}
        initial={{ opacity: 0, scale: reduce ? 1 : 1.018, y: reduce ? 0 : -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, y: reduce ? 0 : 8 }}
        transition={{ duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <BackdropMarks variant={VIEW_VARIANT[view]} />
      </motion.div>
    </AnimatePresence>
  );
}
