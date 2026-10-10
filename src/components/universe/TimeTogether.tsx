"use client";

/* ————————————————————————————————————————————————
   Time Together — the flagship live counter.
   Calendar-aware, timezone-correct, warm & romantic.
———————————————————————————————————————————————— */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useContent, useLang } from "./Lang";
import {
  diffWall,
  formatNumber,
  parseStartWall,
  wallClockInZone,
  type TogetherDuration,
} from "@/lib/timeTogether";
import { isArabic } from "@/lib/isArabic";
import { Ltr } from "./Shared";
import { cn } from "@/lib/utils";

function useNow(reduce: boolean) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    const raf = requestAnimationFrame(tick);
    const id = setInterval(tick, reduce ? 3000 : 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(id);
    };
  }, [reduce]);
  return now;
}

/* a number that gently settles into place — only when it actually changes */
function FlipValue({ value }: { value: number | string }) {
  const reduce = useReducedMotion();
  const text = String(value);
  return (
    <span className="inline-block min-w-[2ch] text-center">
      <span
        key={text}
        className={reduce ? "inline-block" : "inline-block animate-digit-settle"}
      >
        {text}
      </span>
    </span>
  );
}

function Group({
  value,
  label,
  big = false,
}: {
  value: number | string;
  label: string;
  big?: boolean;
}) {
  return (
    <div className="flex min-w-[3ch] flex-col items-center">
      <span
        className={cn(
          "font-display tabular-digits leading-none text-cream",
          big ? "text-[52px] sm:text-[64px]" : "text-[26px] text-cream/85 sm:text-[30px]"
        )}
      >
        <FlipValue value={value} />
      </span>
      <span
        className={cn(
          "uppercase tracking-[0.26em] text-berry",
          big ? "mt-2.5 text-[10px]" : "mt-1.5 text-[9px]"
        )}
      >
        {label}
      </span>
    </div>
  );
}

function HeartSeparator() {
  return (
    <span aria-hidden className="mt-6 inline-flex sm:mt-8">
      <svg
        viewBox="0 0 24 24"
        className="h-[11px] w-[11px] animate-heart-pulse text-rose/75"
        fill="currentColor"
      >
        <path d="M12 21s-7.5-4.9-9.7-9.2C.7 8.6 2.6 5 6.1 5c2 0 3.4 1.1 4.2 2.4L12 9l1.7-1.6C14.5 6.1 15.9 5 17.9 5c3.5 0 5.4 3.6 3.8 6.8C19.5 16.1 12 21 12 21z" />
      </svg>
    </span>
  );
}

function DotSeparator() {
  return (
    <span
      aria-hidden
      className="mt-3 h-1 w-1 animate-soft-glow rounded-full bg-rose/60"
    />
  );
}

function RotatingPhrase() {
  const { lang, content } = useLang();
  const phrases = content.relationship.counterPhrases;
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const id = setInterval(
      () => setIndex((v) => (v + 1) % phrases.length),
      7000
    );
    return () => clearInterval(id);
  }, [phrases.length]);

  /* an Arabic phrase inside the English rotation gets its own
     voice; in Arabic mode the whole page already speaks it */
  const phraseArabic = lang === "en" && isArabic(phrases[index]);

  return (
    <motion.p
      key={`${index}-${lang}`}
      initial={{ opacity: 0, y: reduce ? 0 : 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0 : 0.9, ease: "easeOut" }}
      dir={phraseArabic ? "rtl" : undefined}
      lang={phraseArabic ? "ar" : undefined}
      className={cn(
        "mx-auto mt-7 min-h-[3.4em] max-w-md px-4 text-lg leading-relaxed sm:text-xl",
        phraseArabic
          ? "font-arabic leading-[2]"
          : "font-display italic text-cream/80"
      )}
    >
      {phrases[index]}
    </motion.p>
  );
}

export default function TimeTogether() {
  const reduce = useReducedMotion();
  const now = useNow(Boolean(reduce));
  const { relationship, ui } = useContent();

  const start = parseStartWall(relationship.startDate, relationship.startTime);
  const duration: TogetherDuration | null = now
    ? diffWall(start, wallClockInZone(now, relationship.timezone))
    : null;

  const dash = "–";

  return (
    <section
      aria-label={ui.time.ariaLabel}
      className="relative mt-12 text-center sm:mt-16"
    >
      <p className="text-[11px] uppercase tracking-[0.34em] text-rose/80">
        {relationship.startMessage}
      </p>

      {/* years · months · days — the counter is an archival
          object, so it keeps its LTR order and English units
          even on the Arabic page, like a stamp on the paper */}
      <div dir="ltr" className="mt-7 flex items-start justify-center gap-3.5 sm:gap-6">
        <Group big value={duration ? duration.years : dash} label={ui.time.years} />
        <HeartSeparator />
        <Group big value={duration ? duration.months : dash} label={ui.time.months} />
        <HeartSeparator />
        <Group big value={duration ? duration.days : dash} label={ui.time.days} />
      </div>

      {/* hours · minutes · seconds */}
      <div
        dir="ltr"
        className="mt-5 flex items-start justify-center gap-2.5 sm:gap-4"
      >
        <Group value={duration ? duration.hours : dash} label={ui.time.hours} />
        <DotSeparator />
        <Group value={duration ? duration.minutes : dash} label={ui.time.minutes} />
        <DotSeparator />
        <Group value={duration ? duration.seconds : dash} label={ui.time.seconds} />
      </div>

      {/* thin burgundy line */}
      <div
        aria-hidden
        className="mx-auto mt-7 h-px w-56 bg-gradient-to-r from-transparent via-[#7d2c3f] to-transparent sm:w-80"
      />

      {/* the original moment, in small handwriting — a date,
          so it keeps its LTR island even in the Arabic flow */}
      <p className="mt-4 font-hand text-xl text-cream/85 sm:text-2xl">
        <Ltr>{relationship.sinceLabel}</Ltr>
      </p>

      {/* quiet total */}
      <p className="mt-2.5 text-[11px] uppercase tracking-[0.26em] text-berry/90">
        {relationship.daysTemplate.replace(
          "{days}",
          duration ? formatNumber(duration.totalDays) : "…"
        )}
      </p>

      <RotatingPhrase />
    </section>
  );
}
