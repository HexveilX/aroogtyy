import { NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";

/* ————————————————————————————————————————————————
   POST /api/postcard
   Body: { dayKey: string, seed: number }
   Returns: { body: string, source: "llm" | "fallback" }

   Generates a fresh one-line postcard in the burgundy
   ink voice of the site. The model is told to write
   in the same soft register as the rest of this place,
   without mentioning itself, without meta-comment, and
   short (2–3 sentences, ~50–80 words).

   The dayKey is the Cairo-tz date "YYYY-MM-DD" the
   caller already computed. It's used only as a soft
   signal so the same calendar day can be deduplicated
   on the client side.

   The seed rotates a small "mood" hint so that, on
   days she asks for another, the postcard doesn't
   read the same as the first. The 5 mood labels are
   soft, late, weather, ordinary, hopeful — same as
   the spirit of the rest of the site.
—————————————————————————————————————————————— */

export const runtime = "nodejs";

const MOODS = [
  "soft — a quiet hour, ordinary and tender",
  "late — past midnight, the room almost dark",
  "weather — somewhere with rain or wind outside",
  "ordinary — a slow tuesday in the middle of the year",
  "hopeful — early, before anything has happened yet",
] as const;

function pickMood(seed: number): (typeof MOODS)[number] {
  const i = Math.abs(Math.floor(seed)) % MOODS.length;
  return MOODS[i];
}

/* the day the story started — 19 May 2026 — used
   to count whole months for the little anniversary
   mood. Kept in one place, matching content. */
const STORY_START = { year: 2026, month: 5 }; // 1-based month
const HER_BIRTHDAY = { month: 9, day: 18 }; // 18 September

/* date-aware mood override — returns null on ordinary
   days, letting the seed rotation drive. Her birthday,
   the night before it, and every 19th (a monthly
   anniversary) each carry their own mood. */
function dateAwareMood(dayKey: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dayKey);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  const day = Number(m[3]);

  if (month === HER_BIRTHDAY.month && day === HER_BIRTHDAY.day) {
    return "her birthday itself — she is a year older today; the postcard should quietly celebrate her, hold cake and candles and the small traditions of her, without singing and without saying the number";
  }
  if (month === HER_BIRTHDAY.month && day === HER_BIRTHDAY.day - 1) {
    return "the night before her birthday — the last evening of the age she is leaving; write about that specific, slightly golden kind of waiting";
  }
  if (day === 19) {
    const months =
      (year - STORY_START.year) * 12 + (month - STORY_START.month);
    if (months >= 1 && months <= 96) {
      return `a small monthly anniversary — ${months} whole month${months > 1 ? "s" : ""} of them, as of today; mark it lightly, the way a doorframe in pencil does, without counting out loud too much`;
    }
  }
  return null;
}

const SYSTEM_PROMPT = [
  "You are the writer of a private romantic keepsake website called 'Aroogty's Little Universe'.",
  "The site is built for one reader, Aroogty, by the person who loves her.",
  "Every line on the rest of the site is short, quiet, slightly self-aware, and genuinely tender — never saccharine, never grand.",
  "You are writing a single postcard — once a day, in the voice of that writer.",
  "Constraints:",
  "  - 2 to 3 sentences, total length between 45 and 90 words.",
  "  - First person, present tense, addressed to 'you' (her).",
  "  - Reference small concrete things (a cup, a window, the dark, an hour) — never abstractions like 'forever' or 'eternity'.",
  "  - Do NOT reference yourself as an AI, a model, a machine, or the website.",
  "  - Do NOT mention 'burgundy ink', 'cream paper', or describe your own writing.",
  "  - Do NOT use quotation marks, headings, or em dashes at the very start.",
  "  - Sign off implicitly (no signature line — the website adds it).",
  "  - The mood of the postcard is set by the user; honor it without restating it.",
  "  - End the postcard on a small, quiet beat — a concrete image, not a declaration.",
].join("\n");

export async function POST(req: Request) {
  let dayKey = "";
  let seed = 0;
  try {
    const body = await req.json();
    if (typeof body?.dayKey === "string") dayKey = body.dayKey;
    if (typeof body?.seed === "number" && Number.isFinite(body.seed))
      seed = body.seed;
  } catch {
    /* empty or invalid body — proceed with defaults */
  }

  const mood = dateAwareMood(dayKey) ?? pickMood(seed);
  const userPrompt = [
    `Today's mood for the postcard: ${mood}.`,
    dayKey
      ? `Today's calendar key (for your own grounding only, do not print it): ${dayKey}.`
      : "Today's calendar key: unknown — write generally.",
    "Write the postcard now. Only the postcard body — no greeting, no sign-off, no label.",
  ].join("\n");

  try {
    const zai = await ZAI.create();
    /* race the model against a hard timeout — a slow or
       stuck call falls through to the curated fallback
       line instead of keeping her waiting indefinitely */
    const LLM_TIMEOUT_MS = 11_000;
    const completion = await Promise.race([
      zai.chat.completions.create({
        messages: [
          { role: "assistant", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        thinking: { type: "disabled" },
        temperature: 0.85,
      }),
      new Promise<never>((_, reject) => {
        const t = setTimeout(
          () => reject(new Error("postcard timeout")),
          LLM_TIMEOUT_MS
        );
        // if the model wins the race, release the timer
        // so the runtime isn't held open needlessly
        if (typeof t.unref === "function") t.unref();
      }),
    ]);

    let text = (completion?.choices?.[0]?.message?.content ?? "").trim();

    // tidy: drop wrapping quotes if the model added them, collapse
    // any leading "Dear Aroogty," / "Hi," style preface, drop a
    // trailing signature line that starts with "—"
    text = text.replace(/^["'“”]+|["'“”]+$/g, "");
    text = text.replace(
      /^(dear\s+\w+|hi\s+\w+|hello,?\s*\w*)[\s,,:]+/i,
      ""
    );
    // strip any trailing signature block starting with an em-dash
    // (handled without the /s flag so older targets can compile)
    const emMatch = text.match(/\n+\s*—\s*/);
    if (emMatch && typeof emMatch.index === "number") {
      text = text.slice(0, emMatch.index);
    }
    text = text.trim();

    // gentle length guard — if it ran very long, truncate at the
    // last full sentence under ~110 words; if very short, accept it.
    const words = text.split(/\s+/).filter(Boolean);
    if (words.length > 110) {
      let cut = words.slice(0, 110).join(" ");
      const lastStop = Math.max(
        cut.lastIndexOf("."),
        cut.lastIndexOf("!"),
        cut.lastIndexOf("?")
      );
      if (lastStop > 40) cut = cut.slice(0, lastStop + 1);
      text = cut;
    }

    if (!text) throw new Error("empty completion");

    return NextResponse.json({ body: text, source: "llm" });
  } catch {
    // never reveal the failure to the site's voice — return a
    // curated fallback line. The client also has its own fallback
    // list, but returning one here keeps the wire format identical.
    const fallbacks = [
      "Tonight the room is quiet and so am I, and somehow both of those things are because of you. Hello, from wherever I am right now.",
      "Wherever you're reading this — I hope the light is warm there. I'm writing to you from a different hour, and it's still your name I keep coming back to.",
      "Small thing, written late: today I noticed the exact shade of the sky I always think of when I think of you. So it was a good day, by definition.",
      "From later, with love: I'm still the same person who built you this little place. The ink hasn't dried yet on this one.",
      "If you're holding the phone too close to your face right now, that's very on-brand for you. Hello, my love. From wherever I am.",
      "Tonight's small thing: I missed you on purpose, on schedule, and with great care. From later, with love.",
    ];
    const pick = fallbacks[Math.abs(seed) % fallbacks.length];
    return NextResponse.json({ body: pick, source: "fallback" });
  }
}
