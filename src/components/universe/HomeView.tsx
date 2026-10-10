"use client";

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import type { ViewId } from "@/content/arooqtyContent";
import { useContent } from "./Lang";
import { daysUntil } from "@/lib/timeTogether";
import { lsGet } from "@/lib/localStorage";
import { Reveal } from "./Shared";
import ScrapbookDoodles, { HeartOutline } from "./ScrapbookDoodles";
import ChapterNav from "./ChapterNav";
import DailyTouch from "./DailyTouch";
import SoonCard from "./SoonCard";
import BirthdayToday from "./BirthdayToday";
import HeartConstellation from "./HeartConstellation";
import TodaysNudge from "./TodaysNudge";
import { PolaroidArtifact } from "./Artifacts";
import TimeTogether from "./TimeTogether";
import Doorframe from "./Doorframe";
import Postcard from "./Postcard";
import { cn } from "@/lib/utils";

export default function HomeView({
  onNavigate,
}: {
  onNavigate: (v: ViewId, memoryId?: string) => void;
}) {
  const reduce = useReducedMotion();
  const {
    birthday,
    homePreview,
    identity,
    memories,
    relationship,
    visitKeepsake,
    ui,
  } = useContent();
  const preview = memories.find((m) => m.id === homePreview.memoryId);
  const visitGap = lsGet<number>("lastVisitGap", -1);

  /* on her birthday itself, the soon-card steps aside
     for the little takeover banner */
  const isBirthdayToday = useMemo(
    () => daysUntil(birthday.date, new Date(), relationship.timezone) === 0,
    [birthday, relationship]
  );

  const visitLine =
    visitGap < 0
      ? null
      : visitGap === 0
        ? ui.visits.earlierToday
        : visitGap === 1
          ? ui.visits.yesterday
          : ui.visits.daysAgoTemplate.replace("{n}", String(visitGap));

  /* the visit keepsake — a quiet count of distinct days here */
  const dayCount = lsGet<string[]>("visitDays", []).length;
  const milestone =
    dayCount >= 2 ? (visitKeepsake.milestones[dayCount] ?? null) : null;
  const keepsakeLine =
    dayCount === 1
      ? visitKeepsake.firstLine
      : dayCount >= 2
        ? (milestone ??
          visitKeepsake.template.replace("{days}", String(dayCount)))
        : null;
  /* milestones speak for themselves; the gap line only adds chatter there */
  const gapPart =
    visitLine && dayCount !== 1 && !milestone ? visitLine : null;
  const shelfLine = [gapPart, keepsakeLine].filter(Boolean).join("  ·  ");

  return (
    <div className="relative isolate text-center">
      {/* the living scrapbook — a few tiny hearts and
          stars breathing quietly around the first page */}
      <ScrapbookDoodles variant="home" />
      {/* soft burgundy glow behind the title */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-8 left-1/2 h-[380px] w-[320px] -translate-x-1/2 rounded-full bg-burgundy/25 blur-[110px] sm:w-[460px]"
      />
      {/* THE OPENING BLOOM — the universe's first breath.
          When the scrapbook opens, the burgundy atmosphere
          does not simply exist; it arrives: a soft wash of
          wine-coloured light blooming out from behind the
          title, holding for a moment, then easing back to
          let the page settle. It plays once, and only for
          her — the room remembering it was just opened */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-[540px] w-[540px] -translate-x-1/2 rounded-full sm:-top-32 sm:h-[680px] sm:w-[680px]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(101,28,45,0.5) 0%, rgba(101,28,45,0.22) 42%, rgba(45,11,21,0) 74%)",
          }}
          initial={{ opacity: 0, scale: 0.82 }}
          animate={{ opacity: [0, 0.95, 0.55, 0], scale: [0.82, 1.06, 1, 1.12] }}
          transition={{
            duration: 2.1,
            times: [0, 0.28, 0.62, 1],
            ease: "easeOut",
          }}
        />
      )}
      {/* a second, smaller breath of rose off to the side —
          one of the page's two special ambient accents; it
          swells and eases over twelve slow seconds, never
          demanding anything, only making the dark feel held */}
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-16 end-[6%] hidden h-56 w-56 rounded-full bg-rose/10 blur-3xl sm:block"
          animate={{ opacity: [0.45, 0.85, 0.45] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* the hero, arriving like handwriting — the page opens
          in its own order: the atmosphere blooms first, then
          the overline, then her name coming into focus like
          ink, then the words beneath. Each line settles out
          of a small blur, the way writing comes into focus,
          never a plain fade */}
      <motion.div
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: reduce ? 0 : 0.24,
              delayChildren: reduce ? 0 : 0.34,
            },
          },
        }}
      >
        <motion.p
          variants={{
            hidden: { opacity: 0, y: reduce ? 0 : 12, filter: "blur(4px)" },
            show: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: reduce ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="text-[11px] uppercase tracking-[0.34em] text-rose/75"
        >
          {identity.overline}
        </motion.p>
        <motion.h1
          variants={{
            hidden: {
              opacity: 0,
              y: reduce ? 0 : 18,
              scale: reduce ? 1 : 0.985,
              filter: "blur(6px)",
            },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              transition: { duration: reduce ? 0 : 0.85, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="mt-4 font-display text-[3.4rem] font-medium leading-none text-cream sm:text-7xl"
        >
          {identity.herName}
          <motion.span
            aria-hidden
            className="ml-3 inline-block align-baseline"
            initial={reduce ? false : { scale: 0, rotate: -18, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{
              delay: reduce ? 0 : 1.15,
              duration: reduce ? 0 : 0.65,
              ease: [0.22, 1.4, 0.36, 1],
            }}
          >
            <Heart
              className="inline-block h-7 w-7 animate-heart-pulse text-rose sm:h-8 sm:w-8"
              fill="currentColor"
              strokeWidth={0}
            />
          </motion.span>
        </motion.h1>
        <motion.p
          variants={{
            hidden: { opacity: 0, y: reduce ? 0 : 12, filter: "blur(4px)" },
            show: {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: reduce ? 0 : 0.75, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="mx-auto mt-6 max-w-md font-hand text-xl leading-relaxed text-rose/90 sm:text-2xl"
        >
          {identity.openingMessage}
        </motion.p>
        {/* the last step of the opening — a small flourish
            drawing itself beneath the first words, like the
            pen lifting at the end of its first sentence */}
        {!reduce && (
          <motion.svg
            viewBox="0 0 220 14"
            aria-hidden
            className="mx-auto mt-7 block h-3.5 w-44 overflow-visible text-burgundy/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.35, duration: 0.5 }}
          >
            <motion.path
              d="M4 8 C 40 3, 78 12, 118 7 S 176 4, 216 8"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.35, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.svg>
        )}
      </motion.div>

      {/* a tiny secret — a heart tucked into the first page's
          corner, almost invisible until she happens upon it */}
      <span
        aria-hidden
        className="absolute end-2 top-[132px] block h-[18px] w-[18px] cursor-default opacity-[0.13] transition-[opacity,transform] duration-700 hover:scale-125 hover:opacity-60"
      >
        <HeartOutline color="#B77C8D" />
      </span>

      {/* on her birthday itself, the banner comes first —
          the soon-card would normally sit further down */}
      {isBirthdayToday && <BirthdayToday onNavigate={onNavigate} />}

      <TimeTogether />

      {/* the postcard — a fresh small note written each
          day by the small language model that's read the
          rest of this place. Lives below the counter so
          today's line is the first new thing after the
          hours-and-minutes she's already seen */}
      <Postcard />

      {shelfLine && (
        <p
          className={cn(
            "mt-3 font-hand text-lg transition-colors",
            milestone ? "text-rose/80" : "text-rose-soft/80"
          )}
        >
          {shelfLine}
        </p>
      )}

      {/* little anniversaries, notched in pencil */}
      <Doorframe />

      {/* one small line, changing once a day */}
      <DailyTouch />

      {/* the next date worth waiting for */}
      {!isBirthdayToday && <SoonCard onNavigate={onNavigate} />}

      {/* a quiet constellation — progress through the rituals */}
      <HeartConstellation onNavigate={onNavigate} />

      {/* one rotating gentle prompt per day */}
      <TodaysNudge onNavigate={onNavigate} />

      {preview && (
        <Reveal className="mt-14" delay={0.05}>
          <p className="text-[10px] uppercase tracking-[0.3em] text-rose-soft/80">
            {homePreview.overline}
          </p>
          <motion.button
            onClick={() => onNavigate("memories", preview.id)}
            whileHover={reduce ? undefined : { rotate: 0, scale: 1.03 }}
            whileTap={reduce ? undefined : { scale: 0.97 }}
            className="group relative mt-5 inline-block rotate-[2.5deg] cursor-pointer"
            aria-label={ui.wander.memoryAria}
          >
            {/* a small paper clip, holding the polaroid to the page */}
            <svg
              aria-hidden
              viewBox="0 0 24 42"
              className="absolute -left-4 -top-3.5 z-10 h-12 w-[26px] -rotate-12 text-[#8a4a5c]/70 transition-transform duration-300 group-hover:-translate-y-0.5"
            >
              <path
                d="M9.5 15 v12.5 a3.25 3.25 0 0 0 6.5 0 V10 a5.75 5.75 0 0 0 -11.5 0 v20 a8.5 8.5 0 0 0 17 0 V15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
              />
            </svg>
            <PolaroidArtifact memory={preview} />
          </motion.button>
        </Reveal>
      )}

      <Reveal className="mt-14" delay={0.1}>
        <p className="font-hand text-xl text-rose/70">{ui.wander.overline}</p>
        <nav
          aria-label={ui.wander.aria}
          className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-2.5"
        >
          {ui.wander.links.map((link, i) => (
            <span key={link.view} className="flex items-center gap-2">
              <button
                onClick={() => onNavigate(link.view)}
                className="wander-link rounded-sm px-0.5 text-[12px] uppercase tracking-[0.18em] text-cream/75 hover:text-rose focus:outline-none focus-visible:text-rose focus-visible:ring-1 focus-visible:ring-rose/60"
              >
                {link.label}
              </button>
              {i < ui.wander.links.length - 1 && (
                <span aria-hidden className="wander-sep text-burgundy">
                  ♡
                </span>
              )}
            </span>
          ))}
        </nav>
      </Reveal>

      <ChapterNav current="home" onNavigate={onNavigate} />
    </div>
  );
}
