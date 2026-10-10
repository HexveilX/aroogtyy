# Aroogty's Little Universe — Complete Project Backup

A private, single-page romantic scrapbook website built by Zyad for Aroogty (she calls him "زوز").
This ZIP is the **full, restorable development project** — real source code, real assets, real
recordings. Not a static export. After extraction you can install dependencies, run the dev
server, and continue editing the site exactly as it exists today.

---

## What's inside

| Path | What it is |
|---|---|
| `src/` | All source code — the entire website (111 files) |
| `src/app/page.tsx` | The site's single route (everything lives on `/`) |
| `src/app/api/postcard/` | The one API route (daily postcard generator, with offline fallback) |
| `src/components/universe/` | Every room/component of the site (home, timeline, memories, birthday, song, letters…) |
| `src/content/` | **All the words** — `copyCore.ts` (main copy, passcode, dates) and `copyMore.ts` (letters, quiz, coupons, mixtape…) |
| `src/components/ui/` | shadcn/ui component set |
| `public/audio/` | The four songs/recordings: `our-song.mp3`, `our-song-b.mp3` (side B), `makanak.mp3`, `birthday-song.mp3` — **irreplaceable personal files** |
| `public/photos/`, `public/memories/`, `public/timeline/`, `public/birthday/` | All images |
| `prisma/` + `db/` | Prisma + SQLite scaffold (included; the site runs without needing it — see notes) |
| `docs/original-content-prompts/` | The original content briefs (V1–V4) that shaped the site's writing |
| `worklog.md` | The full development history — every feature, fix, and design decision, in order |
| `package.json`, `bun.lock`, `*.config.*`, `tsconfig.json` | All configuration and the lockfile |

## Requirements

- **Bun 1.1+** (recommended — the lockfile is `bun.lock`): https://bun.sh
- or Node.js 20+ with npm (works too; lockfile precision is bun's)
- Internet on first run (Google Fonts: Cormorant Garamond, Lora, Caveat, Aref Ruqaa, Amiri are
  loaded via `next/font` and cached by Next.js afterwards)

## Restore & run

```bash
# 1. extract, then enter the folder
cd Aroogty-Website-Complete

# 2. install dependencies
bun install          # (or: npm install)

# 3. start the dev server
bun run dev          # (or: npm run dev)

# 4. open http://localhost:3000
```

The site opens behind its little passcode gate. The passcode is **`love`**
(lives in `src/content/copyCore.ts` → `password`, if you ever want to change it).

## Production build (optional)

```bash
bun run build        # standalone build into .next/standalone
bun run start        # serves the production build
```

## Notes you'll actually care about

1. **No secrets, no API keys required.** The `.env` here only contains a local SQLite path.
   The site is fully functional offline-of-any-paid-service.
2. **Daily postcard ("كارت بريد للنهاردة")**: the `/api/postcard` route tries to generate a
   fresh line through `z-ai-web-dev-sdk`. Without Z.ai credentials on the new machine it
   automatically falls back to curated handwritten lines — the site never breaks, never shows
   a technical error. If you later want live generation, set up `z-ai-web-dev-sdk` credentials
   in the environment; otherwise ignore this.
3. **Database is dormant.** Prisma/SQLite scaffold is included but no page reads it. If you
   ever want it: `bun run db:push` (the `.env` uses a relative path: `file:../db/custom.db`).
4. **Editing the words**: open `src/content/copyCore.ts` and `src/content/copyMore.ts` —
   every sentence on the site is there, bilingual (English + Egyptian Arabic).
5. **The recordings in `public/audio/` are the only copies that matter.** Keep this ZIP safe;
   it contains the full site *and* the personal media it plays.
6. **Cairo timezone**: the time-together counter and birthday logic use Africa/Cairo.

## Preserving it

This whole folder is the source of truth. The previous platform workspace also held copies of
the original uploaded media (WhatsApp voice notes, photos) — those were byte-identical to the
files already in `public/`, so they're covered by this backup. The original content briefs are
kept in `docs/original-content-prompts/`.

Made with love, in burgundy ink. ♡
