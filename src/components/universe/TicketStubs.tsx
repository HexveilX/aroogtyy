"use client";

/* ————————————————————————————————————————————————
   ticket stubs — the films queued for us, kept like
   real cinema stubs: each one admits two, and gets a
   star punched through it the night they finally
   watch it. Punch state lives on her device.
   Reduce-guarded. No nesting — the stub is a button,
   the un-punch link sits beside it, not inside.
———————————————————————————————————————————————— */

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart, Scissors, Star } from "lucide-react";
import { useContent } from "./Lang";
import { lsGet, lsSet } from "@/lib/localStorage";
import { Ltr, Reveal } from "./Shared";
import { cn } from "@/lib/utils";

/* slight scatter, like stubs dropped in a pile */
const ROTATIONS = ["-1.1deg", "0.8deg", "-0.6deg", "1deg"];

/* the star punch-hole — paper showing darkness through it */
function PunchHole({ reduce }: { reduce: boolean }) {
  return (
    <motion.span
      initial={reduce ? { scale: 1 } : { scale: 0 }}
      animate={reduce ? { scale: 1 } : { scale: [0, 1.3, 1] }}
      transition={{
        duration: 0.45,
        times: [0, 0.55, 1],
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative flex h-6 w-6 items-center justify-center"
      aria-hidden
    >
      {/* the hole itself — dark, like the board seen through paper */}
      <Star
        className="h-6 w-6 fill-[#1c0e14] text-cream/45"
        strokeWidth={1.1}
      />
      {/* the tiny paper-bur ring a real punch leaves */}
      <span className="absolute inset-0 rounded-full bg-cream/10 blur-[1.5px]" />
    </motion.span>
  );
}

/* the rubber stamp pressed over a watched film */
function WatchedStamp({ reduce }: { reduce: boolean }) {
  const { ticketStubs: cfg } = useContent();
  return (
    <motion.span
      initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 1.6, rotate: -16 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, rotate: -8 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden
      className="pointer-events-none absolute end-3 top-2.5 inline-flex items-center gap-1.5 rounded-[3px] border-[1.5px] border-burgundy/65 px-2 py-[3px] text-[9px] font-semibold uppercase tracking-[0.3em] text-burgundy/75 select-none"
    >
      {cfg.watchedLabel}
      <Heart
        className="h-2.5 w-2.5 text-burgundy/70"
        fill="currentColor"
        strokeWidth={0}
      />
    </motion.span>
  );
}

export default function TicketStubs() {
  const reduce = useReducedMotion();
  const { ticketStubs: cfg } = useContent();
  const [punched, setPunched] = useState<string[]>(() =>
    lsGet<string[]>("ticketStubsPunched", [])
  );
  const [justPunched, setJustPunched] = useState<string | null>(null);

  const punch = (id: string) => {
    if (punched.includes(id)) return;
    const next = [...punched, id];
    setPunched(next);
    lsSet("ticketStubsPunched", next);
    // a brief burgundy halo, like the little things board
    setJustPunched(id);
    window.setTimeout(() => setJustPunched(null), 1600);
  };

  const unPunch = (id: string) => {
    const next = punched.filter((p) => p !== id);
    setPunched(next);
    lsSet("ticketStubsPunched", next);
  };

  const allWatched = punched.length === cfg.films.length;
  const justPunchedTitle = cfg.films.find((f) => f.id === justPunched)?.title;

  return (
    <Reveal className="mx-auto mt-14 w-[min(92vw,560px)]" delay={0.06}>
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-rose/75">
          {cfg.overline}
        </p>
        <h3 className="mt-2 font-display text-2xl text-cream sm:text-3xl">
          {cfg.title}
        </h3>
        <p className="mt-2 font-hand text-lg text-rose-soft/85">{cfg.sub}</p>
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="mt-7 flex flex-col gap-4"
      >
        {cfg.films.map((film, i) => {
          const isPunched = punched.includes(film.id);
          const rot = ROTATIONS[i % ROTATIONS.length];
          return (
            <div
              key={film.id}
              className="relative"
              style={{ transform: `rotate(${rot})` }}
            >
              <motion.button
                onClick={() => punch(film.id)}
                whileHover={reduce ? undefined : { y: -3, rotate: 0 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
                transition={{ type: "spring", stiffness: 380, damping: 17 }}
                aria-label={
                  isPunched
                    ? cfg.ariaWatched.replace("{title}", film.title)
                    : `${cfg.punchSr}: ${film.title}`
                }
                className={cn(
                  "group flex w-full cursor-pointer touch-manipulation items-stretch overflow-hidden rounded-md bg-cream text-start polaroid-shadow ring-1 ring-rose/15 transition-opacity duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0D0A0B]",
                  isPunched && "opacity-85",
                  justPunched === film.id && "animate-discover-glow rounded-md"
                )}
              >
                {/* the stub side — what the usher keeps */}
                <div className="relative flex w-[72px] shrink-0 flex-col items-center justify-center gap-2 bg-[#f4ede7] py-4">
                  <span className="text-[7.5px] uppercase tracking-[0.22em] text-[#8a4a5c]/80">
                    <Ltr>no. {String(i + 1).padStart(2, "0")}</Ltr>
                  </span>
                  <span className="rotate-180 text-[8px] uppercase tracking-[0.3em] text-rose/75 [writing-mode:vertical-rl]">
                    {cfg.admitLabel}
                  </span>
                  <div className="flex h-6 items-center justify-center">
                    {isPunched ? (
                      <PunchHole reduce={!!reduce} />
                    ) : (
                      <span
                        aria-hidden
                        className="h-4 w-4 rounded-full border border-dashed border-rose/40"
                      />
                    )}
                  </div>
                </div>

                {/* the perforation — with tiny scissors riding it,
                    like the stub was just cut from the sheet */}
                <span
                  aria-hidden
                  className="relative my-2.5 w-0 border-s border-dashed border-burgundy/30"
                >
                  <Scissors
                    className="absolute -top-1 left-1/2 h-3.5 w-3.5 -translate-x-1/2 -rotate-90 text-rose/70"
                    strokeWidth={1.5}
                  />
                </span>

                {/* the ticket side — the film */}
                <div className="relative min-w-0 flex-1 px-4 py-4 sm:px-5">
                  <p className="pe-16 font-display text-lg leading-tight text-burgundy sm:text-xl">
                    {film.title}
                  </p>
                  <p className="mt-1 font-hand text-[15px] leading-snug text-ink-soft/85">
                    {film.why}
                  </p>
                  {!isPunched && (
                    <p className="mt-2.5 font-hand text-[10.5px] uppercase tracking-[0.18em] text-[#8a4a5c] transition-colors duration-300 group-hover:text-burgundy">
                      {cfg.punchLabel}
                    </p>
                  )}
                  {isPunched && <WatchedStamp reduce={!!reduce} />}
                </div>
              </motion.button>

              {/* the un-punch affordance — outside the button,
                  visible only once punched */}
              {isPunched && (
                <button
                  onClick={() => unPunch(film.id)}
                  aria-label={cfg.ariaUnpunch.replace("{title}", film.title)}
                  className="absolute bottom-3.5 end-3.5 rounded-sm px-1.5 py-0.5 font-hand text-[10px] uppercase tracking-[0.15em] text-[#8a4a5c]/85 underline decoration-[#8a4a5c]/40 underline-offset-4 transition-colors duration-300 hover:text-burgundy focus:outline-none focus-visible:ring-1 focus-visible:ring-rose/50"
                >
                  {cfg.undoLabel}
                </button>
              )}
            </div>
          );
        })}
      </motion.div>

      {/* quiet screen-reader announcement for the punch */}
      <span className="sr-only" aria-live="polite">
        {justPunchedTitle
          ? cfg.justPunchedTemplate.replace("{title}", justPunchedTitle)
          : ""}
      </span>

      {/* the line that appears once the whole first reel is watched */}
      <p
        aria-live="polite"
        className={cn(
          "mt-6 text-center font-hand text-xl transition-opacity duration-700",
          allWatched ? "text-rose/90 opacity-100" : "opacity-0"
        )}
      >
        {allWatched ? cfg.allWatchedLine : ""}
      </p>

      <p className="mt-4 text-center font-hand text-base text-rose-soft/85">
        {cfg.footLine}
      </p>
    </Reveal>
  );
}
