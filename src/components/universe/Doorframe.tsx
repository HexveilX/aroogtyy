"use client";

/* ————————————————————————————————————————————————
   the doorframe — little anniversaries marked in
   pencil, like the strip of wood where a family
   notches a child's height each year. Passed marks
   carry a stamp; future ones wait in faint graphite;
   today's gets a small celebration.
———————————————————————————————————————————————— */

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { useContent, useLang } from "./Lang";
import type { Content } from "@/content/arooqtyContent";
import {
  diffWall,
  parseStartWall,
  wallClockInZone,
} from "@/lib/timeTogether";
import { Reveal } from "./Shared";
import { cn } from "@/lib/utils";

const DAY_MS = 86_400_000;

type Rel = Content["relationship"];

/* the calendar date of a given day-number (day 1 = the start) */
function dateOfDay(day: number, relationship: Rel): Date {
  const start = parseStartWall(relationship.startDate, relationship.startTime);
  const base = Date.UTC(start.year, start.month - 1, start.day);
  return new Date(base + (day - 1) * DAY_MS);
}

function stampOfDay(day: number, relationship: Rel): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    })
      .format(dateOfDay(day, relationship))
      .toUpperCase();
  } catch {
    return dateOfDay(day, relationship).toDateString();
  }
}

export default function Doorframe() {
  const reduce = useReducedMotion();
  const { doorframe: cfg, relationship } = useContent();
  const { isArabic } = useLang();

  const { dayNumber, marks, todayPct } = useMemo(() => {
    const start = parseStartWall(
      relationship.startDate,
      relationship.startTime
    );
    const now = new Date();
    const duration = diffWall(start, wallClockInZone(now, relationship.timezone));
    const today = duration.totalDays + 1; // the day it all began counts as day one

    const marks = cfg.milestones.map((m) => {
      const daysUntil = m.day - today;
      return {
        ...m,
        passed: daysUntil < 0,
        isToday: daysUntil === 0,
        daysUntil: Math.abs(daysUntil),
        stamp: stampOfDay(m.day, relationship),
      };
    });

    /* the proportional position of "today" across the strip —
       clamped between the first and last milestone so a fresh
       start (day 1) sits at the very left and the far future
       (day 1000+) caps at the very right */
    const first = cfg.milestones[0]?.day ?? 1;
    const last = cfg.milestones[cfg.milestones.length - 1]?.day ?? 1;
    const raw = (today - first) / Math.max(1, last - first);
    const pct = Math.min(1, Math.max(0, raw)) * 100;

    return { dayNumber: today, marks, todayPct: pct };
  }, [cfg, relationship]);

  const todayMark = marks.find((m) => m.isToday);

  return (
    <Reveal className="mx-auto mt-8 w-[min(92vw,460px)]" delay={0.04}>
      <section
        aria-label={cfg.srLabel}
        className="relative rounded-xl border border-rose/12 bg-paper-card/50 px-5 pb-4 pt-4 polaroid-shadow"
      >
        {/* overline */}
        <p className="text-[10px] uppercase tracking-[0.3em] text-rose-soft/85">
          {cfg.overline}
          <span className="ms-2 font-hand text-sm normal-case tracking-normal text-cream/80">
            {cfg.title}
          </span>
        </p>

        {/* the wooden strip with pencil ticks */}
        <div
          role="img"
          aria-label={cfg.srLabel}
          className="relative mt-4 rounded-md border border-[#8a4a5c]/20 bg-gradient-to-b from-[#2d1a1f]/70 to-[#1c1014]/70 px-4 py-4"
        >
          {/* the wood grain — three faint wavy hairlines */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-md">
            {[18, 46, 72].map((top, i) => (
              <svg
                key={top}
                viewBox="0 0 300 8"
                preserveAspectRatio="none"
                className="absolute left-0 w-full"
                style={{ top: `${top}%`, height: 8, opacity: 0.10 + i * 0.02 }}
              >
                <path
                  d={`M0 ${i % 2 ? 5 : 3} C 60 ${i % 2 ? 1 : 6}, 120 ${i % 2 ? 7 : 2}, 180 ${i % 2 ? 3 : 5} S 280 ${i % 2 ? 6 : 2}, 300 ${i % 2 ? 4 : 3}`}
                  stroke="#B77C8D"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>
            ))}
          </div>

          {/* the ticks, oldest → newest */}
          <div className="relative flex items-end justify-between gap-1.5">
            {/* the "you are here" tag — floats above today's
                proportional position on the strip, even when
                today isn't a milestone. In Arabic the strip reads
                right-to-left, so the tag anchors from the right. */}
            {!todayMark && (
              <motion.div
                aria-hidden
                initial={reduce ? false : { opacity: 0, y: -3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: reduce ? 0 : 0.5,
                  delay: reduce ? 0 : 0.4,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={cn(
                  "pointer-events-none absolute -top-3 z-10 flex flex-col items-center",
                  isArabic
                    ? "translate-x-1/2"
                    : "-translate-x-1/2"
                )}
                style={
                  isArabic
                    ? { right: `${todayPct}%` }
                    : { left: `${todayPct}%` }
                }
              >
                <span
                  className="mb-0.5 rotate-[-3deg] rounded-sm border border-[#B77C8D]/45 bg-cream/95 px-1.5 py-[1px] font-hand text-[10px] leading-none text-burgundy shadow-[0_2px_4px_-2px_rgba(0,0,0,0.45)]"
                >
                  {cfg.youAreHere}
                </span>
                {/* the small heart tucked at the tag's corner */}
                <Heart
                  className="absolute -end-1 -top-1 h-2 w-2 text-rose"
                  fill="currentColor"
                  strokeWidth={0}
                />
                {/* the pencil line dropping to the wood */}
                <span
                  className="mt-0.5 w-px bg-[#B77C8D]/55"
                  style={{ height: 12 }}
                />
              </motion.div>
            )}

            {marks.map((m, i) => {
              const active = m.passed || m.isToday;
              return (
                <div
                  key={m.day}
                  className="group/tick flex min-w-0 flex-1 flex-col items-center"
                >
                  {/* the day number riding above its tick */}
                  <p
                    className={cn(
                      "mb-1.5 font-hand text-[15px] leading-none tabular-digits transition-colors",
                      m.isToday
                        ? "text-rose"
                        : active
                          ? "text-cream/80"
                          : "text-cream/60"
                    )}
                  >
                    {m.day}
                  </p>
                  {/* the pencil tick itself */}
                  <motion.div
                    initial={
                      reduce ? false : { scaleY: 0, opacity: 0 }
                    }
                    animate={{ scaleY: 1, opacity: 1 }}
                    transition={{
                      duration: reduce ? 0 : 0.4,
                      delay: reduce ? 0 : i * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    style={{ transformOrigin: "top" }}
                    className={cn(
                      "w-[3px] rounded-full transition-colors duration-300",
                      m.isToday
                        ? "h-9 bg-rose shadow-[0_0_10px_rgba(183,124,141,0.5)]"
                        : active
                          ? "h-7 bg-[#B77C8D]/80"
                          : "h-4 bg-[#B77C8D]/30"
                    )}
                  />
                  {/* the little heart under today's tick */}
                  {m.isToday && (
                    <Heart
                      className="mt-1 h-3 w-3 text-rose"
                      fill="currentColor"
                      strokeWidth={0}
                      aria-hidden
                    />
                  )}
                  {/* stamp under passed ticks; countdown under future ones */}
                  <p
                    className={cn(
                      "mt-1.5 max-w-full truncate text-[7.5px] uppercase tracking-[0.12em] tabular-digits",
                      active ? "text-cream/75" : "text-cream/60"
                    )}
                  >
                    {active
                      ? m.stamp
                      : cfg.untilTemplate.replace("{n}", String(m.daysUntil))}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* today's line, if she lands exactly on a milestone */}
        {todayMark && (
          <motion.p
            initial={{ opacity: 0, y: reduce ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : 0.3 }}
            className="mt-3 text-center font-hand text-lg text-rose"
          >
            {cfg.todayTemplate.replace("{label}", todayMark.label)}
          </motion.p>
        )}

        {/* the quiet footnote */}
        <p className="mt-2 text-center text-[9px] uppercase tracking-[0.22em] text-rose-soft/65">
          {cfg.footLine} {cfg.dayFragment.replace("{n}", String(dayNumber))}
        </p>
      </section>
    </Reveal>
  );
}
