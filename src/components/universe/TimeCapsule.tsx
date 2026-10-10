"use client";

/* ————————————————————————————————————————————————
   a letter to later — her own sealed notes. She
   writes to her future self and picks the day the
   seal breaks. Kept only on her device; not even
   he can peek. His letters wait in the drawer above
   — these are hers, from her, for her.
———————————————————————————————————————————————— */

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart, Hourglass, Lock, X } from "lucide-react";
import type { TimeCapsuleNote } from "@/content/arooqtyContent";
import { useContent } from "./Lang";
import { isArabic } from "@/lib/isArabic";
import { lsGet, lsSet } from "@/lib/localStorage";
import { PaperDialog, Reveal, TapeStrip } from "./Shared";
import { cn } from "@/lib/utils";

const DAY_MS = 86_400_000;

/* her timezone, quietly respected */
function prettyDate(at: number, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: timezone,
    }).format(new Date(at));
  } catch {
    return new Date(at).toDateString();
  }
}

/* whole days between now and a future moment (negative if past) */
function daysUntil(openAt: number, now: number): number {
  return Math.ceil((openAt - now) / DAY_MS);
}

export default function TimeCapsule() {
  const reduce = useReducedMotion();
  const { timeCapsule: cfg, relationship } = useContent();
  const [notes, setNotes] = useState<TimeCapsuleNote[]>(() =>
    lsGet<TimeCapsuleNote[]>("timeCapsules", [])
  );
  const [draft, setDraft] = useState("");
  const [pickedDays, setPickedDays] = useState<number>(cfg.durations[0].days);
  const [justSealed, setJustSealed] = useState(false);
  const [now, setNow] = useState<number>(() => Date.now());
  const [reading, setReading] = useState<TimeCapsuleNote | null>(null);
  const [earlyId, setEarlyId] = useState<string | null>(null);
  const sealedTimer = useRef<number | null>(null);

  /* a slow clock — minute precision is plenty for day arithmetic */
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const persist = (next: TimeCapsuleNote[]) => {
    setNotes(next);
    lsSet("timeCapsules", next);
  };

  const seal = () => {
    const text = draft.trim();
    if (!text) return;
    const note: TimeCapsuleNote = {
      id: `${Date.now()}`,
      text,
      writtenAt: Date.now(),
      openAt: Date.now() + pickedDays * DAY_MS,
      openedAt: null,
    };
    /* if the drawer is full, the oldest letter steps aside first */
    const next = [note, ...notes];
    if (next.length > cfg.maxNotes) next.length = cfg.maxNotes;
    persist(next);
    setDraft("");
    setJustSealed(true);
    if (sealedTimer.current) window.clearTimeout(sealedTimer.current);
    sealedTimer.current = window.setTimeout(() => setJustSealed(false), 1800);
  };

  /* open a letter whose day has come */
  const openReady = (note: TimeCapsuleNote) => {
    if (note.openedAt === null && daysUntil(note.openAt, now) > 0) return;
    setReading(note);
    if (note.openedAt === null) {
      persist(
        notes.map((n) =>
          n.id === note.id ? { ...n, openedAt: Date.now() } : n
        )
      );
    }
  };

  /* unseal early — only after she confirms */
  const openEarly = (note: TimeCapsuleNote) => setEarlyId(note.id);
  const confirmEarly = () => {
    const note = notes.find((n) => n.id === earlyId);
    setEarlyId(null);
    if (!note) return;
    setReading(note);
    persist(
      notes.map((n) =>
        n.id === note.id ? { ...n, openedAt: Date.now() } : n
      )
    );
  };

  const remove = (id: string) =>
    persist(notes.filter((n) => n.id !== id));

  /* the sealed letters, soonest first */
  const sorted = useMemo(
    () =>
      [...notes].sort(
        (a, b) =>
          (a.openedAt ? 1 : 0) - (b.openedAt ? 1 : 0) ||
          a.openAt - b.openAt
      ),
    [notes]
  );

  const earlyNote = notes.find((n) => n.id === earlyId) ?? null;

  return (
    <section
      aria-label={cfg.title}
      className="mx-auto mt-20 max-w-[560px]"
    >
      {/* the little heading */}
      <Reveal className="text-center">
        <p className="text-[11px] uppercase tracking-[0.3em] text-rose/75">
          {cfg.overline}
        </p>
        <h3 className="mt-3 font-hand text-3xl text-cream/95">{cfg.title}</h3>
        <p className="mx-auto mt-1.5 max-w-xs text-[10px] uppercase tracking-[0.22em] text-rose-soft/70">
          {cfg.sub}
        </p>
      </Reveal>

      {/* the writing desk — a small dark card, distinct from her cream notebook */}
      <Reveal className="mt-8" delay={0.06}>
        <div className="relative rotate-[-0.4deg] rounded-lg border border-rose/15 bg-paper-card/80 px-6 pb-6 pt-7 polaroid-shadow sm:px-8">
          <TapeStrip className="-top-3 left-1/2 w-16 -translate-x-1/2 rotate-1" />

          <textarea
            dir="auto"
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, cfg.maxChars))}
            placeholder={cfg.placeholder}
            aria-label={cfg.inputLabel}
            rows={3}
            className="w-full resize-none rounded-md bg-[#1a0f14]/60 px-4 py-3 font-hand text-[1.25rem] leading-relaxed text-cream/95 placeholder:text-cream/45 ring-1 ring-rose/15 transition-shadow focus:outline-none focus:ring-rose/40"
          />

          {/* seal-until choices */}
          <div className="mt-4">
            <p className="text-[10px] uppercase tracking-[0.26em] text-rose-soft/85">
              {cfg.sealLabel}
            </p>
            <div
              role="radiogroup"
              aria-label={cfg.sealLabel}
              className="mt-2 flex flex-wrap gap-2"
            >
              {cfg.durations.map((d) => {
                const active = pickedDays === d.days;
                const future = new Date(Date.now() + d.days * DAY_MS);
                return (
                  <button
                    key={d.days}
                    role="radio"
                    aria-checked={active}
                    onClick={() => setPickedDays(d.days)}
                    className={cn(
                      "min-h-[40px] rounded-full border px-4 py-1.5 text-[11px] tracking-[0.08em] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/50",
                      active
                        ? "border-rose/60 bg-burgundy/30 text-cream"
                        : "border-rose/20 text-cream/80 hover:border-rose/40 hover:text-cream"
                    )}
                  >
                    {d.label}
                    <span className="ms-1.5 font-hand text-sm normal-case text-rose-soft/85">
                      {prettyDate(future.getTime(), relationship.timezone)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* save row */}
          <div className="mt-4 flex items-center justify-between gap-3">
            <p
              aria-hidden
              className="text-[10px] tabular-digits tracking-wider text-rose-soft/75"
            >
              {draft.length}/{cfg.maxChars}
            </p>
            <motion.button
              onClick={seal}
              disabled={!draft.trim()}
              whileTap={reduce || !draft.trim() ? undefined : { scale: 0.96 }}
              aria-label={cfg.sealButtonLabel}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-rose/35 px-5 py-1.5 text-[11px] uppercase tracking-[0.2em] text-rose/85 transition-all duration-300 hover:border-rose/60 hover:bg-rose/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/50 disabled:cursor-default disabled:opacity-35"
            >
              <Lock className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={justSealed ? "sealed" : "seal"}
                  initial={{ opacity: 0, y: reduce ? 0 : 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -4 }}
                  transition={{ duration: reduce ? 0 : 0.25 }}
                >
                  {justSealed ? cfg.sealedButtonLabel : cfg.sealButtonLabel}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </Reveal>

      {/* her sealed letters */}
      {sorted.length > 0 ? (
        <Reveal className="mt-8" delay={0.1}>
          <div role="list" className="grid gap-4 sm:grid-cols-2">
            <AnimatePresence initial={false}>
              {sorted.map((n, i) => {
                const remaining = daysUntil(n.openAt, now);
                const ready = n.openedAt !== null || remaining <= 0;
                return (
                  <motion.div
                    key={n.id}
                    layout
                    role="listitem"
                    initial={{ opacity: 0, y: reduce ? 0 : -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: reduce ? 0 : 0.35 }}
                    className={cn(
                      "group relative rounded-lg px-5 py-4 ring-1 transition-transform duration-300 hover:-translate-y-0.5",
                      ready
                        ? "cursor-pointer bg-cream ring-[#8a4a5c]/15 hover:ring-[#8a4a5c]/40"
                        : "bg-[#1a0f14]/70 ring-rose/12 hover:ring-rose/30"
                    )}
                    onClick={() => ready && openReady(n)}
                  >
                    {/* the seal — a small wax dot with a lock or an open heart */}
                    <div
                      aria-hidden
                      className={cn(
                        "absolute -top-3 left-5 flex h-8 w-8 items-center justify-center rounded-full shadow-md ring-2",
                        ready
                          ? "bg-gradient-to-br from-[#7d2c3f] to-[#4a1622] ring-[#4a1622]/40"
                          : "bg-gradient-to-br from-[#3d1620] to-[#2d0b15] ring-[#4a1622]/50"
                      )}
                    >
                      {ready ? (
                        <Heart
                          className="h-3.5 w-3.5 text-cream"
                          fill="currentColor"
                          strokeWidth={0}
                        />
                      ) : (
                        <Lock
                          className="h-3.5 w-3.5 text-cream/70"
                          strokeWidth={1.8}
                        />
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p
                        className={cn(
                          "text-[9.5px] uppercase tracking-[0.22em]",
                          ready ? "text-rose-soft" : "text-rose-soft/80"
                        )}
                      >
                        {cfg.keptForTemplate.replace(
                          "{date}",
                          prettyDate(n.openAt, relationship.timezone)
                        )}
                      </p>
                      {n.openedAt !== null && (
                        <span className="rounded-full bg-burgundy/10 px-2 py-0.5 text-[8.5px] uppercase tracking-[0.18em] text-[#8a4a5c]">
                          {cfg.openedLabel}
                        </span>
                      )}
                    </div>

                    {/* what the card shows: sealed hides the words, opened shows them */}
                    {n.openedAt !== null ? (
                      <p
                        dir={isArabic(n.text) ? "rtl" : "ltr"}
                        className={cn(
                          "mt-2 line-clamp-3 whitespace-pre-wrap text-ink",
                          isArabic(n.text)
                            ? "font-arabic text-[1.25rem] leading-relaxed"
                            : "font-hand text-[1.1rem] leading-snug"
                        )}
                      >
                        {n.text}
                      </p>
                    ) : (
                      <p className="mt-3 flex items-center gap-2 font-body text-[13.5px] italic text-cream/80">
                        <Hourglass
                          className="h-3.5 w-3.5 shrink-0 text-rose-soft/75"
                          strokeWidth={1.6}
                          aria-hidden
                        />
                        {remaining > 0
                          ? cfg.countdownTemplate.replace(
                              "{n}",
                              String(remaining)
                            )
                          : cfg.readyLabel}
                      </p>
                    )}

                    <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-rose-soft/65">
                      {n.openedAt !== null
                        ? cfg.readAgainLabel
                        : remaining <= 0
                          ? cfg.readyLabel
                          : cfg.sealedStill}
                    </p>

                    {/* unseal-early (small, quiet) + remove */}
                    <div className="absolute bottom-2 end-2 flex items-center gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100 focus-within:opacity-100 max-sm:opacity-70">
                      {n.openedAt === null && remaining > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openEarly(n);
                          }}
                          aria-label={cfg.removeLabel}
                          className="rounded-full p-2 text-cream/70 transition-colors hover:text-rose focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/50"
                        >
                          <Hourglass
                            className="h-3.5 w-3.5"
                            strokeWidth={2}
                            aria-hidden
                          />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          remove(n.id);
                        }}
                        aria-label={cfg.discardLabel}
                        className="rounded-full p-2 text-cream/70 transition-colors hover:text-rose focus:outline-none focus-visible:ring-2 focus-visible:ring-rose/50"
                      >
                        <X className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </Reveal>
      ) : (
        <Reveal className="mt-7 text-center" delay={0.1}>
          <p className="font-hand text-lg text-rose-soft/80">{cfg.emptyLine}</p>
        </Reveal>
      )}

      {/* the privacy line */}
      <Reveal className="mt-5 text-center" delay={0.12}>
        <p className="mx-auto max-w-xs font-hand text-base leading-relaxed text-rose-soft/80">
          {cfg.privateLine}
        </p>
      </Reveal>

      {/* reading a letter she may now open */}
      <PaperDialog
        open={reading !== null}
        onOpenChange={(o) => !o && setReading(null)}
        ariaLabel={cfg.title}
      >
        {reading && (
          <div className="p-7 sm:p-9">
            <p className="text-center text-[10px] uppercase tracking-[0.28em] text-[#8a4a5c]">
              {cfg.overline.replace(" —", "")}
            </p>
            <p className="mt-1 text-center text-[10px] uppercase tracking-[0.22em] text-[#8a4a5c]/60">
              {cfg.stampTemplate
                .replace("{a}", prettyDate(reading.writtenAt, relationship.timezone))
                .replace(
                  "{b}",
                  prettyDate(reading.openedAt ?? Date.now(), relationship.timezone)
                )}
            </p>
            <div aria-hidden className="mx-auto mt-4 h-px w-16 bg-[#8a4a5c]/25" />
            <div className="mt-5 space-y-4">
              {reading.text.split("\n").map((para, i) => (
                <p
                  key={i}
                  dir={isArabic(para) ? "rtl" : "ltr"}
                  className={cn(
                    "text-ink",
                    isArabic(para)
                      ? "font-arabic text-[1.5rem] leading-[1.9]"
                      : "font-hand text-[1.35rem] leading-[1.7]"
                  )}
                >
                  {para}
                </p>
              ))}
            </div>
            <p className="mt-7 text-end font-hand text-2xl text-burgundy">
              {cfg.signature}
            </p>
          </div>
        )}
      </PaperDialog>

      {/* the early-unseal confirmation — a quiet little dialog */}
      <PaperDialog
        open={earlyNote !== null}
        onOpenChange={(o) => !o && setEarlyId(null)}
        ariaLabel={cfg.earlyOpenTitle}
      >
        {earlyNote && (
          <div className="p-7 sm:p-9">
            <p className="text-center text-[10px] uppercase tracking-[0.28em] text-[#8a4a5c]">
              {cfg.earlyOpenTitle}
            </p>
            <div aria-hidden className="mx-auto mt-4 h-px w-16 bg-[#8a4a5c]/25" />
            <p className="mt-5 text-center font-body text-[15px] leading-[1.8] text-ink-soft/95">
              {cfg.earlyOpenBody.replace(
                "{date}",
                prettyDate(earlyNote.openAt, relationship.timezone)
              )}
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={confirmEarly}
                className="min-h-[44px] rounded-full border border-[#651C2D]/40 px-6 py-2 text-[11px] uppercase tracking-[0.2em] text-[#651C2D] transition-all duration-300 hover:bg-[#651C2D]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#651C2D]/40"
              >
                {cfg.earlyOpenConfirm}
              </button>
              <button
                onClick={() => setEarlyId(null)}
                className="min-h-[44px] rounded-full border border-[#8a4a5c]/25 px-6 py-2 text-[11px] uppercase tracking-[0.2em] text-[#8a4a5c] transition-all duration-300 hover:border-[#8a4a5c]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8a4a5c]/40"
              >
                {cfg.earlyOpenCancel}
              </button>
            </div>
          </div>
        )}
      </PaperDialog>
    </section>
  );
}
