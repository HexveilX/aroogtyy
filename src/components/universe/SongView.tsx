"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FlipHorizontal2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import type { ViewId } from "@/content/arooqtyContent";
import { useContent } from "./Lang";
import {
  getMusicEngineElapsed,
  getMusicEngineLoop,
  getMusicEngineProgress,
  useMusic,
  type MusicSide,
} from "@/lib/musicBox";
import { useRealAudioPlayer } from "@/lib/realAudio";
import { isArabic } from "@/lib/isArabic";
import { formatTimeParts } from "@/lib/timeTogether";
import { Reveal, SectionHeading, TapeStrip } from "./Shared";
import ChapterNav from "./ChapterNav";
import Mixtape from "./Mixtape";
import { SeekTrack } from "./SongControls";
import { cn } from "@/lib/utils";

function CassettePlayer({
  isPlaying,
  side,
}: {
  isPlaying: boolean;
  side: MusicSide;
}) {
  const { song, ui } = useContent();
  const b = side === "b";
  const title = b ? song.sideB.title : song.title;
  const artist = b ? song.sideB.artist : song.artist;
  return (
    <svg
      viewBox="0 0 240 156"
      className="mx-auto w-full max-w-[300px] polaroid-shadow"
      role="img"
      aria-label={
        b
          ? ui.songUi.ariaSideB.replace("{title}", song.sideB.title)
          : ui.songUi.ariaMain
      }
    >
      <rect
        x="2"
        y="2"
        width="236"
        height="152"
        rx="10"
        fill="#2D0B15"
        stroke="#651C2D"
        strokeWidth="2"
      />
      {/* label */}
      <rect x="22" y="16" width="196" height="58" rx="5" fill="#F8F4F1" />
      <text
        x="120"
        y="44"
        textAnchor="middle"
        fontFamily="var(--font-caveat), cursive"
        fontSize="26"
        fill="#651C2D"
      >
        {title}
      </text>
      <text
        x="120"
        y="62"
        textAnchor="middle"
        fontFamily="var(--font-lora), Georgia, serif"
        fontSize="9"
        /* Arabic letters must stay joined — no tracking on its script */
        letterSpacing={/[\u0600-\u06FF]/.test(artist) ? 0 : 3}
        fill="#7a4a58"
      >
        {artist.toUpperCase()}
      </text>
      {/* tiny handwritten corners on the label */}
      <text
        x="31"
        y="29"
        fontFamily="var(--font-caveat), cursive"
        fontSize="10"
        fill="#B77C8D"
        opacity="0.9"
      >
        {b ? song.sideBLabel : song.sideALabel}
      </text>
      <text
        x="209"
        y="29"
        textAnchor="end"
        fontSize="9"
        fill="#B77C8D"
        opacity="0.75"
      >
        {b ? "☾" : "♥"}
      </text>
      {/* window */}
      <rect
        x="56"
        y="82"
        width="128"
        height="42"
        rx="8"
        fill="#0D0A0B"
        stroke="#651C2D"
        strokeWidth="1.5"
      />
      {/* tape between reels */}
      <rect x="86" y="100" width="68" height="5" rx="2" fill="#7a4a58" opacity="0.35" />
      {/* reels */}
      {[86, 154].map((cx) => (
        <g
          key={cx}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          className={cn("reel-spin", !isPlaying && "reel-paused")}
        >
          <circle cx={cx} cy="103" r="14" fill="#1a0f14" stroke="#B77C8D" strokeWidth="1.5" />
          <g stroke="#B77C8D" strokeWidth="2" strokeLinecap="round">
            <line x1={cx} y1="95" x2={cx} y2="111" />
            <line x1={cx - 7} y1="99" x2={cx + 7} y2="107" />
            <line x1={cx - 7} y1="107" x2={cx + 7} y2="99" />
          </g>
        </g>
      ))}
      {/* screws */}
      <circle cx="14" cy="14" r="2" fill="#651C2D" />
      <circle cx="226" cy="14" r="2" fill="#651C2D" />
      <circle cx="14" cy="142" r="2" fill="#651C2D" />
      <circle cx="226" cy="142" r="2" fill="#651C2D" />
      {/* bottom trapezoid */}
      <path d="M78 140 L162 140 L152 128 L88 128 Z" fill="#1a0f14" stroke="#651C2D" strokeWidth="1" />
    </svg>
  );
}

export default function SongView({
  onNavigate,
}: {
  onNavigate: (v: ViewId) => void;
}) {
  const reduce = useReducedMotion();
  const { isPlaying, isMuted, toggle, setMuted, side, setSide } = useMusic();
  const { song, ui } = useContent();
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [loop, setLoop] = useState(() => getMusicEngineLoop());

  /* both sides of the tape now hold real recordings of the
     two of them — side A was the first, side B the second
     one that was there all along. (If a side's URL is ever
     empty, that side falls back to the music box, exactly
     the way the old waltz used to behave.) */
  const recA = useRealAudioPlayer("oursong", song.audioUrl);
  const recB = useRealAudioPlayer("oursongb", song.sideB.audioUrl ?? "");
  const b = side === "b";
  const realA = Boolean(song.audioUrl);
  const realB = Boolean(song.sideB.audioUrl);
  const activeReal = b ? realB : realA;
  const active = b ? recB : recA;
  const activePlaying = activeReal ? active.playing : isPlaying;

  useEffect(() => {
    const id = setInterval(() => {
      setProgress(getMusicEngineProgress());
      setElapsed(getMusicEngineElapsed());
      setLoop(getMusicEngineLoop());
    }, 250);
    return () => clearInterval(id);
  }, []);

  const shownTitle = b ? song.sideB.title : song.title;
  const shownArtist = b ? song.sideB.artist : song.artist;
  const shownWhy = b ? song.sideB.why : song.why;

  /* the line under the player — a real word for every state
     of the tape: loading, singing, finished, resting */
  const shownNote = activeReal
    ? active.status === "error"
      ? ui.songUi.errorOurs
      : active.duration <= 0
        ? ui.songUi.loadingOurs
        : active.ended
          ? ui.songUi.endedOurs
          : active.playing
            ? ui.songUi.playingOurs
            : b
              ? song.sideB.realNote
              : song.realNote
    : b
      ? song.sideB.playerNote
      : song.playerNote;

  /* flipping the tape always puts the other side's voice
     down first — never two songs at once, and never the
     next side singing before she asks it to */
  const handleFlip = () => {
    if (!b && recA.playing) recA.pause();
    if (b && recB.playing) recB.pause();
    /* the fallback waltz steps aside too, on the rare side
       that hums it — the flip reveals, it never forces sound */
    if (isPlaying) toggle();
    setSide(b ? "a" : "b");
  };

  const artistAr = isArabic(shownArtist);

  return (
    <div>
      <SectionHeading
        overline={ui.sections.song.overline}
        title={ui.sections.song.title}
        sub={ui.sections.song.sub}
      />

      {/* the cassette — flips over when she turns the tape */}
      <Reveal className="mt-12" delay={0.05}>
        <motion.div
          key={side}
          initial={{ rotateX: reduce ? 0 : -72, opacity: reduce ? 1 : 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          transition={{ duration: reduce ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformPerspective: 900 }}
        >
          <CassettePlayer isPlaying={activePlaying} side={side} />
        </motion.div>
      </Reveal>

      <Reveal className="mt-9 text-center" delay={0.1}>
        <h3 className="font-display text-3xl text-cream">{shownTitle}</h3>
        <p
          className={cn(
            "mt-1.5 text-rose/80",
            artistAr
              ? "font-arabic text-base leading-relaxed"
              : "text-[11px] uppercase tracking-[0.3em]",
          )}
        >
          {shownArtist}
        </p>
        <p className="mx-auto mt-4 max-w-md font-body text-[15px] italic leading-relaxed text-cream/70">
          {shownWhy}
        </p>
      </Reveal>

      <Reveal className="mt-9" delay={0.15}>
        <div className="mx-auto flex max-w-sm items-center gap-4">
          {/* mute — one hush for the whole music room */}
          <button
            onClick={() => setMuted(!isMuted)}
            aria-label={isMuted ? ui.songUi.ariaUnmute : ui.songUi.ariaMute}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-rose/25 text-cream/70 transition-colors hover:border-rose/50 hover:text-cream focus:outline-none focus-visible:ring-1 focus-visible:ring-rose/60"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" strokeWidth={1.6} />
            ) : (
              <Volume2 className="h-4 w-4" strokeWidth={1.6} />
            )}
          </button>

          {/* progress — the side that's showing can be scrubbed;
              the fallback loop just drifts along */}
          {activeReal ? (
            <SeekTrack
              tone="dark"
              current={active.current}
              duration={active.duration}
              onSeek={active.seek}
              ariaLabel={ui.songUi.ariaSeek}
            />
          ) : (
            <div className="flex-1">
              <div
                role="progressbar"
                aria-label={ui.songUi.ariaProgress}
                aria-valuenow={Math.round(progress * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
                className="h-1 w-full overflow-hidden rounded-full bg-cream/15"
              >
                <div
                  className="h-full rounded-full bg-rose transition-[width] duration-200"
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <p className="mt-2 text-center text-[10px] tracking-wider text-cream/80 tabular-nums">
                {formatTimeParts(elapsed, loop)}
              </p>
            </div>
          )}

          {/* play / pause */}
          <motion.button
            onClick={activeReal ? active.toggle : toggle}
            whileTap={reduce ? undefined : { scale: 0.92 }}
            whileHover={reduce ? undefined : { scale: 1.05 }}
            aria-label={
              activePlaying ? ui.songUi.ariaPause : ui.songUi.ariaPlay
            }
            className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-burgundy text-cream shadow-[0_10px_24px_-8px_rgba(101,28,45,0.8)] transition-colors hover:bg-[#7d2c3f] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60"
          >
            {activePlaying ? (
              <Pause className="h-5 w-5" fill="currentColor" strokeWidth={0} />
            ) : (
              <Play className="ml-0.5 h-5 w-5" fill="currentColor" strokeWidth={0} />
            )}
          </motion.button>
        </div>

        {/* flip the tape — side A holds our first song, side B the second one that was hiding behind it */}
        <div className="mt-6 flex justify-center">
          <motion.button
            onClick={handleFlip}
            whileTap={reduce ? undefined : { scale: 0.96 }}
            whileHover={reduce ? undefined : { y: -2 }}
            aria-label={`${song.flipSrLabel} — ${
              b ? ui.songUi.sideNowB : ui.songUi.sideNowA
            }`}
            className="inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-rose/25 px-5 py-2 text-[11px] uppercase tracking-[0.2em] text-rose/75 transition-colors duration-300 hover:border-rose/50 hover:text-rose focus:outline-none focus-visible:ring-1 focus-visible:ring-rose/60"
          >
            <FlipHorizontal2
              className={cn("h-3.5 w-3.5", !reduce && "transition-transform duration-500")}
              strokeWidth={1.8}
              aria-hidden
            />
            {song.flipLabel}
            <span className="font-hand text-base normal-case tracking-normal text-rose-soft/85">
              {b ? ui.songUi.sideChipB : ui.songUi.sideChipA}
            </span>
          </motion.button>
        </div>

        <p
          aria-live={activeReal ? "polite" : undefined}
          className="mt-6 text-center font-hand text-lg text-rose-soft/85"
        >
          {shownNote}
        </p>
      </Reveal>

      {/* side B carries a folded note — the story of why a
          second song exists. It unfolds only when the tape is
          turned over */}
      <AnimatePresence initial={false}>
        {b && (
          <motion.div
            key="side-b-note"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: reduce ? 0 : 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="overflow-hidden"
          >
            <Reveal className="mx-auto mt-10 max-w-[440px]" delay={reduce ? 0 : 0.1}>
              <div className="relative rotate-[0.5deg] rounded-lg bg-cream px-7 py-7 polaroid-shadow sm:px-9">
                <TapeStrip className="-top-3 left-1/2 w-14 -translate-x-1/2 rotate-2" />
                {/* a faint fold line, like the note lived folded in a pocket */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-5 top-1/2 h-px bg-[#8a4a5c]/12"
                />
                <p className="text-center text-[10px] uppercase tracking-[0.28em] text-[#8a4a5c]">
                  {song.sideB.noteOverline}
                </p>
                <div className="mt-4 space-y-3.5">
                  {song.sideB.noteLines.map((line, i) => (
                    <p
                      key={i}
                      className="font-body text-[14.5px] leading-[1.85] text-ink-soft/95"
                    >
                      {line}
                    </p>
                  ))}
                </div>
                <p className="mt-5 text-end font-hand text-xl text-burgundy">
                  {ui.songUi.builder}
                </p>
              </div>
            </Reveal>
          </motion.div>
        )}
      </AnimatePresence>

      {/* side C — five small song dedications, each card
          flips to reveal the one-line reason. Pure content
          from the mixtape block. */}
      <Mixtape />

      <ChapterNav current="song" onNavigate={onNavigate} />
    </div>
  );
}
