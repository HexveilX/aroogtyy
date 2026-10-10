"use client";

/* ————————————————————————————————————————————————
   Little Things That Are So You
   seven small objects, kept on a board of their own.
———————————————————————————————————————————————— */

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import {
  type LittleThing,
  type LittleThingObject,
  type ViewId,
} from "@/content/arooqtyContent";
import { useContent } from "./Lang";
import { lsGet, lsSet } from "@/lib/localStorage";
import { PaperDialog, Reveal, SectionHeading } from "./Shared";
import ScrapbookDoodles, { Sparkle } from "./ScrapbookDoodles";
import { ScrapbookPhoto } from "./ScrapbookPhoto";
import ChapterNav from "./ChapterNav";
import PlayLittle from "./PlayLittle";
import TicketStubs from "./TicketStubs";
import { cn } from "@/lib/utils";

/* ————— object art ————— */

function NoteArt({ big }: { big?: boolean }) {
  return (
    <div
      className={cn(
        "relative rounded-[2px] bg-cream polaroid-shadow",
        big ? "h-[110px] w-[150px]" : "h-[72px] w-[98px]"
      )}
    >
      <div className="absolute inset-x-3 top-[15px] space-y-[7px]">
        <span className="block h-px bg-burgundy/20" />
        <span className="block h-px bg-burgundy/20" />
        <span className="block h-px bg-burgundy/20" />
      </div>
      <div className="absolute bottom-0 right-0 h-[22px] w-[22px] bg-[#e7dbd4] [clip-path:polygon(100%_0,0_100%,100%_100%)] shadow-[-2px_-2px_5px_rgba(0,0,0,0.1)]" />
      <span
        aria-hidden
        className="tape-strip absolute -top-1.5 left-1/2 h-4 w-12 -translate-x-1/2 -rotate-2 rounded-[1px]"
      />
    </div>
  );
}

function ChocolateArt({ big }: { big?: boolean }) {
  return (
    <div
      className={cn(
        "relative flex items-center",
        big ? "h-[76px] w-[176px]" : "h-[50px] w-[120px]"
      )}
    >
      <div className="h-full w-[26px] bg-gradient-to-b from-[#6d2737] via-[#8a3a4c] to-[#5b1f2e] [clip-path:polygon(100%_50%,15%_0,0_18%,0_82%,15%_100%)]" />
      <div className="h-full w-[5px] bg-black/25" />
      <div className="relative h-full flex-1 bg-gradient-to-br from-[#7d2c3f] via-[#a04a5e] to-[#5b1f2e]">
        <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_18%,rgba(248,244,241,0.3)_27%,transparent_36%,transparent_54%,rgba(248,244,241,0.2)_61%,transparent_70%)]" />
        <div className="absolute inset-x-2.5 top-1 h-px bg-cream/35" />
        <div className="absolute inset-x-3 bottom-1.5 h-px bg-black/30" />
      </div>
      <div className="h-full w-[5px] bg-black/25" />
      <div className="h-full w-[26px] bg-gradient-to-b from-[#6d2737] via-[#8a3a4c] to-[#5b1f2e] [clip-path:polygon(0_50%,85%_0,100%_18%,100%_82%,85%_100%)]" />
    </div>
  );
}

function PolaroidArt({ big }: { big?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-[2px] bg-cream p-[6px] pb-[24%] polaroid-shadow",
        big ? "w-[132px]" : "w-[86px]"
      )}
    >
      <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-[#241019] to-[#43222e]">
        <Heart
          className={cn("text-rose/80", big ? "h-9 w-9" : "h-5 w-5")}
          fill="currentColor"
          strokeWidth={0}
          aria-hidden
        />
      </div>
    </div>
  );
}

function FlowerArt({ big }: { big?: boolean }) {
  const size = big ? 128 : 78;
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden
      className="drop-shadow-[0_12px_14px_rgba(0,0,0,0.5)]"
    >
      <path
        d="M32 34 C 30 44, 33 52, 32 60.5"
        stroke="#7a4a58"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M32 49 C 26.5 48, 23 44.5, 22.5 40 C 28 41.5, 31 44, 32 49 Z" fill="#651C2D" />
      <path d="M32 44 C 37.5 43, 41 39.5, 41.5 35 C 36 36.5, 33 39, 32 44 Z" fill="#651C2D" opacity="0.8" />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx="32"
          cy="15.5"
          rx="6.4"
          ry="9.8"
          fill="#B77C8D"
          opacity="0.93"
          transform={`rotate(${a} 32 24)`}
        />
      ))}
      <circle cx="32" cy="24" r="4.8" fill="#651C2D" />
      <circle cx="30.5" cy="22.4" r="1.3" fill="#F8F4F1" opacity="0.55" />
    </svg>
  );
}

function WordArt({ big }: { big?: boolean }) {
  return (
    <div
      className={cn(
        "relative flex rotate-[-2deg] items-center justify-center rounded-[2px] bg-cream polaroid-shadow",
        big ? "h-[104px] w-[160px]" : "h-[66px] w-[108px]"
      )}
    >
      <span
        aria-hidden
        className="absolute inset-x-3 bottom-2 h-px bg-[#8a4a5c]/25"
      />
      <span
        dir="rtl"
        lang="ar"
        className={cn(
          "font-arabic leading-none text-[#651C2D]",
          big ? "text-[46px]" : "text-[30px]"
        )}
      >
        بجااااد
      </span>
      <span
        aria-hidden
        className="tape-strip absolute -top-1.5 right-2 h-4 w-10 rotate-3 rounded-[1px]"
      />
    </div>
  );
}

function StickerArt({ big }: { big?: boolean }) {
  const size = big ? 132 : 86;
  const heartPath =
    "M16 29 C 8 22, 1 16.5, 1 9.5 C 1 4.8 4.4 1.5 8.4 1.5 C 11.4 1.5 14.2 3.2 16 6 C 17.8 3.2 20.6 1.5 23.6 1.5 C 27.6 1.5 31 4.8 31 9.5 C 31 16.5 24 22 16 29 Z";
  return (
    <svg
      viewBox="-3 -3 38 35"
      width={size}
      height={(size * 35) / 38}
      aria-hidden
      className="drop-shadow-[0_12px_14px_rgba(0,0,0,0.5)]"
    >
      <path d={heartPath} fill="#F8F4F1" />
      <path d={heartPath} fill="#651C2D" transform="translate(2.9 2.7) scale(0.82)" />
      <path
        d="M11 13 c 1.2 -1.6, 3.6 -1.6, 4.4 0"
        stroke="#F8F4F1"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        opacity="0.55"
        transform="translate(1.2 1.1) scale(0.9)"
      />
    </svg>
  );
}

function CassetteArt({ big }: { big?: boolean }) {
  const content = useContent();
  return (
    <div
      className={cn(
        "relative rounded-md border border-burgundy bg-wine polaroid-shadow",
        big ? "h-[122px] w-[196px]" : "h-[78px] w-[128px]"
      )}
    >
      <div className="absolute inset-x-2.5 top-2 flex h-[42%] flex-col items-center justify-center rounded-sm bg-cream">
        <span
          className={cn(
            "font-hand leading-none text-[#651C2D]",
            big ? "text-[24px]" : "text-[15px]"
          )}
        >
          {content.ui.sections.things.cassetteSong}
        </span>
        <span
          className={cn(
            "mt-1 uppercase tracking-[0.3em] text-[#8a4a5c]/70",
            big ? "text-[8px]" : "text-[6px]"
          )}
        >
          {content.ui.sections.things.cassetteSide}
        </span>
      </div>
      <div className="absolute inset-x-4 bottom-2 flex h-[32%] items-center justify-center gap-5 rounded-sm border border-burgundy/70 bg-paper">
        <span
          className={cn(
            "rounded-full border-[2.5px] border-rose/70",
            big ? "h-5 w-5" : "h-3.5 w-3.5"
          )}
        />
        <span className="h-[3px] w-1/3 rounded bg-rose/25" />
        <span
          className={cn(
            "rounded-full border-[2.5px] border-rose/70",
            big ? "h-5 w-5" : "h-3.5 w-3.5"
          )}
        />
      </div>
      <span className="absolute left-1.5 top-1.5 h-1 w-1 rounded-full bg-burgundy" />
      <span className="absolute right-1.5 top-1.5 h-1 w-1 rounded-full bg-burgundy" />
      <span className="absolute bottom-1.5 left-1.5 h-1 w-1 rounded-full bg-burgundy" />
      <span className="absolute bottom-1.5 right-1.5 h-1 w-1 rounded-full bg-burgundy" />
    </div>
  );
}

function ObjectArt({
  object,
  big,
}: {
  object: LittleThingObject;
  big?: boolean;
}) {
  switch (object) {
    case "note":
      return <NoteArt big={big} />;
    case "chocolate":
      return <ChocolateArt big={big} />;
    case "polaroid":
      return <PolaroidArt big={big} />;
    case "flower":
      return <FlowerArt big={big} />;
    case "word":
      return <WordArt big={big} />;
    case "sticker":
      return <StickerArt big={big} />;
    case "cassette":
      return <CassetteArt big={big} />;
  }
}

/* ————— gentle scatter layout ————— */
const LAYOUT = [
  { rotate: -5, y: 8 },
  { rotate: 4, y: -6 },
  { rotate: -2, y: 10 },
  { rotate: 5, y: -4 },
  { rotate: -4, y: 6 },
  { rotate: 3, y: -10 },
  { rotate: -3, y: 8 },
];

export default function LittleThingsView({
  onNavigate,
}: {
  onNavigate: (v: ViewId) => void;
}) {
  const reduce = useReducedMotion();
  const { littleThings, littleThingsAllFound, realPhotos, ui } = useContent();
  const [discovered, setDiscovered] = useState<string[]>(() =>
    lsGet<string[]>("littleThings", [])
  );
  const [active, setActive] = useState<LittleThing | null>(null);
  const [justFound, setJustFound] = useState<string | null>(null);
  /* the one-shot heart that leaves a tap — a tiny "yes"
     rising from whichever little thing she just touched */
  const [tapHeart, setTapHeart] = useState<string | null>(null);

  const open = (thing: LittleThing) => {
    setActive(thing);
    if (!reduce) {
      setTapHeart(thing.id);
      window.setTimeout(() => setTapHeart(null), 1000);
    }
    if (!discovered.includes(thing.id)) {
      const next = [...discovered, thing.id];
      setDiscovered(next);
      lsSet("littleThings", next);
      // a tiny burgundy halo, just for a moment
      setJustFound(thing.id);
      window.setTimeout(() => setJustFound(null), 1600);
    }
  };

  const allFound = discovered.length === littleThings.length;

  return (
    <div className="relative isolate">
      {/* the living scrapbook — playful little marks and
          sparkles scattered around the little things */}
      <ScrapbookDoodles variant="things" />
      <SectionHeading
        overline={ui.sections.things.overline}
        title={ui.sections.things.title}
        sub={ui.sections.things.sub}
      />

      {/* the board */}
      <Reveal className="mt-12" delay={0.05}>
        <div className="rounded-2xl border border-rose/10 bg-wine/25 px-4 py-12 sm:px-10">
          <div className="flex flex-wrap items-center justify-center gap-x-9 gap-y-12 sm:gap-x-12">
            {littleThings.map((thing, i) => {
              const found = discovered.includes(thing.id);
              const { rotate, y } = LAYOUT[i % LAYOUT.length];
              return (
                <div
                  key={thing.id}
                  style={{ transform: `rotate(${rotate}deg) translateY(${y}px)` }}
                >
                  <motion.button
                    onClick={() => open(thing)}
                    aria-label={`${thing.ariaLabel}${found ? ui.sections.things.foundAria : ""}`}
                    whileHover={reduce ? undefined : { scale: 1.07, rotate: 0 }}
                    whileTap={reduce ? undefined : { scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 380, damping: 17 }}
                    className={cn(
                      "group relative block cursor-pointer touch-manipulation",
                      justFound === thing.id && "animate-discover-glow rounded-xl"
                    )}
                  >
                    <ObjectArt object={thing.object} />
                    {/* a tiny sparkle, waking beside the object
                        while she considers it */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -right-2 -top-2.5 block h-3.5 w-3.5 scale-75 opacity-0 transition-[opacity,transform] duration-300 group-hover:scale-100 group-hover:opacity-80"
                    >
                      <Sparkle color="#B77C8D" />
                    </span>
                    {/* the tap's little yes — a heart rising once
                        from wherever she just touched */}
                    {tapHeart === thing.id && !reduce && (
                      <motion.span
                        key={`tap-${thing.id}`}
                        aria-hidden
                        initial={{ opacity: 0, y: 4, scale: 0.55 }}
                        animate={{
                          opacity: [0, 0.9, 0.9, 0],
                          y: -26,
                          scale: 1,
                        }}
                        transition={{
                          duration: 0.95,
                          times: [0, 0.22, 0.72, 1],
                          ease: "easeOut",
                        }}
                        className="pointer-events-none absolute left-1/2 -top-3 -ml-2 block"
                      >
                        <Heart
                          className="h-4 w-4 text-rose"
                          fill="currentColor"
                          strokeWidth={0}
                        />
                      </motion.span>
                    )}
                    {found && (
                      <motion.span
                        aria-hidden
                        initial={reduce ? false : { scale: 0, rotate: -40 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 500, damping: 16 }}
                        className="absolute -right-1.5 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-burgundy shadow"
                      >
                        <Heart
                          className="h-2.5 w-2.5 text-cream"
                          fill="currentColor"
                          strokeWidth={0}
                        />
                      </motion.span>
                    )}
                  </motion.button>
                </div>
              );
            })}
          </div>
        </div>
        <p
          className={cn(
            "mt-6 text-center font-hand text-xl transition-opacity duration-700",
            allFound ? "text-rose/90 opacity-100" : "opacity-0"
          )}
          aria-live="polite"
        >
          {allFound ? littleThingsAllFound : ""}
        </p>
      </Reveal>

      {/* a real moment from our chat — printed and taped in
          under the board, like a screenshot someone kept.
          The room stays playful; the photo stays honest */}
      <Reveal className="mt-14" delay={0.05}>
        <div className="flex flex-col items-center">
          <p className="text-center text-[11px] uppercase tracking-[0.3em] text-rose/75">
            {realPhotos.chatMoment.overline}
          </p>
          <ScrapbookPhoto
            src={realPhotos.chatMoment.src}
            alt={realPhotos.chatMoment.alt}
            caption={realPhotos.chatMoment.caption}
            rotate={-1.8}
            maxWidth={218}
            frame="polaroid"
            tape="single"
            className="mt-5"
          />
        </div>
      </Reveal>

      {/* the ticket stubs — films queued for us */}
      <TicketStubs />

      {/* the play drawer */}
      <Reveal className="mt-4" delay={0.05}>
        <PlayLittle />
      </Reveal>

      {/* the reveal */}
      <PaperDialog
        open={active !== null}
        onOpenChange={(o) => {
          if (!o) setActive(null);
        }}
        ariaLabel={active?.title ?? ui.sections.things.fallbackTitle}
      >
        {active && (
          <div className="p-7 text-center sm:p-9">
            <div className="flex h-32 items-center justify-center">
              <ObjectArt object={active.object} big />
            </div>
            <h3 className="mt-5 font-display text-2xl text-ink">
              {active.title}
            </h3>
            <div
              aria-hidden
              className="mx-auto mt-3 h-px w-16 bg-[#8a4a5c]/30"
            />
            <p className="mt-4 font-hand text-[1.5rem] leading-snug text-ink-soft">
              {active.note}
            </p>
          </div>
        )}
      </PaperDialog>

      <ChapterNav current="things" onNavigate={onNavigate} />
    </div>
  );
}
