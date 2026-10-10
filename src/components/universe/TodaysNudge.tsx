"use client";

/* ————————————————————————————————————————————————
   today's nudge — one rotating gentle prompt per day,
   surfacing existing features without inventing new
   ones. Quiet, optional, not pushy.
   Picks deterministically by UTC day-of-year so it
   stays consistent within a calendar day.
———————————————————————————————————————————————— */

import { useSyncExternalStore } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Content, TodaysNudge, ViewId } from "@/content/arooqtyContent";
import { useContent } from "./Lang";
import { lsGet } from "@/lib/localStorage";
import { TapeStrip } from "./Shared";

/* one prompt per UTC day, deterministically — like the daily touch */
function dayIndex(date: Date): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const diff = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((diff - start) / 86_400_000);
}

let dayCache: { key: string; value: number } | null = null;
function todaysPick(len: number): number {
  const d = new Date();
  const key = d.toDateString();
  if (dayCache?.key === key) return dayCache.value;
  const value = (dayIndex(d) - 1) % len;
  dayCache = { key, value };
  return value;
}

const noopSubscribe = () => () => {};
function useTodaysPick(len: number): number {
  return useSyncExternalStore(
    noopSubscribe,
    () => todaysPick(len),
    () => -1
  );
}

/* has the destination ritual already been done today?
   For nudge prompts that target an already-finished ritual,
   we swap the line out for the "already done" copy. */
function isViewAllDone(view: ViewId, c: Content): boolean {
  switch (view) {
    case "things":
      /* every play-drawer ritual + the little things — if all are done, things are finished */
      return (
        lsGet<string[]>("littleThings", []).length >= c.littleThings.length &&
        lsGet<boolean>("quizLetterEarned", false) &&
        lsGet<boolean>("matchCompleted", false) &&
        lsGet<boolean>("jarPicked", false) &&
        lsGet<boolean>("reasonDrawn", false) &&
        lsGet<boolean>("couponScratched", false)
      );
    case "memories":
      return lsGet<string[]>("openedMemories", []).length >= c.memories.length;
    case "birthday":
      return lsGet<boolean>("birthdayWishSent", false);
    default:
      return false;
  }
}

function isEverythingDone(c: Content): boolean {
  return c.heartConstellation.hearts.every((h) => {
    if (h.storageKey === "littleThings")
      return lsGet<string[]>("littleThings", []).length >= c.littleThings.length;
    if (h.storageKey === "openedMemories")
      return lsGet<string[]>("openedMemories", []).length >= c.memories.length;
    return lsGet<boolean>(h.storageKey, false);
  });
}

export default function TodaysNudge({
  onNavigate,
}: {
  onNavigate: (v: ViewId) => void;
}) {
  const reduce = useReducedMotion();
  const content = useContent();
  const { todaysNudge: cfg, ui } = content;
  const index = useTodaysPick(cfg.prompts.length);

  if (index < 0) {
    return <div aria-hidden className="mx-auto mt-10 min-h-[80px] max-w-md" />;
  }

  const prompt: TodaysNudge = cfg.prompts[index];

  /* the nudge stays honest: if everything is already done, say so.
     Otherwise, if THIS nudge's destination is done, soften it to the
     "already done today" line, still pointing to the same view. */
  const everything = isEverythingDone(content);
  const targetDone = !everything && isViewAllDone(prompt.view, content);
  const line = everything
    ? cfg.allDoneLine
    : targetDone
      ? cfg.alreadyDoneLine
      : prompt.line;
  const cta = everything || targetDone ? null : prompt.cta;

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto mt-10 w-[min(92vw,440px)]"
    >
      <p className="text-center text-[10px] uppercase tracking-[0.3em] text-rose-soft/80">
        {cfg.overline}
      </p>
      <motion.button
        onClick={() => onNavigate(prompt.view)}
        whileHover={reduce ? undefined : { y: -2 }}
        whileTap={reduce ? undefined : { scale: 0.985 }}
        aria-label={`${line} ${ui.common.openSection}`}
        className="group relative mt-3 flex w-full items-center gap-3 rounded-xl border border-rose/15 bg-paper-card/70 px-5 py-4 text-start polaroid-shadow transition-[border-color,box-shadow] duration-300 hover:border-rose/40 hover:shadow-[0_22px_44px_-18px_rgba(0,0,0,0.9)] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60"
      >
        <TapeStrip className="-top-2.5 right-8 w-10 -rotate-3" />
        <span className="flex-1">
          <span className="block font-hand text-[1.2rem] leading-snug text-cream/90">
            {line}
          </span>
          {cta && (
            <span className="mt-1.5 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-rose/70 transition-colors group-hover:text-rose">
              {cta}
              <ArrowRight
                className="h-3 w-3 rtl:-scale-x-100 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                strokeWidth={1.8}
                aria-hidden
              />
            </span>
          )}
        </span>
      </motion.button>
    </motion.div>
  );
}
