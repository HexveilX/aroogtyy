"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Heart } from "lucide-react";
import BootVeil from "./BootVeil";
import EntranceGate from "./EntranceGate";
import { LangProvider, useContent, useLang } from "./Lang";
import { BottomNav, TopNav } from "./Nav";
import SiteSongDock from "./SiteSongDock";
import AmbientSpecks from "./AmbientSpecks";
import ScrapbookBackdrop from "./ScrapbookBackdrop";
import HomeView from "./HomeView";
import TimelineView from "./TimelineView";
import LittleThingsView from "./LittleThingsView";
import MemoriesView from "./MemoriesView";
import BirthdayView from "./BirthdayView";
import SongView from "./SongView";
import LettersView from "./LettersView";
import { type ViewId } from "@/content/arooqtyContent";
import { lsGet, lsSet } from "@/lib/localStorage";
import { initMusicPreferences } from "@/lib/musicBox";

/* ————— each room's own way of arriving —————
   Every room used to share one plain fade-up. Now the
   wrapper itself carries a little of the room's
   personality: Home blooms softly out of the dark,
   Our Beginning rises like a story being picked up,
   Little Things lands with a playful tilt, Memories
   settles like paper laid on a board, Birthday warms
   its way in, Letters tips up like a page being turned
   toward her. Our Song keeps the quiet neutral fade —
   the cassette room arrives exactly as it always has.
   These variants touch only the wrapper; nothing
   inside any room — nothing locked — ever moves. */
const ROOM_ENTRANCE: Record<
  ViewId,
  {
    from: { opacity: number; y: number; scale: number; rotate: number };
    to: { opacity: number; y: number; scale: number; rotate: number };
    dur: number;
  }
> = {
  /* soft atmospheric reveal — the slowest, gentlest bloom */
  home: {
    from: { opacity: 0, y: 20, scale: 0.99, rotate: 0 },
    to: { opacity: 1, y: 0, scale: 1, rotate: 0 },
    dur: 0.62,
  },
  /* the story rises out of the page beneath it */
  beginning: {
    from: { opacity: 0, y: 30, scale: 0.997, rotate: 0 },
    to: { opacity: 1, y: 0, scale: 1, rotate: 0 },
    dur: 0.5,
  },
  /* playful — a small tilt that straightens as it lands */
  things: {
    from: { opacity: 0, y: 18, scale: 0.995, rotate: -1.2 },
    to: { opacity: 1, y: 0, scale: 1, rotate: 0 },
    dur: 0.52,
  },
  /* keepsakes settling onto the board from slightly above */
  memories: {
    from: { opacity: 0, y: 34, scale: 0.965, rotate: 0 },
    to: { opacity: 1, y: 0, scale: 1, rotate: 0 },
    dur: 0.62,
  },
  /* warm magical reveal — slower, swelling in */
  birthday: {
    from: { opacity: 0, y: 24, scale: 0.972, rotate: 0 },
    to: { opacity: 1, y: 0, scale: 1, rotate: 0 },
    dur: 0.68,
  },
  /* the locked room — the same quiet fade it has always had */
  song: {
    from: { opacity: 0, y: 14, scale: 0.995, rotate: 0 },
    to: { opacity: 1, y: 0, scale: 1, rotate: 0 },
    dur: 0.32,
  },
  /* a page tipping up toward her, like paper caught by a breath */
  letters: {
    from: { opacity: 0, y: 16, scale: 0.99, rotate: 0.8 },
    to: { opacity: 1, y: 0, scale: 1, rotate: 0 },
    dur: 0.56,
  },
};

/* ————— the two levels of ending —————
   The universe used to end every single room with the long
   goodbye letter, which made each page feel like it had the
   same ending. Now the ending breathes in two tiers:

   · every normal room closes with one small handwritten
     signature — "صنعته مخصوص لأروجتي ♡" — a mark, not a
     message. It never grows, never competes with the room
     it lives under, and stays visually tiny.

   · only the last room — Letters, chapter 7 of 7, the true
     end of the whole website — carries the long closing
     letter. The goodbye is kept for the goodbye. */
function SiteFooter({ view }: { view: ViewId }) {
  const { footer } = useContent();
  const { lang } = useLang();
  const reduce = useReducedMotion();

  const isFinalRoom = view === "letters";

  /* the closing letter, kept exactly where he broke the
     lines — paragraphs by blank line, lines within — so the
     last page of the universe reads like a letter, not a
     block of text. Each line arrives softly as she reaches
     the very end of the scroll. (The memo runs in every room
     — hooks cannot live behind the early return — but it is
     a tiny split, and it is what keeps the last page honest) */
  const paragraphs = useMemo(
    () => footer.closing.split("\n\n").map((p) => p.split("\n")),
    [footer.closing],
  );

  const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

  /* ——— the small signature ——— */
  if (!isFinalRoom) {
    return (
      <footer className="relative z-10 mt-auto px-6 pb-24 pt-4 text-center md:pb-8">
        <motion.p
          key={view}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: reduce ? 0.25 : 0.9, ease: [0.22, 1, 0.36, 1] }}
          className={
            lang === "en"
              ? "font-hand text-[1.2rem] leading-none text-rose/65"
              : "font-hand text-[1.08rem] leading-[1.9] text-rose/65"
          }
        >
          {footer.small}
        </motion.p>
      </footer>
    );
  }

  return (
    <footer className="relative z-10 mt-auto border-t border-rose/10 bg-paper/60 px-6 pb-28 pt-10 text-center md:pb-10">
      {/* a small ink flourish above the words */}
      <div
        aria-hidden
        className="mx-auto mb-7 flex w-40 items-center gap-2 opacity-70"
      >
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-burgundy/60" />
        <Heart
          className="h-2.5 w-2.5 shrink-0 text-burgundy/80"
          fill="currentColor"
          strokeWidth={0}
        />
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-burgundy/60" />
      </div>

      {/* the final closing — the answer to the question she
          never has to ask. The lines are variant children, so
          they only begin once the letter itself scrolls into
          view, one after another, like ink being written */}
      <motion.div
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-60px" }}
        variants={{
          hidden: {},
          show: {
            transition: {
              staggerChildren: reduce ? 0.02 : 0.16,
              delayChildren: reduce ? 0 : 0.15,
            },
          },
        }}
        className="mx-auto max-w-xl"
      >
        {paragraphs.map((lines, p) => (
          <div key={p} className={p > 0 ? "mt-5" : undefined}>
            {lines.map((line, i) => (
              <motion.p
                key={`${p}-${i}`}
                variants={{
                  hidden: reduce
                    ? { opacity: 0 }
                    : { opacity: 0, y: 9, filter: "blur(2px)" },
                  show: reduce
                    ? { opacity: 1 }
                    : { opacity: 1, y: 0, filter: "blur(0px)" },
                }}
                transition={{
                  duration: reduce ? 0.3 : 0.7,
                  ease: EASE,
                }}
                className={
                  lang === "en"
                    ? "font-hand text-[1.35rem] leading-[1.5] text-rose/85"
                    : "font-hand text-[1.3rem] leading-[1.95] text-rose/85"
                }
              >
                {line}
              </motion.p>
            ))}
          </div>
        ))}
      </motion.div>

      {/* the quiet signature — the very last mark of the place */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: reduce ? 0.2 : 0.8, delay: reduce ? 0 : 0.6 }}
        className="mt-8"
      >
        <p className="flex items-center justify-center gap-1.5 text-[10px] uppercase tracking-[0.28em] text-rose-soft/85">
          {footer.signature}
          <Heart
            className="h-3 w-3 text-burgundy"
            fill="currentColor"
            strokeWidth={0}
            aria-hidden
          />
        </p>
      </motion.div>
    </footer>
  );
}

function UniverseShell() {
  const [unlocked, setUnlocked] = useState(false);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState<ViewId>("home");
  const [pendingMemory, setPendingMemory] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const { content } = useLang();

  /* the boot veil — one breath of a closed scrapbook. It
     stays only as long as the first paint needs to settle
     (a little less if she asks the web for stillness), and
     it can never get stuck: one timer, always cleared, and
     the covers part the moment it fires. The gate (or the
     rooms, if she is already unlocked) mount underneath
     while the covers are still moving, so what she meets
     when the book opens is a page already waking up */
  const [veilGone, setVeilGone] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setVeilGone(true), reduce ? 450 : 1150);
    return () => window.clearTimeout(t);
  }, [reduce]);

  useEffect(() => {
    initMusicPreferences();
    // remember the last visit, gently
    const last = lsGet<number | null>("lastVisit", null);
    lsSet("lastVisitGap", last ? Math.floor((Date.now() - last) / 86_400_000) : -1);
    lsSet("lastVisit", Date.now());
    // the visit keepsake — one quiet mark per distinct day (her timezone)
    try {
      const today = new Intl.DateTimeFormat("en-CA", {
        timeZone: content.relationship.timezone,
      }).format(new Date()); // YYYY-MM-DD
      const days = lsGet<string[]>("visitDays", []);
      if (!days.includes(today)) {
        days.push(today);
        if (days.length > 400) days.splice(0, days.length - 400);
        lsSet("visitDays", days);
      }
    } catch {
      // Intl quirks — the keepsake stays quiet rather than loud
    }
    // hydration-safe unlock check, deferred past first paint
    const t = window.setTimeout(() => {
      if (lsGet("unlocked", false)) setUnlocked(true);
      setReady(true);
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  const navigate = useCallback((next: ViewId, memoryId?: string) => {
    setView(next);
    setPendingMemory(memoryId ?? null);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, []);

  if (!ready) {
    return <div className="fixed inset-0 bg-[#170810]" aria-hidden />;
  }

  return (
    <div
      dir="rtl"
      lang="ar"
      className="flex min-h-svh flex-col bg-paper text-foreground"
    >
      {/* the scrapbook opening — the closed cover that parts */}
      <AnimatePresence>{!veilGone && <BootVeil key="boot" />}</AnimatePresence>

      {veilGone &&
        (!unlocked ? (
          <AnimatePresence mode="wait">
            <EntranceGate key="gate" onUnlocked={() => setUnlocked(true)} />
          </AnimatePresence>
        ) : (
          <>
          {/* the ambient breath — a few near-invisible specks
              rising through the dark of every room. First in
              the tree on purpose: behind all content, above
              only the paper itself. It never touches a pointer */}
          <AmbientSpecks />
          {/* the composition layer — the large faint scrapbook
              marks and ink atmosphere that make the empty space
              of every page feel decorated. Fixed behind all
              content, crossfading softly between rooms */}
          <ScrapbookBackdrop view={view} />
          <TopNav view={view} onNavigate={navigate} />
          <main
            className="relative mx-auto w-full max-w-3xl flex-1 px-5 pb-28 pt-1 sm:px-8 md:pb-20 md:pt-4"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                /* keyed by room only — the page-turn belongs to
                   navigation. Every room reads its words through
                   useContent(), so the Arabic page simply is the
                   page — and nothing she was mid-way through (a
                   game, a drawer, the candles, her place on the
                   page) is ever reset */
                key={view}
                initial={
                  reduce
                    ? { opacity: 0 }
                    : { ...ROOM_ENTRANCE[view].from }
                }
                animate={{ ...ROOM_ENTRANCE[view].to }}
                exit={{ opacity: 0, y: reduce ? 0 : -10, scale: reduce ? 1 : 0.997 }}
                transition={{
                  duration: reduce ? 0 : ROOM_ENTRANCE[view].dur,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="w-full"
              >
                {view === "home" && <HomeView onNavigate={navigate} />}
                {view === "beginning" && <TimelineView onNavigate={navigate} />}
                {view === "things" && <LittleThingsView onNavigate={navigate} />}
                {view === "memories" && (
                  <MemoriesView
                    onNavigate={navigate}
                    pendingMemory={pendingMemory}
                    onPendingConsumed={() => setPendingMemory(null)}
                  />
                )}
                {view === "birthday" && <BirthdayView onNavigate={navigate} />}
                {view === "song" && <SongView onNavigate={navigate} />}
                {view === "letters" && <LettersView onNavigate={navigate} />}
              </motion.div>
            </AnimatePresence>
          </main>
          <SiteFooter view={view} />
          <BottomNav view={view} onNavigate={navigate} />
          {/* the site song's little scrap — above every room, so
              the soundtrack follows her without ever starting
              over. It is not part of any room's markup on
              purpose: navigation must never touch it */}
          <SiteSongDock />
          </>
        ))}
    </div>
  );
}

export default function UniverseApp() {
  return (
    <LangProvider>
      <UniverseShell />
    </LangProvider>
  );
}
