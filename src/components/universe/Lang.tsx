"use client";

/* ————————————————————————————————————————————————
   The language of this little universe.

   It speaks Arabic — Egyptian, warm, handwritten. The
   interface, the buttons, the instructions, every
   complete sentence lives in Arabic now, and the whole
   page turns with it: dir="rtl", Arabic reading fonts,
   Arabic rhythm.

   A few things deliberately stay in elegant English and
   keep their left-to-right order inside the Arabic page —
   her name "Aroogty", song titles and artists, dates like
   19 May 2026, the counter's numbers and units, archival
   labels like SIDE A / ADMIT TWO / NO. 01. Those are
   visual objects, not sentences: they are isolated with
   dir="ltr" wherever they appear, so RTL never reverses
   them. English and Arabic never share one sentence.
———————————————————————————————————————————————— */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getContent, type Content, type Lang } from "@/content/arooqtyContent";
import { lsSet } from "@/lib/localStorage";

interface LangState {
  /** the language this universe speaks — always Arabic */
  lang: Lang;
  /** true — the universe is speaking Arabic */
  isArabic: boolean;
  /** the whole universe of copy, written in Arabic */
  content: Content;
}

const LangContext = createContext<LangState | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  // one language, one voice — no choice to remember
  const [lang] = useState<Lang>("ar");

  /* the document itself is an Arabic page — not just the
     app shell. Radix portals (dialogs) mount at <body>,
     outside any inner dir wrapper, so the direction lives
     on <html>. layout.tsx already renders <html lang="ar"
     dir="rtl"> server-side; this keeps it true client-side
     forever, and retires any language choice her device
     may still remember from an older visit. */
  useEffect(() => {
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
    lsSet("lang", "ar");
  }, []);

  const content = useMemo(() => getContent(lang), [lang]);

  const value = useMemo<LangState>(
    () => ({ lang, isArabic: true, content }),
    [lang, content],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangState {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used inside <LangProvider>");
  return ctx;
}

/** every word on the site, in the language it speaks */
export function useContent(): Content {
  return useLang().content;
}
