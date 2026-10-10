"use client";

/* ————————————————————————————————————————————————
   "and the moon —" the phase of the moon the night it
   began, next to tonight's. Pure arithmetic; a quiet
   outro for the Our Beginning thread.
———————————————————————————————————————————————— */

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useContent, useLang } from "./Lang";
import { moonPhase, type MoonPhase } from "@/lib/moonPhase";

/* one moon disc — dark side + the lit region (semicircle ± ellipse terminator) */
function MoonDisc({
  phase,
  delay,
  ariaLabel,
}: {
  phase: MoonPhase;
  delay: number;
  ariaLabel: string;
}) {
  const R = 44;
  const lit = phase.illumination;
  const k = Math.cos(2 * Math.PI * phase.fraction); // 1 new → -1 full
  const rx = Math.abs(k) * R;

  /* the lit region: limb semicircle + terminator ellipse arc */
  let d = "";
  if (lit > 0.02) {
    if (phase.waxing) {
      const sweep = k > 0 ? 1 : 0; // crescent hugs the limb, gibbous crosses center
      d = `M 0 ${-R} A ${R} ${R} 0 0 1 0 ${R} A ${rx} ${R} 0 0 ${sweep} 0 ${-R} Z`;
    } else {
      const sweep = k > 0 ? 0 : 1;
      d = `M 0 ${-R} A ${R} ${R} 0 0 0 0 ${R} A ${rx} ${R} 0 0 ${sweep} 0 ${-R} Z`;
    }
  }

  return (
    <motion.span
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center"
    >
      <svg
        viewBox="-52 -52 104 104"
        width="88"
        height="88"
        role="img"
        aria-label={ariaLabel}
      >
        <defs>
          <radialGradient id={`moonlight-${delay}`} cx="0.38" cy="0.34" r="0.9">
            <stop offset="0" stopColor="#F8F4F1" />
            <stop offset="0.65" stopColor="#EDDFD9" />
            <stop offset="1" stopColor="#D9C3C9" />
          </radialGradient>
        </defs>
        {/* the dark disc */}
        <circle
          r={R}
          fill="#1c0e15"
          stroke="rgba(183,124,141,0.35)"
          strokeWidth="1"
        />
        {/* the lit part */}
        {d && <path d={d} fill={`url(#moonlight-${delay})`} />}
        {/* two faint craters on the lit side, for texture */}
        {d && (
          <g fill="#B77C8D" opacity="0.22">
            <circle cx={phase.waxing ? 12 : -14} cy={-10} r="3.2" />
            <circle cx={phase.waxing ? 22 : -26} cy={8} r="2.1" />
            <circle cx={phase.waxing ? 4 : -6} cy={16} r="1.6" />
          </g>
        )}
      </svg>
    </motion.span>
  );
}

export default function MoonCard() {
  const reduce = useReducedMotion();
  const { moonCard, relationship } = useContent();
  const { lang } = useLang();

  const thatNight = useMemo(
    () =>
      moonPhase(
        new Date(`${relationship.startDate}T${relationship.startTime}:00`)
      ),
    [relationship]
  );
  const tonight = useMemo(() => moonPhase(new Date()), []);

  /* the phases say their names in her language — the engine's
     English names are just the lookup key */
  const phaseName = (phase: MoonPhase) =>
    lang === "ar"
      ? moonCard.phaseNames[phase.name] ?? phase.name
      : phase.name;
  const discAria = (phase: MoonPhase) =>
    moonCard.ariaTemplate
      .replace("{p}", String(Math.round(phase.illumination * 100)))
      .replace("{phase}", phaseName(phase));

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto mt-16 max-w-md rounded-2xl border border-rose/10 bg-paper-card/50 px-6 py-9 text-center"
    >
      <p className="text-[10px] uppercase tracking-[0.32em] text-rose/70">
        {moonCard.overline}
      </p>

      <div className="mt-7 flex items-start justify-center gap-9 sm:gap-14">
        <div className="flex flex-col items-center">
          <MoonDisc phase={thatNight} delay={0.05} ariaLabel={discAria(thatNight)} />
          <p className="mt-3.5 font-hand text-lg leading-tight text-cream/85">
            {moonCard.thatNightLabel}
          </p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-rose-soft/80">
            {moonCard.captionTemplate.replace("{phase}", phaseName(thatNight))}
          </p>
        </div>

        <span
          aria-hidden
          className="mt-9 hidden text-burgundy sm:inline"
        >
          ♡
        </span>

        <div className="flex flex-col items-center">
          <MoonDisc phase={tonight} delay={0.18} ariaLabel={discAria(tonight)} />
          <p className="mt-3.5 font-hand text-lg leading-tight text-cream/85">
            {moonCard.tonightLabel}
          </p>
          <p className="mt-1 text-[9px] uppercase tracking-[0.22em] text-rose-soft/80">
            {moonCard.captionTemplate.replace("{phase}", phaseName(tonight))}
          </p>
        </div>
      </div>

      <p className="mt-8 font-display text-lg italic text-rose/85">
        {moonCard.line}
      </p>
    </motion.div>
  );
}
