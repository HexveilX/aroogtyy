"use client";

/* ————————————————————————————————————————————————
   The seek line shared by the two real players —
   a thin ink rail with a small movable pin. The
   drag itself is a native range input wearing
   invisibility, so touch, mouse and keyboard all
   seek the same honest way.
———————————————————————————————————————————————— */

import { formatClock } from "@/lib/realAudio";
import { cn } from "@/lib/utils";

export function SeekTrack({
  current,
  duration,
  onSeek,
  ariaLabel,
  tone = "dark",
}: {
  current: number;
  duration: number;
  onSeek: (t: number) => void;
  ariaLabel: string;
  /** "dark" sits on the page's black paper; "paper" sits on cream */
  tone?: "dark" | "paper";
}) {
  const paper = tone === "paper";
  /* duration not measured yet → keep the rail at zero and
     never show a made-up number */
  const pct =
    duration > 0 ? Math.min(100, Math.max(0, (current / duration) * 100)) : 0;
  const ready = duration > 0;

  return (
    <div className="min-w-0 flex-1">
      <div className="group/seek relative flex h-7 items-center">
        {/* the visible rail */}
        <div
          className={cn(
            "pointer-events-none relative h-1 w-full overflow-visible rounded-full",
            paper ? "bg-[#8a4a5c]/22" : "bg-cream/15",
          )}
        >
          <div
            className={cn(
              "absolute inset-y-0 start-0 rounded-full transition-[width] duration-150 ease-linear",
              paper ? "bg-burgundy" : "bg-rose",
            )}
            style={{ width: `${pct}%` }}
          />
          {/* the little pin — appears when she reaches for the rail */}
          <span
            aria-hidden
            className={cn(
              "absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-burgundy opacity-0 transition-opacity duration-200 group-hover/seek:opacity-100 group-focus-within/seek:opacity-100",
              paper ? "ring-2 ring-cream" : "ring-2 ring-[#0D0A0B]",
            )}
            style={{ insetInlineStart: `calc(${pct}% - 6px)` }}
          />
        </div>
        {/* the real control — invisible, but native: touch,
            mouse and arrow keys all work exactly as expected */}
        <input
          type="range"
          min={0}
          max={ready ? duration : 0}
          step={0.05}
          value={ready ? Math.min(current, duration) : 0}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          aria-label={ariaLabel}
          aria-valuetext={`${formatClock(current)} / ${
            ready ? formatClock(duration) : "–:–"
          }`}
          disabled={!ready}
          className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0 focus:outline-none"
        />
      </div>
      <p
        className={cn(
          "mt-1.5 text-center text-[10px] tracking-wider tabular-digits",
          paper ? "text-[#8a4a5c]" : "text-cream/80",
        )}
      >
        {formatClock(current)} / {ready ? formatClock(duration) : "–:–"}
      </p>
    </div>
  );
}
