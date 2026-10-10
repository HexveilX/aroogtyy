"use client";

/* ————————————————————————————————————————————————
   a page for you — the one page in this universe
   that belongs to her. A small notebook to write
   back: kept lines, kept dates, kept only on her
   own device. His letters fill the rest of this
   room; this corner is hers.
———————————————————————————————————————————————— */

import { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Camera, Check, PenLine, X } from "lucide-react";
import type { Content, HerNote } from "@/content/arooqtyContent";
import { useContent } from "./Lang";
import { isArabic } from "@/lib/isArabic";
import { lsGet, lsSet } from "@/lib/localStorage";
import { Reveal, TapeStrip } from "./Shared";
import { cn } from "@/lib/utils";

/* her timezone, quietly respected */
function noteDate(at: number, timezone: string): string {
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

/* same date, but safe for a filename (2026-08-30) */
function noteDateSlug(at: number, timezone: string): string {
  try {
    return new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
    }).format(new Date(at));
  } catch {
    return new Date(at).toISOString().slice(0, 10);
  }
}

/* ——— keep one of her lines as a little picture ———
   drawn on a canvas, saved on her device, never
   uploaded anywhere. The picture is hers to show
   him in person (or send, if she decides to). */
function cssFamily(varName: string, fallback: string): string {
  try {
    /* next/font declares its variables on <body> in this project */
    const fromBody = getComputedStyle(document.body)
      .getPropertyValue(varName)
      .trim();
    if (fromBody) return fromBody;
    const fromRoot = getComputedStyle(document.documentElement)
      .getPropertyValue(varName)
      .trim();
    return fromRoot || fallback;
  } catch {
    return fallback;
  }
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const out: string[] = [];
  for (const para of text.split("\n")) {
    let line = "";
    for (const word of para.split(/\s+/).filter(Boolean)) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        out.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    out.push(line);
  }
  return out;
}

function drawHeart(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string
) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy + size * 0.32);
  ctx.bezierCurveTo(
    cx - size * 0.5, cy - size * 0.28,
    cx - size * 0.98, cy + size * 0.22,
    cx, cy + size * 0.85
  );
  ctx.bezierCurveTo(
    cx + size * 0.98, cy + size * 0.22,
    cx + size * 0.5, cy - size * 0.28,
    cx, cy + size * 0.32
  );
  ctx.fill();
  ctx.restore();
}

async function renderNotePicture(
  note: HerNote,
  cfg: Content["herPage"],
  timezone: string
): Promise<void> {
  const W = 1080;
  const H = 1440;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const hand = cssFamily("--font-caveat", "cursive");
  const body = cssFamily("--font-lora", "Georgia, serif");
  /* the picture's Arabic voice — Amiri reads, Aref Ruqaa signs
     (canvas cannot follow the page's dir=rtl font swap, so the
     right family is chosen per drawn line instead) */
  const amiri = cssFamily("--font-amiri", "serif").replace(/['"]/g, "");
  const aref = cssFamily("--font-aref", "serif").replace(/['"]/g, "");
  /* which lines are in Arabic tonight */
  const noteAr = isArabic(note.text);
  const overlineAr = isArabic(cfg.imageOverline);
  const footerAr = isArabic(cfg.imageFooter);
  const noteFont = noteAr ? amiri : hand;
  const overlineFont = overlineAr ? amiri : body;
  const footerFont = footerAr ? aref : hand;

  /* make sure the handwriting has actually loaded before we ink it */
  try {
    await Promise.all([
      document.fonts.load(`64px ${hand}`, "for you"),
      document.fonts.load(`26px ${body}`, "A PAGE"),
      /* the Arabic voices, warm and ready when a line is in Arabic */
      ...(noteAr ? [document.fonts.load(`64px ${noteFont}`, note.text)] : []),
      ...(overlineAr ? [document.fonts.load(`26px ${overlineFont}`, cfg.imageOverline)] : []),
      ...(footerAr ? [document.fonts.load(`44px ${footerFont}`, cfg.imageFooter)] : []),
    ]);
  } catch {
    /* the browser will fall back to something warm enough */
  }

  /* the paper */
  ctx.fillStyle = "#F8F4F1";
  ctx.fillRect(0, 0, W, H);

  /* a faint vignette, like a photo taken in warm light */
  const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.32, W / 2, H / 2, H * 0.78);
  vg.addColorStop(0, "rgba(13,10,11,0)");
  vg.addColorStop(1, "rgba(13,10,11,0.05)");
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, W, H);

  /* the frame — two hairlines and a small heart riding the top one */
  ctx.strokeStyle = "rgba(101,28,45,0.30)";
  ctx.lineWidth = 2.5;
  ctx.strokeRect(48, 48, W - 96, H - 96);
  ctx.strokeStyle = "rgba(101,28,45,0.16)";
  ctx.lineWidth = 1;
  ctx.strokeRect(60, 60, W - 120, H - 120);
  drawHeart(ctx, W / 2, 48, 26, "#651C2D");
  drawHeart(ctx, W / 2, 41, 26, "#F8F4F1");

  /* the overline */
  ctx.textAlign = "center";
  const spaced = ctx as CanvasRenderingContext2D & { letterSpacing?: string };
  ctx.direction = overlineAr ? "rtl" : "ltr";
  if ("letterSpacing" in ctx) spaced.letterSpacing = overlineAr ? "0px" : "9px";
  ctx.fillStyle = "#8a4a5c";
  ctx.font = `26px ${overlineFont}`;
  ctx.fillText(cfg.imageOverline, W / 2, 168);
  if ("letterSpacing" in ctx) spaced.letterSpacing = "0px";

  /* a small divider */
  ctx.strokeStyle = "rgba(138,74,92,0.30)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 34, 206);
  ctx.lineTo(W / 2 + 34, 206);
  ctx.stroke();

  /* her line — auto-sized so even a long thought fits the page */
  const maxWidth = W - 260;
  let fontSize = 64;
  let lines: string[] = [];
  for (; fontSize >= 34; fontSize -= 4) {
    ctx.font = `${fontSize}px ${noteFont}`;
    lines = wrapLines(ctx, note.text, maxWidth);
    if (lines.length * fontSize * 1.38 <= 640) break;
  }
  const lineH = fontSize * 1.38;
  const startY = 330;
  ctx.fillStyle = "#241a1e";
  ctx.font = `${fontSize}px ${noteFont}`;
  ctx.direction = noteAr ? "rtl" : "ltr";
  lines.forEach((ln, i) => ctx.fillText(ln, W / 2, startY + i * lineH));

  /* a small heart under her words */
  const afterText = startY + lines.length * lineH + 46;
  drawHeart(ctx, W / 2, afterText, 30, "#651C2D");

  /* the date she wrote it */
  const dateLabel = cfg.noteLabel
    .replace("{date}", noteDate(note.at, timezone))
    .toUpperCase();
  const labelAr = isArabic(dateLabel);
  ctx.direction = labelAr ? "rtl" : "ltr";
  if ("letterSpacing" in ctx) spaced.letterSpacing = labelAr ? "0px" : "6px";
  ctx.fillStyle = "rgba(138,74,92,0.85)";
  ctx.font = `23px ${labelAr ? amiri : body}`;
  ctx.fillText(dateLabel, W / 2, afterText + 108);
  if ("letterSpacing" in ctx) spaced.letterSpacing = "0px";

  /* the footer — the same line that closes every page here */
  ctx.fillStyle = "#651C2D";
  ctx.font = `44px ${footerFont}`;
  ctx.direction = footerAr ? "rtl" : "ltr";
  ctx.fillText(cfg.imageFooter, W / 2, H - 132);

  /* save it — everything stays on this device */
  const link = document.createElement("a");
  link.download = `a-line-from-her-page-${noteDateSlug(note.at, timezone)}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

export default function HerPage() {
  const reduce = useReducedMotion();
  const { herPage: cfg, relationship } = useContent();
  const [notes, setNotes] = useState<HerNote[]>(() =>
    lsGet<HerNote[]>("herNotes", [])
  );
  const [draft, setDraft] = useState("");
  const [justKept, setJustKept] = useState(false);
  const [savedImageId, setSavedImageId] = useState<string | null>(null);
  const keptTimer = useRef<number | null>(null);
  const imageTimer = useRef<number | null>(null);

  const keep = () => {
    const text = draft.trim();
    if (!text) return;
    const next = [{ id: `${Date.now()}`, text, at: Date.now() }, ...notes];
    /* if the notebook is full, the oldest line steps aside first */
    if (next.length > cfg.maxNotes) next.length = cfg.maxNotes;
    setNotes(next);
    lsSet("herNotes", next);
    setDraft("");
    setJustKept(true);
    if (keptTimer.current) window.clearTimeout(keptTimer.current);
    keptTimer.current = window.setTimeout(() => setJustKept(false), 1800);
  };

  const remove = (id: string) => {
    const next = notes.filter((n) => n.id !== id);
    setNotes(next);
    lsSet("herNotes", next);
  };

  const keepAsImage = useCallback(
    (note: HerNote) => {
      void renderNotePicture(note, cfg, relationship.timezone).then(() => {
        setSavedImageId(note.id);
        if (imageTimer.current) window.clearTimeout(imageTimer.current);
        imageTimer.current = window.setTimeout(
          () => setSavedImageId(null),
          1600
        );
      });
    },
    [cfg, relationship.timezone]
  );

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

      {/* the notebook itself */}
      <Reveal className="mt-8" delay={0.06}>
        <div className="relative rotate-[0.3deg] rounded-lg bg-cream pb-7 ps-12 pe-6 pt-8 polaroid-shadow sm:ps-14">
          <TapeStrip className="-top-3 left-1/2 w-16 -translate-x-1/2 -rotate-2" />

          {/* a bookmark ribbon — the page she'll come back to */}
          <div
            aria-hidden
            className="absolute -top-1 end-10 sm:end-14"
            style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.22))" }}
          >
            <div
              className="h-14 w-5 bg-burgundy"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 76%, 0 100%)",
              }}
            >
              <div className="h-4 w-full bg-[#7d2c3f]/60" />
            </div>
          </div>

          {/* spiral binding — punched holes down the start edge */}
          <div
            aria-hidden
            className="absolute bottom-7 start-4 flex flex-col justify-between top-8"
          >
            {Array.from({ length: 7 }).map((_, i) => (
              <span
                key={i}
                className="h-2 w-2 rounded-full bg-[#1c0e15]/85 shadow-[inset_0_1px_2px_rgba(0,0,0,0.55)]"
              />
            ))}
          </div>
          {/* the red margin line, the way real notebooks keep them */}
          <div
            aria-hidden
            className="absolute bottom-7 start-9 top-8 w-px bg-[#B77C8D]/30 sm:start-10"
          />
          {/* a tiny corner-fold, bottom-end — a page that's been turned */}
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-0 end-0 h-4 w-4 rounded-bl-[100%] rtl:rounded-br-[100%] rtl:rounded-bl-none"
            style={{
              background:
                "linear-gradient(135deg, transparent 49%, rgba(101,28,45,0.16) 50%, rgba(101,28,45,0.07) 100%)",
            }}
          />

          {/* the writing area — ruled lines behind her handwriting */}
          <textarea
            dir="auto"
            value={draft}
            onChange={(e) => setDraft(e.target.value.slice(0, cfg.maxChars))}
            placeholder={cfg.placeholder}
            aria-label={cfg.inputLabel}
            rows={3}
            className="w-full resize-none bg-transparent font-hand text-[1.3rem] text-ink placeholder:text-ink-soft/35 focus:outline-none"
            style={{
              lineHeight: "34px",
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent 0, transparent 33px, rgba(101,28,45,0.13) 33px, rgba(101,28,45,0.13) 34px)",
            }}
          />

          {/* save row — counter left, keep-button right */}
          <div className="mt-2 flex items-center justify-between gap-3">
            <p
              aria-hidden
              className="text-[10px] tabular-digits tracking-wider text-ink-soft/45"
            >
              {draft.length}/{cfg.maxChars}
            </p>
            <motion.button
              onClick={keep}
              disabled={!draft.trim()}
              whileTap={reduce || !draft.trim() ? undefined : { scale: 0.96 }}
              aria-label={cfg.saveLabel}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[#8a4a5c]/35 px-5 py-1.5 text-[11px] uppercase tracking-[0.2em] text-[#651C2D] transition-all duration-300 hover:border-[#651C2D]/60 hover:bg-[#651C2D]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#651C2D]/40 disabled:cursor-default disabled:opacity-35"
            >
              <PenLine className="h-3.5 w-3.5" strokeWidth={1.8} aria-hidden />
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={justKept ? "kept" : "keep"}
                  initial={{ opacity: 0, y: reduce ? 0 : 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduce ? 0 : -4 }}
                  transition={{ duration: reduce ? 0 : 0.25 }}
                >
                  {justKept ? cfg.savedLabel : cfg.saveLabel}
                </motion.span>
              </AnimatePresence>
            </motion.button>
          </div>

          {/* her kept lines */}
          {notes.length > 0 ? (
            <div
              role="list"
              aria-label={cfg.listAria}
              className="mt-6 max-h-80 space-y-3 overflow-y-auto pe-1"
            >
              <AnimatePresence initial={false}>
                {notes.map((n) => (
                  <motion.div
                    key={n.id}
                    role="listitem"
                    layout
                    initial={{ opacity: 0, y: reduce ? 0 : -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: reduce ? 0 : 0.35 }}
                    className="group relative rounded-md bg-[#f3ebe6] px-4 py-3 ring-1 ring-[#8a4a5c]/15"
                  >
                    <p
                      dir={isArabic(n.text) ? "rtl" : "ltr"}
                      className={cn(
                        "whitespace-pre-wrap pe-16 text-ink",
                        isArabic(n.text)
                          ? "font-arabic text-[1.3rem] leading-relaxed"
                          : "font-hand text-[1.15rem] leading-snug"
                      )}
                    >
                      {n.text}
                    </p>
                    <p className="mt-1.5 text-[9px] uppercase tracking-[0.22em] text-[#8a4a5c]/65">
                      {cfg.noteLabel.replace("{date}", noteDate(n.at, relationship.timezone))}
                    </p>
                    {/* keep as a little picture — hers to show him, if she ever wants */}
                    <button
                      onClick={() => keepAsImage(n)}
                      aria-label={cfg.keepAsImageLabel}
                      title={cfg.keepAsImageLabel}
                      className="absolute end-8 top-1 rounded-full p-2 text-[#8a4a5c]/45 transition-colors duration-200 hover:text-[#651C2D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#651C2D]/40 opacity-70 sm:opacity-0 sm:group-hover:opacity-70 sm:focus-visible:opacity-70"
                    >
                      {savedImageId === n.id ? (
                        <Check
                          className="h-3.5 w-3.5 text-[#651C2D]"
                          strokeWidth={2.2}
                          aria-hidden
                        />
                      ) : (
                        <Camera className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                      )}
                    </button>
                    {/* remove — visible on touch always, on hover/focus elsewhere */}
                    <button
                      onClick={() => remove(n.id)}
                      aria-label={cfg.removeLabel}
                      className="absolute end-1.5 top-1.5 rounded-full p-2 text-[#8a4a5c]/45 transition-colors duration-200 hover:text-[#651C2D] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#651C2D]/40 opacity-70 sm:opacity-0 sm:group-hover:opacity-70 sm:focus-visible:opacity-70"
                    >
                      <X className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <p className="mt-6 text-center font-hand text-lg text-ink-soft/45">
              {cfg.emptyLine}
            </p>
          )}
        </div>
      </Reveal>

      {/* the tiny privacy promise */}
      <Reveal className="mt-5 text-center" delay={0.1}>
        <p className="mx-auto max-w-xs font-hand text-base leading-relaxed text-rose-soft/80">
          {cfg.privateLine}
        </p>
      </Reveal>
    </section>
  );
}
