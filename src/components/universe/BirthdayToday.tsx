"use client";

/* ————————————————————————————————————————————————
   "it's today" — a small takeover card on the Home
   shelf, shown only on her birthday itself. Replaces
   the soon-card for that one day, with a few soft
   hearts drifting behind it.
———————————————————————————————————————————————— */

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ViewId } from "@/content/arooqtyContent";
import { useContent } from "./Lang";
import { TapeStrip } from "./Shared";

/** where each drifting heart starts (percent-based, aria-hidden garnish) */
const DRIFTING_HEARTS = [
  { left: "6%", delay: 0, size: 12, drift: 26 },
  { left: "22%", delay: 1.4, size: 9, drift: 34 },
  { left: "78%", delay: 0.7, size: 10, drift: 30 },
  { left: "93%", delay: 2.1, size: 8, drift: 22 },
] as const;

export default function BirthdayToday({
  onNavigate,
}: {
  onNavigate: (v: ViewId) => void;
}) {
  const reduce = useReducedMotion();
  const { birthdayToday, identity } = useContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto mt-12 w-fit max-w-full"
      aria-label={birthdayToday.ariaLabel}
    >
      {/* a few soft hearts, drifting up behind the card */}
      {!reduce &&
        DRIFTING_HEARTS.map((h, i) => (
          <span
            key={i}
            aria-hidden
            className="animate-float-heart pointer-events-none absolute bottom-6 text-rose/25"
            style={
              {
                left: h.left,
                width: h.size,
                height: h.size,
                animationDelay: `${h.delay}s`,
                "--drift": `${h.drift}px`,
              } as React.CSSProperties
            }
          >
            <svg viewBox="0 0 24 24" className="h-full w-full" fill="currentColor">
              <path d="M12 21s-7.5-4.9-9.7-9.2C.7 8.6 2.6 5 6.1 5c2 0 3.4 1.1 4.2 2.4L12 9l1.7-1.6C14.5 6.1 15.9 5 17.9 5c3.5 0 5.4 3.6 3.8 6.8C19.5 16.1 12 21 12 21z" />
            </svg>
          </span>
        ))}

      <motion.button
        onClick={() => onNavigate("birthday")}
        whileHover={reduce ? undefined : { y: -3 }}
        whileTap={reduce ? undefined : { scale: 0.98 }}
        aria-label={`${birthdayToday.ariaLabel} ${birthdayToday.ariaSuffix}`}
        className="group relative mx-auto block w-[min(88vw,380px)] rounded-xl border border-rose/25 bg-paper-card/90 px-7 py-6 text-center polaroid-shadow transition-[border-color,box-shadow] duration-300 hover:border-rose/50 hover:shadow-[0_22px_44px_-18px_rgba(0,0,0,0.9)] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60"
      >
        <TapeStrip className="-top-2.5 left-1/2 w-14 -translate-x-1/2" />

        <p className="text-[10px] uppercase tracking-[0.3em] text-rose/75">
          {birthdayToday.overline}
        </p>
        <p className="mt-3 font-display text-3xl font-medium leading-tight text-cream sm:text-4xl">
          {birthdayToday.headline.replace("{name}", identity.herName)}
        </p>
        <p className="mx-auto mt-3 max-w-[30ch] font-hand text-[1.3rem] leading-snug text-rose/90">
          {birthdayToday.line}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-rose/80 transition-colors group-hover:text-rose">
          {birthdayToday.linkLabel}
          <ArrowRight
            className="h-3.5 w-3.5 rtl:-scale-x-100 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
            strokeWidth={1.8}
            aria-hidden
          />
        </span>
      </motion.button>
    </motion.div>
  );
}
