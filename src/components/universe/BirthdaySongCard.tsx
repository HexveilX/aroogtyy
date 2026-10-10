"use client";

/* ————————————————————————————————————————————————
   BirthdaySongCard — a little gift hidden inside
   the birthday room.

   Not a giant music player: a small cream card, tucked
   under a paper tab marked "for you", that she finds
   on her own. The reveal is a sequence, never a pop:
   the tab shows itself first, the card slides up a few
   pixels while it is still a little faded, the words
   arrive, and the play button settles into place —
   all inside ~700ms of quiet stagger.

   The song belongs to this room only. It starts on
   her press (never before), it is silenced and put
   away at 0:00 the moment she leaves the room, and it
   always yields to مكانك and the tape — and they to
   it. One voice at a time, as everywhere here.
———————————————————————————————————————————————— */

import { motion, useReducedMotion } from "framer-motion";
import { Pause, Play, Volume1, Volume2, VolumeX } from "lucide-react";
import { useRealAudioPlayer } from "@/lib/realAudio";
import { useMusic } from "@/lib/musicBox";
import { useContent, useLang } from "./Lang";
import { SeekTrack } from "./SongControls";
import { cn } from "@/lib/utils";

export default function BirthdaySongCard({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const { lang } = useLang();
  const { birthday } = useContent();
  const { isMuted, setMuted } = useMusic();
  const s = birthday.song;
  const artistAr = lang === "ar";

  /* the room-owned player — leaving the birthday room
     stops the song and puts it back at 0:00 */
  const player = useRealAudioPlayer("birthday", s.audioUrl, {
    stopOnLeave: true,
  });

  const stateLine = player.status === "error"
    ? s.stateError
    : player.status === "loading" || (player.duration === 0 && !player.ended)
      ? s.stateLoading
      : player.playing
        ? s.statePlaying
        : player.ended
          ? s.stateEnded
          : null;

  /* the little staggered arrival — the tab peeks, the
     card rises still half-faded, then everything finds
     its place. Times are small; nothing bounces */
  const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];
  const d = (ms: number) => (reduce ? 0 : ms);

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-40px" }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduce ? 0 : 0.09, delayChildren: reduce ? 0 : 0.12 } },
      }}
      className={cn("relative mx-auto mt-14 max-w-[340px]", className)}
      aria-label={s.ariaCard}
    >
      {/* the paper tab — the first thing she notices */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 7 },
          show: { opacity: 1, y: 0, transition: { duration: d(0.3), ease } },
        }}
        className="absolute -top-3 left-1/2 z-10 -translate-x-1/2"
      >
        <span className="block rotate-[-2deg] rounded-[3px] border border-burgundy/25 bg-wine px-3.5 pb-[3px] pt-[5px] shadow-[0_3px_8px_rgba(0,0,0,0.35)]">
          <span
            lang="ar"
            className={cn(
              "block text-[13px] leading-none text-rose-soft/90",
              artistAr ? "font-arabic" : "font-hand",
            )}
          >
            {s.tab}
          </span>
        </span>
      </motion.div>

      {/* the card itself — arrives slightly faded, slides
          up a few pixels, then settles */}
      <motion.article
        variants={{
          hidden: { opacity: 0, y: 12 },
          show: {
            opacity: [0, 0.55, 1],
            y: [12, 6, 0],
            transition: { duration: d(0.62), times: [0, 0.45, 1], ease },
          },
        }}
        className="group relative rotate-[-0.8deg] rounded-lg bg-cream px-5 pb-5 pt-7 polaroid-shadow transition-[box-shadow,transform] duration-300 hover:-translate-y-0.5 sm:px-6"
      >
        {/* washi tape, holding the card down */}
        <span
          aria-hidden
          className="tape-strip pointer-events-none absolute -top-2 end-6 h-5 w-14 rotate-[4deg] rounded-[1px]"
        />

        {/* the words — arriving one after another */}
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 8 },
            show: { opacity: 1, y: 0, transition: { duration: d(0.4), ease } },
          }}
          className="text-center text-[9px] uppercase tracking-[0.3em] text-[#8a4a5c]"
        >
          {s.overline}
        </motion.p>

        <motion.h3
          variants={{
            hidden: { opacity: 0, y: 8 },
            show: { opacity: 1, y: 0, transition: { duration: d(0.4), ease } },
          }}
          lang={artistAr ? "ar" : undefined}
          className={cn(
            "mt-2.5 text-center text-burgundy",
            artistAr
              ? "font-arabic text-[26px] leading-snug"
              : "font-display text-[24px] leading-snug",
          )}
        >
          {s.title}
        </motion.h3>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 8 },
            show: { opacity: 1, y: 0, transition: { duration: d(0.4), ease } },
          }}
          className={cn(
            "mt-0.5 text-center text-[#8a4a5c]",
            artistAr
              ? "font-arabic text-[13px] leading-relaxed"
              : "text-[10px] uppercase tracking-[0.28em]",
          )}
        >
          {s.artist}
        </motion.p>

        <motion.p
          variants={{
            hidden: { opacity: 0, y: 8 },
            show: { opacity: 1, y: 0, transition: { duration: d(0.4), ease } },
          }}
          className="mx-auto mt-3.5 max-w-[270px] text-center font-hand text-[15.5px] leading-relaxed text-ink-soft"
        >
          {s.note}
        </motion.p>

        {/* a small ink flourish between the note and the player */}
        <motion.svg
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 0.75, transition: { duration: d(0.45) } },
          }}
          viewBox="0 0 120 10"
          aria-hidden
          className="mx-auto mt-4 h-2 w-24 overflow-visible text-burgundy"
        >
          <path
            d="M2 6.5 C 20 2.5, 38 9, 58 5.5 S 94 2.5, 118 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </motion.svg>

        {/* the player — small, honest, hers to press */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { duration: d(0.35) } },
          }}
          className="mt-3.5"
        >
          <div className="flex items-center gap-3">
            {/* one hush for the whole place, same as the music room */}
            <button
              onClick={() => setMuted(!isMuted)}
              aria-label={isMuted ? s.ariaUnmute : s.ariaMute}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#8a4a5c]/25 text-[#8a4a5c]/80 transition-colors hover:border-[#8a4a5c]/50 hover:text-[#651c2d] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#651c2d]/40"
            >
              {isMuted ? (
                <VolumeX className="h-3.5 w-3.5" strokeWidth={1.7} />
              ) : (
                <Volume2 className="h-3.5 w-3.5" strokeWidth={1.7} />
              )}
            </button>

            <SeekTrack
              tone="paper"
              current={player.current}
              duration={player.duration}
              onSeek={player.seek}
              ariaLabel={s.ariaSeek}
            />

            {/* play / pause — the song begins only here */}
            <motion.button
              onClick={player.toggle}
              whileTap={reduce ? undefined : { scale: 0.9 }}
              aria-label={player.playing ? s.ariaPause : s.ariaPlay}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-burgundy text-cream shadow-[0_8px_18px_-6px_rgba(101,28,45,0.75)] transition-colors hover:bg-[#7d2c3f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#651c2d]/50"
            >
              {player.playing ? (
                <Pause className="h-4 w-4" fill="currentColor" strokeWidth={0} />
              ) : (
                <Play className="ml-0.5 h-4 w-4" fill="currentColor" strokeWidth={0} />
              )}
            </motion.button>
          </div>

          {/* how loudly this little gift sings */}
          <div className="mt-2.5 flex items-center justify-center gap-2">
            {isMuted ? (
              <VolumeX aria-hidden className="h-3 w-3 text-[#8a4a5c]/70" strokeWidth={1.7} />
            ) : (
              <Volume1 aria-hidden className="h-3 w-3 text-[#8a4a5c]/70" strokeWidth={1.7} />
            )}
            <div className="relative flex h-6 w-[72px] items-center">
              <div className="pointer-events-none relative h-[3px] w-full rounded-full bg-[#8a4a5c]/20">
                <div
                  className="absolute inset-y-0 start-0 rounded-full bg-[#8a4a5c]"
                  style={{ width: `${player.volume * 100}%` }}
                />
                <span
                  aria-hidden
                  className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-burgundy"
                  style={{
                    insetInlineStart: `calc(${player.volume * 100}% - 3px)`,
                  }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={player.volume}
                onChange={(e) => player.setVolume(parseFloat(e.target.value))}
                aria-label={s.ariaVolume}
                className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0 focus:outline-none"
              />
            </div>
          </div>

          {/* the small state line — what the gift is doing */}
          <p
            aria-live="polite"
            className="mt-1.5 min-h-[1.4em] text-center font-hand text-[14px] leading-relaxed text-[#8a4a5c]"
          >
            {stateLine}
          </p>
        </motion.div>
      </motion.article>
    </motion.section>
  );
}
