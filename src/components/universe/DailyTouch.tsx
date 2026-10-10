"use client";

/* ————————————————————————————————————————————————
   a line for today — one small taped note on the
   home screen, changing quietly once a day.
———————————————————————————————————————————————— */

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useContent } from "./Lang";
import { TapeStrip } from "./Shared";

/** day-of-year, so the line changes once per day, deterministically */
function dayIndex(date: Date): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const diff = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((diff - start) / 86_400_000);
}

/* cache the day's pick — getSnapshot must be stable within a day */
let dayCache: { key: string; value: number } | null = null;

function todaysLine(len: number): number {
  const d = new Date();
  const key = d.toDateString();
  if (dayCache?.key === key) return dayCache.value;
  const value = (dayIndex(d) - 1) % len;
  dayCache = { key, value };
  return value;
}

const noopSubscribe = () => () => {};

/** hydration-safe: -1 on the server, the day's line on the client */
function useTodaysLine(len: number): number {
  return useSyncExternalStore(
    noopSubscribe,
    () => todaysLine(len),
    () => -1
  );
}

export default function DailyTouch() {
  const reduce = useReducedMotion();
  const { dailyTouch } = useContent();
  const index = useTodaysLine(dailyTouch.lines.length);

  if (index < 0) {
    return <div aria-hidden className="mx-auto mt-14 min-h-[92px] max-w-md" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto mt-14 max-w-md"
    >
      <p className="text-[10px] uppercase tracking-[0.3em] text-rose-soft/80">
        {dailyTouch.overline}
      </p>
      <div className="group relative mt-4 rotate-[-1deg] rounded-lg bg-cream px-6 py-5 polaroid-shadow transition-transform duration-300 hover:rotate-0 sm:px-7">
        <TapeStrip className="-top-2.5 left-1/2 w-12 -translate-x-1/2 rotate-2" />
        <p className="font-hand text-[1.35rem] leading-snug text-ink">
          {dailyTouch.lines[index]}
        </p>
      </div>
    </motion.div>
  );
}
