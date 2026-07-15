// ─────────────────────────────────────────────────────────
// EDIT ME: every piece of personal content lives here.
// Swap placeholder text/photos without touching any component.
// ─────────────────────────────────────────────────────────

export const intro = {
  lines: ["Every person lives a story.", "This is yours."],
  cta: "Begin Journey",
};

export const littleThings = [
  { label: "Favorite scent", value: "Vanilla" },
  { label: "Favorite color", value: "Pink" },
  { label: "Comfort food", value: "Instant ramen & cheesy pasta" },
  { label: "Favorite season", value: "Summer" },
  { label: "Favorite time of day", value: "Sunset" },
  { label: "Favorite music", value: "ABBA" },
];

export type Destination = {
  id: string;
  name: string;
  x: number; // % position on map, 0-100
  y: number;
  reason: string;
};

export const destinations: Destination[] = [
  {
    id: "cabin",
    name: "A cozy cabin, somewhere in the mountains",
    x: 28,
    y: 34,
    reason: "PLACEHOLDER — why this place matters to her.",
  },
  {
    id: "beach",
    name: "A quiet beach at low tide",
    x: 62,
    y: 58,
    reason: "PLACEHOLDER — a beach memory or dream.",
  },
  {
    id: "somewhere-new",
    name: "Somewhere neither of you have been yet",
    x: 78,
    y: 30,
    reason: "PLACEHOLDER — a future trip you're planning together.",
  },
];

export const hiddenQualities = [
  "PLACEHOLDER — a trait she doesn't give herself enough credit for.",
  "She notices when people feel left out, and quietly makes room for them.",
  "PLACEHOLDER — a quirk that's actually a strength.",
  "PLACEHOLDER — how she makes people feel included, on purpose.",
];

export const dreams = [
  { id: "pottery", label: "Pottery", detail: "PLACEHOLDER — the pottery dream, in her words or yours." },
  { id: "language", label: "Speaking another language", detail: "PLACEHOLDER — which language, and why." },
  { id: "travel", label: "Travel", detail: "PLACEHOLDER — where to, and what she'd do there." },
  { id: "future", label: "A future goal", detail: "PLACEHOLDER — something she's working toward." },
];

export const detectivePuzzle = {
  intro: "A memory has gone missing. Follow the clues to find it.",
  // Simple 3-clue chain; each clue's answer unlocks the next.
  clues: [
    {
      prompt: "PLACEHOLDER clue 1 (e.g. a riddle about where you first met).",
      answer: "PLACEHOLDER", // lowercase, matched loosely
    },
    {
      prompt: "PLACEHOLDER clue 2.",
      answer: "PLACEHOLDER",
    },
    {
      prompt: "PLACEHOLDER clue 3.",
      answer: "PLACEHOLDER",
    },
  ],
  reward: "PLACEHOLDER — the hidden memory revealed once solved.",
};

export const gardenFlowers = [
  "PLACEHOLDER — something beautiful about her, revealed on click.",
  "She's faster to laugh than anyone I know.",
  "PLACEHOLDER — a quality that grew on you over time.",
  "PLACEHOLDER.",
  "PLACEHOLDER.",
  "PLACEHOLDER.",
];

export type ScrapbookMemory = {
  id: string;
  caption: string;
  photo: string; // path in /public/assets/photos
  rotation: number; // for scattered look
};

export const scrapbookMemories: ScrapbookMemory[] = [
  { id: "m1", caption: "PLACEHOLDER — memory one.", photo: "/assets/photos/placeholder-1.jpg", rotation: -6 },
  { id: "m2", caption: "PLACEHOLDER — memory two.", photo: "/assets/photos/placeholder-2.jpg", rotation: 4 },
  { id: "m3", caption: "PLACEHOLDER — memory three.", photo: "/assets/photos/placeholder-3.jpg", rotation: -3 },
  { id: "m4", caption: "PLACEHOLDER — memory four.", photo: "/assets/photos/placeholder-4.jpg", rotation: 7 },
];

export const twentyOneReasons: string[] = Array.from({ length: 21 }, (_, i) =>
  i === 0
    ? "You once told me you'd want to wake up next to me, anywhere in the world."
    : i === 1
    ? "Your voice is the sound that calms me."
    : `PLACEHOLDER reason #${i + 1}.`
);

export const future = {
  seedPrompt: "Plant a seed.",
  finalLine: "I can't wait to keep growing beside you.",
};

export const music = {
  // Drop an mp3 in /public/assets/music and update this path.
  src: "/assets/music/ambient.mp3",
  label: "Ambient soundtrack",
};
