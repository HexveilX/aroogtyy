"use client";

/* Shared building blocks for Aroogty's Little Universe. */

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { X } from "lucide-react";
import { Children, type ReactNode } from "react";
import { useContent } from "./Lang";
import { cn } from "@/lib/utils";

/* ————— LTR island —————
   English that must keep its left-to-right visual order
   inside the Arabic universe: dates like 19 May 2026,
   counter numbers and units, song titles, artists,
   archival labels (SIDE A · NO. 01 · ADMIT TWO). The
   dir attribute gives it isolation semantics per the
   HTML spec; unicode-bidi is restated inline so the
   intent survives any future refactor. Arabic and
   English never share one sentence. */
export function Ltr({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      dir="ltr"
      style={{ unicodeBidi: "isolate" }}
      className={className}
    >
      {children}
    </span>
  );
}

/* ————— scroll reveal ————— */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-36px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ————— line-by-line text reveal —————
   children appear one after another, not all at once */
export function LinesReveal({
  children,
  className,
  step = 0.1,
}: {
  children: ReactNode;
  className?: string;
  step?: number;
}) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : step } },
  };
  const line: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-30px" }}
      className={className}
    >
      {Children.map(children, (child, i) => (
        <motion.div key={i} variants={line}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ————— section heading ————— */
export function SectionHeading({
  overline,
  title,
  sub,
}: {
  overline: string;
  title: string;
  sub?: string;
}) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.14 } },
  };
  const line: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-30px" }}
      className="text-center"
    >
      <motion.p
        variants={line}
        className="text-[11px] uppercase tracking-[0.32em] text-rose/80"
      >
        {overline}
      </motion.p>
      <motion.h2
        variants={{
          hidden: { opacity: 0, y: reduce ? 0 : 12, filter: "blur(3px)" },
          show: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: reduce ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] },
          },
        }}
        className="mt-3 font-display text-4xl font-medium text-cream sm:text-5xl"
      >
        {title}
      </motion.h2>
      {sub ? (
        <motion.p
          variants={line}
          className="mt-3 font-hand text-xl text-rose/85 sm:text-2xl"
        >
          {sub}
        </motion.p>
      ) : null}
      {/* a hand-inked flourish, drawn once as the heading arrives */}
      <motion.svg
        variants={line}
        viewBox="0 0 120 10"
        aria-hidden
        className="mx-auto mt-6 h-2.5 w-28 overflow-visible text-burgundy/85"
      >
        <motion.path
          d="M2 6.5 C 20 2.5, 38 9, 58 5.5 S 94 2.5, 118 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          variants={{
            hidden: { pathLength: reduce ? 1 : 0, opacity: reduce ? 1 : 0.5 },
            show: {
              pathLength: 1,
              opacity: 1,
              transition: {
                pathLength: { duration: reduce ? 0 : 0.9, ease: [0.22, 1, 0.36, 1] },
                opacity: { duration: 0.4 },
              },
            },
          }}
        />
      </motion.svg>
    </motion.div>
  );
}

/* ————— paper dialog (radix, cream paper styling) ————— */
export function PaperDialog({
  open,
  onOpenChange,
  ariaLabel,
  children,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ariaLabel: string;
  children: ReactNode;
  className?: string;
}) {
  const { ui } = useContent();
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[100] bg-[#070506]/85 backdrop-blur-[3px] data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          aria-label={ariaLabel}
          aria-describedby={undefined}
          className={cn(
            "paper-unfold fixed left-1/2 top-1/2 z-[101] max-h-[86svh] w-[92vw] max-w-[430px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl bg-cream text-ink polaroid-shadow focus:outline-none",
            "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            className
          )}
        >
          <DialogPrimitive.Title className="sr-only">
            {ariaLabel}
          </DialogPrimitive.Title>
          {children}
          <DialogPrimitive.Close
            aria-label={ui.common.close}
            className="absolute end-3 top-3 rounded-full p-1.5 text-[#7a4a58]/60 transition-[color,background-color,transform] duration-300 hover:rotate-90 hover:bg-[#651c2d]/10 hover:text-[#651c2d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#651c2d]/40"
          >
            <X className="h-4 w-4" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

/* ————— washi tape strip ————— */
export function TapeStrip({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "tape-strip pointer-events-none absolute h-5 w-16 rotate-[-4deg] rounded-[1px]",
        className
      )}
    />
  );
}

/* ————— a quiet pulsing heart ————— */
export function PulsingHeart({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={cn("inline-flex animate-heart-pulse", className)}
    >
      <svg viewBox="0 0 24 24" className="h-full w-full" fill="currentColor">
        <path d="M12 21s-7.5-4.9-9.7-9.2C.7 8.6 2.6 5 6.1 5c2 0 3.4 1.1 4.2 2.4L12 9l1.7-1.6C14.5 6.1 15.9 5 17.9 5c3.5 0 5.4 3.6 3.8 6.8C19.5 16.1 12 21 12 21z" />
      </svg>
    </span>
  );
}
