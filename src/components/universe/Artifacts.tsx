"use client";

/* Physical memory artifacts for "Our Memory Drawer". */

import { Moon } from "lucide-react";
import type { MemoryItem } from "@/content/arooqtyContent";
import { useContent, useLang } from "./Lang";
import { Ltr } from "./Shared";
import { isArabic } from "@/lib/isArabic";
import { cn } from "@/lib/utils";

/* ————— polaroid ————— */
export function PolaroidArtifact({
  memory,
  className,
}: {
  memory: MemoryItem;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-[132px] rounded-[3px] bg-cream p-[7px] pb-[38px] polaroid-shadow sm:w-[150px] sm:p-2 sm:pb-[42px]",
        className
      )}
    >
      <img
        src={memory.image ?? memory.images?.[0]}
        alt={memory.imageAlt ?? memory.caption}
        loading="lazy"
        className="aspect-square w-full rounded-[1px] object-cover"
      />
      <p className="mt-1.5 line-clamp-2 text-center font-hand text-[14px] leading-[1.15] text-ink-soft">
        {memory.caption}
      </p>
    </div>
  );
}

/* ————— photo strip ————— */
export function StripArtifact({
  memory,
  className,
}: {
  memory: MemoryItem;
  className?: string;
}) {
  const { ui } = useContent();
  return (
    <div
      className={cn(
        "w-[100px] rounded-[2px] bg-cream p-[7px] pb-4 polaroid-shadow sm:w-[112px] sm:p-2 sm:pb-5",
        className
      )}
    >
      <div className="flex flex-col gap-[5px]">
        {(memory.images ?? []).map((src, i) => (
          <img
            key={src + i}
            src={src}
            alt={`${memory.caption}${ui.memoriesUi.frame.replace("{n}", String(i + 1))}`}
            loading="lazy"
            className="h-[86px] w-full rounded-[1px] object-cover"
          />
        ))}
      </div>
    </div>
  );
}

/* ————— chat screenshot card ————— */
export function ChatArtifact({
  memory,
  className,
  preview = false,
}: {
  memory: MemoryItem;
  className?: string;
  preview?: boolean;
}) {
  const { ui } = useContent();
  const { lang } = useLang();
  const bubbles = preview ? (memory.chat ?? []).slice(0, 2) : memory.chat ?? [];
  const remaining = (memory.chat?.length ?? 0) - bubbles.length;
  /* the little moon label — the time that night, or just "late" */
  const timeLabel = memory.date.includes("·")
    ? memory.date.split("·").pop()!.trim()
    : ui.common.late;
  return (
    <div
      className={cn(
        "w-[176px] rounded-2xl border border-rose/15 bg-[#221319] p-3 polaroid-shadow sm:w-[196px]",
        className
      )}
    >
      <div className="flex items-center justify-center gap-1.5 pb-2 text-[10px] tracking-wide text-rose-soft/85">
        <Moon className="h-3 w-3" />
        <span>{timeLabel}</span>
      </div>
      <div className="space-y-1.5">
        {bubbles.map((b, i) => {
          /* an Arabic bubble inside the English page needs its own
             direction and voice; in Arabic mode the page already
             provides both */
          const ar = lang === "en" && isArabic(b.text);
          return (
            <div
              key={i}
              dir={ar ? "rtl" : undefined}
              lang={ar ? "ar" : undefined}
              className={cn(
                "max-w-[85%] rounded-2xl px-3 py-1.5 leading-snug",
                ar ? "text-[13px]" : "text-[12px]",
                b.from === "her"
                  ? "ml-auto rounded-br-md bg-burgundy text-cream"
                  : "mr-auto rounded-bl-md bg-[#3a242e] text-cream/90",
                ar && "font-arabic"
              )}
            >
              {b.text}
            </div>
          );
        })}
        {remaining > 0 && (
          <p className="pt-0.5 text-center text-[10px] text-rose-soft/80">
            {ui.common.plusMoreTemplate.replace("{n}", String(remaining))}
          </p>
        )}
      </div>
    </div>
  );
}

/* ————— cinema ticket stub ————— */
export function TicketArtifact({
  memory,
  className,
}: {
  memory: MemoryItem;
  className?: string;
}) {
  const { ui } = useContent();
  const t = memory.ticket;
  return (
    <div
      className={cn(
        "relative flex h-[92px] w-[188px] rounded-md bg-cream polaroid-shadow",
        className
      )}
    >
      <div className="flex flex-1 flex-col justify-between p-3">
        <p className="text-[9px] uppercase tracking-[0.3em] text-[#8a4a5c]">
          {ui.common.cinemaOverline}
        </p>
        <div>
          <p className="font-display text-[22px] leading-none text-burgundy">
            {t?.main}
          </p>
          <p className="mt-1 text-[10px] tracking-wide text-ink-soft/80">
            {t?.sub}
          </p>
        </div>
        <p className="text-[10px] text-ink-soft/70">
          {isArabic(memory.date) ? memory.date : <Ltr>{memory.date}</Ltr>}
        </p>
      </div>
      {/* perforation */}
      <div className="relative w-[52px] border-s-2 border-dashed border-[#8a4a5c]/40">
        <span className="absolute -start-[7px] -top-[7px] h-3.5 w-3.5 rounded-full bg-[#1c0e15]" />
        <span className="absolute -bottom-[7px] -start-[7px] h-3.5 w-3.5 rounded-full bg-[#1c0e15]" />
        <div className="flex h-full flex-col items-center justify-center gap-[3px] py-3">
          <span className="font-hand text-lg leading-none text-burgundy">
            {t?.stub}
          </span>
          <span className="h-6 w-[2px] rounded bg-[#8a4a5c]/30" />
          <span className="h-[3px] w-6 rounded bg-[#8a4a5c]/40" />
          <span className="h-[3px] w-6 rounded bg-[#8a4a5c]/25" />
        </div>
      </div>
    </div>
  );
}

/* ————— a real photo, taped in —————
   Tall real photos are never cropped into squares: the
   whole photo is kept, taped at the top like a page
   tipped into the drawer */
export function TapedArtifact({
  memory,
  className,
}: {
  memory: MemoryItem;
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <span
        aria-hidden
        className="tape-strip absolute -top-2.5 left-1/2 z-10 block h-5 w-14 -translate-x-1/2 -rotate-3 rounded-[1px]"
      />
      <div className="w-[100px] rounded-[2px] bg-cream p-[7px] pb-[30px] polaroid-shadow sm:w-[106px] sm:p-2 sm:pb-[32px]">
        <img
          src={memory.image}
          alt={memory.imageAlt ?? memory.caption}
          loading="lazy"
          className="block w-full rounded-[1px] object-cover"
        />
        <p className="mt-1.5 line-clamp-2 text-center font-hand text-[13.5px] leading-[1.15] text-ink-soft">
          {memory.caption}
        </p>
      </div>
    </div>
  );
}

/* ————— folded note ————— */
export function NoteArtifact({
  memory,
  className,
}: {
  memory: MemoryItem;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-[140px] rounded-[2px] bg-cream p-3 pt-5 polaroid-shadow",
        className
      )}
    >
      <span
        aria-hidden
        className="absolute -top-2 left-1/2 h-5 w-14 -translate-x-1/2 -rotate-2 tape-strip rounded-[1px]"
      />
      <p className="whitespace-pre-line text-center font-hand text-[17px] leading-tight text-ink-soft">
        {memory.noteText}
      </p>
    </div>
  );
}

/* ————— pick the right artifact for a memory ————— */
export function MemoryArtifact({
  memory,
  className,
}: {
  memory: MemoryItem;
  className?: string;
}) {
  switch (memory.kind) {
    case "polaroid":
      return <PolaroidArtifact memory={memory} className={className} />;
    case "strip":
      return <StripArtifact memory={memory} className={className} />;
    case "chat":
      return <ChatArtifact memory={memory} className={className} preview />;
    case "ticket":
      return <TicketArtifact memory={memory} className={className} />;
    case "note":
      return <NoteArtifact memory={memory} className={className} />;
    case "taped":
      return <TapedArtifact memory={memory} className={className} />;
  }
}
