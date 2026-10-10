"use client";

/* ————————————————————————————————————————————————
   "soon —" the next date worth waiting for.
   A slim taped paper card on the Home shelf: the days
   left, what we're waiting for, and a way to peek at it.
———————————————————————————————————————————————— */

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ViewId } from "@/content/arooqtyContent";
import { useContent } from "./Lang";
import { daysUntil } from "@/lib/timeTogether";
import { Ltr, TapeStrip } from "./Shared";

export default function SoonCard({
  onNavigate,
}: {
  onNavigate: (v: ViewId) => void;
}) {
  const reduce = useReducedMotion();
  const { relationship, soonCard, ui } = useContent();

  const next = useMemo(() => {
    const now = new Date();
    const upcoming = soonCard.dates
      .map((d) => ({ d, days: daysUntil(d.iso, now, relationship.timezone) }))
      .filter((x) => x.days >= 0)
      .sort((a, b) => a.days - b.days);
    return upcoming[0] ?? null;
  }, [soonCard, relationship]);

  if (!next) return null;
  const { d, days } = next;
  const isToday = days === 0;
  const isTomorrow = days === 1;

  const ariaLabel = isToday
    ? soonCard.todayTemplate.replace("{label}", d.label)
    : soonCard.ariaTemplate
        .replace("{days}", String(days))
        .replace("{label}", d.label)
        .replace("{date}", d.prettyDate);

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto mt-12 w-fit max-w-full"
    >
      <motion.button
        onClick={() => onNavigate(d.view as ViewId)}
        whileHover={reduce ? undefined : { y: -3 }}
        whileTap={reduce ? undefined : { scale: 0.98 }}
        aria-label={`${ariaLabel} ${ui.common.openSection}`}
        className="group relative mx-auto flex w-[min(88vw,380px)] items-center gap-5 rounded-xl border border-rose/15 bg-paper-card/80 px-6 py-5 text-start polaroid-shadow transition-[border-color,box-shadow] duration-300 hover:border-rose/40 hover:shadow-[0_22px_44px_-18px_rgba(0,0,0,0.9)] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60"
      >
        <TapeStrip className="-top-2.5 left-1/2 w-14 -translate-x-1/2" />

        {isToday ? (
          /* the day itself — one soft, glowing line */
          <p className="w-full py-1 text-center font-hand text-xl text-rose animate-soft-glow">
            {soonCard.todayTemplate.replace("{label}", d.label)}
          </p>
        ) : (
          <>
            <span
              aria-hidden
              className="flex shrink-0 flex-col items-center border-e border-burgundy/25 pe-5"
            >
              <span className="font-display text-[3.2rem] font-medium leading-none text-cream">
                {days}
              </span>
              <span className="mt-1 text-[9px] uppercase tracking-[0.24em] text-rose-soft/85">
                {isTomorrow ? soonCard.dayUnit : soonCard.daysUnit}
              </span>
            </span>

            <span className="flex min-w-0 flex-col">
              <span className="text-[9px] uppercase tracking-[0.3em] text-rose-soft/80">
                {isTomorrow
                  ? soonCard.tomorrowTemplate.replace("{label}", d.label)
                  : soonCard.overline}
              </span>
              <span className="mt-1.5 truncate font-hand text-[1.35rem] leading-tight text-cream/90">
                {isTomorrow ? <Ltr>{d.prettyDate}</Ltr> : d.label}
              </span>
              <span className="mt-1 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-rose/70 transition-colors group-hover:text-rose">
                {soonCard.linkLabel}
                <ArrowRight
                  className="h-3 w-3 rtl:-scale-x-100 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                  strokeWidth={1.8}
                  aria-hidden
                />
              </span>
            </span>
          </>
        )}
      </motion.button>
    </motion.div>
  );
}

export type { SoonDate } from "@/content/arooqtyContent";
