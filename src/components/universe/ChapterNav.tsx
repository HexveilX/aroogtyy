"use client";

/* ————————————————————————————————————————————————
   Chapter footer navigation — slim paper tabs that
   carry her gently from one section to the next.
———————————————————————————————————————————————— */

import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { ViewId } from "@/content/arooqtyContent";
import { useContent } from "./Lang";
import { useNavItems } from "./Nav";
import { TapeStrip } from "./Shared";
import { cn } from "@/lib/utils";

/* one slim paper tab */
function ChapterTab({
  direction,
  label,
  onClick,
  primary,
}: {
  direction: "back" | "next";
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  const reduce = useReducedMotion();
  const { chapterNav } = useContent();
  const Arrow = direction === "back" ? ArrowLeft : ArrowRight;
  const isBack = direction === "back";

  return (
    <motion.button
      onClick={onClick}
      whileTap={reduce ? undefined : { scale: 0.965 }}
      whileHover={reduce ? undefined : { y: -3 }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      aria-label={
        isBack
          ? chapterNav.backTemplate.replace("{label}", label)
          : chapterNav.continueTemplate.replace("{label}", label)
      }
      className={cn(
        "group relative inline-flex min-h-[58px] touch-manipulation cursor-pointer items-center gap-3 rounded-[10px] border px-4 py-3 text-start backdrop-blur-[2px] transition-[border-color,background-color,box-shadow] duration-300",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose/60",
        isBack
          ? "-rotate-[0.8deg] border-rose/25 bg-wine/40 hover:border-rose/55 hover:bg-wine/70"
          : "rotate-[0.8deg] border-burgundy/60 bg-burgundy/25 shadow-[0_10px_26px_-16px_rgba(101,28,45,0.9)] hover:border-rose/70 hover:bg-burgundy/50",
        primary && "hover:shadow-[0_16px_30px_-16px_rgba(101,28,45,1)]"
      )}
    >
      {/* a tiny piece of washi tape on the outer top corner —
          like a tab slipped into a paper bookmark */}
      <TapeStrip
        className={cn(
          "-top-2 h-3 w-8",
          isBack ? "-start-1 -rotate-[8deg]" : "-end-1 rotate-[8deg]"
        )}
      />

      {/* paper-slide: the whole tab drifts toward its direction on hover */}
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 rounded-[10px] transition-transform duration-300",
          isBack
            ? "group-hover:-translate-x-[3px] rtl:group-hover:translate-x-[3px]"
            : "group-hover:translate-x-[3px] rtl:group-hover:-translate-x-[3px]"
        )}
      />

      {isBack && (
        <Arrow
          className="h-[15px] w-[15px] shrink-0 text-rose/80 transition-transform duration-300 group-hover:-translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:translate-x-0.5"
          strokeWidth={1.8}
          aria-hidden
        />
      )}

      <span className="relative flex flex-col gap-0.5">
        <span
          className={cn(
            "text-[9px] uppercase tracking-[0.26em] transition-colors duration-300",
            isBack ? "text-rose-soft/80 group-hover:text-rose-soft" : "text-rose-soft/85 group-hover:text-rose-soft"
          )}
        >
          {isBack ? chapterNav.backWord : chapterNav.continueWord}
        </span>
        {/* the label + its hand-drawn ink underline, drawn on hover */}
        <span className="relative inline-block">
          <span className="text-[13px] font-medium tracking-wide text-cream/90 transition-colors duration-300 group-hover:text-cream">
            {label}
          </span>
          <svg
            viewBox="0 0 64 5"
            preserveAspectRatio="none"
            aria-hidden
            className="ink-draw absolute -bottom-[3px] left-0 h-[4px] w-full opacity-0 transition-opacity duration-200 group-hover:opacity-90"
          >
            <path
              d={
                isBack
                  ? "M2 3 C 18 1, 42 4.5, 62 2.5"
                  : "M2 2.5 C 20 4.5, 44 1, 62 3"
              }
              fill="none"
              stroke="#B77C8D"
              strokeWidth="1.7"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </span>

      {!isBack && (
        <Arrow
          className="h-[15px] w-[15px] shrink-0 text-rose/80 transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
          strokeWidth={1.8}
          aria-hidden
        />
      )}
    </motion.button>
  );
}

export default function ChapterNav({
  current,
  onNavigate,
}: {
  current: ViewId;
  onNavigate: (v: ViewId) => void;
}) {
  const { chapterNav } = useContent();
  const items = useNavItems();
  const index = items.findIndex((i) => i.id === current);
  if (index === -1) return null;

  const prev = index > 0 ? items[index - 1] : null;
  const next = index < items.length - 1 ? items[index + 1] : null;

  return (
    <nav
      aria-label={chapterNav.ariaLabel}
      className="mt-20 select-none sm:mt-24"
    >
      {/* quiet overline */}
      <p
        aria-hidden
        className="text-center font-hand text-lg text-rose-soft/75"
      >
        {chapterNav.overline}
      </p>

      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
        {/* previous tab */}
        <div className="min-w-0 justify-self-start">
          {prev ? (
            <ChapterTab
              direction="back"
              label={prev.label}
              onClick={() => onNavigate(prev.id)}
            />
          ) : (
            <span aria-hidden className="hidden sm:block">
              {/* keeps the counter truly centered on the first chapter */}
              <span className="inline-block h-[58px] w-[10px] rounded-full border border-dashed border-rose/20" />
            </span>
          )}
        </div>

        {/* the little counter — "3 of 7" */}
        <p
          className="flex items-center gap-2.5 whitespace-nowrap px-1 text-[10px] uppercase tracking-[0.32em] text-rose/75"
          aria-label={chapterNav.counterTemplate
            .replace("{current}", String(index + 1))
            .replace("{total}", String(items.length))}
        >
          <span
            aria-hidden
            className="hidden h-px w-6 bg-gradient-to-r from-transparent to-burgundy/60 sm:block"
          />
          {chapterNav.counterTemplate
            .replace("{current}", String(index + 1))
            .replace("{total}", String(items.length))}
          <span
            aria-hidden
            className="hidden h-px w-6 bg-gradient-to-l from-transparent to-burgundy/60 sm:block"
          />
        </p>

        {/* next tab */}
        <div className="min-w-0 justify-self-end">
          {next ? (
            <ChapterTab
              direction="next"
              label={next.label}
              onClick={() => onNavigate(next.id)}
              primary
            />
          ) : (
            <span aria-hidden className="hidden sm:block">
              <span className="inline-block h-[58px] w-[10px] rounded-full border border-dashed border-rose/20" />
            </span>
          )}
        </div>
      </div>
    </nav>
  );
}
