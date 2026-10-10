/* ————————————————————————————————————————————————
   The bilingual foundation.
   Every piece of copy in this universe exists in two
   carefully written versions — English and Egyptian
   Arabic — kept side by side, like one thought in
   two languages.
———————————————————————————————————————————————— */

export type Lang = "en" | "ar";

/** one line, two lives */
export interface Bi {
  en: string;
  ar: string;
}

/** tiny helper so the copy files read like a conversation, not JSON */
export function bi(en: string, ar: string): Bi {
  return { en, ar };
}
