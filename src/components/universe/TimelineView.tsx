"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, Heart } from "lucide-react";
import type { TimelineMoment, ViewId } from "@/content/arooqtyContent";
import { useLang } from "./Lang";
import { Ltr, Reveal, SectionHeading, TapeStrip } from "./Shared";
import ScrapbookDoodles, { HeartFill, PenStar, Sparkle } from "./ScrapbookDoodles";
import ChapterNav from "./ChapterNav";
import MoonCard from "./MoonCard";
import StarMap from "./StarMap";
import { isArabic } from "@/lib/isArabic";
import { cn } from "@/lib/utils";

function Milestone({
  moment,
  index,
}: {
  moment: TimelineMoment;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const { lang, content } = useLang();
  const isNow = moment.id === "now";
  const left = index % 2 === 0;
  /* an Arabic line inside the English universe gets its own
     direction and voice; in Arabic mode the whole page
     already breathes RTL, so the base voice is enough */
  const noteIsArabic = lang === "en" && isArabic(moment.note ?? "");

  return (
    <Reveal>
      <li className="relative ps-9 md:ps-0">
        {/* node on the thread — as the story reaches it, the
            mark pops once onto the line, the way a pen first
            touches down: a small overshoot, then round and
            settled. The thread draws; the marks land on it */}
        <motion.span
          aria-hidden
          initial={reduce ? undefined : { scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 16,
            delay: reduce ? 0 : 0.12,
          }}
          className={cn(
            "absolute top-7 z-[1] h-[9px] w-[9px] rounded-full",
            "start-[15px] md:left-1/2 md:-translate-x-1/2",
            isNow
              ? "animate-soft-glow bg-rose ring-4 ring-burgundy/30"
              : "bg-burgundy ring-4 ring-burgundy/25"
          )}
        />
        {/* a tiny hand-drawn mark beside the important points —
            a heart at the very beginning, stars at the moments
            that kept a picture, a sparkle beside "now". Small,
            quiet, part of the thread's own handwriting */}
        {(index === 0 || isNow || moment.image) && !reduce ? (
          <span
            aria-hidden
            className={cn(
              "absolute top-[22px] z-[1] h-[12px] w-[12px]",
              "start-[29px] md:left-1/2 md:ms-[13px]",
              isNow && "doodle-twinkle",
            )}
            style={
              isNow
                ? ({
                    "--d-min": 0.25,
                    "--d-max": 0.8,
                    "--d-dur": "4.4s",
                    "--d-delay": "-1s",
                    "--d-rot": "0deg",
                  } as React.CSSProperties)
                : undefined
            }
          >
            {isNow ? (
              <Sparkle color="#B77C8D" />
            ) : index === 0 ? (
              <HeartFill color="#B77C8D" />
            ) : (
              <PenStar color="#B77C8D" />
            )}
          </span>
        ) : null}

        <div className="md:grid md:grid-cols-2 md:gap-16">
          <div className={cn(!left && "md:col-start-2")}>
            <motion.article
              /* the card settles a beat after its marker lands —
                 the story writes itself: mark, then moment */
              initial={reduce ? undefined : { opacity: 0, y: 16, rotate: left ? -1.4 : 1.4 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: reduce ? 0 : 0.62,
                delay: reduce ? 0 : 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={cn(
                "rounded-xl border border-rose/10 bg-paper-card/90 p-5 shadow-[0_14px_36px_-18px_rgba(0,0,0,0.8)] transition-[transform,box-shadow] duration-300 hover:rotate-0 hover:shadow-[0_24px_48px_-18px_rgba(0,0,0,0.9)] sm:p-6",
                left ? "md:rotate-[-0.5deg]" : "md:rotate-[0.5deg]"
              )}
            >
              {/* a date in English keeps its LTR island on the
                  Arabic page — an Arabic date simply stays RTL */}
              <p className="font-hand text-lg text-rose">
                {isArabic(moment.date) ? (
                  moment.date
                ) : (
                  <Ltr>{moment.date}</Ltr>
                )}
              </p>
              <h3 className="mt-1 font-display text-2xl text-cream">
                {moment.title}
              </h3>
              <p className="mt-2 text-sm italic leading-relaxed text-cream/65">
                {moment.line}
              </p>

              {moment.image && (
                <div className="relative mt-4 inline-block rotate-[-2deg]">
                  <TapeStrip className="-top-2 left-1/2 w-12 -translate-x-1/2" />
                  <img
                    src={moment.image}
                    alt={moment.imageAlt ?? moment.title}
                    loading="lazy"
                    className="w-36 rounded-[2px] border-[6px] border-cream polaroid-shadow sm:w-44"
                  />
                </div>
              )}

              {moment.note && (
                <div className="mt-4">
                  <button
                    onClick={() => setOpen((o) => !o)}
                    aria-expanded={open}
                    className="inline-flex items-center gap-1.5 rounded-sm text-[11px] uppercase tracking-[0.2em] text-rose/80 transition-colors hover:text-rose focus:outline-none focus-visible:ring-1 focus-visible:ring-rose/60"
                  >
                    {content.ui.timeline.readNote}
                    <motion.span
                      animate={{ rotate: open ? 180 : 0 }}
                      transition={{ duration: reduce ? 0 : 0.25 }}
                      className="inline-flex"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        key="note"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: reduce ? 0 : 0.42,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 rotate-[-0.4deg] rounded-md bg-cream p-4 polaroid-shadow">
                          <p
                            dir={noteIsArabic ? "rtl" : undefined}
                            lang={noteIsArabic ? "ar" : undefined}
                            className={cn(
                              "whitespace-pre-line leading-snug",
                              noteIsArabic
                                ? "font-arabic text-[1.15rem] leading-[2] text-[#3a1e28]"
                                : "font-hand text-xl text-[#3a1e28]"
                            )}
                          >
                            {moment.note}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {isNow && (
                <p className="mt-3 flex items-center gap-2 font-hand text-lg text-rose/80">
                  <Heart
                    className="h-4 w-4 animate-heart-pulse text-rose"
                    fill="currentColor"
                    strokeWidth={0}
                    aria-hidden
                  />
                  {content.ui.timeline.andCounting}
                </p>
              )}
            </motion.article>
          </div>
        </div>
      </li>
    </Reveal>
  );
}

export default function TimelineView({
  onNavigate,
}: {
  onNavigate: (v: ViewId) => void;
}) {
  const reduce = useReducedMotion();
  const { content } = useLang();
  return (
    <div className="relative isolate">
      {/* the living scrapbook — handwritten lines and tiny
          marks around the story of how it all began */}
      <ScrapbookDoodles variant="beginning" />
      <SectionHeading
        overline={content.ui.sections.beginning.overline}
        title={content.ui.sections.beginning.title}
        sub={content.ui.sections.beginning.sub}
      />

      <div className="relative mt-14">
        {/* the thread — drawing itself down the page as she
            arrives, the way the story was drawn in the first
            place: one line at a time */}
        <motion.div
          aria-hidden
          initial={{ scaleY: reduce ? 1 : 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: reduce ? 0 : 1.7, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-4 start-[19px] top-2 w-px origin-top bg-gradient-to-b from-burgundy/70 via-burgundy/40 to-transparent md:left-1/2"
        />
        <ol className="space-y-9 md:space-y-14">
          {content.timelineMoments.map((m, i) => (
            <Milestone key={m.id} moment={m} index={i} />
          ))}
        </ol>
      </div>

      {/* the sky that night, sketched in stars */}
      <StarMap />

      {/* the moon that night, and tonight */}
      <MoonCard />

      <ChapterNav current="beginning" onNavigate={onNavigate} />
    </div>
  );
}
