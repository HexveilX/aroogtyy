"use client";

/* ————————————————————————————————————————————————
   مكانك — the soundtrack of this little universe.

   Not a bar floating over the page. A little music
   bookmark, tucked into the start edge of the scrapbook
   the way a ribbon is tucked between pages: a sliver of
   burgundy paper no bigger than a real bookmark — its
   reels, its name, and nothing else. That is its whole
   resting self, on a phone most of all, where every
   pixel of her page belongs to her, not to it.

   Tapping the tiny tab unfolds a small paper note above
   it — play, the song's progress, the hours, her volume
   — which folds back down the same way it opened. The
   ribbon beneath never fattens for the occasion.

   And when she reads — really reads, the page moving
   under her thumb — the bookmark does what a real
   bookmark does the moment a book is picked up: it
   slips entirely behind the page edge and is gone. Not
   shrunk, not dimmed, not folded into a corner — gone,
   every pixel of the page hers again. It stays gone the
   whole while she keeps turning, never re-running its
   leave. Only when she pauses for a breath does a
   sliver of burgundy peek back out from behind the
   edge, and the ribbon quietly settles home.

   None of its music is disturbed by any of it — the
   song walks with her from room to room and never
   starts over. It never sings over the personal tape:
   whoever starts second, steps aside.
———————————————————————————————————————————————— */

import { useEffect, useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { Pause, Play, Volume1, Volume2, VolumeX } from "lucide-react";
import { useContent, useLang } from "./Lang";
import { isRealAudioMuted, useRealAudioPlayer } from "@/lib/realAudio";
import { SeekTrack } from "./SongControls";
import { cn } from "@/lib/utils";

/* the resting bookmark's two sizes — a touch larger on a
   desk, where there is room to be; genuinely small on a
   phone, where it must sit beside her text, not on it */
const REST_W_WIDE = 124;
const REST_W_SMALL = 106;
const REST_H_WIDE = 40;
const REST_H_SMALL = 36;

/* how much honest scrolling before the bookmark excuses
   itself entirely behind the page edge, and how still she
   must be before it peeks back out */
const HIDE_AFTER_PX = 30;
const RETURN_STOP_MS = 700;

/* where the bookmark is in its life with the page:

   enter      — its first arrival, once the cover has
                settled: behind the edge → a peek → home
   away-rest  — leaving from its resting place, with a
                small tug toward the edge first, the way a
                ribbon is pulled before it is tucked
   away-any   — leaving from anywhere else (mid-arrival,
                mid-return): the shortest honest path
                behind the page edge, no ceremony
   return     — a beat of patience, a sliver of burgundy
                peeking out, then settling home */
type Phase = "enter" | "away-rest" | "away-any" | "return";

/* the tiny cassette mark — two reels that only turn while
   the song actually does, and freeze mid-turn when it
   doesn't. Kin to the big tape in the music room. */
function MiniReels({
  playing,
  className,
}: {
  playing: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 26 20"
      aria-hidden
      className={cn("h-[19px] w-[25px] shrink-0", className)}
    >
      <rect
        x="0.9"
        y="0.9"
        width="24.2"
        height="18.2"
        rx="3.6"
        fill="none"
        stroke="#B77C8D"
        strokeWidth="1.3"
        opacity="0.5"
      />
      {[8.2, 17.8].map((cx) => (
        <g
          key={cx}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          className={cn("reel-spin-slow", !playing && "reel-paused")}
        >
          <circle
            cx={cx}
            cy="10"
            r="3.2"
            fill="none"
            stroke="#B77C8D"
            strokeWidth="1.4"
          />
          <g stroke="#B77C8D" strokeWidth="1.2" strokeLinecap="round">
            <line x1={cx} y1="8.1" x2={cx} y2="11.9" />
            <line x1={cx - 2.3} y1="9" x2={cx + 2.3} y2="11" />
            <line x1={cx - 2.3} y1="11" x2={cx + 2.3} y2="9" />
          </g>
        </g>
      ))}
    </svg>
  );
}

/* a tiny handwritten eighth note — the margin doodle
   that says "a song lives here" without a single word */
function InkNote({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 12 16"
      aria-hidden
      className={cn("h-[13px] w-[10px] shrink-0", className)}
    >
      <g fill="currentColor">
        <ellipse cx="3.5" cy="12.7" rx="2.7" ry="2.1" transform="rotate(-14 3.5 12.7)" />
        <rect x="5.2" y="2.6" width="1.15" height="10.2" rx="0.55" />
        <path d="M5.2 2.6c2.5.7 4.4 2 4.4 4.4-1.1-1.5-2.5-2.2-4.4-2.5z" />
      </g>
    </svg>
  );
}

export default function SiteSongDock() {
  const reduce = useReducedMotion();
  const { isArabic } = useLang();
  const { song, ui } = useContent();
  const s = song.siteSong;
  const t = ui.songUi;
  /* the one and only hook over the makanak element — this
     component lives above every room, so the song never
     restarts, never duplicates, never loses its place */
  const player = useRealAudioPlayer("makanak", s.audioUrl);

  /* the small paper note — folded away until she taps */
  const [open, setOpen] = useState(false);
  /* where the bookmark currently is in its life with the
     page — resting home, behind the edge, or on its way
     between them. Never a word of this touches the song */
  const [phase, setPhase] = useState<Phase>("enter");
  /* true only while the bookmark sits fully home (x = 0):
     a leave that begins from rest may give its little tug
     toward the edge first, while one that interrupts
     another motion simply continues out. onAnimationComplete
     is the only writer, so it is never stale */
  const settledRef = useRef(false);
  /* wide screens (the rooms without the bottom navigation).
     The bookmark is small everywhere, but a phone keeps it
     smallest — the page belongs to her, not to it */
  const [wide, setWide] = useState(
    () =>
      typeof window === "undefined" ||
      window.matchMedia("(min-width: 768px)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const fn = () => setWide(mq.matches);
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  /* the resting footprint — what the ribbon measures when
     it is home */
  const restW = wide ? REST_W_WIDE : REST_W_SMALL;
  const restH = wide ? REST_H_WIDE : REST_H_SMALL;

  /* until she has let the song sing once this visit (and only
     if she hasn't hushed the whole place), the little tab
     breathes — very quietly — so she knows it's there.
     Derived purely from the player's own state: the song
     has never played while it still sits at 0:00 */
  const [attention] = useState(() => !isRealAudioMuted());
  const breathe =
    attention && !player.playing && !player.ended && player.current === 0;

  /* the edges of its little life, alive to her language:
     which edge the bookmark hides behind (the start edge
     of whichever language she is reading now) and how far
     it travels to be fully gone — measured against
     whichever width it rests at. It may change with her
     tongue or her screen, quietly: only a true change of
     phase ever runs a motion, so nothing replays — the
     next journey simply leaves toward the right edge.
     The sign points toward the start edge: negative
     hides behind the left edge in English, positive
     behind the right edge in Arabic. */
  const edge = useMemo(() => {
    const sign = isArabic ? 1 : -1;
    const rest = wide ? REST_W_WIDE : REST_W_SMALL;
    return {
      /* fully behind the page edge, with clearance enough
         that not even the ribbon's shadow stays on her page */
      hidden: sign * (rest + 34),
      /* a sliver of burgundy paper out */
      peek: sign * (rest - 15),
      /* the small pull toward the edge before the page
         takes the ribbon back */
      tug: sign * 7,
    };
  }, [isArabic, wide]);

  /* the bookmark's whole choreography with the page edge,
     held stable across renders so nothing ever replays on
     its own — only a true change of phase runs a motion:

     enter      behind → peek → home (once, at arrival)
     away-rest  home → a small tug → behind the edge
     away-any   wherever it is → behind the edge
     return     behind → a peek → home

     The null that leads each journey means "wherever you
     truly are right now" — so an interrupted motion always
     continues honestly from itself, never jumps. */
  const dockVariants = useMemo<Variants>(
    () => ({
      enter: {
        x: [null, edge.hidden, edge.peek, 0],
        transition: reduce
          ? { duration: 0 }
          : {
              duration: 0.95,
              delay: 1.45,
              times: [0, 0.16, 0.42, 1],
              ease: "easeOut",
            },
      },
      "away-rest": {
        x: [0, edge.tug, edge.hidden],
        transition: reduce
          ? { duration: 0 }
          : {
              duration: 0.38,
              times: [0, 0.3, 1],
              ease: ["easeOut", "easeIn"],
            },
      },
      "away-any": {
        x: [null, edge.hidden],
        transition: reduce
          ? { duration: 0 }
          : { duration: 0.34, ease: [0.55, 0, 1, 0.45] },
      },
      return: {
        x: [null, edge.hidden, edge.peek, 0],
        transition: reduce
          ? { duration: 0 }
          : {
              duration: 0.55,
              times: [0, 0.2, 0.55, 1],
              ease: "easeOut",
            },
      },
    }),
    [reduce, edge],
  );

  /* the bookmark's tail — a notch cut into the free end of
     the ribbon, on whichever side the page turns its face */
  const notch = isArabic
    ? "polygon(0 0, 100% 0, 100% 100%, 0 100%, 10px 50%)"
    : "polygon(0 0, 100% 0, calc(100% - 10px) 50%, 100% 100%, 0 100%)";
  const ribbonBg = isArabic
    ? "linear-gradient(260deg, #651C2D 0%, #2D0B15 84%)"
    : "linear-gradient(100deg, #651C2D 0%, #2D0B15 84%)";

  /* the little handwritten state line — a real word for
     every state, never NaN, never silence pretending */
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

  /* ————— the scroll intelligence —————
     Everything the scroll listener needs to read lives in
     refs, so the listener attaches once and never goes
     stale. The music itself is never touched — this is
     purely the bookmark minding its manners. */
  const phaseRef = useRef(phase);
  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    let lastY = window.scrollY;
    let lastT = 0;
    let travel = 0; /* how far this gesture has truly moved */
    let stopTimer: number | undefined;

    const onScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;

      /* a pause between events starts a new gesture —
         the last one's jitter doesn't count against her */
      if (now - lastT > 240) travel = 0;
      lastT = now;
      travel = Math.max(0, travel + Math.abs(dy));

      /* while she keeps scrolling — every event resetting
         this timer — the bookmark stays behind the page
         edge. It never re-runs its leave, never flickers
         in and out mid-gesture; direction is direction,
         up or down, the page is moving under her */
      if (stopTimer !== undefined) window.clearTimeout(stopTimer);
      stopTimer = window.setTimeout(() => {
        stopTimer = undefined;
        /* only if it truly left — a still page never
           summons it, and a scroll that never meant
           anything never dismissed it */
        const p = phaseRef.current;
        if (p === "away-rest" || p === "away-any") setPhase("return");
      }, RETURN_STOP_MS);

      /* the moment her scrolling means it, the note folds
         and the whole ribbon slips behind the page edge —
         completely: not a smaller self, not a dimmed self,
         nothing of it left over her page */
      const p = phaseRef.current;
      const away = p === "away-rest" || p === "away-any";
      if (!away && travel >= HIDE_AFTER_PX) {
        setOpen(false);
        setPhase(settledRef.current ? "away-rest" : "away-any");
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (stopTimer !== undefined) window.clearTimeout(stopTimer);
    };
  }, []);

  /* ————— closing the note —————
     A tap on the tab folds it back up; so does a tap on
     the page beyond it, an Escape, or an honest scroll.
     The little tab itself always remains. */
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  /* which little speaker the current volume deserves */
  const VolIcon = player.volume <= 0.001 ? VolumeX : player.volume < 0.55 ? Volume1 : Volume2;

  /* while it lives behind the page edge — the one state
     where the page is entirely hers */
  const away = phase === "away-rest" || phase === "away-any";

  return (
    /* tucked into the start edge of the page, above the
       mobile navigation — never covering it, never covering
       the rooms' content. On desktop it rests against the
       margin like a ribbon left in the book */
    <div
      ref={rootRef}
      role="group"
      aria-label={t.ariaDock}
      className={cn(
        "fixed bottom-[calc(env(safe-area-inset-bottom)+76px)] start-0 z-40 md:bottom-8",
        /* behind the page edge it is not merely invisible —
           it cannot so much as stand in the way of a single
           tap meant for her page */
        away && "pointer-events-none",
      )}
    >
      <motion.div
        /* the bookmark arrives the way bookmarks do: tucked
           behind the edge, a sliver peeking out, then it
           slides gently into place and the name appears.
           Every later journey uses the same language: a tug,
           a slide behind the edge, a peek, a settling */
        initial={{ x: reduce ? 0 : edge.hidden }}
        animate={phase}
        variants={dockVariants}
        onAnimationComplete={(definition) => {
          /* home again once an arrival truly finishes;
             gone once a leave does. The only writer. */
          settledRef.current =
            definition === "enter" || definition === "return";
        }}
        className="flex flex-col items-start"
      >
        {/* the unfolded note — a small paper scrap that
            rises from behind the bookmark, holds play, the
            song's hours and her volume, and folds back down
            the same way it opened. Never a wall over the
            page; just enough to hold the controls she
            asked for */}
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              key="site-song-panel"
              id="site-song-panel"
              initial={{ height: 0, opacity: reduce ? 1 : 0, y: reduce ? 0 : 12 }}
              animate={{ height: "auto", opacity: 1, y: 0 }}
              exit={{ height: 0, opacity: reduce ? 1 : 0, y: reduce ? 0 : 8 }}
              transition={{
                duration: reduce ? 0 : 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative z-[1] -mb-1.5 overflow-hidden"
            >
              <div className="relative w-[min(calc(100vw-1.5rem),252px)] rounded-xl bg-[#2D0B15] px-4 pb-3 pt-3.5 ring-1 ring-rose/20 shadow-[0_24px_48px_-20px_rgba(13,10,11,0.85)]">
                {/* the stitched seam, like the note was sewn
                    onto the same ribbon as its bookmark */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-[5px] rounded-lg border border-dashed border-rose/25"
                />

                {/* her controls, in one small handful:
                    the play, the name, the hours, her volume */}
                <div className="flex items-center gap-3">
                  <motion.button
                    type="button"
                    onClick={() => player.toggle()}
                    whileTap={reduce ? undefined : { scale: 0.92 }}
                    aria-label={
                      player.playing ? t.ariaPauseSite : t.ariaPlaySite
                    }
                    className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-cream text-burgundy shadow-[0_6px_16px_-6px_rgba(13,10,11,0.85)] transition-colors duration-300 hover:bg-[#fffbf6] focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/70"
                  >
                    {player.playing ? (
                      <Pause className="h-[14px] w-[14px]" fill="currentColor" strokeWidth={0} />
                    ) : (
                      <Play className="ml-[2px] h-[14px] w-[14px]" fill="currentColor" strokeWidth={0} />
                    )}
                  </motion.button>
                  <span
                    dir="rtl"
                    className="font-arabic text-[19px] leading-none text-cream"
                  >
                    {s.title}
                  </span>
                  <InkNote className="-rotate-12 text-rose/70" />
                </div>

                <p
                  aria-live="polite"
                  className="mt-1.5 min-h-[1.2em] text-center font-hand text-[12.5px] leading-tight text-rose-soft/85"
                >
                  {stateLine}
                </p>

                <div className="mt-1">
                  <SeekTrack
                    tone="dark"
                    current={player.current}
                    duration={player.duration}
                    onSeek={(v) => player.seek(v)}
                    ariaLabel={t.ariaSeek}
                  />
                </div>

                {/* her volume — one small speaker and a short
                    ink rail, nothing more to hold */}
                <div className="mt-1 flex items-center justify-center gap-2.5">
                  <VolIcon
                    aria-hidden
                    className="h-[14px] w-[14px] shrink-0 text-rose/75"
                    strokeWidth={1.7}
                  />
                  <div className="relative flex h-7 w-[88px] items-center">
                    <div className="pointer-events-none relative h-[3px] w-full rounded-full bg-cream/15">
                      <div
                        className="absolute inset-y-0 start-0 rounded-full bg-rose"
                        style={{ width: `${player.volume * 100}%` }}
                      />
                      <span
                        aria-hidden
                        className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-cream"
                        style={{
                          insetInlineStart: `calc(${player.volume * 100}% - 4px)`,
                        }}
                      />
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={player.volume}
                      onChange={(e) =>
                        player.setVolume(parseFloat(e.target.value))
                      }
                      aria-label={t.ariaVolumeSite}
                      className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent opacity-0 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* the bookmark itself — a small burgundy ribbon with
            a notched tail, stitched like the scrapbook it
            lives in, and the song's name on its face. Its
            visible footprint is honestly tiny; the invisible
            hem of padding around it keeps it as easy to tap
            as it ever was */}
        <motion.button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-song-panel"
          aria-label={open ? t.ariaCollapseDock : t.ariaExpandDock}
          tabIndex={away ? -1 : 0}
          className="relative z-[2] block -mt-1.5 -mb-1.5 -me-3 rounded-xl pb-1.5 pe-3 pt-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60"
        >
          <span
            className="relative flex items-center overflow-hidden"
            style={{
              width: restW,
              height: restH,
              clipPath: notch,
              background: ribbonBg,
              /* while the song actually sings, the paper glows
                 a shade warmer — the only celebration it
                 allows itself */
              filter: player.playing
                ? "drop-shadow(0 10px 22px rgba(13,10,11,0.6)) drop-shadow(0 0 12px rgba(183,124,141,0.22))"
                : "drop-shadow(0 10px 20px rgba(13,10,11,0.55))",
            }}
          >
            {/* the stitched hem of the ribbon */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-[4px] rounded-[5px] border border-dashed border-rose/30"
            />

            {/* ——— its one resting face: the reels and the
                name, and on a desk a margin doodle too. The
                words arrive with the first entrance, not
                before it ——— */}
            <motion.span
              initial={{ opacity: reduce ? 1 : 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: reduce ? 0 : 0.5,
                delay: reduce ? 0 : 1.45 + 0.34,
                ease: "easeOut",
              }}
              className="absolute inset-0 flex items-center"
            >
              <span className="flex h-full w-full items-center justify-center gap-[7px]">
                <MiniReels
                  playing={player.playing}
                  className={wide ? "h-[21px] w-[27px]" : "h-[18px] w-[23px]"}
                />
                <span
                  dir="rtl"
                  className={cn(
                    "font-arabic leading-none text-cream",
                    wide ? "text-[15px]" : "text-[13.5px]",
                  )}
                >
                  {s.title}
                </span>
                {wide && <InkNote className="-rotate-12 text-rose/70" />}
              </span>
            </motion.span>

            {/* the quiet invitation — breathes only until she
                has tapped play once; then it never returns */}
            {breathe && (
              <span
                aria-hidden
                className="dock-breathe pointer-events-none absolute inset-[3px] rounded-[5px]"
              />
            )}
          </span>
        </motion.button>
      </motion.div>
    </div>
  );
}
