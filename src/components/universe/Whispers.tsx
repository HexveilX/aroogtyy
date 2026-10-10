"use client";

/* ————————————————————————————————————————————————
   whispers — a tiny note from him, one unsealed per
   calendar day she visits. The unsealed ones stay
   readable forever, stacked under today's.
———————————————————————————————————————————————— */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, MoonStar } from "lucide-react";
import { useContent } from "./Lang";
import { lsGet, lsSet } from "@/lib/localStorage";
import { Reveal, TapeStrip } from "./Shared";
import { cn } from "@/lib/utils";

/* the little postal stamp's date — today, in her timezone */
function stampDate(timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: timezone,
    }).format(new Date());
  } catch {
    return new Date().toDateString();
  }
}

export default function Whispers() {
  const reduce = useReducedMotion();
  const { relationship, whispers } = useContent();
  const TOTAL = whispers.notes.length;
  const [count, setCount] = useState(0);
  const [justUnsealed, setJustUnsealed] = useState(false);
  const [earlierOpen, setEarlierOpen] = useState(false);

  /* one new whisper per calendar day she visits (her timezone) —
     deferred past first paint, like the unlock check upstream */
  useEffect(() => {
    const t = window.setTimeout(() => {
      let today = "";
      try {
        today = new Intl.DateTimeFormat("en-CA", {
          timeZone: relationship.timezone,
        }).format(new Date());
      } catch {
        today = new Date().toISOString().slice(0, 10);
      }
      const last = lsGet<string>("whisperLastDay", "");
      let unlocked = lsGet<number>("whisperCount", 0);
      if (last !== today && unlocked < TOTAL) {
        unlocked = Math.min(unlocked + 1, TOTAL);
        lsSet("whisperCount", unlocked);
        setJustUnsealed(true);
      }
      if (last !== today) lsSet("whisperLastDay", today);
      setCount(unlocked);
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  if (count === 0) return null;

  const todayIndex = count - 1;
  const todayNote = whispers.notes[todayIndex];
  const earlier = whispers.notes.slice(0, todayIndex).map((note, i) => ({
    note,
    n: i + 1,
  }));
  const allUnsealed = count >= TOTAL;

  return (
    <div className="mt-20">
      {/* the little heading */}
      <Reveal className="text-center">
        <p className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.3em] text-rose/75">
          <MoonStar
            className="h-3.5 w-3.5 text-rose/80"
            strokeWidth={1.6}
            aria-hidden
          />
          {whispers.overline}
        </p>
        <h3 className="mt-3 font-hand text-3xl text-cream/95">
          {whispers.title}
        </h3>
        <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-rose-soft/70">
          {whispers.sub}
        </p>
      </Reveal>

      {/* today's whisper — the featured slip */}
      <Reveal className="mx-auto mt-8 max-w-[520px]" delay={0.06}>
        <div
          className={cn(
            "relative rotate-[-0.6deg] rounded-lg bg-cream px-7 py-8 polaroid-shadow sm:px-10",
            justUnsealed && "animate-discover-glow"
          )}
        >
          <TapeStrip className="-top-3 left-1/2 w-16 -translate-x-1/2 -rotate-2" />
          {/* a hand-stitched inner edge — the slip was sewn
              onto its card, not just glued */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-2.5 rounded-md border border-dashed border-[#8a4a5c]/25"
          />

          {/* an ink-pressed heart stamp at the lower-right —
              like a small wax-seal pressed in burgundy, with
              "with love" tucked inside in tiny handwriting.
              Distinct from the postmark up top; this one is
              the closing flourish on the slip itself. */}
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-2.5 right-6 flex h-12 w-12 items-center justify-center rounded-full bg-burgundy/85 text-cream shadow-[0_3px_8px_-3px_rgba(101,28,45,0.6)] sm:right-8"
            style={{ rotate: "-6deg" }}
          >
            <span className="flex flex-col items-center leading-none">
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5"
                fill="currentColor"
                aria-hidden
              >
                <path d="M12 21s-7.5-4.9-9.7-9.2C.7 8.6 2.6 5 6.1 5c2 0 3.4 1.1 4.2 2.4L12 9l1.7-1.6C14.5 6.1 15.9 5 17.9 5c3.5 0 5.4 3.6 3.8 6.8C19.5 16.1 12 21 12 21z" />
              </svg>
              <span className="mt-0.5 font-hand text-[6.5px] uppercase tracking-[0.15em] text-cream/85">
                {whispers.stampText}
              </span>
            </span>
          </div>

          <div className="flex items-baseline justify-between gap-3">
            <p className="text-[10px] uppercase tracking-[0.26em] text-[#8a4a5c]">
              {whispers.todayLabel}
            </p>
            <p className="font-hand text-lg text-burgundy/70">
              {whispers.dayTemplate.replace("{n}", String(count))}
            </p>
          </div>
          {/* the postmark — a whisper is a letter too, so it
              gets stamped with the day it was unsealed */}
          <p className="absolute -end-2.5 top-[4.6rem] rotate-[7deg] rounded-full border border-[#8a4a5c]/40 px-3 py-1 text-[8.5px] uppercase tracking-[0.18em] text-[#8a4a5c]/75 sm:top-[4.9rem]">
            {whispers.stampTemplate.replace("{date}", stampDate(relationship.timezone))}
          </p>
          <div
            aria-hidden
            className="mt-3 h-px w-14 bg-[#8a4a5c]/20"
          />
          <motion.p
            initial={{ opacity: 0, y: reduce ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.15 }}
            className="mt-4 font-hand text-[1.55rem] leading-snug text-ink"
          >
            {todayNote}
          </motion.p>
        </div>
      </Reveal>

      {/* earlier whispers — tucked under, unfold on demand */}
      {earlier.length > 0 && (
        <Reveal className="mx-auto mt-7 max-w-[520px]" delay={0.1}>
          <button
            onClick={() => setEarlierOpen((o) => !o)}
            aria-expanded={earlierOpen}
            className="mx-auto flex min-h-[44px] items-center gap-2 rounded-full border border-rose/25 px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-rose/75 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose/50 hover:text-rose focus:outline-none focus-visible:ring-1 focus-visible:ring-rose/60"
          >
            {whispers.earlierLabel}
            <span className="font-hand text-base normal-case tracking-normal text-rose-soft/85">
              ({earlier.length})
            </span>
            <motion.span
              animate={{ rotate: earlierOpen ? 180 : 0 }}
              transition={{ duration: reduce ? 0 : 0.25 }}
              className="inline-flex"
            >
              <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {earlierOpen && (
              <motion.div
                key="earlier"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{
                  duration: reduce ? 0 : 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="overflow-hidden"
              >
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {earlier
                    .slice()
                    .reverse()
                    .map(({ note, n }, i) => (
                      <motion.div
                        key={n}
                        initial={{ opacity: 0, y: reduce ? 0 : 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: reduce ? 0 : 0.4,
                          delay: reduce ? 0 : i * 0.05,
                        }}
                        className={cn(
                          "relative rounded-md bg-paper-card/90 px-5 py-4 ring-1 ring-rose/10 transition-transform duration-300 hover:-translate-y-0.5 hover:ring-rose/30",
                          i % 2 === 0 ? "rotate-[-0.5deg]" : "rotate-[0.5deg]"
                        )}
                      >
                        <p className="font-hand text-base text-rose-soft/85">
                          {whispers.dayTemplate.replace("{n}", String(n))}
                        </p>
                        <p className="mt-1.5 font-body text-[14.5px] leading-relaxed text-cream/80">
                          {note}
                        </p>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Reveal>
      )}

      {/* the quiet footer line */}
      <Reveal className="mt-6 text-center" delay={0.12}>
        <p className="text-[10px] uppercase tracking-[0.24em] text-rose-soft/70">
          {whispers.progressTemplate
            .replace("{n}", String(count))
            .replace("{total}", String(TOTAL))}
        </p>
        <p className="mt-2 font-hand text-lg text-rose-soft/85">
          {allUnsealed ? whispers.allUnsealedLine : whispers.tomorrowLine}
        </p>
      </Reveal>
    </div>
  );
}
