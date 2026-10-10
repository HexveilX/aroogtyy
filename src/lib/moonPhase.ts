/* ————————————————————————————————————————————————
   The moon — pure arithmetic, no API.
   Approximate phase for any date, accurate to roughly
   a day (plenty for a scrapbook). Reference new moon:
   6 Jan 2000, 18:14 UTC. Synodic month: 29.53058867 d.
———————————————————————————————————————————————— */

export interface MoonPhase {
  /** 0 = new, 0.25 = first quarter, 0.5 = full, 0.75 = last quarter */
  fraction: number;
  /** 0..1 — how much of the disc is lit */
  illumination: number;
  /** true while growing (new → full) */
  waxing: boolean;
  /** human name, e.g. "waxing crescent" */
  name: string;
}

/** reference: new moon 2000-01-06 18:14 UTC */
const REF_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14);
const SYNODIC_MS = 29.53058867 * 86_400_000;

export function moonPhase(date: Date): MoonPhase {
  const cycles = (date.getTime() - REF_NEW_MOON_MS) / SYNODIC_MS;
  const fraction = ((cycles % 1) + 1) % 1;
  const illumination = (1 - Math.cos(2 * Math.PI * fraction)) / 2;
  const waxing = fraction < 0.5;

  /* name by band, with a little tolerance around the quarters */
  const near = (target: number, tol = 0.0225) =>
    Math.abs(fraction - target) < tol || Math.abs(fraction - target) > 1 - tol;
  let name: string;
  if (near(0)) name = "new moon";
  else if (near(0.25)) name = "first quarter";
  else if (near(0.5)) name = "full moon";
  else if (near(0.75)) name = "last quarter";
  else if (fraction < 0.25) name = "waxing crescent";
  else if (fraction < 0.5) name = "waxing gibbous";
  else if (fraction < 0.75) name = "waning gibbous";
  else name = "waning crescent";

  return { fraction, illumination, waxing, name };
}
