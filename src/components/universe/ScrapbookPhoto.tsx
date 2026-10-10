"use client";

/* ————————————————————————————————————————————————
   ScrapbookPhoto — a REAL photo, placed like a memory.

   The real photos of Ziad & Arooga are not gallery items;
   they are keepsakes. Each one is taped into the page
   the way a printed photo is: the washi tape lands
   first, then the photo settles at its own slight angle,
   then the handwritten caption arrives underneath.

   Entrance (all at once = chaotic; staged = handmade):
     0.00s  the tape presses down
     0.18s  the photo settles — a touch too rotated at
            first, finding its own angle as it lands
     0.58s  the caption rises in

   Everything yields to prefers-reduced-motion. The
   photo is never distorted, never zoomed, never given
   a cinematic effect — it is just… kept.
———————————————————————————————————————————————— */

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

export function ScrapbookPhoto({
  src,
  alt,
  caption,
  /** resting angle of the whole keepsake, degrees */
  rotate = 0,
  /** max width of the photo area, px */
  maxWidth = 260,
  /** "polaroid" — cream frame, thicker at the bottom
      "mat"     — even cream mat, like a page tipped in */
  frame = "polaroid",
  /** "single" — one diagonal strip over the top edge
      "corners" — two strips on the top corners */
  tape = "single",
  className,
}: {
  src: string;
  alt: string;
  caption?: string;
  rotate?: number;
  maxWidth?: number;
  frame?: "polaroid" | "mat";
  tape?: "single" | "corners";
  className?: string;
}) {
  const reduce = useReducedMotion();

  /* with reduced motion every piece simply exists —
     nothing moves, nothing waits */
  const photoV: Variants | undefined = reduce
    ? undefined
    : {
        hidden: { opacity: 0, y: 20, rotate: 2.6, scale: 0.965 },
        kept: {
          opacity: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          transition: { duration: 0.72, delay: 0.18, ease: [0.22, 1, 0.36, 1] },
        },
      };
  const tapeV = (extraDelay = 0): Variants | undefined =>
    reduce
      ? undefined
      : {
          hidden: { opacity: 0, scale: 1.3 },
          kept: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.34, delay: extraDelay, ease: "easeOut" },
          },
        };
  const captionV: Variants | undefined = reduce
    ? undefined
    : {
        hidden: { opacity: 0, y: 9 },
        kept: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, delay: 0.58, ease: [0.22, 1, 0.36, 1] },
        },
      };

  return (
    <motion.figure
      initial="hidden"
      whileInView="kept"
      viewport={{ once: true, margin: "-40px" }}
      className={cn("relative inline-block", className)}
      style={{ rotate }}
      aria-label={caption ? undefined : alt}
    >
      {/* the photo, settling onto the page like paper —
          the figure holds the resting angle, this finds it */}
      <motion.div
        variants={photoV}
        className={cn(
          "relative rounded-[2px] bg-cream polaroid-shadow",
          frame === "polaroid"
            ? "p-[9px] pb-[30px]"
            : "p-[14px]",
        )}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="block w-full rounded-[1px] object-cover"
          style={{ maxWidth }}
        />

        {/* the washi tape — pressed down before the photo arrives */}
        {tape === "single" ? (
          <motion.span
            aria-hidden
            variants={tapeV()}
            className="tape-strip pointer-events-none absolute -top-3 left-1/2 block h-5 w-16 -translate-x-1/2 -rotate-3 rounded-[1px]"
          />
        ) : (
          <>
            <motion.span
              aria-hidden
              variants={tapeV()}
              className="tape-strip pointer-events-none absolute -top-2.5 left-2 block h-5 w-14 -rotate-[16deg] rounded-[1px]"
            />
            <motion.span
              aria-hidden
              variants={tapeV(0.08)}
              className="tape-strip pointer-events-none absolute -top-2.5 right-2 block h-5 w-14 rotate-[14deg] rounded-[1px]"
            />
          </>
        )}
      </motion.div>

      {/* the handwritten caption — arriving once the photo has landed */}
      {caption && (
        <motion.figcaption
          variants={captionV}
          className={cn(
            "mt-2.5 text-center font-hand text-[1.15rem] leading-snug text-rose/90",
            frame === "polaroid" && "px-2",
          )}
        >
          {caption}
        </motion.figcaption>
      )}
    </motion.figure>
  );
}
