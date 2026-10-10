/* ————————————————————————————————————————————————
   Aroogty's Little Universe — central content file.

   The copy itself lives in copyCore.ts / copyMore.ts as a
   bilingual master: every line written twice, { en, ar }.
   This module resolves it into a plain, fully-typed content
   object for the active language — components read it via
   useContent(), so both languages feel like one carefully
   written website, never a translation layer.

   To edit the words: open copyCore.ts / copyMore.ts.
———————————————————————————————————————————————— */

import type { Bi, Lang } from "./bi";
import * as core from "./copyCore";
import * as more from "./copyMore";

/* ————— the seven rooms of this universe ————— */
export type ViewId =
  | "home"
  | "beginning"
  | "things"
  | "memories"
  | "birthday"
  | "song"
  | "letters";

/* ————— deep resolution: { en, ar } → string, everything else kept ————— */

type Resolved<T> = T extends Bi
  ? string
  : T extends Array<infer U>
    ? Resolved<U>[]
    : T extends object
      ? { [K in keyof T]: Resolved<T[K]> }
      : T;

function isBi(node: unknown): node is Bi {
  return (
    !!node &&
    typeof node === "object" &&
    typeof (node as Record<string, unknown>).en === "string" &&
    typeof (node as Record<string, unknown>).ar === "string"
  );
}

function resolveBi(node: unknown, lang: Lang): unknown {
  if (typeof node === "string" || typeof node === "number") return node;
  if (isBi(node)) return node[lang];
  if (Array.isArray(node)) return node.map((n) => resolveBi(n, lang));
  if (node && typeof node === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node)) out[k] = resolveBi(v, lang);
    return out;
  }
  return node;
}

/* ————— the bilingual master, assembled ————— */
const CONTENT_RAW = {
  gate: core.gate,
  identity: core.identity,
  relationship: core.relationship,
  doorframe: core.doorframe,
  timelineMoments: core.timelineMoments,
  littleThings: core.littleThings,
  littleThingsAllFound: core.littleThingsAllFound,
  memories: core.memories,
  realPhotos: core.realPhotos,
  homePreview: core.homePreview,
  birthday: core.birthday,
  footer: core.footer,
  song: core.song,
  ui: core.ui,

  mainLetter: more.mainLetter,
  sealedLetterLabels: more.sealedLetterLabels,
  sealedLetters: more.sealedLetters,
  dailyTouch: more.dailyTouch,
  soonCard: more.soonCard,
  moonCard: more.moonCard,
  visitKeepsake: more.visitKeepsake,
  birthdayToday: more.birthdayToday,
  chapterNav: more.chapterNav,
  playLittle: more.playLittle,
  quizHiddenLetter: more.quizHiddenLetter,
  whispers: more.whispers,
  starMap: more.starMap,
  coupons: more.coupons,
  heartConstellation: more.heartConstellation,
  todaysNudge: more.todaysNudge,
  timeCapsule: more.timeCapsule,
  herPage: more.herPage,
  postcard: more.postcard,
  mixtape: more.mixtape,
  ticketStubs: more.ticketStubs,
};

/** the whole universe of copy, resolved for one language */
export type Content = Resolved<typeof CONTENT_RAW>;

/** resolve the bilingual master into one language */
export function getContent(lang: Lang): Content {
  return resolveBi(CONTENT_RAW, lang) as Content;
}

/** the two languages this universe speaks */
export type { Lang, Bi };

/* ————— resolved types, derived from the master ————— */
export type TimelineMoment = Content["timelineMoments"][number];
export type LittleThing = Content["littleThings"][number];
export type LittleThingObject = Content["littleThings"][number]["object"];
export type MemoryItem = Content["memories"][number];
export type MemoryKind = Content["memories"][number]["kind"];
export type ChatBubble = NonNullable<Content["memories"][number]["chat"]>[number];
export type SealedLetter = Content["sealedLetters"][number];
export type SoonDate = Content["soonCard"]["dates"][number];
export type QuizOption = Content["playLittle"]["quiz"]["questions"][number]["options"][number];
export type QuizQuestion = Content["playLittle"]["quiz"]["questions"][number];
export type MatchCard = Content["playLittle"]["match"]["pairs"][number]["a"];
export type MatchPair = Content["playLittle"]["match"]["pairs"][number];
export type Coupon = Content["coupons"]["list"][number];
export type MixtapeSong = Content["mixtape"]["songs"][number];
export type TicketStubFilm = Content["ticketStubs"]["films"][number];
export type ConstellationHeart = Content["heartConstellation"]["hearts"][number];
export type TodaysNudge = Content["todaysNudge"]["prompts"][number];

/* ————— her own, device-local data shapes (never bilingual — they're hers) ————— */
export interface HerNote {
  id: string;
  text: string;
  /** epoch ms — the moment she kept the line */
  at: number;
}

export interface TimeCapsuleNote {
  id: string;
  text: string;
  /** epoch ms — when she sealed it */
  writtenAt: number;
  /** epoch ms — the first moment it may be unsealed */
  openAt: number;
  /** epoch ms — set once she has broken the seal (null while sealed) */
  openedAt: number | null;
}
