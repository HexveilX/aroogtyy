/* ————————————————————————————————————————————————
   tiny Arabic-script detection, so bilingual copy can
   flow correctly: Egyptian Arabic lines get RTL +
   the Arabic identity font (Aref Ruqaa), while every
   English line keeps its current typography.
———————————————————————————————————————————————— */

/** true when the text contains Arabic-script characters */
export function isArabic(text: string): boolean {
  return /[\u0600-\u06FF]/.test(text);
}
