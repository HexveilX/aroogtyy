"use client";

/* ————————————————————————————————————————————————
   a postcard for today — one small line from him,
   pre-written, kept on this device. A different
   postcard greets each new day; the "read another"
   action simply turns the stack. Always his
   handwriting, never a machine's.
———————————————————————————————————————————————— */

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { PenLine } from "lucide-react";
import { useContent, useLang } from "./Lang";
import { lsGet, lsSet } from "@/lib/localStorage";
import { isArabic } from "@/lib/isArabic";
import { cn } from "@/lib/utils";
import { Reveal, TapeStrip } from "./Shared";

/* today's cairo-tz calendar key — YYYY-MM-DD */
function todayKey(timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
    }).format(new Date());
  } catch {
    return new Date().toISOString().slice(0, 10);
  }
}

/* the pretty day stamp — "30 AUGUST 2026" */
function prettyDayStamp(timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: timezone,
    })
      .format(new Date())
      .toUpperCase();
  } catch {
    return new Date().toDateString().toUpperCase();
  }
}

/* which line starts each day — a slow, even rotation,
   so the same postcard doesn't greet two days in a row */
function dayStartIndex(day: string, total: number): number {
  let h = 0;
  for (let i = 0; i < day.length; i++) {
    h = (h * 31 + day.charCodeAt(i)) | 0;
  }
  return Math.abs(h) % total;
}

export default function Postcard() {
  const reduce = useReducedMotion();
  const { postcard: cfg, relationship } = useContent();
  const { lang } = useLang();
  /* lazy hydration — SSR-safe via lsGet's window guard.
     If she turned the stack today, keep her place; a new
     day (or a fresh visit) starts on the rotation's own
     line. Nothing needs writing until she reads another. */
  const [{ day, index }, setPostcard] = useState(() => {
    const today = todayKey(relationship.timezone);
    const storedDay = lsGet<string>("postcardDay", "");
    const storedIndex = lsGet<number>("postcardIndex", -1);
    if (storedDay === today && storedIndex >= 0) {
      return {
        day: today,
        index: storedIndex % cfg.lines.length,
      };
    }
    return { day: today, index: dayStartIndex(today, cfg.lines.length) };
  });

  /* turn to the next postcard in the stack — the only
     moment anything is written to storage */
  const readAnother = () => {
    const next = (index + 1) % cfg.lines.length;
    setPostcard({ day, index: next });
    lsSet("postcardDay", day);
    lsSet("postcardIndex", next);
  };

  const line = cfg.lines[index] ?? "";
  /* an Arabic line inside the English page needs its own
     direction and voice; in Arabic mode the page already
     provides both */
  const arabicLine = lang === "en" && isArabic(line);

  return (
    <Reveal className="mx-auto mt-10 w-[min(92vw,460px)]" delay={0.04}>
      <section
        aria-label={`${cfg.overline} ${cfg.title}`}
        className="relative rounded-lg bg-cream px-6 py-7 text-start polaroid-shadow sm:px-8"
        style={{ rotate: "0.4deg" }}
      >
        {/* tape strip — the postcard was stuck down */}
        <TapeStrip className="-top-3 left-1/2 w-16 -translate-x-1/2 -rotate-2" />

        {/* faint ruled paper behind the writing, like
            a real postcard's address side */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-3 bottom-3 top-12 rounded-md opacity-[0.06] [background:repeating-linear-gradient(0deg,transparent_0,transparent_22px,#651C2D_22px,#651C2D_23px)]"
        />

        {/* overline + day stamp row */}
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-[10px] uppercase tracking-[0.28em] text-[#8a4a5c]">
            {cfg.overline}
          </p>
          <p className="font-hand text-base text-burgundy/70">
            {cfg.title}
          </p>
        </div>

        {/* the postmark — a real round stamp */}
        <div
          aria-hidden
          className="absolute end-2 top-3 rotate-[6deg] flex h-14 w-14 flex-col items-center justify-center rounded-full border border-[#8a4a5c]/40 text-center text-[6.5px] uppercase tracking-[0.12em] leading-tight text-[#8a4a5c]/75 sm:top-4 sm:h-[4.6rem] sm:w-[4.6rem]"
        >
          <span aria-hidden className="block">{cfg.cairoStamp}</span>
          <span aria-hidden className="block font-hand text-base normal-case tracking-normal text-burgundy/70">
            ♡
          </span>
          <span aria-hidden className="block">
            {cfg.dayStampTemplate.replace("{date}", prettyDayStamp(relationship.timezone))}
          </span>
        </div>

        {/* the provenance hint — a tiny line in his voice */}
        <p className="mt-2 max-w-[16rem] font-hand text-sm italic text-ink-soft/60">
          {cfg.craftHint}
        </p>

        {/* divider rule */}
        <div
          aria-hidden
          className="mt-3 h-px w-14 bg-[#8a4a5c]/25"
        />

        {/* the body — his handwriting */}
        <div className="mt-4 min-h-[5.5rem]">
          <motion.p
            key={`${day}-${index}`}
            initial={{ opacity: 0, y: reduce ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: reduce ? 0 : 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className={cn(
              arabicLine
                ? "font-arabic text-[1.15rem] leading-[2.1] text-ink"
                : "font-hand text-[1.3rem] leading-[1.55] text-ink"
            )}
            dir={arabicLine ? "rtl" : undefined}
            lang={arabicLine ? "ar" : undefined}
          >
            {line}
          </motion.p>
        </div>

        {/* signature */}
        {line && (
          <p className="mt-3 text-end font-hand text-base text-burgundy/85">
            {cfg.signature}
          </p>
        )}

        {/* the action row */}
        <div className="mt-5 flex items-center justify-between gap-3">
          <p className="text-[8.5px] uppercase tracking-[0.2em] text-[#8a4a5c]/70">
            {index + 1} / {cfg.lines.length}
          </p>
          <motion.button
            onClick={readAnother}
            whileTap={reduce ? undefined : { scale: 0.95 }}
            whileHover={reduce ? undefined : { y: -1 }}
            aria-label={cfg.askLabel}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-rose/40 px-4 py-2 text-[10.5px] uppercase tracking-[0.2em] text-rose/85 transition-all duration-300 hover:border-rose/65 hover:text-rose focus:outline-none focus-visible:ring-1 focus-visible:ring-rose/60"
          >
            <PenLine className="h-3 w-3" strokeWidth={1.8} aria-hidden />
            {cfg.askLabel}
          </motion.button>
        </div>

        {/* the tiny private promise */}
        <p className="mt-5 text-center text-[8.5px] uppercase tracking-[0.18em] text-[#8a4a5c]/65">
          {cfg.privateLine}
        </p>
      </section>
    </Reveal>
  );
}
