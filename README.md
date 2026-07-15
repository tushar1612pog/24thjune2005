# Her Story — a birthday, in chapters

An interactive, cinematic birthday website. Built with Next.js 14 (App Router),
TypeScript, Tailwind CSS, Framer Motion, and Zustand.

## Status

All 10 chapters are built and wired into the linear, unlock-as-you-go journey:

1. **The Beginning** — animated timeline
2. **Little Things That Make You…** — flip cards
3. **The World Through Your Eyes** — clickable travel map pins
4. **Things You Don't Realize About Yourself** — sequential reveals
5. **Dreams** — clickable twinkling stars
6. **The Detective** — a 3-clue mystery puzzle unlocking a hidden memory
7. **A Garden** — flowers that bloom on tap
8. **Our Story** — a draggable scrapbook
9. **21 Things I Love About You** — 21 unlockable reasons
10. **The Future** — plant a seed, grow a tree, one-time confetti finale

**Important — I could not run an actual build in my working environment**
(no network access to install packages), so this hasn't been verified with a
real `next build`. I reviewed every file closely and ran a structural
TypeScript check against stub types to catch typos and mismatched
props/logic, but you should still run the real build yourself before
deploying — see below. If you hit any error, paste it back to me and I'll
fix it right away.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Also worth running
`npm run build` once to confirm a clean production build before deploying.

## Where things live

```
/app/page.tsx              — orchestrator: intro → scroll-snapped chapters
/lib/content.ts             — ALL personal content (edit this, not components)
/lib/journeyStore.ts        — chapter-unlock state (persisted to localStorage)
/lib/animations.ts          — shared Framer Motion variants
/components/shared/         — Firefly, ParticleField, GlassCard, MusicToggle,
                               ProgressRail, IntroSequence, ChapterFooter
/components/chapters/       — one file per chapter
/public/assets/photos/      — drop real photos here for the scrapbook chapter
/public/assets/music/       — drop one ambient mp3 here
```

## Personalizing content

Almost everything you'd want to change lives in `lib/content.ts` —
littleThings, destinations, dreams, the detective puzzle, garden reveals,
scrapbook memories, and the 21 reasons. Each placeholder is marked clearly.
You generally won't need to touch component code to update the content.

## Adding a real photo/memory to the scrapbook

1. Drop the image in `public/assets/photos/`
2. Update the matching entry in `scrapbookMemories` in `lib/content.ts`
   with the real path and caption

## Deployment (Vercel)

1. Push this project to a GitHub repo
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo
3. Framework preset: Next.js (auto-detected) — no config needed
4. Deploy

Or from the CLI:

```bash
npm install -g vercel
vercel
```

## Accessibility & performance notes

- Respects `prefers-reduced-motion`
- Music is muted/paused by default, one tap to enable
- Progress rail and firefly cursor-light are hidden on small screens to keep
  mobile focused and uncluttered
