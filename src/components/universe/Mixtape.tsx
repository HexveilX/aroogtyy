"use client";

/* ————————————————————————————————————————————————
   mixtape (side C) — five small song dedications,
   plus a sixth slot that belongs to her: "your side
   of the tape". She writes her pick once (title +
   artist + optional reason); it lives on her device
   and flips like the rest of the cards. Reduce-guarded.
———————————————————————————————————————————————— */

import { useState } from "react";
import type { KeyboardEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart, Music4, PenLine, RotateCw } from "lucide-react";
import type { MixtapeSong } from "@/content/arooqtyContent";
import { useContent } from "./Lang";
import { isArabic } from "@/lib/isArabic";
import { lsGet, lsSet } from "@/lib/localStorage";
import { PaperDialog, Reveal, TapeStrip } from "./Shared";
import { cn } from "@/lib/utils";

/* what she once wrote — kept on her device */
type HerSong = { title: string; artist: string; why: string };

/* a tiny SVG cassette silhouette — small, hand-drawn feel */
function MiniCassette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 38"
      className={className}
      aria-hidden
      fill="none"
    >
      <rect
        x="1.5"
        y="1.5"
        width="57"
        height="35"
        rx="4"
        fill="#2D0B15"
        stroke="#651C2D"
        strokeWidth="1.4"
      />
      <rect
        x="7"
        y="6"
        width="46"
        height="14"
        rx="2"
        fill="#F8F4F1"
        opacity="0.95"
      />
      <rect
        x="14"
        y="22"
        width="32"
        height="11"
        rx="3"
        fill="#0D0A0B"
        stroke="#651C2D"
        strokeWidth="1"
      />
      <circle cx="22" cy="28" r="3.6" fill="#1a0f14" stroke="#B77C8D" strokeWidth="0.9" />
      <circle cx="38" cy="28" r="3.6" fill="#1a0f14" stroke="#B77C8D" strokeWidth="0.9" />
      <rect x="20" y="27.5" width="20" height="1" fill="#7a4a58" opacity="0.4" />
    </svg>
  );
}

/* the little paper label the empty cassette window shows */
function MiniCassetteBlank({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 38"
      className={className}
      aria-hidden
      fill="none"
    >
      <rect
        x="1.5"
        y="1.5"
        width="57"
        height="35"
        rx="4"
        fill="#211319"
        stroke="#B77C8D"
        strokeWidth="1.2"
        strokeDasharray="3 2.5"
      />
      <rect
        x="7"
        y="6"
        width="46"
        height="14"
        rx="2"
        fill="#F8F4F1"
        opacity="0.28"
      />
      <path
        d="M18 13 h24"
        stroke="#B77C8D"
        strokeWidth="1.2"
        strokeDasharray="2.5 3"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="24" cy="28" r="3.4" stroke="#B77C8D" strokeWidth="1" strokeDasharray="2 2.4" />
      <circle cx="36" cy="28" r="3.4" stroke="#B77C8D" strokeWidth="1" strokeDasharray="2 2.4" />
    </svg>
  );
}

/* ————— the little scrapbook watch-ticket —————
   Every card flips over to a reason written on warm paper,
   and pressed at the bottom: a dashed ticket that opens
   the song's official video on YouTube. Burgundy play
   badge, handwritten label, a slight tilt — like a real
   ticket taped into the book. It lives INSIDE the back
   face (never below the card), and stops the flip's
   click so the card stays put while the song opens. */
function WatchTicket({ song }: { song: MixtapeSong }) {
  const { mixtape: cfg } = useContent();
  if (!song.youtube) return null;
  const labelAr = isArabic(cfg.watchLabel);
  return (
    <a
      href={song.youtube}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      aria-label={`${cfg.watchLabel} — ${song.title}. ${cfg.watchSr}`}
      className="inline-flex min-h-[34px] shrink-0 items-center gap-1.5 rounded-[4px] border border-dashed border-burgundy/55 bg-cream px-2.5 py-1.5 shadow-[0_2px_7px_-2px_rgba(36,16,22,0.45)] -rotate-[1.6deg] transition-all duration-300 hover:rotate-0 hover:-translate-y-0.5 hover:border-burgundy/85 hover:shadow-[0_6px_14px_-4px_rgba(36,16,22,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/60"
    >
      {/* a tiny play badge — the site's own burgundy, never red */}
      <span
        aria-hidden
        className="flex h-[14px] w-[20px] shrink-0 items-center justify-center rounded-[4px] bg-burgundy"
      >
        <svg viewBox="0 0 12 14" className="h-[8px] w-[7px] fill-cream">
          <path d="M0 0 L12 7 L0 14 Z" />
        </svg>
      </span>
      <span
        className={cn(
          "leading-none text-burgundy",
          labelAr ? "font-arabic text-[13px]" : "font-hand text-[12.5px]",
        )}
      >
        {cfg.watchLabel}
      </span>
    </a>
  );
}

function SongCard({
  song,
  index,
}: {
  song: MixtapeSong;
  index: number;
}) {
  const reduce = useReducedMotion();
  const { mixtape: cfg } = useContent();
  const [flipped, setFlipped] = useState(false);

  /* the slight rotation per card — gives the page a
     scattered-feeling collection, like real polaroids
     pinned on a corkboard */
  const rotations = [
    "-1.2deg",
    "0.6deg",
    "-0.4deg",
    "1deg",
    "-0.8deg",
  ];
  const rot = rotations[index % rotations.length];

  const titleAr = isArabic(song.title);
  const artistAr = isArabic(song.artist);
  const overlineAr = isArabic(cfg.reasonOverline);

  /* the card is a div wearing a button's role, so the watch
     ticket inside can be a real anchor (valid nesting), while
     Enter / Space still flip it like the button it replaced */
  const flip = () => setFlipped((f) => !f);
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      flip();
    }
  };

  return (
    <motion.div
      onClick={flip}
      onKeyDown={onKeyDown}
      role="button"
      tabIndex={0}
      aria-pressed={flipped}
      whileTap={reduce ? undefined : { scale: 0.97 }}
      whileHover={reduce ? undefined : { y: -3 }}
      aria-label={cfg.ariaTemplate
        .replace("{title}", song.title)
        .replace("{artist}", song.artist)
        .replace("{flip}", cfg.flipLabel)
        .replace("{which}", flipped ? cfg.ariaWhichReason : cfg.ariaWhichSong)}
      className="group relative block w-full cursor-pointer rounded-lg text-start focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
      style={{ perspective: 900 }}
    >
      {/* the back face is the one IN FLOW — it defines the
          card's height, so its note and ticket(s) can never
          outgrow the card. the front face is absolute on top
          of it, filling the same box. cards therefore vary in
          height with their notes — a scattered, real-tape
          crate, never a clipped one */}
      <div
        className="relative w-full"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* face-up — the song */}
        <motion.div
          initial={false}
          animate={{
            rotateY: flipped ? 180 : 0,
          }}
          transition={{
            duration: reduce ? 0 : 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            backfaceVisibility: "hidden",
            transformStyle: "preserve-3d",
            position: "absolute",
            inset: 0,
            transform: `rotate(${rot})`,
          }}
          className={cn(
            "flex h-full flex-col justify-between rounded-lg bg-cream px-4 py-3.5 polaroid-shadow ring-1 ring-rose/15"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-[8.5px] uppercase tracking-[0.22em] text-[#8a4a5c]">
                no. {String(index + 1).padStart(2, "0")}
              </p>
              <p
                className={cn(
                  "mt-1 text-burgundy",
                  titleAr
                    ? "font-display text-[1.35rem] leading-[1.45]"
                    : "font-display text-lg leading-tight",
                )}
              >
                {song.title}
              </p>
              <p
                className={cn(
                  "mt-0.5 text-[#8a4a5c]",
                  artistAr
                    ? "font-arabic text-[12.5px] leading-normal"
                    : "text-[9.5px] uppercase tracking-[0.18em]",
                )}
              >
                {song.artist}
              </p>
            </div>
            <Music4
              className="h-4 w-4 shrink-0 text-[#8a4a5c]"
              strokeWidth={1.6}
              aria-hidden
            />
          </div>
          {/* the little cassette at the bottom */}
          <div className="mt-2 flex items-end justify-between gap-2">
            <MiniCassette className="h-9 w-14" />
            <span className="font-hand text-[11px] uppercase tracking-[0.15em] text-[#8a4a5c]">
              {cfg.flipLabel}
            </span>
          </div>
        </motion.div>

        {/* face-down — the reason, on the sealed letters' warm
            paper. The back's own little contract: a handwritten
            title, the reason, a small separator, then the
            ticket — all of it INSIDE the card, never below
            it, never clipped. (A bug lived here once: a dark
            panel under dark ink — the reason was invisible
            handwriting. it reads like ink now.) */}
        <motion.div
          initial={false}
          animate={{
            rotateY: flipped ? 0 : -180,
          }}
          transition={{
            duration: reduce ? 0 : 0.55,
            ease: [0.22, 1, 0.36, 1],
          }}
          style={{
            backfaceVisibility: "hidden",
            transformStyle: "preserve-3d",
            position: "relative",
            transform: `rotate(${rot})`,
          }}
          className={cn(
            "flex w-full flex-col rounded-lg bg-warm-paper px-4 py-3.5 polaroid-shadow ring-1 ring-rose/25",
          )}
        >
          {/* the handwritten title */}
          <p
            className={cn(
              "leading-snug text-ink/90",
              overlineAr
                ? "font-arabic text-[1.15rem]"
                : "font-hand text-[1.05rem]",
            )}
          >
            {cfg.reasonOverline}
          </p>
          {/* the reason itself */}
          <p
            className={cn(
              "mt-1.5 leading-snug text-ink",
              isArabic(song.why)
                ? "font-arabic text-[1.02rem]"
                : "font-hand text-[0.98rem]",
            )}
          >
            {song.why}
          </p>

          {/* separator + tickets, pinned inside the card's own bottom */}
          <div className="mt-auto">
            <div
              aria-hidden
              className="flex items-center justify-center gap-1.5 pb-2.5"
            >
              <span className="h-px w-7 border-t border-dashed border-burgundy/40" />
              <Heart
                className="h-2 w-2 fill-burgundy/50 text-burgundy/50"
                strokeWidth={0}
              />
              <span className="h-px w-7 border-t border-dashed border-burgundy/40" />
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              {song.youtube ? (
                <WatchTicket song={song} />
              ) : (
                <span className="flex shrink-0 items-center gap-1 font-hand text-[11px] uppercase tracking-[0.15em] text-[#8a4a5c]">
                  <RotateCw className="h-3 w-3" strokeWidth={1.6} aria-hidden />
                  {cfg.flipBackLabel}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ————— her side of the tape — the sixth slot ————— */
function HerPickCard() {
  const reduce = useReducedMotion();
  const { mixtape: cfg } = useContent();
  const y = cfg.yours;
  /* hydrate from her device — lazy, like every other
     keepsake component on the site (SSR-safe: lsGet
     returns its fallback on the server) */
  const [song, setSong] = useState<HerSong | null>(() => {
    const stored = lsGet<HerSong | null>("mixtapeYours", null);
    if (stored && typeof stored.title === "string" && stored.title.trim()) {
      return {
        title: stored.title,
        artist: typeof stored.artist === "string" ? stored.artist : "",
        why: typeof stored.why === "string" ? stored.why : "",
      };
    }
    return null;
  });
  const [flipped, setFlipped] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  /* the form mirrors whatever was last saved (or blank) */
  const [title, setTitle] = useState(song?.title ?? "");
  const [artist, setArtist] = useState(song?.artist ?? "");
  const [why, setWhy] = useState(song?.why ?? "");

  const openDialog = () => {
    // prefill with whatever she last wrote, so editing is gentle
    if (song) {
      setTitle(song.title);
      setArtist(song.artist ?? "");
      setWhy(song.why ?? "");
    }
    setDialogOpen(true);
  };

  const save = () => {
    const t = title.trim();
    if (!t) return;
    const next: HerSong = { title: t, artist: artist.trim(), why: why.trim() };
    lsSet("mixtapeYours", next);
    setSong(next);
    setFlipped(false);
    setDialogOpen(false);
  };

  /* ——— empty state: a dashed, waiting cassette ——— */
  if (!song) {
    return (
      <>
        <motion.button
          onClick={openDialog}
          whileTap={reduce ? undefined : { scale: 0.97 }}
          whileHover={reduce ? undefined : { y: -3 }}
          aria-label={`${y.overline} ${y.emptyTitle}`}
          className="group relative block w-full rounded-lg border border-dashed border-rose/40 bg-wine/30 px-4 py-3.5 text-start focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream transition-colors duration-300 hover:border-rose/65 hover:bg-wine/45"
        >
          <p className="text-[8.5px] uppercase tracking-[0.22em] text-rose-soft/85">
            no. 06 · {y.overline}
          </p>
          <p className="mt-1.5 font-hand text-[1.1rem] leading-snug text-cream/85">
            {y.emptyTitle}
          </p>
          <div className="mt-2 flex items-end justify-between gap-2">
            <MiniCassetteBlank className="h-9 w-14 transition-opacity duration-300 group-hover:opacity-90 opacity-60" />
            <span className="flex items-center gap-1.5 font-hand text-[10px] uppercase tracking-[0.15em] text-rose-soft/80">
              <PenLine className="h-3 w-3" strokeWidth={1.6} aria-hidden />
              {y.emptyHint}
            </span>
          </div>
        </motion.button>

        <HerPickDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title={title}
          artist={artist}
          why={why}
          setTitle={setTitle}
          setArtist={setArtist}
          setWhy={setWhy}
          onSave={save}
        />
      </>
    );
  }

  /* ——— filled: her pick, flippable like the rest ——— */
  const rot = "0.9deg";
  return (
    <>
      <motion.button
        onClick={() => setFlipped((f) => !f)}
        whileTap={reduce ? undefined : { scale: 0.97 }}
        whileHover={reduce ? undefined : { y: -3 }}
        aria-label={`${song.title}${song.artist ? ` — ${song.artist}` : ""}. ${y.pickTag}. ${y.flipLabel}. ${
          flipped ? y.ariaHerReason : y.ariaHerSong
        }.`}
        className="group relative block w-full text-start focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/60 focus-visible:ring-offset-2 focus-visible:ring-offset-cream"
        style={{ perspective: 900 }}
      >
        {/* the back face (her reason) is the in-flow one —
            the card is exactly as tall as whatever she wrote,
            so her handwriting can never be clipped */}
        <div
          className="relative w-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* face-up — her song, in her handwriting */}
          <motion.div
            initial={false}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{
              duration: reduce ? 0 : 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              backfaceVisibility: "hidden",
              transformStyle: "preserve-3d",
              position: "absolute",
              inset: 0,
              transform: `rotate(${rot})`,
            }}
            className="flex h-full flex-col justify-between rounded-lg bg-cream px-4 py-3.5 polaroid-shadow ring-1 ring-rose/25"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-[8.5px] uppercase tracking-[0.22em] text-[#8a4a5c]">
                  no. 06
                  <span className="rounded-full border border-burgundy/40 px-1.5 py-px font-hand text-[9px] normal-case tracking-normal text-burgundy/85">
                    {y.pickTag}
                  </span>
                </p>
                <p
                  dir={isArabic(song.title) ? "rtl" : "ltr"}
                  className={cn(
                    "mt-1 text-burgundy",
                    isArabic(song.title)
                      ? "font-arabic text-[1.5rem] leading-relaxed"
                      : "font-hand text-[1.35rem] leading-tight"
                  )}
                >
                  {song.title}
                </p>
                {song.artist ? (
                  <p
                    dir={isArabic(song.artist) ? "rtl" : "ltr"}
                    className={cn(
                      "mt-0.5 text-[#8a4a5c]",
                      isArabic(song.artist)
                        ? "font-arabic text-[11px] leading-relaxed"
                        : "text-[9.5px] uppercase tracking-[0.18em]"
                    )}
                  >
                    {song.artist}
                  </p>
                ) : null}
              </div>
              <TapeStrip className="-right-2 -top-2 w-11 rotate-6" />
            </div>
            <div className="mt-2 flex items-end justify-between gap-2">
              <MiniCassette className="h-9 w-14" />
              <span className="font-hand text-[10px] uppercase tracking-[0.15em] text-[#8a4a5c]">
                {y.flipLabel}
              </span>
            </div>
          </motion.div>

          {/* face-down — her reason (or the blank-why line), on
              warm paper so her handwriting reads like ink */}
          <motion.div
            initial={false}
            animate={{ rotateY: flipped ? 0 : -180 }}
            transition={{
              duration: reduce ? 0 : 0.55,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              backfaceVisibility: "hidden",
              transformStyle: "preserve-3d",
              position: "relative",
              transform: `rotate(${rot})`,
            }}
            className="flex w-full flex-col justify-between rounded-lg bg-warm-paper px-4 py-3.5 polaroid-shadow ring-1 ring-rose/25"
          >
            <div>
              <p
                className={cn(
                  "leading-snug text-ink/90",
                  isArabic(y.reasonOverline)
                    ? "font-arabic text-[1.15rem]"
                    : "font-hand text-[1.05rem]",
                )}
              >
                {y.reasonOverline}
              </p>
              <p
                dir={isArabic(song.why || y.blankWhy) ? "rtl" : "ltr"}
                className={cn(
                  "mt-1.5 text-ink",
                  isArabic(song.why || y.blankWhy)
                    ? "font-arabic text-[1.08rem] leading-relaxed"
                    : "font-hand text-[1.02rem] leading-snug"
                )}
              >
                {song.why || y.blankWhy}
              </p>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span
                className={cn(
                  "min-w-0 truncate text-burgundy/75",
                  isArabic(song.title)
                    ? "font-arabic text-[12px]"
                    : "font-hand text-xs",
                )}
              >
                {song.title}
              </span>
              <span className="flex shrink-0 items-center gap-1 font-hand text-[11px] uppercase tracking-[0.15em] text-[#8a4a5c]">
                <RotateCw className="h-3 w-3" strokeWidth={1.6} aria-hidden />
                {y.flipBackLabel}
              </span>
            </div>
          </motion.div>
        </div>
      </motion.button>

      {/* the small change affordance, under her card */}
      <div className="flex justify-center">
        <button
          onClick={openDialog}
          className="mt-1 rounded-sm font-hand text-xs uppercase tracking-[0.15em] text-rose-soft/75 underline decoration-rose/30 underline-offset-4 transition-colors duration-300 hover:text-rose-soft focus:outline-none focus-visible:ring-1 focus-visible:ring-rose/50"
        >
          {y.changeLabel}
        </button>
      </div>

      <HerPickDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={title}
        artist={artist}
        why={why}
        setTitle={setTitle}
        setArtist={setArtist}
        setWhy={setWhy}
        onSave={save}
      />
    </>
  );
}

/* ————— the little writing dialog for her pick ————— */
function HerPickDialog({
  open,
  onOpenChange,
  title,
  artist,
  why,
  setTitle,
  setArtist,
  setWhy,
  onSave,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  artist: string;
  why: string;
  setTitle: (v: string) => void;
  setArtist: (v: string) => void;
  setWhy: (v: string) => void;
  onSave: () => void;
}) {
  const reduce = useReducedMotion();
  const { mixtape: cfg } = useContent();
  const y = cfg.yours;
  const canSave = title.trim().length > 0;

  const fieldClass =
    "w-full rounded-md border border-[#8a4a5c]/30 bg-[#fdfaf8] px-3.5 py-2.5 font-hand text-[1.15rem] text-ink placeholder:text-[#8a4a5c]/40 focus:border-burgundy/60 focus:outline-none focus-visible:ring-1 focus-visible:ring-burgundy/40 transition-colors duration-300";

  return (
    <PaperDialog open={open} onOpenChange={onOpenChange} ariaLabel={y.dialogTitle}>
      <div className="p-7 sm:p-8">
        <p className="text-center text-[10px] uppercase tracking-[0.28em] text-[#8a4a5c]">
          {y.overline}
        </p>
        <h3 className="mt-2 text-center font-display text-2xl text-ink">
          {y.dialogTitle}
        </h3>
        <p className="mx-auto mt-3 max-w-[300px] text-center font-hand text-[15px] leading-relaxed text-ink-soft/80">
          {y.dialogHint}
        </p>

        <div className="mt-6 space-y-3.5">
          <div>
            <label
              htmlFor="mixtape-yours-title"
              className="mb-1.5 block text-[9px] uppercase tracking-[0.22em] text-[#8a4a5c]"
            >
              {y.titlePlaceholder}
            </label>
            <input
              id="mixtape-yours-title"
              dir="auto"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={60}
              autoComplete="off"
              className={fieldClass}
            />
          </div>
          <div>
            <label
              htmlFor="mixtape-yours-artist"
              className="mb-1.5 block text-[9px] uppercase tracking-[0.22em] text-[#8a4a5c]"
            >
              {y.artistPlaceholder}
            </label>
            <input
              id="mixtape-yours-artist"
              dir="auto"
              value={artist}
              onChange={(e) => setArtist(e.target.value)}
              maxLength={60}
              autoComplete="off"
              className={fieldClass}
            />
          </div>
          <div>
            <label
              htmlFor="mixtape-yours-why"
              className="mb-1.5 block text-[9px] uppercase tracking-[0.22em] text-[#8a4a5c]"
            >
              {y.whyPlaceholder}
            </label>
            <textarea
              id="mixtape-yours-why"
              dir="auto"
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              maxLength={140}
              rows={2}
              className={cn(fieldClass, "resize-none leading-snug")}
            />
          </div>
        </div>

        <div className="mt-7 flex items-center justify-center gap-3">
          <button
            onClick={() => onOpenChange(false)}
            className="min-h-[44px] rounded-full border border-[#8a4a5c]/25 px-4 py-2 text-[10px] uppercase tracking-[0.2em] text-[#8a4a5c]/70 transition-colors duration-300 hover:border-[#8a4a5c]/50 hover:text-[#8a4a5c] focus:outline-none focus-visible:ring-1 focus-visible:ring-[#8a4a5c]/40"
          >
            {y.cancelLabel}
          </button>
          <motion.button
            onClick={onSave}
            disabled={!canSave}
            whileTap={reduce || !canSave ? undefined : { scale: 0.96 }}
            className={cn(
              "inline-flex min-h-[44px] items-center gap-2 rounded-full px-5 py-2 text-[10px] uppercase tracking-[0.2em] transition-all duration-300",
              canSave
                ? "bg-burgundy text-cream shadow-[0_10px_22px_-10px_rgba(101,28,45,0.9)] hover:bg-[#7d2c3f] focus:outline-none focus-visible:ring-2 focus-visible:ring-burgundy/50"
                : "cursor-not-allowed bg-burgundy/25 text-cream/60"
            )}
          >
            <PenLine className="h-3 w-3" strokeWidth={1.8} aria-hidden />
            {y.saveLabel}
          </motion.button>
        </div>
      </div>
    </PaperDialog>
  );
}

export default function Mixtape() {
  const reduce = useReducedMotion();
  const { mixtape: cfg } = useContent();

  return (
    <Reveal className="mx-auto mt-14 w-[min(94vw,520px)]" delay={0.06}>
      <div className="text-center">
        <p className="text-[10px] uppercase tracking-[0.3em] text-rose/75">
          {cfg.overline}
        </p>
        <h3 className="mt-2 font-display text-2xl text-cream sm:text-3xl">
          {cfg.title}
        </h3>
        <p className="mt-2 font-hand text-lg text-rose-soft/85">{cfg.sub}</p>
      </div>

      <motion.div
        initial={reduce ? false : { opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={{
          duration: reduce ? 0 : 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {cfg.songs.map((song, i) => (
          <SongCard key={song.id} song={song} index={i} />
        ))}
        {/* the sixth slot — hers */}
        <HerPickCard />
      </motion.div>

      <p className="mt-7 text-center font-hand text-base text-rose-soft/75">
        {cfg.footLine}
      </p>
    </Reveal>
  );
}
