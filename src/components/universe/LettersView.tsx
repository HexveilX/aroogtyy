"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart, Lock } from "lucide-react";
import type { SealedLetter, ViewId } from "@/content/arooqtyContent";
import { useContent, useLang } from "./Lang";
import { lsGet, lsSet } from "@/lib/localStorage";
import { daysUntil } from "@/lib/timeTogether";
import { LinesReveal, PaperDialog, Reveal, SectionHeading, TapeStrip } from "./Shared";
import ScrapbookDoodles, { HeartOutline } from "./ScrapbookDoodles";
import { ScrapbookPhoto } from "./ScrapbookPhoto";
import ChapterNav from "./ChapterNav";
import Whispers from "./Whispers";
import HerPage from "./HerPage";
import TimeCapsule from "./TimeCapsule";
import { isArabic } from "@/lib/isArabic";
import { cn } from "@/lib/utils";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function prettyDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[(m ?? 1) - 1]} ${y}`;
}

function SealedLetterCard({
  letter,
  index,
  unlocked,
  opened,
  daysLeft,
  onOpen,
}: {
  letter: SealedLetter;
  index: number;
  unlocked: boolean;
  opened: boolean;
  /** days remaining until the seal breaks (null when openable) */
  daysLeft: number | null;
  onOpen: () => void;
}) {
  const reduce = useReducedMotion();
  const { sealedLetterLabels } = useContent();
  const rotate = [-1.5, 1.2, -1, 1.6][index % 4];

  return (
    <Reveal delay={index * 0.06}>
      <motion.button
        onClick={() => unlocked && onOpen()}
        whileHover={reduce || !unlocked ? undefined : { scale: 1.02, rotate: 0 }}
        whileTap={reduce || !unlocked ? undefined : { scale: 0.98 }}
        aria-disabled={!unlocked}
        className={cn(
          "group block w-full cursor-pointer text-center",
          !unlocked && "cursor-default"
        )}
      >
        {/* the envelope */}
        <div
          className={cn(
            "relative mx-auto aspect-[3/2] w-full max-w-[290px] rounded-md bg-gradient-to-b from-[#faf6f3] to-[#eee0da] polaroid-shadow transition-transform duration-300",
            unlocked && "group-hover:-translate-y-0.5"
          )}
          style={{ transform: `rotate(${rotate}deg)` }}
        >
          <svg
            viewBox="0 0 300 200"
            aria-hidden
            className="absolute inset-0 h-full w-full"
          >
            <path
              d="M6 6 L150 96 L294 6"
              className="envelope-flap"
              stroke="#d9c8c0"
              strokeWidth="2.5"
              fill="none"
            />
            <path
              d="M6 194 L112 108 M294 194 L188 108"
              stroke="#e5d8d1"
              strokeWidth="2"
              fill="none"
            />
          </svg>
          {/* a soft inner shadow at the flap fold — the way
              a real envelope carries a pressed crease */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[42px] rounded-t-md"
            style={{
              background:
                "linear-gradient(to bottom, rgba(101,28,45,0.16), rgba(101,28,45,0.04) 60%, transparent)",
            }}
          />
          {/* wax seal — tilts a little under her thumb, like it might crack */}
          <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2">
            {/* a tiny heart surfacing above the envelope while
                she holds it — the paper noticing her */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[-26px] -translate-x-1/2 block h-3.5 w-3.5 translate-y-1.5 opacity-0 transition-[opacity,transform] duration-500 group-hover:translate-y-0 group-hover:opacity-70"
            >
              <HeartOutline color="#8a3a4e" />
            </span>
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#7d2c3f] to-[#4a1622] shadow-md ring-2 ring-[#4a1622]/40 transition-transform duration-300",
                unlocked && "group-hover:scale-110 group-hover:-rotate-6",
                !unlocked && "saturate-[0.8]"
              )}
            >
              {unlocked ? (
                <Heart
                  className="h-4 w-4 text-cream"
                  fill="currentColor"
                  strokeWidth={0}
                />
              ) : (
                <Lock className="h-4 w-4 text-cream/90" strokeWidth={1.8} />
              )}
            </div>
          </div>
          {opened && (
            <span className="absolute end-3 top-3 rounded-full bg-burgundy/10 px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] text-[#8a4a5c]">
              {sealedLetterLabels.openedLabel}
            </span>
          )}
          {/* a tiny countdown chip — how long the wax still holds */}
          {!unlocked && daysLeft !== null && daysLeft > 0 && (
            <span className="absolute start-3 top-3 rounded-full border border-rose/25 bg-[#0D0A0B]/55 px-2 py-0.5 text-[8.5px] uppercase tracking-[0.14em] text-rose/85 tabular-digits">
              {sealedLetterLabels.countdownTemplate.replace(
                "{n}",
                String(daysLeft)
              )}
            </span>
          )}
        </div>

        <p className="mt-4 font-display text-lg leading-snug text-cream">
          {letter.title}
        </p>
        <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-rose-soft/85">
          {!unlocked
            ? sealedLetterLabels.keptForTemplate.replace(
                "{date}",
                prettyDate(letter.openOn!)
              )
            : opened
              ? sealedLetterLabels.readAgainLabel
              : sealedLetterLabels.tapToBreakLabel}
        </p>
      </motion.button>
    </Reveal>
  );
}

export default function LettersView({
  onNavigate,
}: {
  onNavigate: (v: ViewId) => void;
}) {
  const reduce = useReducedMotion();
  const { lang, content } = useLang();
  const { mainLetter, relationship, sealedLetters, realPhotos, ui } = content;
  const [activeLetter, setActiveLetter] = useState<SealedLetter | null>(null);
  const [openedIds, setOpenedIds] = useState<string[]>(() =>
    lsGet<string[]>("sealedLetters", [])
  );
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const initial = new Date();
    const id = setInterval(() => setNow(new Date()), 60_000);
    const raf = requestAnimationFrame(() => setNow(initial));
    return () => {
      clearInterval(id);
      cancelAnimationFrame(raf);
    };
  }, []);

  const isUnlocked = (letter: SealedLetter) => {
    if (!letter.openOn || !now) return true;
    return daysUntil(letter.openOn, now, relationship.timezone) <= 0;
  };

  const daysLeftFor = (letter: SealedLetter): number | null => {
    if (!letter.openOn || !now) return null;
    return Math.max(0, daysUntil(letter.openOn, now, relationship.timezone));
  };

  const openLetter = (letter: SealedLetter) => {
    if (!isUnlocked(letter)) return;
    setActiveLetter(letter);
    if (!openedIds.includes(letter.id)) {
      const next = [...openedIds, letter.id];
      setOpenedIds(next);
      lsSet("sealedLetters", next);
    }
  };

  return (
    <div className="relative isolate">
      {/* the living scrapbook — tiny envelopes and quiet
          marks drifting between the letters */}
      <ScrapbookDoodles variant="letters" />
      <SectionHeading
        overline={ui.sections.letters.overline}
        title={ui.sections.letters.title}
        sub={ui.sections.letters.sub}
      />

      {/* the main letter */}
      <Reveal className="mx-auto mt-12 max-w-[640px]" delay={0.05}>
        <article className="relative rotate-[0.4deg] rounded-lg bg-cream px-7 py-10 polaroid-shadow sm:px-12 sm:py-14">
          <TapeStrip className="-top-3 left-1/2 w-20 -translate-x-1/2 -rotate-2" />
          {/* a tiny corner-fold, like a real letter that's been held —
              a small triangle shadow in the reading corner */}
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-0 end-0 h-5 w-5 rounded-bl-[100%] rtl:rounded-br-[100%] rtl:rounded-bl-none"
            style={{
              background:
                "linear-gradient(135deg, transparent 49%, rgba(101,28,45,0.18) 50%, rgba(101,28,45,0.08) 100%)",
            }}
          />
          {/* faint ruled lines — like a letter actually written on paper */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-8 top-[8.4rem] bottom-16 sm:inset-x-14"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(101,28,45,0.055) 31px, rgba(101,28,45,0.055) 32px)",
            }}
          />
          {/* a soft red margin line, the way notebooks keep them */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-10 top-[8.4rem] start-5 w-px sm:start-7"
            style={{ backgroundColor: "rgba(183,124,141,0.14)" }}
          />
          <p className="relative font-hand text-4xl text-ink">{mainLetter.greeting}</p>
          <LinesReveal className="relative mt-6 space-y-5" step={0.16}>
            {mainLetter.paragraphs.map((p, i) => {
              /* in the English universe, the Arabic paragraph steps
                 forward in its own voice; in Arabic mode every line
                 already lives in that voice */
              const ar = lang === "en" && isArabic(p);
              return (
                <p
                  key={i}
                  dir={ar ? "rtl" : undefined}
                  lang={ar ? "ar" : undefined}
                  className={cn(
                    "leading-[1.95] text-ink-soft/95",
                    ar
                      ? "font-arabic text-[17px] leading-[2.2]"
                      : "font-body text-[16.5px]"
                  )}
                >
                  {p}
                </p>
              );
            })}
          </LinesReveal>
          <p className="relative mt-10 flex items-center justify-end gap-2 font-hand text-3xl text-burgundy">
            — {mainLetter.signature}
            <Heart
              className="h-4 w-4 text-rose"
              fill="currentColor"
              strokeWidth={0}
              aria-hidden
            />
          </p>
        </article>
      </Reveal>

      {/* whispers — one small note unsealed each day */}
      <Whispers />

      {/* a real page — the handwriting exists somewhere outside
          this website; the website just keeps a copy of it. Tipped
          in quietly, where the letters live */}
      <Reveal className="mx-auto mt-16 max-w-[640px]" delay={0.05}>
        <div className="flex flex-col items-center">
          <p className="text-center text-[11px] uppercase tracking-[0.3em] text-rose/75">
            {realPhotos.loveNote.overline}
          </p>
          <ScrapbookPhoto
            src={realPhotos.loveNote.src}
            alt={realPhotos.loveNote.alt}
            caption={realPhotos.loveNote.caption}
            rotate={1.6}
            maxWidth={292}
            frame="mat"
            tape="corners"
            className="mt-5"
          />
        </div>
      </Reveal>

      {/* for later */}
      <div className="mt-20">
        <Reveal className="text-center">
          <h3 className="font-hand text-3xl text-rose/90">{ui.lettersUi.forLaterOverline}</h3>
          <p className="mt-1 text-[11px] uppercase tracking-[0.24em] text-rose-soft/70">
            {ui.lettersUi.forLaterSub}
          </p>
          {/* a soft handwritten underline, drawing itself beneath
              the words as she reaches this part of the page */}
          <svg
            viewBox="0 0 120 10"
            aria-hidden
            className="mx-auto mt-3.5 block h-2.5 w-28 overflow-visible text-rose/60"
          >
            <motion.path
              d="M2 6 C 22 2, 40 9, 62 5.5 S 98 3, 118 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0.4 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: reduce ? 0 : 1.1,
                ease: [0.22, 1, 0.36, 1],
              }}
            />
          </svg>
          {/* a tiny lock between two ink lines — like the drawer
              these letters sleep in */}
          <div
            aria-hidden
            className="mx-auto mt-4 flex w-40 items-center gap-2 opacity-60"
          >
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-burgundy/60" />
            <Lock className="h-3 w-3 text-rose/70" strokeWidth={1.8} />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-burgundy/60" />
          </div>
        </Reveal>

        <div className="mt-9 grid gap-9 sm:grid-cols-2 sm:gap-7">
          {sealedLetters.map((letter, i) => (
            <SealedLetterCard
              key={letter.id}
              letter={letter}
              index={i}
              unlocked={isUnlocked(letter)}
              opened={openedIds.includes(letter.id)}
              daysLeft={daysLeftFor(letter)}
              onOpen={() => openLetter(letter)}
            />
          ))}
        </div>
      </div>

      {/* a page for her — the one corner of this room that's hers */}
      <HerPage />

      {/* a letter to later — her own sealed notes, future-facing */}
      <TimeCapsule />

      {/* sealed letter reading */}
      <PaperDialog
        open={activeLetter !== null}
        onOpenChange={(o) => {
          if (!o) setActiveLetter(null);
        }}
        ariaLabel={activeLetter?.title ?? ui.lettersUi.fallbackTitle}
      >
        {activeLetter && (
          <div className="p-7 sm:p-9">
            <p className="text-center text-[10px] uppercase tracking-[0.28em] text-[#8a4a5c]">
              {activeLetter.title}
            </p>
            <div
              aria-hidden
              className="mx-auto mt-4 h-px w-16 bg-[#8a4a5c]/25"
            />
            <div className="mt-5 space-y-4">
              {activeLetter.body.map((p, i) => (
                <p
                  key={i}
                  className="font-body text-[15.5px] leading-[1.9] text-ink-soft/95"
                >
                  {p}
                </p>
              ))}
            </div>
            <p className="mt-7 text-end font-hand text-2xl text-burgundy">
              — {mainLetter.signature}
            </p>
          </div>
        )}
      </PaperDialog>

      <ChapterNav current="letters" onNavigate={onNavigate} />
    </div>
  );
}
