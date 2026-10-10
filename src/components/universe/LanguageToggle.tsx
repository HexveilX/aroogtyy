"use client";

/* ————————————————————————————————————————————————
   The language toggle — a tiny paper pill that belongs
   to the universe itself. Two segments, EN and عربي,
   a burgundy thumb that slides between them, and on
   every switch a single small heart drifts upward,
   like the whole place quietly acknowledging her.
———————————————————————————————————————————————— */

import { useId, useState, type CSSProperties } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import { useLang } from "@/lib/language";
import { cn } from "@/lib/utils";

const SEGMENTS = [
  { id: "en", label: "EN" },
  { id: "ar", label: "عربي" },
] as const;

export default function LanguageToggle({
  className,
}: {
  className?: string;
}) {
  const { lang, setLang, t } = useLang();
  const reduce = useReducedMotion();
  const thumbId = useId();
  const [heartKey, setHeartKey] = useState(0);

  const pick = (next: (typeof SEGMENTS)[number]["id"]) => {
    if (next === lang) return;
    setLang(next);
    if (!reduce) setHeartKey((k) => k + 1);
  };

  return (
    <div className={cn("relative", className)}>
      {/* one small heart, released on each switch */}
      <AnimatePresence>
        {heartKey > 0 && (
          <span
            key={heartKey}
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-1 flex justify-center"
            onAnimationEnd={() => setHeartKey(0)}
          >
            <span
              className="animate-float-heart inline-block"
              style={{ "--drift": "6px" } as CSSProperties}
            >
              <Heart
                className="h-3 w-3 text-rose"
                fill="currentColor"
                strokeWidth={0}
              />
            </span>
          </span>
        )}
      </AnimatePresence>

      <div
        role="group"
        aria-label={t.ui.langToggleAria}
        className="flex items-center gap-[2px] rounded-full border border-rose/25 bg-paper/70 p-[3px] backdrop-blur-md"
      >
        {SEGMENTS.map((seg) => {
          const active = lang === seg.id;
          return (
            <button
              key={seg.id}
              type="button"
              onClick={() => pick(seg.id)}
              aria-pressed={active}
              lang={seg.id}
              className={cn(
                "relative min-h-[24px] cursor-pointer rounded-full px-2.5 py-1 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-rose/60",
                active ? "cursor-default" : "hover:bg-cream/5"
              )}
            >
              {active && (
                <motion.span
                  layoutId={`${thumbId}-thumb`}
                  aria-hidden
                  className="absolute inset-0 rounded-full bg-burgundy shadow-[0_4px_12px_-4px_rgba(101,28,45,0.9)]"
                  transition={{
                    type: "spring",
                    stiffness: 420,
                    damping: 32,
                  }}
                />
              )}
              <span
                className={cn(
                  "relative select-none text-[10px] leading-none transition-colors duration-300",
                  seg.id === "ar"
                    ? "font-arabic text-[11px]"
                    : "font-display tracking-[0.14em]",
                  active
                    ? "text-cream"
                    : "text-rose-soft/70 hover:text-cream/90"
                )}
              >
                {seg.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
