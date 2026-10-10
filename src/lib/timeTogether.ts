/* Calendar-aware "time together" math, timezone-correct. */

export interface WallClock {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
  second: number;
}

export interface TogetherDuration {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalDays: number;
}

/** Wall-clock reading of a Date in a given IANA timezone. */
export function wallClockInZone(date: Date, timeZone: string): WallClock {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);
  let hour = get("hour");
  if (hour === 24) hour = 0; // some engines return 24:00
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour,
    minute: get("minute"),
    second: get("second"),
  };
}

/** Parse "2026-05-19" + "16:35" into a wall clock. */
export function parseStartWall(dateStr: string, timeStr: string): WallClock {
  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);
  return { year, month, day, hour, minute, second: 0 };
}

function wallToUtcMs(w: WallClock): number {
  return Date.UTC(w.year, w.month - 1, w.day, w.hour, w.minute, w.second);
}

const ZERO: TogetherDuration = {
  years: 0,
  months: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
  totalDays: 0,
};

/** Calendar-aware diff between two wall clocks (start ≤ now). */
export function diffWall(start: WallClock, now: WallClock): TogetherDuration {
  let years = now.year - start.year;
  let months = now.month - start.month;
  let days = now.day - start.day;
  let hours = now.hour - start.hour;
  let minutes = now.minute - start.minute;
  let seconds = now.second - start.second;

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    // borrow the length of the month before `now` (Gregorian)
    const prevMonth = now.month === 1 ? 12 : now.month - 1;
    const prevYear = now.month === 1 ? now.year - 1 : now.year;
    days += new Date(Date.UTC(prevYear, prevMonth, 0)).getUTCDate();
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }
  if (years < 0) {
    // start date is in the future — keep it calm and zeroed
    return ZERO;
  }
  const totalMs = wallToUtcMs(now) - wallToUtcMs(start);
  const totalDays = Math.max(0, Math.floor(totalMs / 86_400_000));
  return { years, months, days, hours, minutes, seconds, totalDays };
}

/** Whole days from today (in timeZone) until an ISO date. Negative = passed. */
export function daysUntil(isoDate: string, now: Date, timeZone: string): number {
  const nowWall = wallClockInZone(now, timeZone);
  const [y, m, d] = isoDate.split("-").map(Number);
  const target = Date.UTC(y, m - 1, d);
  const today = Date.UTC(nowWall.year, nowWall.month - 1, nowWall.day);
  return Math.round((target - today) / 86_400_000);
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

export function formatTimeParts(progress: number, total: number): string {
  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };
  return `${fmt(progress)} / ${fmt(total)}`;
}
