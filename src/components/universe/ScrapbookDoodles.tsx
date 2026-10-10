"use client";

/* ————————————————————————————————————————————————
   ScrapbookDoodles — the living background.

   A handful of tiny hand-drawn marks scattered through
   the pages of this universe: imperfect hearts, pen
   stars, sparkles, dot clusters, short curves, little
   x's, envelope doodles, paper marks. They sit BEHIND
   everything (a -z-10 layer inside the room's own
   stacking context), never intercept a pointer, and
   never ask for attention:

     · some are perfectly still, like old ink
     · some breathe in and out of notice over ~10s
     · a few drift a few pixels, like paper settling
     · a small group shifts very slightly with the
       page as she scrolls — one transform for all

   There is no heart rain here. The density is sparse
   on purpose: she discovers them, they never announce
   themselves. On small screens most of them quietly
   step aside (hidden md:block), and every motion
   yields to prefers-reduced-motion.

   Placement is deterministic per room (seeded), so the
   marks stay exactly where they were drawn — across
   renders, languages and visits.
———————————————————————————————————————————————— */

import { useMemo, type CSSProperties } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

export type DoodleVariant =
  | "home"
  | "beginning"
  | "things"
  | "memories"
  | "letters"
  | "birthdayPage"
  | "birthdayRoom"
  | "gate";

/* ————— the little drawings themselves —————
   Every path is deliberately a touch imperfect —
   drawn by a hand, not plotted by a machine. */

export function HeartOutline({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-full w-full">
      <path
        d="M12 20.3 C 7.6 16.9 3.2 13.3 3.5 9.0 C 3.7 6.3 5.4 4.6 7.5 4.8 C 9.1 4.95 10.8 5.7 12 7.5 C 13.1 5.6 14.9 4.6 16.7 4.75 C 18.8 4.9 20.5 6.5 20.4 9.2 C 20.2 13.4 16.4 16.7 12 20.3"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeartFill({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-full w-full">
      <path
        d="M12 20.6 C 7.8 17.0 3.8 13.5 3.8 9.3 C 3.8 6.6 5.7 4.9 7.8 4.9 C 9.4 4.9 11.0 5.8 12 7.5 C 13.0 5.8 14.6 4.9 16.2 4.9 C 18.3 4.9 20.2 6.6 20.2 9.3 C 20.2 13.5 16.2 17.0 12 20.6"
        fill={color}
      />
    </svg>
  );
}

export function PenStar({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-full w-full">
      <path
        d="M12 3.2 L13.7 10.3 L20.8 12 L13.7 13.7 L12 20.8 L10.3 13.7 L3.2 12 L10.3 10.3 Z"
        fill={color}
      />
    </svg>
  );
}

export function Sparkle({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden className="h-full w-full">
      <g
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        transform="rotate(14 12 12)"
      >
        <path d="M12 4.5 V19.5" />
        <path d="M6 8.2 L18 15.8" />
        <path d="M18 8.2 L6 15.8" />
      </g>
    </svg>
  );
}

function DotCluster({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 20 18" fill="none" aria-hidden className="h-full w-full">
      <circle cx="5.2" cy="6.2" r="1.7" fill={color} />
      <circle cx="12.6" cy="4.2" r="1.2" fill={color} opacity="0.75" />
      <circle cx="9.4" cy="12.6" r="1.0" fill={color} opacity="0.55" />
    </svg>
  );
}

function InkCurve({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 32 12" fill="none" aria-hidden className="h-full w-full">
      <path
        d="M2 9 C 9 2.5, 20 3.5, 30 7.5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TinyX({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden className="h-full w-full">
      <g stroke={color} strokeWidth="1.4" strokeLinecap="round">
        <path d="M2.6 2.6 L9.4 9.4" />
        <path d="M9.4 2.6 L2.6 9.4" />
      </g>
    </svg>
  );
}

function SquiggleUnderline({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 36 8" fill="none" aria-hidden className="h-full w-full">
      <path
        d="M2 5.5 C 8 2.2, 13 7.4, 18 5 S 28 2.4, 34 5"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function EnvelopeDoodle({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 18" fill="none" aria-hidden className="h-full w-full">
      <rect
        x="2.4"
        y="3.4"
        width="19.2"
        height="12.4"
        rx="1.6"
        stroke={color}
        strokeWidth="1.4"
      />
      <path
        d="M3.2 4.6 L12 11 L20.8 4.6"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PaperMark({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 10 14" fill="none" aria-hidden className="h-full w-full">
      <rect
        x="1.6"
        y="1.6"
        width="6.8"
        height="10.8"
        rx="1.2"
        fill={color}
        transform="rotate(7 5 7)"
      />
    </svg>
  );
}

function TapeMark({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 26 12" fill="none" aria-hidden className="h-full w-full">
      {/* a little strip of washi, stuck down at one corner */}
      <path
        d="M2.2 4.1 L21.4 1.6 C 23 1.4, 24 2.4, 23.8 4 L23.2 8.2 C 23 9.7, 21.8 10.4, 20.3 10.2 L2.8 7.8 C 1.4 7.6, 1 6.7, 1.2 5.6 Z"
        fill={color}
        transform="rotate(-8 13 6)"
      />
    </svg>
  );
}

function PenArrow({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 30 14" fill="none" aria-hidden className="h-full w-full">
      {/* a pen stroke that wandered somewhere, pointing at it */}
      <path
        d="M2.5 10.5 C 10 9.2, 18 8.4, 25.5 5"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M20.6 3.4 L26 4.7 L23.7 9.5"
        stroke={color}
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

function TornScrap({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 16 12" fill="none" aria-hidden className="h-full w-full">
      {/* a torn bit of paper that fell and stayed */}
      <path
        d="M1.5 2.5 L6 1.2 L9.5 2.8 L14 1.8 L15 6.5 L11.5 8 L13 10.5 L7.5 9.2 L3.5 10.8 L2.2 7.2 L0.8 5.8 Z"
        fill={color}
      />
    </svg>
  );
}

type ShapeId =
  | "heartOutline"
  | "heartFill"
  | "star"
  | "sparkle"
  | "dots"
  | "curve"
  | "x"
  | "underline"
  | "envelope"
  | "paperMark"
  | "tape"
  | "arrow"
  | "scrap";

const SHAPES: Record<
  ShapeId,
  { draw: (c: string) => React.ReactNode; ratio: number }
> = {
  heartOutline: { draw: (c) => <HeartOutline color={c} />, ratio: 1 },
  heartFill: { draw: (c) => <HeartFill color={c} />, ratio: 1 },
  star: { draw: (c) => <PenStar color={c} />, ratio: 1 },
  sparkle: { draw: (c) => <Sparkle color={c} />, ratio: 1 },
  dots: { draw: (c) => <DotCluster color={c} />, ratio: 0.9 },
  curve: { draw: (c) => <InkCurve color={c} />, ratio: 0.38 },
  x: { draw: (c) => <TinyX color={c} />, ratio: 1 },
  underline: { draw: (c) => <SquiggleUnderline color={c} />, ratio: 0.22 },
  envelope: { draw: (c) => <EnvelopeDoodle color={c} />, ratio: 0.75 },
  paperMark: { draw: (c) => <PaperMark color={c} />, ratio: 1.4 },
  tape: { draw: (c) => <TapeMark color={c} />, ratio: 0.46 },
  arrow: { draw: (c) => <PenArrow color={c} />, ratio: 0.47 },
  scrap: { draw: (c) => <TornScrap color={c} />, ratio: 0.75 },
};

/* ————— a seeded little randomness, so nothing moves
   between renders — the marks were drawn once, by hand ————— */

function hashSeed(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ————— each room's own recipe —————
   Sparse. Deliberate. Never the same feel twice:
   home keeps to hearts and stars, our beginning to
   inked lines, little things to playful marks, memories
   to paper, letters to envelopes, and the birthday room
   is allowed to be a little warmer and fuller. */

interface DoodleSpec {
  shape: ShapeId;
  x: number;
  y: number;
  size: number;
  rot: number;
  color: string;
  opacity: number;
  motion: "still" | "fade" | "drift" | "twinkle" | "float";
  dur: number;
  delay: number;
  desktopOnly: boolean;
  scrollGroup: boolean;
}

const RECIPES: Record<
  DoodleVariant,
  { shapes: ShapeId[]; roseRange: [number, number]; creamRange: [number, number] }
> = {
  home: {
    shapes: [
      "heartFill", "star", "heartOutline", "sparkle", "dots", "curve",
      "star", "heartFill", "heartOutline", "sparkle", "dots", "curve",
      "star", "scrap",
    ],
    roseRange: [0.2, 0.36],
    creamRange: [0.1, 0.2],
  },
  beginning: {
    shapes: [
      "curve", "x", "heartOutline", "star", "dots", "underline",
      "curve", "heartFill", "star", "underline", "x", "arrow",
    ],
    roseRange: [0.18, 0.32],
    creamRange: [0.09, 0.18],
  },
  things: {
    shapes: [
      "sparkle", "x", "star", "dots", "heartFill", "sparkle",
      "heartOutline", "dots", "star", "x", "arrow", "tape",
    ],
    roseRange: [0.2, 0.34],
    creamRange: [0.1, 0.2],
  },
  memories: {
    shapes: [
      "heartOutline", "star", "dots", "curve", "paperMark", "heartOutline",
      "paperMark", "star", "dots", "heartFill", "curve", "scrap", "tape",
    ],
    roseRange: [0.2, 0.34],
    creamRange: [0.1, 0.2],
  },
  letters: {
    shapes: [
      "envelope", "curve", "heartFill", "dots", "sparkle", "x",
      "envelope", "heartOutline", "curve", "envelope", "star", "tape",
    ],
    roseRange: [0.18, 0.34],
    creamRange: [0.1, 0.2],
  },
  birthdayPage: {
    shapes: [
      "heartOutline", "star", "sparkle", "heartFill", "curve", "star",
      "dots", "sparkle", "heartOutline", "star",
    ],
    roseRange: [0.22, 0.38],
    creamRange: [0.12, 0.22],
  },
  /* the birthday room itself — the one place allowed to
     feel noticeably magical: a few more hearts, twinkling
     sparkles, confetti-like paper marks, all still quiet */
  birthdayRoom: {
    shapes: [
      "heartOutline", "star", "sparkle", "paperMark", "heartFill",
      "dots", "heartOutline", "sparkle", "star", "paperMark",
      "heartFill", "star", "dots", "sparkle",
    ],
    roseRange: [0.36, 0.55],
    creamRange: [0.18, 0.32],
  },
  /* the sealed stage before the universe — the same hand,
     drawing quieter still, so the dark does not feel dead
     while she finds the word */
  gate: {
    shapes: [
      "heartOutline", "star", "sparkle", "dots", "heartFill",
      "curve", "star", "dots", "heartOutline",
    ],
    roseRange: [0.12, 0.22],
    creamRange: [0.07, 0.14],
  },
};

function buildDoodles(variant: DoodleVariant): DoodleSpec[] {
  const recipe = RECIPES[variant];
  const rnd = mulberry32(hashSeed(variant));
  const total = recipe.shapes.length;
  /* small screens keep a little over half of the marks —
     intelligently fewer, never just smaller */
  const mobileCount = Math.ceil(total * 0.6);

  return recipe.shapes.map((shape, i) => {
    /* side bands mostly; a few mid-page, quieter still */
    const side = rnd() < 0.62;
    const x = side
      ? rnd() < 0.5
        ? 3 + rnd() * 15
        : 82 + rnd() * 14
      : 22 + rnd() * 56;
    const y = 4 + rnd() * 90;
    const size =
      shape === "curve" || shape === "underline"
        ? 26 + rnd() * 22
        : shape === "envelope"
          ? 22 + rnd() * 10
          : shape === "tape" || shape === "arrow"
            ? 24 + rnd() * 14
            : 10 + rnd() * 9;
    const rose = rnd() < 0.68;
    const [lo, hi] = rose ? recipe.roseRange : recipe.creamRange;
    const opacity = lo + rnd() * (hi - lo);
    /* mid-page marks hide a little deeper in the paper */
    const inMiddle = !side;
    const finalOpacity = inMiddle ? opacity * 0.6 : opacity;

    const motionCycle = [
      "fade", "still", "drift", "still", "float", "fade", "twinkle",
    ] as const;
    let motion = motionCycle[(i + Math.floor(rnd() * 2)) % motionCycle.length];
    /* sparkles prefer to twinkle; paper-like marks never do —
       tape, scraps and envelopes are physical things */
    if (shape === "sparkle" && rnd() < 0.7) motion = "twinkle";
    if (
      shape === "paperMark" ||
      shape === "envelope" ||
      shape === "tape" ||
      shape === "scrap"
    ) {
      motion = motion === "twinkle" ? "still" : motion;
    }

    const dur =
      motion === "twinkle"
        ? 3.6 + rnd() * 1.8
        : motion === "drift"
          ? 11 + rnd() * 6
          : motion === "float"
            ? 16 + rnd() * 10
            : 9 + rnd() * 5;
    /* negative delays desynchronise the breathing — nothing
       pulses in unison, ever */
    const delay = -(rnd() * dur);

    return {
      shape,
      x,
      y,
      size,
      rot: (rnd() - 0.5) * 44,
      color: rose ? "#B77C8D" : "#F8F4F1",
      opacity: finalOpacity,
      motion,
      dur,
      delay,
      desktopOnly: i >= mobileCount,
      scrollGroup: i % 3 === 2,
    };
  });
}

/* ————— one doodle ————— */
function Doodle({ spec }: { spec: DoodleSpec }) {
  const s = SHAPES[spec.shape];
  const h = Math.round(spec.size * s.ratio);
  const style: CSSProperties & Record<string, string | number> = {
    left: `${spec.x}%`,
    top: `${spec.y}%`,
    width: `${Math.round(spec.size)}px`,
    height: `${h}px`,
    opacity: spec.motion === "fade" ? spec.opacity * 0.8 : spec.opacity,
    "--d-rot": `${spec.rot}deg`,
  };
  if (spec.motion === "float") {
    /* the slowest breath — 8 to 14 pixels of lift */
    style["--d-lift"] = `${8 + (Math.abs(spec.rot) / 44) * 6}px`;
  } else if (spec.motion === "fade") {
    style["--d-min"] = `${spec.opacity * 0.45}`;
    style["--d-max"] = `${Math.min(spec.opacity * 1.35, 0.85)}`;
  } else if (spec.motion === "twinkle") {
    style["--d-min"] = `${spec.opacity * 0.3}`;
    style["--d-max"] = `${Math.min(spec.opacity * 1.5, 0.9)}`;
  }
  if (spec.motion !== "still") {
    style["--d-dur"] = `${spec.dur.toFixed(2)}s`;
    style["--d-delay"] = `${spec.delay.toFixed(2)}s`;
  }

  return (
    <span
      aria-hidden
      className={cn(
        "absolute block select-none",
        spec.desktopOnly && "hidden md:block",
        spec.motion === "fade" && "doodle-fade",
        spec.motion === "drift" && "doodle-drift",
        spec.motion === "twinkle" && "doodle-twinkle",
        spec.motion === "float" && "doodle-float",
      )}
      style={style}
    >
      {s.draw(spec.color)}
    </span>
  );
}

/* ————— the layer ————— */
export default function ScrapbookDoodles({
  variant,
  className,
  enterFade = false,
}: {
  variant: DoodleVariant;
  className?: string;
  /** fade the whole set in on first mount (the birthday
      room's warm "someone was just here" arrival) */
  enterFade?: boolean;
}) {
  const reduce = useReducedMotion();
  const doodles = useMemo(() => buildDoodles(variant), [variant]);

  /* the scroll group — a few marks shifting very slightly
     with the page. ONE transform drives all of them */
  const { scrollY } = useScroll();
  const shift = useTransform(scrollY, [0, 700], [0, -15]);
  const scrollSet = doodles.filter((d) => d.scrollGroup);
  const calmSet = doodles.filter((d) => !d.scrollGroup);

  const layer = (children: React.ReactNode) =>
    enterFade ? (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : 1.1, delay: 0.12, ease: "easeOut" }}
        className="absolute inset-0"
      >
        {children}
      </motion.div>
    ) : (
      <>{children}</>
    );

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 select-none overflow-hidden",
        className,
      )}
    >
      {layer(
        <>
          {/* the scroll-reactive few */}
          <motion.div
            style={reduce ? undefined : { y: shift }}
            className="absolute inset-0"
          >
            {scrollSet.map((d, i) => (
              <Doodle key={`s${i}`} spec={d} />
            ))}
          </motion.div>
          {/* the calm rest */}
          {calmSet.map((d, i) => (
            <Doodle key={`c${i}`} spec={d} />
          ))}
        </>,
      )}
    </div>
  );
}
