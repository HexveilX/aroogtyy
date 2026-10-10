"use client";

/* ————————————————————————————————————————————————
   The language of Aroogty's Little Universe.

   Two carefully written versions of the same website:
   English and Egyptian Arabic — never a machine
   translation of either. The provider keeps the chosen
   language on her device, turns the document truly
   RTL when Arabic is speaking, and hands every
   component its bundle through useT().
———————————————————————————————————————————————— */

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as en from "@/content/arooqtyContent";
import * as ar from "@/content/arooqtyContent.ar";
import { lsGet, lsSet } from "@/lib/localStorage";

export type Lang = "en" | "ar";

/** the full shape of one language's copy (English is the source of truth) */
export type ContentBundle = typeof en;

const CONTENT: Record<Lang, ContentBundle> = { en, ar };

interface LanguageContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggle: () => void;
  /** the active language's complete copy bundle */
  t: ContentBundle;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  /* remember the language, gently — hydrated past first paint.
     The blank first frame (and the gate's slow entrance) keep
     the swap invisible; the choice then persists on her device. */
  useEffect(() => {
    const t = window.setTimeout(() => {
      const saved = lsGet<Lang | null>("lang", null);
      if (saved === "ar" || saved === "en") setLangState(saved);
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  /* the document follows the language: real RTL, real lang,
     and a data-lang hook for the Arabic-mode typography */
  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    root.dataset.lang = lang;
  }, [lang]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang: (l: Lang) => {
        setLangState(l);
        lsSet("lang", l);
      },
      toggle: () => {
        const next: Lang = lang === "en" ? "ar" : "en";
        setLangState(next);
        lsSet("lang", next);
      },
      t: CONTENT[lang],
    }),
    [lang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLang must be used inside <LanguageProvider>");
  }
  return ctx;
}

/** the active language's copy — `const t = useT()` */
export function useT(): ContentBundle {
  return useLang().t;
}
