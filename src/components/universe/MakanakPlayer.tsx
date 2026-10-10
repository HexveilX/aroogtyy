"use client";

/* ————————————————————————————————————————————————
   مكانك — the song of this little universe.

   Not a music app. A record left here for one person:
   black paper, burgundy ink, one slow patient turn at
   a time. It never starts without her pressing play,
   and it never plays over anything else.
———————————————————————————————————————————————— */

import { motion, useReducedMotion } from "framer-motion";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useContent } from "./Lang";
import { useMusic } from "@/lib/musicBox";
import { useRealAudioPlayer } from "@/lib/realAudio";
import { isArabic } from "@/lib/isArabic";
import { Reveal, TapeStrip } from "./Shared";
import { SeekTrack } from "./SongControls";
import { cn } from "@/lib/utils";

/* ————— the record itself ————— */

function RecordDisc({ playing }: { playing: boolean }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden
      className={cn(
        "block h-[148px] w-[148px] sm:h-[172px] sm:w-[172px]",
        "record-spin",
        !playing && "record-paused",
      )}
    >
      {/* the disc — warm black, like the cassette's reels */}
      <circle cx="100" cy="100" r="97" fill="#1a0f14" stroke="#651C2D" strokeWidth="2.5" />
      {/* grooves */}
      {[90, 83, 76, 69, 62, 55].map((r) => (
        <circle
          key={r}
          cx="100"
          cy="100"
          r={r}
          fill="none"
          stroke="#B77C8D"
          strokeWidth="0.8"
          opacity="0.13"
        />
      ))}
      {/* light catching the grooves — it travels with the turn */}
      <path
        d="M36 46 A 77 77 0 0 1 92 23"
        fill="none"
        stroke="#F8F4F1"
        strokeWidth="9"
        strokeLinecap="round"
        opacity="0.08"
      />
      <path
        d="M164 154 A 77 77 0 0 1 108 177"
        fill="none"
        stroke="#F8F4F1"
        strokeWidth="9"
        strokeLinecap="round"
        opacity="0.05"
      />
      {/* the pressed label */}
      <circle cx="100" cy="100" r="41" fill="none" stroke="#B77C8D" strokeWidth="0.6" opacity="0.35" />
      <circle cx="100" cy="100" r="37" fill="#651C2D" stroke="#B77C8D" strokeWidth="1" />
      <text
        x="100"
        y="93"
        textAnchor="middle"
        fontFamily="var(--font-aref), serif"
        fontSize="24"
        fill="#F8F4F1"
      >
        مكانك
      </text>
      <text
        x="100"
        y="114"
        textAnchor="middle"
        fontFamily="var(--font-lora), Georgia, serif"
        fontSize="7.5"
        letterSpacing="2.5"
        fill="#B77C8D"
      >
        AMR DIAB
      </text>
      {/* spindle */}
      <circle cx="100" cy="100" r="2.6" fill="#F8F4F1" opacity="0.9" />
      <circle cx="100" cy="100" r="1.1" fill="#0D0A0B" />
    </svg>
  );
}

/* ————— the card the record lives on ————— */

export default function MakanakPlayer() {
  const reduce = useReducedMotion();
  const { song, ui } = useContent();
  const s = song.siteSong;
  const t = ui.songUi;
  const player = useRealAudioPlayer("makanak", s.audioUrl);
  const { isMuted, setMuted } = useMusic();

  /* the handwritten state line — always a real word,
     never a raw number, never NaN */
  const stateLine =
    player.status === "error"
      ? t.errorSite
      : player.duration <= 0
        ? t.loadingSite
        : player.ended
          ? t.endedSite
          : player.playing
            ? t.playingSite
            : null;

  const subtitleAr = isArabic(s.subtitle);

  return (
    <Reveal className="mx-auto mt-12 w-[min(94vw,560px)]" delay={0.05}>
      <div
        className={cn(
          "group relative rotate-[0.4deg] rounded-xl bg-cream px-6 py-8 polaroid-shadow ring-1 sm:rotate-[0.25deg] sm:px-9 sm:py-9",
          player.playing ? "ring-rose/35" : "ring-rose/15",
        )}
      >
        <TapeStrip className="-top-3 start-10 w-14 rotate-[3deg]" />

        <div className="flex flex-col items-center gap-7 sm:flex-row sm:gap-9">
          {/* the record — a soft rose halo blooms behind it
              only while it sings */}
          <div
            className={cn(
              "shrink-0 rounded-full transition-shadow duration-700",
              reduce && "transition-none",
              player.playing &&
                "shadow-[0_0_38px_-6px_rgba(183,124,141,0.55)]",
            )}
          >
            <RecordDisc playing={player.playing} />
          </div>

          {/* the words + the controls */}
          <div className="min-w-0 flex-1 text-center sm:text-start">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#8a4a5c]">
              {s.overline}
            </p>
            <h3
              dir="rtl"
              className="mt-2 font-arabic text-[2.5rem] leading-[1.25] text-burgundy sm:text-[2.7rem]"
            >
              {s.title}
            </h3>
            <p
              className={cn(
                "mt-1 text-[#8a4a5c]",
                subtitleAr
                  ? "font-arabic text-[15px] leading-relaxed"
                  : "text-[11px] uppercase tracking-[0.28em]",
              )}
            >
              {s.subtitle}
            </p>
            <p className="mt-3.5 font-hand text-[17px] leading-relaxed text-ink-soft/90">
              {s.why}
            </p>

            {/* the player row — kin to the cassette's, in ink */}
            <div className="mt-6 flex items-center gap-3.5">
              <button
                onClick={() => setMuted(!isMuted)}
                aria-label={isMuted ? ui.songUi.ariaUnmute : ui.songUi.ariaMute}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#8a4a5c]/30 text-[#8a4a5c] transition-colors duration-300 hover:border-[#8a4a5c]/60 hover:text-burgundy focus:outline-none focus-visible:ring-1 focus-visible:ring-burgundy/50"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" strokeWidth={1.6} />
                ) : (
                  <Volume2 className="h-4 w-4" strokeWidth={1.6} />
                )}
              </button>

              <SeekTrack
                tone="paper"
                current={player.current}
                duration={player.duration}
                onSeek={player.seek}
                ariaLabel={t.ariaSeek}
              />

              <motion.button
                onClick={player.toggle}
                whileTap={reduce ? undefined : { scale: 0.92 }}
                whileHover={reduce ? undefined : { scale: 1.05 }}
                aria-label={
                  player.playing ? ui.songUi.ariaPauseSite : ui.songUi.ariaPlaySite
                }
                className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-burgundy text-cream shadow-[0_10px_24px_-8px_rgba(101,28,45,0.8)] transition-colors duration-300 hover:bg-[#7d2c3f] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60"
              >
                {player.playing ? (
                  <Pause className="h-5 w-5" fill="currentColor" strokeWidth={0} />
                ) : (
                  <Play className="ml-0.5 h-5 w-5" fill="currentColor" strokeWidth={0} />
                )}
              </motion.button>
            </div>

            {/* the state line — reserved height, so the paper
                never shifts under it */}
            <p
              aria-live="polite"
              className="mt-3 min-h-[1.6em] font-hand text-[15px] leading-snug text-burgundy/75"
            >
              {stateLine}
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
