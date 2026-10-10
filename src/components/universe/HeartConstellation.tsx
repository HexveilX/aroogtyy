"use client";

/* ————————————————————————————————————————————————
   the heart constellation — a small grid of dim/bright
   hearts on the Home shelf. Each heart lights up
   once its ritual is finished; tapping a dim heart
   takes her to the section that's still unfinished.
———————————————————————————————————————————————— */

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ConstellationHeart, ViewId } from "@/content/arooqtyContent";
import { useContent } from "./Lang";
import { lsGet, lsSet } from "@/lib/localStorage";
import { TapeStrip } from "./Shared";

/* how many entries a "list" key needs to be considered complete */
function isHeartLit(
  heart: ConstellationHeart,
  listTargets: Partial<Record<ConstellationHeart["storageKey"], number>>,
): boolean {
  const target = listTargets[heart.storageKey];
  if (target !== undefined) {
    const list = lsGet<string[]>(heart.storageKey, []);
    return list.length >= target;
  }
  return lsGet<boolean>(heart.storageKey, false);
}

/* a tiny dim/bright heart with a soft glow when lit */
function HeartDot({ lit }: { lit: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill={lit ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={lit ? 0 : 1.6}
      aria-hidden
    >
      <path d="M12 21s-7.5-4.9-9.7-9.2C.7 8.6 2.6 5 6.1 5c2 0 3.4 1.1 4.2 2.4L12 9l1.7-1.6C14.5 6.1 15.9 5 17.9 5c3.5 0 5.4 3.6 3.8 6.8C19.5 16.1 12 21 12 21z" />
    </svg>
  );
}

export default function HeartConstellation({
  onNavigate,
}: {
  onNavigate: (v: ViewId) => void;
}) {
  const reduce = useReducedMotion();
  const content = useContent();
  const { heartConstellation: cfg, ui } = content;

  /* how many entries a "list" key needs to be considered complete */
  const listTargets: Partial<Record<ConstellationHeart["storageKey"], number>> =
    {
      littleThings: content.littleThings.length,
      openedMemories: content.memories.length,
    };

  /* cache once at mount — the constellation is meant to be a quiet
     snapshot of "where you've been", not a live tracker. She'll see
     updates next time she comes Home.
     While we're here: hearts that lit since her last visit get a
     one-time gentle ignition, so the loop closes itself — quietly. */
  const [frozen] = useState(() => {
    const entries = cfg.hearts.map((h, i) => ({
      i,
      lit: isHeartLit(h, listTargets),
    }));
    const litKeys = entries
      .filter((e) => e.lit)
      .map((e) => cfg.hearts[e.i].storageKey);
    const seen = lsGet<string[] | null>("constellationSeen", null);
    /* first ever visit (never stored): no fanfare, just remember */
    const fresh =
      seen === null ? [] : litKeys.filter((k) => !seen.includes(k));
    lsSet("constellationSeen", litKeys);
    return entries.map((e) => ({
      ...e,
      fresh: fresh.includes(cfg.hearts[e.i].storageKey),
    }));
  });
  /* the frozen ritual state, wearing today's words — labels follow
     the language she's reading without re-reading storage */
  const snapshot = frozen.map((s) => ({
    h: cfg.hearts[s.i],
    lit: s.lit,
    fresh: s.fresh,
  }));
  const litCount = snapshot.filter((s) => s.lit).length;
  const allLit = litCount === cfg.hearts.length;
  const freshCount = snapshot.filter((s) => s.fresh).length;
  const firstFresh = snapshot.find((s) => s.fresh);

  return (
    <motion.section
      initial={{ opacity: 0, y: reduce ? 0 : 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      aria-label={cfg.ariaLabel}
      className="mx-auto mt-12 w-[min(92vw,460px)]"
    >
      <div className="relative rounded-2xl border border-rose/15 bg-paper-card/70 px-6 pb-6 pt-7 polaroid-shadow">
        <TapeStrip className="-top-2.5 left-1/2 w-14 -translate-x-1/2" />

        {/* overline + counter */}
        <div className="flex items-center justify-between">
          <p className="text-[10px] uppercase tracking-[0.3em] text-rose-soft/85">
            {cfg.overline}
          </p>
          {/* when fresh hearts announce themselves, the counter
              takes one soft breath with them */}
          <motion.p
            aria-live="polite"
            className="font-hand text-base text-rose/80 tabular-digits"
            animate={
              freshCount > 0 && !reduce ? { scale: [1, 1.22, 1] } : { scale: 1 }
            }
            transition={{
              duration: 0.9,
              times: [0, 0.4, 1],
              delay: 0.5,
              ease: "easeInOut",
            }}
          >
            {allLit
              ? cfg.completeLine
              : cfg.counterTemplate
                  .replace("{n}", String(litCount))
                  .replace("{total}", String(cfg.hearts.length))}
          </motion.p>
        </div>

        {/* the constellation itself */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-x-3.5 gap-y-3">
          {snapshot.map((s, i) => {
            const { h, lit } = s;
            return (
            <motion.button
              key={h.storageKey}
              onClick={() => onNavigate(h.view)}
              whileHover={reduce ? undefined : { y: -2, scale: 1.1 }}
              whileTap={reduce ? undefined : { scale: 0.92 }}
              transition={{ type: "spring", stiffness: 320, damping: 18 }}
              aria-label={
                lit
                  ? `${h.label}${ui.common.done}`
                  : `${h.hint} ${ui.common.openSection}`
              }
              className={
                "group relative flex h-9 w-9 items-center justify-center rounded-full border transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60 " +
                (lit
                  ? "border-rose/55 bg-burgundy/20 text-rose"
                  : "border-rose/15 bg-paper/40 text-rose/45 hover:border-rose/40 hover:text-rose/85")
              }
            >
              {lit && (
                <span
                  aria-hidden
                  className={
                    "pointer-events-none absolute inset-0 rounded-full " +
                    (reduce ? "" : "animate-soft-glow bg-rose/10 blur-md")
                  }
                />
              )}
              {/* a one-time ignition ring for hearts that lit since
                  her last visit — a soft ripple, then stillness */}
              {s.fresh && !reduce && (
                <motion.span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-full border border-rose"
                  initial={{ scale: 0.55, opacity: 0.9 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{
                    duration: 1.1,
                    delay: 0.55 + i * 0.14,
                    ease: "easeOut",
                  }}
                />
              )}
              <motion.span
                className="flex h-4 w-4 items-center justify-center"
                animate={
                  s.fresh && !reduce
                    ? { scale: [1, 1.35, 1] }
                    : undefined
                }
                transition={{
                  duration: 0.85,
                  delay: 0.55 + i * 0.14,
                  times: [0, 0.45, 1],
                  ease: "easeInOut",
                }}
              >
                <HeartDot lit={lit} />
              </motion.span>
            </motion.button>
            );
          })}
        </div>

        {/* subline + a tiny CTA that follows the first dim heart she taps */}
        <p className="mt-5 text-center text-[10px] uppercase tracking-[0.24em] text-rose-soft/75">
          {allLit ? cfg.allDoneLine ?? cfg.subline : cfg.subline}
        </p>

        {/* the quiet ignition line — shown once, only when something
            new lit since her last visit, then never again */}
        {freshCount > 0 && (
          <motion.p
            initial={{ opacity: 0, y: reduce ? 0 : 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: reduce ? 0 : 0.9 }}
            className="mt-2 text-center font-hand text-base text-rose/80"
          >
            {freshCount === 1 && firstFresh
              ? cfg.newOneTemplate.replace("{label}", firstFresh.h.label)
              : cfg.newManyTemplate.replace("{n}", String(freshCount))}
          </motion.p>
        )}

        {/* a soft little line — the next dim hint, only when something is still unfinished */}
        {!allLit && (
          <p className="mt-2 text-center font-hand text-base text-rose-soft/80">
            {snapshot.find((s) => !s.lit)?.h.hint}
            <ArrowRight
              className="ms-1 inline-block h-3 w-3 rtl:-scale-x-100"
              strokeWidth={1.8}
              aria-hidden
            />
          </p>
        )}
      </div>
    </motion.section>
  );
}
