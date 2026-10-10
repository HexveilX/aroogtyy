"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Heart, Sparkles } from "lucide-react";
import type { MemoryItem, ViewId } from "@/content/arooqtyContent";
import { useContent, useLang } from "./Lang";
import { lsGet, lsSet } from "@/lib/localStorage";
import { Ltr, PaperDialog, Reveal, SectionHeading, TapeStrip } from "./Shared";
import ScrapbookDoodles, { HeartOutline } from "./ScrapbookDoodles";
import { ChatArtifact, MemoryArtifact, TicketArtifact } from "./Artifacts";
import ChapterNav from "./ChapterNav";
import { isArabic } from "@/lib/isArabic";
import { cn } from "@/lib/utils";

const ROTATIONS = [2.5, -2, 1.5, -3, 2, -1.5, 3];

/* ————— dialog content per memory kind ————— */
function MemoryDialogContent({ memory }: { memory: MemoryItem }) {
  const { lang, content } = useLang();
  const noteArabic = lang === "en" && isArabic(memory.noteText ?? "");
  const longArabic = lang === "en" && isArabic(memory.longNote ?? "");
  return (
    <div className="p-6 sm:p-8">
      {memory.kind === "polaroid" && (
        <img
          src={memory.image}
          alt={memory.imageAlt ?? memory.caption}
          className="aspect-square w-full rounded-[2px] object-cover"
        />
      )}

      {memory.kind === "strip" && (
        <div className="relative mx-auto w-[210px] rotate-[-1deg] rounded-[2px] bg-cream p-2 pb-3 polaroid-shadow">
          <TapeStrip className="-top-2.5 left-1/2 w-12 -translate-x-1/2" />
          <div className="flex flex-col gap-1.5">
            {memory.images?.map((src, i) => (
              <img
                key={src + i}
                src={src}
                alt={`${memory.imageAlt ?? memory.caption}${content.ui.memoriesUi.frame.replace("{n}", String(i + 1))}`}
                className="h-[172px] w-full rounded-[1px] object-cover"
              />
            ))}
          </div>
        </div>
      )}

      {memory.kind === "chat" && (
        <ChatArtifact memory={memory} className="mx-auto w-[250px] border-rose/20" />
      )}

      {memory.kind === "ticket" && (
        <TicketArtifact memory={memory} className="mx-auto mt-1" />
      )}

      {memory.kind === "taped" && (
        <div className="relative mx-auto w-fit rotate-[-1deg]">
          <TapeStrip className="-top-3 left-1/2 w-16 -translate-x-1/2 -rotate-2" />
          <div className="rounded-[2px] bg-cream p-2.5 pb-3 polaroid-shadow">
            <img
              src={memory.image}
              alt={memory.imageAlt ?? memory.caption}
              loading="lazy"
              className="mx-auto block max-h-[54svh] w-auto max-w-full rounded-[1px]"
            />
          </div>
        </div>
      )}

      {memory.kind === "note" && (
        <div className="relative mx-auto max-w-[280px] rotate-[-1deg] rounded-[2px] bg-[#fdfaf8] p-6 pt-8 polaroid-shadow">
          <TapeStrip className="-top-2.5 left-1/2 w-14 -translate-x-1/2" />
          <p
            dir={noteArabic ? "rtl" : undefined}
            lang={noteArabic ? "ar" : undefined}
            className={cn(
              "whitespace-pre-line text-center leading-snug text-ink",
              noteArabic
                ? "font-arabic text-[1.35rem] leading-[2]"
                : "font-hand text-[1.55rem]"
            )}
          >
            {memory.noteText}
          </p>
        </div>
      )}

      <p className="mt-6 text-center font-hand text-lg leading-snug text-[#8a4a5c]">
        {isArabic(memory.date) ? memory.date : <Ltr>{memory.date}</Ltr>}
      </p>
      <h3 className="mt-1 text-center font-display text-[1.6rem] leading-snug text-ink">
        {memory.caption}
      </h3>
      {memory.longNote && (
        <p
          dir={longArabic ? "rtl" : undefined}
          lang={longArabic ? "ar" : undefined}
          className={cn(
            "mt-3 text-center font-body text-[15px] leading-relaxed text-ink-soft/90",
            longArabic && "font-arabic text-[16px] leading-[2.1]"
          )}
        >
          {memory.longNote}
        </p>
      )}
    </div>
  );
}

export default function MemoriesView({
  onNavigate,
  pendingMemory,
  onPendingConsumed,
}: {
  onNavigate: (v: ViewId) => void;
  pendingMemory: string | null;
  onPendingConsumed: () => void;
}) {
  const reduce = useReducedMotion();
  const { memories, ui } = useContent();
  const [active, setActive] = useState<MemoryItem | null>(null);
  const [opened, setOpened] = useState<string[]>(() =>
    lsGet<string[]>("openedMemories", [])
  );
  const [pulseId, setPulseId] = useState<string | null>(null);
  const [justOpened, setJustOpened] = useState<string | null>(null);

  const openMemory = (memory: MemoryItem) => {
    setActive(memory);
    if (!opened.includes(memory.id)) {
      const next = [...opened, memory.id];
      setOpened(next);
      lsSet("openedMemories", next);
      // a tiny burgundy halo, just for a moment
      setJustOpened(memory.id);
      window.setTimeout(() => setJustOpened(null), 1600);
    }
  };

  /* open a memory requested from another screen (home preview) */
  useEffect(() => {
    if (!pendingMemory) return;
    const t = window.setTimeout(() => {
      const target = memories.find((m) => m.id === pendingMemory);
      if (target) openMemory(target);
      onPendingConsumed();
    }, 0);
    return () => window.clearTimeout(t);
  }, [pendingMemory]);

  /* pick a random memory — never the one she just saw */
  const pickRandom = () => {
    const history = lsGet<string[]>("randomMemoryHistory", []);
    const recent = history.slice(-2);
    const pool = memories.filter((m) => !recent.includes(m.id));
    const pick =
      pool.length > 0
        ? pool[Math.floor(Math.random() * pool.length)]
        : memories[0];
    lsSet("randomMemoryHistory", [...history, pick.id].slice(-8));
    openMemory(pick);
    setPulseId(pick.id);
    window.setTimeout(() => setPulseId(null), 2200);
  };

  return (
    <div className="relative isolate">
      {/* the living scrapbook — small hearts and paper
          marks around the places where memories are kept */}
      <ScrapbookDoodles variant="memories" />
      <SectionHeading
        overline={ui.sections.memories.overline}
        title={ui.sections.memories.title}
        sub={ui.sections.memories.sub}
      />

      <Reveal className="mt-8 flex justify-center" delay={0.05}>
        <motion.button
          onClick={pickRandom}
          whileHover={reduce ? undefined : { scale: 1.04 }}
          whileTap={reduce ? undefined : { scale: 0.96 }}
          className="inline-flex items-center gap-2.5 rounded-full border border-rose/30 px-6 py-2.5 text-[12px] uppercase tracking-[0.2em] text-rose transition-colors hover:border-rose/60 hover:bg-wine/60"
        >
          <Sparkles className="h-4 w-4" strokeWidth={1.6} />
          {ui.memoriesUi.shuffle}
        </motion.button>
      </Reveal>

      {/* the drawer */}
      <Reveal className="mt-9" delay={0.1}>
        <div className="overflow-hidden rounded-2xl border border-burgundy/40 polaroid-shadow">
          {/* drawer lip */}
          <div
            aria-hidden
            className="flex h-5 items-center justify-between border-b border-burgundy/60 bg-gradient-to-b from-[#4a1622] to-[#33101c] px-4"
          >
            <span className="h-1 w-10 rounded-full bg-black/30" />
            <span className="h-1.5 w-16 rounded-full bg-black/40" />
            <span className="h-1 w-10 rounded-full bg-black/30" />
          </div>
          {/* drawer interior */}
          <div className="flex flex-wrap items-center justify-center gap-6 bg-gradient-to-b from-[#1c0e15] to-[#150a10] px-4 pb-14 pt-10 sm:gap-8 sm:px-8">
            {memories.map((memory, i) => {
              const rot = ROTATIONS[i % ROTATIONS.length];
              return (
                /* each keepsake settles onto the board the way
                   paper does — arriving from too high and a
                   touch too rotated, finding its own angle as
                   it lands, its shadow arriving with it */
                <motion.div
                  key={memory.id}
                  initial={{
                    opacity: 0,
                    y: reduce ? 0 : 34,
                    rotate: reduce ? rot : rot + 4,
                    scale: reduce ? 1 : 0.92,
                  }}
                  whileInView={{ opacity: 1, y: 0, rotate: rot, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{
                    duration: reduce ? 0 : 0.75,
                    delay: (i % 4) * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative"
                >
                  <motion.button
                    onClick={() => openMemory(memory)}
                    aria-label={ui.memoriesUi.openAria
                      .replace("{caption}", memory.caption)
                      .replace("{date}", memory.date)}
                    whileHover={reduce ? undefined : { scale: 1.05, rotate: 0 }}
                    whileTap={reduce ? undefined : { scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 320, damping: 20 }}
                    className={cn(
                      "group block cursor-pointer touch-manipulation rounded-md",
                      pulseId === memory.id &&
                        "ring-2 ring-rose/70 ring-offset-4 ring-offset-[#1c0e15]",
                      justOpened === memory.id && "animate-discover-glow"
                    )}
                  >
                    <MemoryArtifact memory={memory} />
                    {/* a small handwritten heart, surfacing beside
                        the keepsake while she lingers on it */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -top-3 end-0 block h-4 w-4 translate-y-1 opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-90"
                    >
                      <HeartOutline color="#e1acb9" />
                    </span>
                  </motion.button>
                  {opened.includes(memory.id) && (
                    <motion.span
                      aria-hidden
                      initial={reduce ? false : { scale: 0, rotate: -40 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 500, damping: 16 }}
                      className="absolute -right-1 -top-1 flex h-[18px] w-[18px] items-center justify-center rounded-full bg-burgundy shadow"
                    >
                      <Heart
                        className="h-2.5 w-2.5 text-cream"
                        fill="currentColor"
                        strokeWidth={0}
                      />
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </Reveal>

      <PaperDialog
        open={active !== null}
        onOpenChange={(o) => {
          if (!o) setActive(null);
        }}
        ariaLabel={active?.caption ?? ui.memoriesUi.fallbackTitle}
      >
        {active && <MemoryDialogContent memory={active} />}
      </PaperDialog>

      <ChapterNav current="memories" onNavigate={onNavigate} />
    </div>
  );
}
