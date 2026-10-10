"use client";

/* ————————————————————————————————————————————————
   play a little ♡ — a small drawer at the bottom of
   Little Things: her quiz, a memory match, a jar of
   notes for ordinary days, and a deck of reasons.
———————————————————————————————————————————————— */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ChevronDown,
  Gift,
  Heart,
  HelpCircle,
  Layers,
  Shuffle,
  Sparkles,
  Ticket,
} from "lucide-react";
import type {
  MatchCard,
  MatchPair,
  QuizQuestion,
} from "@/content/arooqtyContent";
import { useContent, useLang } from "./Lang";
import { lsGet, lsSet } from "@/lib/localStorage";
import { PaperDialog, TapeStrip } from "./Shared";
import { HeartOutline as HeartOutlineGlyph, Sparkle as SparkleGlyph } from "./ScrapbookDoodles";
import { isArabic } from "@/lib/isArabic";
import { cn } from "@/lib/utils";

type Activity = "quiz" | "match" | "jar" | "reason" | "coupon";

/* ————— a tiny rose, for the object match card ————— */
function MiniRose() {
  return (
    <svg viewBox="0 0 40 54" width="44" height="58" aria-hidden>
      <path
        d="M20 30 C 18 40, 21 46, 20 52"
        stroke="#7a4a58"
        strokeWidth="1.7"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M20 42 C 15.5 41, 13 38, 12.5 34.5 C 17 36, 19.3 38.4, 20 42 Z" fill="#651C2D" />
      <path d="M20 38 C 24.5 37, 27 34, 27.5 30.5 C 23 32, 20.7 34.4, 20 38 Z" fill="#651C2D" opacity="0.85" />
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse
          key={a}
          cx="20"
          cy="9"
          rx="4.6"
          ry="7"
          fill="#B77C8D"
          opacity="0.93"
          transform={`rotate(${a} 20 15)`}
        />
      ))}
      <circle cx="20" cy="15" r="3.4" fill="#651C2D" />
      <circle cx="18.9" cy="13.9" r="1" fill="#F8F4F1" opacity="0.55" />
    </svg>
  );
}

/* ————— a tiny chocolate, for the object match card ————— */
function MiniChocolate() {
  return (
    <svg viewBox="0 0 56 34" width="62" height="38" aria-hidden>
      <rect x="1" y="6" width="54" height="22" rx="3" fill="#651C2D" />
      <rect x="1" y="6" width="54" height="22" rx="3" fill="url(#chocSheen)" />
      <path d="M14 6 L14 28 M28 6 L28 28 M42 6 L42 28" stroke="#2D0B15" strokeWidth="1.6" />
      <path d="M7 12 L49 12" stroke="#F8F4F1" strokeWidth="1" opacity="0.25" />
      <path d="M20 3 Q 22 1 25 3" stroke="#B77C8D" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <defs>
        <linearGradient id="chocSheen" x1="0" y1="0" x2="56" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0.2" stopColor="#F8F4F1" stopOpacity="0.16" />
          <stop offset="0.5" stopColor="#F8F4F1" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ————————————————— the quiz ————————————————— */

function QuizActivity() {
  const { playLittle, quizHiddenLetter } = useContent();
  const { lang } = useLang();
  const q = playLittle.quiz;
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [earned, setEarned] = useState(() =>
    lsGet<boolean>("quizLetterEarned", false)
  );
  const reduce = useReducedMotion();

  const question: QuizQuestion | null = finished ? null : q.questions[step];
  const isLast = step === q.questions.length - 1;

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
  };

  const next = () => {
    if (isLast) {
      setFinished(true);
      if (!earned) {
        setEarned(true);
        lsSet("quizLetterEarned", true);
      }
    } else {
      setStep((s) => s + 1);
      setPicked(null);
    }
  };

  /* ——— the earned letter ——— */
  const letterDialog = (
    <PaperDialog
      open={letterOpen}
      onOpenChange={setLetterOpen}
      ariaLabel={quizHiddenLetter.title}
    >
      <div className="p-7 sm:p-9">
        <p className="text-center text-[10px] uppercase tracking-[0.28em] text-[#8a4a5c]">
          {quizHiddenLetter.title}
        </p>
        <div aria-hidden className="mx-auto mt-4 h-px w-16 bg-[#8a4a5c]/25" />
        <div className="mt-5 space-y-4">
          {quizHiddenLetter.paragraphs.map((p, i) => (
            <p
              key={i}
              className="font-body text-[15.5px] leading-[1.9] text-ink-soft/95"
            >
              {p}
            </p>
          ))}
        </div>
        <p className="mt-7 text-end font-hand text-2xl text-burgundy">
          — {quizHiddenLetter.signature}
        </p>
      </div>
    </PaperDialog>
  );

  if (finished) {
    return (
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.5 }}
        >
          <p className="font-hand text-2xl text-rose">{q.completeLine}</p>
          <p className="mt-3 text-[11px] uppercase tracking-[0.24em] text-rose-soft/75">
            {q.unlockLine}
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setLetterOpen(true)}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-[10px] border border-burgundy/60 bg-burgundy/25 px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-cream/90 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose/70 hover:bg-burgundy/50"
            >
              <Heart className="h-3.5 w-3.5 text-rose" fill="currentColor" strokeWidth={0} aria-hidden />
              {q.readLetterLabel}
            </button>
            <button
              onClick={() => {
                setFinished(false);
                setStep(0);
                setPicked(null);
              }}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-[10px] border border-rose/25 px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-rose/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose/50 hover:text-rose"
            >
              {q.againLabel}
            </button>
          </div>
        </motion.div>
        {letterDialog}
      </div>
    );
  }

  return (
    <div>
      {/* progress */}
      <div className="flex items-center justify-center gap-3">
        <span className="text-[10px] uppercase tracking-[0.26em] text-rose-soft/85 tabular-digits">
          {q.counterTemplate
            .replace("{n}", String(step + 1))
            .replace("{total}", String(q.questions.length))}
        </span>
        <span className="h-px w-16 overflow-hidden bg-burgundy/40">
          <motion.span
            className="block h-full bg-rose"
            initial={false}
            animate={{ width: `${((step + (picked !== null ? 0.5 : 0)) / q.questions.length) * 100}%` }}
            transition={{ duration: reduce ? 0 : 0.4 }}
          />
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: reduce ? 0 : 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: reduce ? 0 : -16 }}
          transition={{ duration: reduce ? 0 : 0.35, ease: "easeOut" }}
        >
          <h4 className="mt-6 text-center font-display text-2xl leading-snug text-cream sm:text-[1.7rem]">
            {question?.question}
          </h4>

          <div className="mx-auto mt-7 max-w-md space-y-3">
            {question?.options.map((opt, i) => {
              const chosen = picked === i;
              const revealed = picked !== null;
              return (
                /* the entrance belongs to the wrapper — the
                    button below keeps its own hover transition,
                    so nothing fights anything */
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: reduce ? 0 : 0.42,
                    delay: reduce ? 0 : 0.06 + i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <button
                    onClick={() => pick(i)}
                    disabled={revealed}
                    className={cn(
                      "group flex w-full items-start gap-3.5 rounded-xl border px-4 py-3.5 text-start transition-all duration-300",
                      revealed
                        ? chosen
                          ? "border-burgundy/70 bg-burgundy/25 text-cream"
                          : "border-rose/10 bg-transparent text-cream/55"
                        : "cursor-pointer border-rose/20 bg-paper-card/80 text-cream/85 hover:-translate-y-0.5 hover:border-rose/50 hover:bg-wine/50"
                    )}
                  >
                    {/* the heart bullet — fills in and gives one
                        little pop once she picks this one */}
                    <motion.span
                      aria-hidden
                      animate={{ scale: chosen && !reduce ? [1, 1.45, 1] : 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className={cn(
                        "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center transition-colors duration-300",
                        chosen
                          ? "text-rose"
                          : revealed
                            ? "text-rose/15"
                            : "text-rose-soft/70 group-hover:text-rose-soft"
                      )}
                    >
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5"
                        fill={chosen ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth={chosen ? 0 : 1.8}
                      >
                        <path d="M12 21s-7.5-4.9-9.7-9.2C.7 8.6 2.6 5 6.1 5c2 0 3.4 1.1 4.2 2.4L12 9l1.7-1.6C14.5 6.1 15.9 5 17.9 5c3.5 0 5.4 3.6 3.8 6.8C19.5 16.1 12 21 12 21z" />
                      </svg>
                    </motion.span>
                    <span
                      className={cn(
                        "mt-0.5 font-hand text-xl leading-none",
                        revealed && chosen ? "text-rose" : "text-[#c98497]"
                      )}
                    >
                      {String.fromCharCode(97 + i)}.
                    </span>
                    <span className="font-body text-[15px] leading-relaxed">{opt.label}</span>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* the gentle reveal */}
          <AnimatePresence>
            {picked !== null && question && (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.4 }}
                className="mx-auto mt-6 max-w-md"
              >
                <div className="relative rotate-[-0.6deg] rounded-lg bg-cream px-6 py-5 polaroid-shadow">
                  <TapeStrip className="-top-2.5 left-1/2 w-12 -translate-x-1/2" />
                  <p className="font-hand text-xl text-[#8a4a5c]">
                    {picked === question.answerIndex ? q.softRight : q.softWrong}
                  </p>
                  <div aria-hidden className="my-2.5 h-px w-14 bg-[#8a4a5c]/25" />
                  <p className="text-[11px] uppercase tracking-[0.22em] text-[#8a4a5c]/70">
                    {q.revealNoteLabel}
                  </p>
                  <p className="mt-1.5 font-body text-[14.5px] leading-relaxed text-ink-soft">
                    {question.options[picked].note}
                  </p>
                </div>
                <div className="mt-5 flex justify-center">
                  <button
                    onClick={next}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-[10px] border border-burgundy/60 bg-burgundy/25 px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] text-cream/90 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose/70 hover:bg-burgundy/50"
                  >
                    {isLast ? q.finishLabel : q.nextLabel}
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5",
                        /* the forward nudge — leading the reading direction */
                        lang === "ar" ? "rotate-90" : "-rotate-90"
                      )}
                      strokeWidth={1.8}
                      aria-hidden
                    />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* if she earned it before, let her re-read it anytime */}
      {earned && (
        <p className="mt-9 text-center">
          <button
            onClick={() => setLetterOpen(true)}
            className="inline-flex items-center gap-1.5 font-hand text-lg text-rose-soft/85 transition-colors hover:text-rose-soft"
          >
            <Heart className="h-3.5 w-3.5" fill="currentColor" strokeWidth={0} aria-hidden />
            {q.letterEarnedLine}
          </button>
        </p>
      )}
      {letterDialog}
    </div>
  );
}

/* ————————————————— memory match ————————————————— */

interface MatchInstance {
  iid: string;
  pairId: string;
  card: MatchCard;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* what each face actually shows — for the aria-label and
   for anyone listening, every keepsake deserves its true name */
function faceLabel(card: MatchCard, faces: Record<string, string>): string {
  if (card.text) return card.text;
  return faces[card.kind] ?? faces.object;
}

function MatchFace({ card }: { card: MatchCard }) {
  const { lang } = useLang();
  if (card.kind === "photo") {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-[4px] bg-cream p-1.5">
        <img
          src={card.image}
          alt=""
          loading="lazy"
          className="h-full w-full rounded-[2px] object-cover"
        />
      </div>
    );
  }
  if (card.kind === "hand") {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-[4px] bg-cream px-2">
        <p className="text-center font-hand text-[1.15rem] leading-tight text-[#651C2D]">
          {card.text}
        </p>
      </div>
    );
  }
  if (card.kind === "bubble") {
    /* in the English universe the Arabic chat bubble steps
       forward in its own voice; in Arabic mode the whole
       page already lives in that voice */
    const ar = lang === "en" && isArabic(card.text ?? "");
    return (
      <div className="flex h-full w-full items-center justify-center rounded-[4px] bg-gradient-to-b from-[#241019] to-[#160a10] px-3">
        <p
          dir={ar ? "rtl" : undefined}
          lang={ar ? "ar" : undefined}
          className={cn(
            "w-full rounded-2xl rounded-bl-md rtl:rounded-br-md rtl:rounded-bl-none bg-cream/90 px-3 py-2 text-center text-ink",
            ar ? "font-arabic text-[13px] leading-[1.9]" : "font-body text-[12.5px]"
          )}
        >
          {card.text}
        </p>
      </div>
    );
  }
  if (card.kind === "italic") {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-[4px] bg-cream px-2.5">
        <p className="text-center font-display text-[13px] italic leading-snug text-ink">
          {card.text}
        </p>
      </div>
    );
  }
  /* object */
  return (
    <div className="flex h-full w-full items-center justify-center rounded-[4px] bg-cream">
      {card.object === "chocolate" ? <MiniChocolate /> : <MiniRose />}
    </div>
  );
}

function MatchActivity() {
  const { playLittle } = useContent();
  const m = playLittle.match;
  const reduce = useReducedMotion();
  const [deck, setDeck] = useState<MatchInstance[]>(() =>
    shuffle(
      m.pairs.flatMap((p: MatchPair) => [
        { iid: `${p.id}-a`, pairId: p.id, card: p.a },
        { iid: `${p.id}-b`, pairId: p.id, card: p.b },
      ])
    )
  );
  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<string[]>([]);
  const [note, setNote] = useState<string | null>(null);

  const complete = matched.length === m.pairs.length;

  /* remember that she's kept all of us before */
  useEffect(() => {
    if (complete) lsSet("matchCompleted", true);
  }, [complete]);

  const onCard = (inst: MatchInstance) => {
    if (
      complete ||
      flipped.includes(inst.iid) ||
      matched.includes(inst.pairId) ||
      flipped.length >= 2
    )
      return;
    const next = [...flipped, inst.iid];
    setFlipped(next);
    if (next.length === 2) {
      const first = deck.find((d) => d.iid === next[0])!;
      if (first.pairId === inst.pairId) {
        window.setTimeout(() => {
          setMatched((mm) => [...mm, inst.pairId]);
          setNote(m.pairs.find((p) => p.id === inst.pairId)?.note ?? null);
          setFlipped([]);
        }, 560);
      } else {
        window.setTimeout(() => setFlipped([]), 900);
      }
    }
  };

  const playAgain = () => {
    setDeck(
      shuffle(
        m.pairs.flatMap((p: MatchPair) => [
          { iid: `${p.id}-a`, pairId: p.id, card: p.a },
          { iid: `${p.id}-b`, pairId: p.id, card: p.b },
        ])
      )
    );
    setFlipped([]);
    setMatched([]);
    setNote(null);
  };

  return (
    <div>
      {/* the six cards */}
      <div className="mx-auto grid max-w-[430px] grid-cols-3 gap-2.5 sm:gap-3.5">
        {deck.map((inst) => {
          const faceUp = flipped.includes(inst.iid) || matched.includes(inst.pairId);
          const isMatched = matched.includes(inst.pairId);
          return (
            <button
              key={inst.iid}
              onClick={() => onCard(inst)}
              aria-label={
                faceUp
                  ? m.ariaUp.replace("{label}", faceLabel(inst.card, m.faces))
                  : m.ariaDown
              }
              aria-disabled={isMatched}
              className={cn(
                "group relative aspect-[3/4] w-full cursor-pointer touch-manipulation rounded-[6px] [perspective:800px] transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60",
                isMatched && "cursor-default animate-match-pop",
                isMatched && "[animation-delay:0.1s]"
              )}
            >
              <div
                className={cn(
                  "relative h-full w-full [transform-style:preserve-3d] transition-transform duration-500",
                  !reduce && "[transition-timing-function:cubic-bezier(0.34,1.3,0.5,1)]"
                )}
                style={{ transform: faceUp ? "rotateY(180deg)" : "rotateY(0deg)" }}
              >
                {/* the back — a small polaroid-backed burgundy card */}
                <div className="absolute inset-0 flex [backface-visibility:hidden] items-center justify-center rounded-[6px] border border-burgundy/50 bg-gradient-to-b from-[#2d0b15] to-[#1c0e15] p-[7px] polaroid-shadow transition-colors group-hover:border-rose/60 group-active:border-rose/70">
                  <div className="flex h-full w-full items-center justify-center rounded-[3px] bg-[#170a10]">
                    <Heart
                      className={cn(
                        "h-4 w-4 transition-colors duration-300",
                        isMatched ? "text-rose/80" : "text-rose-soft/55 group-hover:text-rose-soft/85"
                      )}
                      fill="currentColor"
                      strokeWidth={0}
                      aria-hidden
                    />
                  </div>
                </div>
                {/* the face */}
                <div
                  className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]"
                  style={{ transform: "rotateY(180deg)" }}
                >
                  <div
                    className={cn(
                      "h-full w-full rounded-[6px] polaroid-shadow transition-[box-shadow,opacity] duration-500",
                      isMatched && "opacity-80"
                    )}
                  >
                    <MatchFace card={inst.card} />
                  </div>
                  {isMatched && (
                    <motion.span
                      aria-hidden
                      initial={reduce ? false : { scale: 0, rotate: -40 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 16, delay: reduce ? 0 : 0.16 }}
                      className="absolute -right-1.5 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-burgundy shadow"
                    >
                      <Heart className="h-2.5 w-2.5 text-cream" fill="currentColor" strokeWidth={0} />
                    </motion.span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* the note of the latest match */}
      <div className="mx-auto mt-6 min-h-[2.2em] max-w-md text-center">
        <AnimatePresence mode="wait">
          {note && !complete && (
            <motion.p
              key={note}
              initial={{ opacity: 0, y: reduce ? 0 : 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.4 }}
              className="font-hand text-xl text-rose/85"
            >
              {m.matchedLabel} {note}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* completion */}
      <AnimatePresence>
        {complete && (
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduce ? 0 : 0.5 }}
            className="text-center"
          >
            <p className="font-hand text-2xl text-rose">{m.completeLine}</p>
            <button
              onClick={playAgain}
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-[10px] border border-rose/25 px-5 py-2.5 text-[11px] uppercase tracking-[0.2em] text-rose/70 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose/50 hover:text-rose"
            >
              {m.playAgainLabel}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ————————————————— the note jar ————————————————— */

const JAR_NOTES = [
  { rotate: -7, x: -52, lift: 26 },
  { rotate: -3, x: -26, lift: 34 },
  { rotate: 2, x: 0, lift: 30 },
  { rotate: 6, x: 26, lift: 34 },
  { rotate: 10, x: 52, lift: 26 },
];

function JarActivity() {
  const { playLittle } = useContent();
  const j = playLittle.jar;
  const reduce = useReducedMotion();
  const [current, setCurrent] = useState<number | null>(null);
  const [last, setLast] = useState<number | null>(null);
  /* the note being pulled out of the jar — its index, for
     the half-second it takes to fly up out of the glass */
  const [pullIdx, setPullIdx] = useState<number | null>(null);

  const pick = useCallback(() => {
    if (j.notes.length <= 1) {
      setCurrent(0);
      return;
    }
    let i = Math.floor(Math.random() * j.notes.length);
    while (i === last) i = Math.floor(Math.random() * j.notes.length);
    /* one of the folded notes lifts out of the jar and
       away — the paper she is about to read */
    if (!reduce) {
      setPullIdx(Math.floor(Math.random() * JAR_NOTES.length));
      window.setTimeout(() => setPullIdx(null), 640);
    }
    setCurrent(i);
    setLast(i);
    lsSet("jarPicked", true);
  }, [j.notes.length, last, reduce]);

  return (
    <div className="text-center">
      {/* the jar */}
      <div className="relative mx-auto h-36 w-56">
        {/* folded notes peeking out — each positioned by its
            wrapper, which also carries the pull animation;
            the note button itself keeps its own hover rest */}
        {JAR_NOTES.map((n, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-6 -translate-x-1/2"
            initial={false}
            animate={
              pullIdx === i
                ? { x: 0, y: -96, rotate: n.rotate * 2.4, opacity: 0, scale: 1.14 }
                : { x: n.x, y: -n.lift, rotate: n.rotate, opacity: 1, scale: 1 }
            }
            transition={{ duration: reduce ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={pick}
              aria-label={j.ariaTemplate.replace("{n}", String(i + 1))}
              className="group block h-16 w-11 cursor-pointer touch-manipulation rounded-[2px] bg-gradient-to-b from-[#fdfaf8] to-[#efe4dd] polaroid-shadow transition-transform duration-300 hover:-translate-y-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60"
            >
              <span
                aria-hidden
                className="absolute inset-x-1.5 top-1.5 h-[2px] rounded bg-[#d9c3c9]"
              />
              <span
                aria-hidden
                className="absolute inset-x-1.5 top-3.5 h-[2px] rounded bg-[#e7dbd4]"
              />
            </button>
          </motion.div>
        ))}

        {/* the lid */}
        <div
          aria-hidden
          className="absolute left-1/2 top-[64px] z-[2] h-[18px] w-[190px] -translate-x-1/2 rounded-[5px] border border-burgundy/70 bg-gradient-to-b from-[#4a1622] to-[#33101c] shadow-[0_6px_14px_-6px_rgba(0,0,0,0.8)]"
        >
          <span className="absolute inset-x-6 top-[7px] h-[3px] rounded-full bg-black/30" />
        </div>

        {/* the jar body */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-[74px] bottom-0 rounded-b-2xl rounded-t-[6px] border border-burgundy/50 bg-gradient-to-b from-[#33101c]/70 to-[#1c0e15]/90"
        >
          <span className="absolute inset-x-3 top-2 h-[3px] rounded-full bg-[#4a1622]" />
          <span className="absolute inset-x-3 bottom-2.5 h-[3px] rounded-full bg-black/30" />
        </div>
      </div>

      <button
        onClick={pick}
        className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-rose/30 px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] text-rose transition-all duration-300 hover:-translate-y-0.5 hover:border-rose/60 hover:bg-wine/60"
      >
        <Sparkles className="h-4 w-4" strokeWidth={1.6} aria-hidden />
        {current === null ? j.pickLabel : j.againLabel}
      </button>

      {/* the unfolded note */}
      <div className="mx-auto mt-8 min-h-[60px] max-w-md">
        <AnimatePresence mode="wait">
          {current !== null && (
            <motion.div
              key={current}
              initial={{ opacity: 0, rotateX: reduce ? 0 : -32, y: reduce ? 0 : -8 }}
              animate={{ opacity: 1, rotateX: 0, y: 0 }}
              exit={{ opacity: 0, rotateX: reduce ? 0 : 18, y: reduce ? 0 : 6 }}
              transition={{ duration: reduce ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformOrigin: "top center", transformPerspective: 900 }}
              className="relative rotate-[-0.7deg] rounded-lg bg-cream px-7 py-6 polaroid-shadow"
            >
              <TapeStrip className="-top-2.5 left-1/2 w-12 -translate-x-1/2" />
              <p className="font-hand text-[1.45rem] leading-snug text-ink">
                {j.notes[current]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ————— activity D — a reason, when you need one ————— */
function ReasonActivity() {
  const reduce = useReducedMotion();
  const { playLittle } = useContent();
  const r = playLittle.reasons;
  const [current, setCurrent] = useState<number | null>(null);
  const [seen, setSeen] = useState<number[]>([]);
  const [deckDone, setDeckDone] = useState(false);
  /* the card in flight — bumped on every draw, so the top
     card visibly leaves the deck and lands as the reason */
  const [flyKey, setFlyKey] = useState(0);

  const draw = useCallback(() => {
    if (deckDone) return;
    const unseen = r.reasons.map((_, i) => i).filter((i) => !seen.includes(i));
    const pick = unseen[Math.floor(Math.random() * unseen.length)];
    setCurrent(pick);
    if (!reduce) setFlyKey((k) => k + 1);
    const nextSeen = [...seen, pick];
    setSeen(nextSeen);
    lsSet("reasonDrawn", true);
    if (nextSeen.length === r.reasons.length) {
      window.setTimeout(() => setDeckDone(true), 1400);
    }
  }, [deckDone, r.reasons, seen, reduce]);

  const reshuffle = () => {
    setSeen([]);
    setCurrent(null);
    setDeckDone(false);
  };

  const remaining = r.reasons.length - seen.length;

  return (
    <div className="text-center">
      {/* the deck — a small stack of cream cards, one fewer each draw */}
      <div
        aria-hidden
        className="relative mx-auto h-[132px] w-[210px]"
      >
        {/* cards left in the deck, fanned slightly */}
        {Array.from({ length: Math.min(remaining, 4) }).map((_, i, arr) => (
          <div
            key={i}
            className="absolute inset-x-0 top-0 h-[118px] rounded-lg border border-rose/25 bg-gradient-to-b from-[#f6efe9] to-[#eadbd4] polaroid-shadow transition-transform duration-500"
            style={{
              transform: `translateY(${i * 7}px) rotate(${(i - (arr.length - 1) / 2) * 1.6}deg)`,
              opacity: 1 - i * 0.12,
              zIndex: 4 - i,
            }}
          >
            <span className="absolute inset-x-6 top-4 h-[2px] rounded bg-[#d9c3c9]/70" />
            <span className="absolute inset-x-6 top-7 h-[2px] rounded bg-[#e7dbd4]/80" />
            <span className="absolute inset-x-10 top-10 h-[2px] rounded bg-[#e7dbd4]/60" />
          </div>
        ))}
        {/* the card leaving the deck — a ghost of the top
            card flying down to where the reason appears,
            connecting the stack to the words */}
        {!reduce && flyKey > 0 && (
          <motion.div
            key={`fly-${flyKey}`}
            aria-hidden
            initial={{ opacity: 0.95, y: 0, x: 0, rotate: 0, scale: 1 }}
            animate={{ opacity: 0, y: 232, x: 34, rotate: 9, scale: 1.07 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[118px] rounded-lg border border-rose/25 bg-gradient-to-b from-[#f6efe9] to-[#eadbd4] polaroid-shadow"
          >
            <span className="absolute inset-x-6 top-4 h-[2px] rounded bg-[#d9c3c9]/70" />
            <span className="absolute inset-x-6 top-7 h-[2px] rounded bg-[#e7dbd4]/80" />
            <span className="absolute inset-x-10 top-10 h-[2px] rounded bg-[#e7dbd4]/60" />
          </motion.div>
        )}
        {/* the wax heart on top card */}
        {remaining > 0 && (
          <Heart
            className="absolute left-1/2 top-[46px] z-[5] h-6 w-6 -translate-x-1/2 text-burgundy/70"
            fill="currentColor"
            strokeWidth={0}
          />
        )}
        {remaining === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="font-hand text-xl text-rose-soft/80">{r.emptyLine}</p>
          </div>
        )}
      </div>

      <p className="mt-3 text-[9px] uppercase tracking-[0.24em] text-rose-soft/70">
        {r.remainingTemplate
          .replace("{n}", String(remaining))
          .replace("{total}", String(r.reasons.length))}
      </p>

      {/* the drawn card */}
      <div className="mx-auto mt-7 min-h-[120px] max-w-md">
        <AnimatePresence mode="wait">
          {current !== null && (
            <motion.div
              key={`${current}-${deckDone}`}
              initial={{ opacity: 0, y: reduce ? 0 : 26, rotate: reduce ? 0 : 3, scale: reduce ? 1 : 0.94 }}
              animate={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, y: reduce ? 0 : -22, rotate: reduce ? 0 : -3 }}
              transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="relative mx-auto rotate-[-0.8deg] rounded-lg bg-cream px-7 py-6 polaroid-shadow"
            >
              <TapeStrip className="-top-2.5 left-1/2 w-12 -translate-x-1/2" />
              <p className="text-[9px] uppercase tracking-[0.28em] text-[#8a4a5c]">
                {r.overline}
              </p>
              <p className="mt-2.5 font-hand text-[1.4rem] leading-snug text-ink">
                {r.reasons[current]}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {deckDone ? (
        <div className="mt-6">
          <p className="font-hand text-xl text-rose/85">{r.seenAllLine}</p>
          <button
            onClick={reshuffle}
            className="mt-4 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-rose/30 px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] text-rose transition-all duration-300 hover:-translate-y-0.5 hover:border-rose/60 hover:bg-wine/60"
          >
            <Shuffle className="h-4 w-4" strokeWidth={1.6} aria-hidden />
            {r.reshuffleLabel}
          </button>
        </div>
      ) : (
        <button
          onClick={draw}
          className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-rose/30 px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] text-rose transition-all duration-300 hover:-translate-y-0.5 hover:border-rose/60 hover:bg-wine/60"
        >
          <Sparkles className="h-4 w-4" strokeWidth={1.6} aria-hidden />
          {current === null ? r.drawLabel : r.againLabel}
        </button>
      )}
    </div>
  );
}

/* ————————————————— the coupons ————————————————— */

/* the burgundy foil — its own component so it paints itself
   fresh every time a new coupon slides in */
function ScratchFoil({
  revealed,
  onReveal,
  ariaLabel,
}: {
  revealed: boolean;
  onReveal: () => void;
  ariaLabel: string;
}) {
  const { coupons } = useContent();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scratchingRef = useRef(false);
  const lastPtRef = useRef<{ x: number; y: number } | null>(null);
  const moveCountRef = useRef(0);
  const doneRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    moveCountRef.current = 0;

    const paint = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 2) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const w = rect.width;
      const h = rect.height;
      /* deep burgundy foil */
      const g = ctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#3a1020");
      g.addColorStop(0.42, "#651C2D");
      g.addColorStop(0.68, "#4a1622");
      g.addColorStop(1, "#2D0B15");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);
      /* a faint diagonal sheen */
      ctx.strokeStyle = "rgba(248,244,241,0.05)";
      ctx.lineWidth = 6;
      for (let x = -h; x < w + h; x += 24) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + h, h);
        ctx.stroke();
      }
      /* the little hint */
      const hintAr = isArabic(coupons.scratchHint);
      let font = "Georgia, serif";
      try {
        if (hintAr) {
          /* the Arabic voice — canvas can't follow the page's
             dir=rtl font swap, so Amiri is named directly */
          const v = getComputedStyle(document.body)
            .getPropertyValue("--font-amiri")
            .trim()
            .replace(/['"]/g, "");
          if (v) font = v;
        } else {
          const v = getComputedStyle(document.documentElement)
            .getPropertyValue("--font-body")
            .trim();
          if (v) font = v;
        }
      } catch {
        /* fallback stays */
      }
      ctx.fillStyle = "rgba(248,244,241,0.55)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.direction = hintAr ? "rtl" : "ltr";
      ctx.font = `italic 500 ${Math.max(12, Math.round(w * 0.042))}px ${font}`;
      ctx.fillText(`♥ ${coupons.scratchHint} ♥`, w / 2, h / 2);
    };

    paint();
    /* if the first paint raced the layout, the observer repaints */
    const ro = new ResizeObserver(() => {
      if (!doneRef.current) paint();
    });
    ro.observe(canvas);

    const at = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    };

    const eraseTo = (pt: { x: number; y: number }) => {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineWidth = 46;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      const last = lastPtRef.current ?? pt;
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
      lastPtRef.current = pt;
    };

    const sample = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (w === 0 || h === 0) return;
      try {
        const data = ctx.getImageData(0, 0, w, h).data;
        let clear = 0;
        let total = 0;
        const step = 8 * Math.max(1, Math.round(w / 320));
        for (let yy = 0; yy < h; yy += step) {
          for (let xx = 0; xx < w; xx += step) {
            total++;
            if (data[(yy * w + xx) * 4 + 3] < 50) clear++;
          }
        }
        if (total > 0 && clear / total > 0.42) {
          doneRef.current = true;
          onReveal();
        }
      } catch {
        /* sampling hiccup — she can always peek */
      }
    };

    const onDown = (e: PointerEvent) => {
      if (doneRef.current) return;
      scratchingRef.current = true;
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* capture is best-effort */
      }
      lastPtRef.current = null;
      eraseTo(at(e));
    };
    const onMove = (e: PointerEvent) => {
      if (!scratchingRef.current || doneRef.current) return;
      eraseTo(at(e));
      moveCountRef.current++;
      if (moveCountRef.current % 5 === 0) sample();
    };
    const onUp = () => {
      scratchingRef.current = false;
      lastPtRef.current = null;
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    return () => {
      ro.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
    };
    /* repaint when the hint changes language, so the foil
       speaks whichever tongue she's reading tonight */
  }, [coupons.scratchHint]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={ariaLabel}
      className={cn(
        "absolute inset-0 h-full w-full touch-none transition-opacity duration-700",
        revealed && "pointer-events-none opacity-0"
      )}
    />
  );
}

function CouponActivity() {
  const { coupons: c } = useContent();
  const reduce = useReducedMotion();
  const [usedIds, setUsedIds] = useState<string[]>(() =>
    lsGet<string[]>("couponsUsed", [])
  );
  const [order, setOrder] = useState<string[]>(() =>
    shuffle(c.list.map((x) => x.id))
  );
  const [pos, setPos] = useState(0);
  const [stamped, setStamped] = useState<string | null>(null);

  /* the next not-yet-used coupon in the shuffled booklet,
     cycling around forever */
  const currentId = useMemo(() => {
    for (let i = pos; i < order.length; i++) {
      if (!usedIds.includes(order[i])) return order[i];
    }
    for (let i = 0; i < pos; i++) {
      if (!usedIds.includes(order[i])) return order[i];
    }
    return null;
  }, [order, pos, usedIds]);

  const current = c.list.find((x) => x.id === currentId) ?? null;
  const currentNo =
    current ? c.list.findIndex((x) => x.id === current.id) + 1 : 0;
  const remainingCount = c.list.filter((x) => !usedIds.includes(x.id)).length;

  /* reveal state is scoped to the current ticket, so a new
     coupon always starts fresh without an effect reset */
  const currentKey = `${currentId}-${pos}`;
  const [revealedFor, setRevealedFor] = useState<string | null>(null);
  const revealed = revealedFor === currentKey;

  const revealNow = () => {
    setRevealedFor(currentKey);
    lsSet("couponScratched", true);
  };

  const advance = () => {
    if (stamped) return;
    setPos((p) => (p + 1) % order.length);
  };

  const useThisOne = () => {
    if (!current || stamped) return;
    const next = [...usedIds, current.id];
    lsSet("couponsUsed", next); // persisted right away
    setStamped(current.id);
    /* the state (and the ticket) waits out the stamp,
       so she gets the full little ceremony */
    window.setTimeout(() => {
      setUsedIds(next);
      setStamped(null);
      setPos((p) => (p + 1) % order.length);
    }, 1600);
  };

  const resetBooklet = () => {
    setUsedIds([]);
    lsSet("couponsUsed", []);
    setOrder(shuffle(c.list.map((x) => x.id)));
    setPos(0);
  };

  /* the empty booklet */
  if (!current) {
    return (
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduce ? 0 : 0.5 }}
        >
          <p className="font-hand text-2xl text-rose">{c.allUsedLine}</p>
          <button
            onClick={resetBooklet}
            className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-rose/30 px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] text-rose transition-all duration-300 hover:-translate-y-0.5 hover:border-rose/60 hover:bg-wine/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60"
          >
            <Shuffle className="h-4 w-4" strokeWidth={1.6} aria-hidden />
            {c.resetLabel}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={`${current.id}-${pos}`}
          initial={{ opacity: 0, y: reduce ? 0 : 20, rotate: reduce ? 0 : 2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : -16 }}
          transition={{ duration: reduce ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="group relative mx-auto max-w-sm"
        >
          {/* the ticket — cream paper with punched notches.
              The whole ticket lifts a breath under her cursor,
              its shadow deepening beneath it */}
          <div
            className={cn(
              "relative px-6 pb-6 pt-5 polaroid-shadow transition-transform duration-300 group-hover:-translate-y-1",
              revealed && "animate-discover-glow"
            )}
            style={{
              background:
                "radial-gradient(circle 8px at 0 50%, transparent 7.5px, #f8f4f1 8px) left / 50.5% 100% no-repeat, radial-gradient(circle 8px at 100% 50%, transparent 7.5px, #f8f4f1 8px) right / 50.5% 100% no-repeat",
            }}
          >
            {/* corner reinforcements — like a real ticket kept in a wallet */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-2 top-2 h-2.5 w-2.5 rounded-full border border-burgundy/30"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute right-2 top-2 h-2.5 w-2.5 rounded-full border border-burgundy/30"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-2 left-2 h-2.5 w-2.5 rounded-full border border-burgundy/30"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute bottom-2 right-2 h-2.5 w-2.5 rounded-full border border-burgundy/30"
            />

            <div className="flex items-baseline justify-between px-1">
              <p className="text-[9px] uppercase tracking-[0.28em] text-[#8a4a5c]">
                {c.ticketOverline}
              </p>
              <p className="font-hand text-lg leading-none text-burgundy/60">
                no. {currentNo}
              </p>
            </div>

            {/* the scratch panel */}
            <div className="relative mt-4 min-h-[136px] overflow-hidden rounded-md ring-1 ring-burgundy/20">
              <div className="absolute inset-0 flex flex-col items-center justify-center px-5 py-5 text-center">
                <p className="font-display text-xl leading-snug text-ink">
                  {current.title}
                </p>
                <div aria-hidden className="mt-2 h-px w-12 bg-burgundy/20" />
                <p className="mt-2.5 font-body text-[13.5px] leading-relaxed text-ink-soft/90">
                  {current.body}
                </p>
              </div>
              <ScratchFoil
                revealed={revealed}
                onReveal={revealNow}
                ariaLabel={c.ariaScratch
                  .replace("{n}", String(currentNo))
                  .replace("{total}", String(c.list.length))}
              />
            </div>

            <p className="mt-3.5 text-center text-[8.5px] uppercase tracking-[0.3em] text-[#8a4a5c]/70">
              {c.validityLine}
            </p>

            {/* the stamp, when a coupon is redeemed */}
            <AnimatePresence>
              {stamped === current.id && (
                <motion.div
                  key="stamp"
                  initial={{ opacity: 0, scale: reduce ? 1 : 1.7, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: -12 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.35 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <span className="rounded-md border-[3px] border-burgundy/70 bg-cream/50 px-5 py-2 text-[12px] font-bold uppercase tracking-[0.3em] text-burgundy/80 backdrop-blur-[1px]">
                    {c.usedLabel}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* the actions */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {!revealed && (
          <button
            onClick={revealNow}
            className="min-h-[44px] px-2 text-[11px] uppercase tracking-[0.2em] text-rose-soft/80 underline-offset-4 transition-colors duration-300 hover:text-rose-soft hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-rose/60"
          >
            {c.peekLabel}
          </button>
        )}
        <button
          onClick={advance}
          disabled={!!stamped}
          className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-rose/25 px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] text-rose/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose/50 hover:text-rose disabled:pointer-events-none disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60"
        >
          {c.anotherLabel}
        </button>
        {revealed && (
          <button
            onClick={useThisOne}
            disabled={!!stamped}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-burgundy/60 bg-burgundy/25 px-6 py-2.5 text-[11px] uppercase tracking-[0.2em] text-cream/90 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose/70 hover:bg-burgundy/50 disabled:pointer-events-none disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60"
          >
            <Heart
              className="h-3.5 w-3.5 text-rose"
              fill="currentColor"
              strokeWidth={0}
              aria-hidden
            />
            {c.useLabel}
          </button>
        )}
      </div>

      <p className="mt-4 text-[9px] uppercase tracking-[0.24em] text-rose-soft/70">
        {stamped
          ? c.usedLine
          : c.remainingTemplate
              .replace("{n}", String(remainingCount))
              .replace("{total}", String(c.list.length))}
      </p>
    </div>
  );
}

/* ————————————————— the drawer itself ————————————————— */

/* the icons for her five little activities — their names
   and subtitles live in the content, per language */
const ACTIVITY_ICONS: Record<string, typeof HelpCircle> = {
  quiz: HelpCircle,
  match: Layers,
  jar: Gift,
  reasons: Heart,
  coupon: Ticket,
};

export default function PlayLittle() {
  const reduce = useReducedMotion();
  const { playLittle, coupons } = useContent();
  /* her five little activities, in the voice of whichever
     language the universe is speaking tonight (the deck of
     reasons is "reasons" in content, "reason" in the drawer) */
  const activities: {
    id: Activity;
    icon: typeof HelpCircle;
    label: string;
    sub: string;
  }[] = playLittle.activities.map((a) => ({
    id: (a.key === "reasons" ? "reason" : a.key) as Activity,
    icon: ACTIVITY_ICONS[a.key] ?? HelpCircle,
    label: a.label,
    sub: a.sub,
  }));
  const [open, setOpen] = useState(false);
  const [activity, setActivity] = useState<Activity | null>(null);
  /* which little activities she has already visited to the end —
     the menu is only ever reached through clicks (never SSR),
     so reading storage lazily here is hydration-safe */
  const readDone = (): Record<Activity, boolean> => ({
    quiz: lsGet<boolean>("quizLetterEarned", false),
    match: lsGet<boolean>("matchCompleted", false),
    jar: lsGet<boolean>("jarPicked", false),
    reason: lsGet<boolean>("reasonDrawn", false),
    coupon: lsGet<boolean>("couponScratched", false),
  });
  const [done, setDone] = useState<Record<Activity, boolean>>(readDone);

  /* returning to the menu is the quiet moment the badges refresh */
  const backToMenu = () => {
    setActivity(null);
    setDone(readDone());
  };

  return (
    <div className="mt-14">
      {/* the little drawer tab */}
      <div className="flex justify-center">
        <button
          onClick={() => {
            setOpen((o) => !o);
            if (open) setActivity(null);
          }}
          aria-expanded={open}
          aria-controls="play-a-little-drawer"
          className="group relative -mb-px inline-flex min-h-[46px] items-center gap-2.5 rounded-t-xl border border-burgundy/60 bg-gradient-to-b from-[#4a1622] to-[#33101c] px-7 py-2.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60"
        >
          <Sparkles
            className={cn(
              "h-4 w-4 text-rose/90 transition-transform duration-500",
              !reduce && "group-hover:rotate-12"
            )}
            strokeWidth={1.6}
            aria-hidden
          />
          <span className="font-hand text-xl text-rose">{playLittle.drawerLabel}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-rose/70 transition-transform duration-400",
              open && "rotate-180"
            )}
            strokeWidth={1.8}
            aria-hidden
          />
        </button>
      </div>

      {/* the drawer body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="play-a-little-drawer"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="relative rounded-2xl border border-t border-burgundy/50 bg-gradient-to-b from-[#1c0e15] to-[#150a10] px-4 pb-12 pt-9 sm:px-8">
              {/* two little doodles waking as the drawer opens —
                  the paper remembering it was drawn on */}
              {!reduce && (
                <>
                  <motion.span
                    aria-hidden
                    initial={{ opacity: 0, rotate: -16 }}
                    animate={{ opacity: 0.32, rotate: -10 }}
                    transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
                    className="pointer-events-none absolute left-[6%] top-[70px] block h-5 w-5"
                  >
                    <HeartOutlineGlyph color="#B77C8D" />
                  </motion.span>
                  <motion.span
                    aria-hidden
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 0.3, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                    className="pointer-events-none absolute bottom-[46px] right-[7%] block h-4 w-4"
                  >
                    <SparkleGlyph color="#F8F4F1" />
                  </motion.span>
                </>
              )}
              {activity === null ? (
                /* the three activities */
                <div>
                  <p className="text-center font-hand text-xl text-rose/70">
                    {playLittle.drawerHint}
                  </p>
                  <div className="mx-auto mt-7 flex max-w-lg flex-wrap justify-center gap-3.5">
                    {activities.map((a) => {
                      const Icon = a.icon;
                      return (
                        <button
                          key={a.id}
                          onClick={() => setActivity(a.id)}
                          className="group relative flex-[1_1_138px] max-w-[158px] rounded-xl border border-rose/20 bg-paper-card/80 px-3 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-rose/50 hover:bg-wine/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60"
                        >
                          <Icon
                            className="mx-auto h-5 w-5 text-rose/80 transition-transform duration-300 group-hover:scale-110"
                            strokeWidth={1.6}
                            aria-hidden
                          />
                          <p className="mt-3 font-hand text-xl text-rose">{a.label}</p>
                          <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-rose-soft/75">
                            {a.sub}
                          </p>
                          {done[a.id] && (
                            <span
                              aria-hidden
                              className="absolute -right-1.5 -top-1.5 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-burgundy shadow"
                            >
                              <Heart
                                className="h-2.5 w-2.5 text-cream"
                                fill="currentColor"
                                strokeWidth={0}
                              />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* one chosen activity */
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      onClick={backToMenu}
                      className="inline-flex min-h-[40px] items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-rose-soft/85 transition-colors hover:text-rose-soft"
                    >
                      <ArrowLeft className="h-3.5 w-3.5 rtl:-scale-x-100" strokeWidth={1.8} aria-hidden />
                      {playLittle.backLabel}
                    </button>
                    <p className="font-display text-xl italic text-cream/80">
                      {activity === "quiz"
                        ? playLittle.quiz.title
                        : activity === "match"
                          ? playLittle.match.title
                          : activity === "jar"
                            ? playLittle.jar.title
                            : activity === "coupon"
                              ? coupons.title
                              : playLittle.reasons.title}
                    </p>
                  </div>
                  <div
                    aria-hidden
                    className="mx-auto mt-4 h-px w-28 bg-gradient-to-r from-transparent via-burgundy to-transparent"
                  />

                  <div className="mt-8">
                    {activity === "quiz" && <QuizActivity />}
                    {activity === "match" && <MatchActivity />}
                    {activity === "jar" && <JarActivity />}
                    {activity === "reason" && <ReasonActivity />}
                    {activity === "coupon" && <CouponActivity />}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
