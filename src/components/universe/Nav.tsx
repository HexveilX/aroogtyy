"use client";

import {
  BookOpen,
  Cake,
  Heart,
  Home,
  Images,
  Mail,
  Music,
  Sticker,
  type LucideIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import type { ViewId } from "@/content/arooqtyContent";
import { useLang } from "./Lang";
import { useMusic } from "@/lib/musicBox";
import { cn } from "@/lib/utils";

/** the seven rooms, with their icons — their names live in the content file */
const NAV_ICONS: Record<ViewId, LucideIcon> = {
  home: Home,
  beginning: BookOpen,
  things: Sticker,
  memories: Images,
  birthday: Cake,
  song: Music,
  letters: Mail,
};

/** shared by TopNav, BottomNav and the chapter tabs */
export function useNavItems() {
  const { content } = useLang();
  return content.ui.nav.items.map((item) => ({
    ...item,
    icon: NAV_ICONS[item.id as ViewId],
  }));
}

/* ————— desktop top navigation ————— */
export function TopNav({
  view,
  onNavigate,
}: {
  view: ViewId;
  onNavigate: (v: ViewId) => void;
}) {
  const isPlaying = useMusic((s) => s.isPlaying);
  const { content } = useLang();
  const items = useNavItems();
  return (
    <header className="sticky top-0 z-40 hidden border-b border-rose/10 bg-paper/85 backdrop-blur-md md:block">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-8">
        <button
          onClick={() => onNavigate("home")}
          className="flex items-center gap-2 font-hand text-2xl text-cream transition-colors hover:text-rose"
          aria-label={content.ui.nav.homeAria}
        >
          Aroogty
          <Heart className="h-4 w-4 text-rose" fill="currentColor" strokeWidth={0} />
        </button>
        <div className="flex items-center gap-4">
          <nav aria-label={content.ui.nav.homeAria}>
            <ul className="flex items-center gap-0.5">
              {items.map((item) => {
                const active = view === item.id;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onNavigate(item.id)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative rounded-full px-2.5 py-1.5 text-[11px] uppercase tracking-[0.08em] transition-colors",
                        active
                          ? "text-rose"
                          : "nav-link text-cream/75 hover:text-cream"
                      )}
                    >
                      <span className="inline-flex items-center gap-1.5">
                        {item.label}
                        {item.id === "song" && isPlaying && (
                          <span
                            className="flex h-3 items-end gap-[2px]"
                            aria-hidden
                          >
                            <span className="eq-bar" style={{ animationDelay: "0ms" }} />
                            <span className="eq-bar" style={{ animationDelay: "160ms" }} />
                            <span className="eq-bar" style={{ animationDelay: "320ms" }} />
                          </span>
                        )}
                      </span>
                      {active && (
                        <svg
                          viewBox="0 0 48 6"
                          aria-hidden
                          className="absolute inset-x-2.5 -bottom-px h-[6px] w-[calc(100%-20px)]"
                        >
                          <motion.path
                            d="M2 4 C 12 1.5, 30 5.5, 46 3"
                            fill="none"
                            stroke="#B77C8D"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}

/* ————— mobile bottom navigation ————— */
export function BottomNav({
  view,
  onNavigate,
}: {
  view: ViewId;
  onNavigate: (v: ViewId) => void;
}) {
  const isPlaying = useMusic((s) => s.isPlaying);
  const items = useNavItems();
  return (
    <nav
      aria-label="التصفح الرئيسي"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-rose/15 bg-paper/80 shadow-[0_-8px_24px_-16px_rgba(0,0,0,0.8)] backdrop-blur-xl md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="grid grid-cols-7">
        {items.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <li key={item.id} className="min-w-0 px-0.5">
              <button
                onClick={() => onNavigate(item.id)}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group/item relative flex h-[64px] w-full flex-col items-center justify-center gap-[5px] rounded-lg transition-colors duration-300",
                  active
                    ? "text-rose"
                    : "text-cream/70 active:text-cream/85"
                )}
              >
                {/* soft burgundy paper pill behind the active item —
                    it slides from room to room now, a little sheet
                    of burgundy paper travelling the row of drawers */}
                {active && (
                  <motion.span
                    aria-hidden
                    layoutId="bottomNavActivePill"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="pointer-events-none absolute inset-x-[7px] inset-y-[7px] rounded-[10px] border border-burgundy/50 bg-burgundy/30"
                  />
                )}
                <span className="relative">
                  <Icon
                    className={cn(
                      "h-[21px] w-[21px] transition-transform duration-300",
                      !active && "group-hover/item:scale-110"
                    )}
                    strokeWidth={active ? 2 : 1.6}
                  />
                  {item.id === "song" && isPlaying && (
                    <span
                      className="absolute -right-2.5 -top-1 flex h-2.5 items-end gap-[2px]"
                      aria-hidden
                    >
                      <span className="eq-bar" style={{ animationDelay: "0ms" }} />
                      <span className="eq-bar" style={{ animationDelay: "160ms" }} />
                      <span className="eq-bar" style={{ animationDelay: "320ms" }} />
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "relative text-[9px] leading-none tracking-wide",
                    active ? "opacity-100" : "opacity-55"
                  )}
                >
                  {item.short}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
