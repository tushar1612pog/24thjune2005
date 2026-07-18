// ─────────────────────────────────────────────────────────
// EDIT ME: every piece of personal content lives here.
// Swap placeholder text/photos without touching any component.
// ─────────────────────────────────────────────────────────

export const intro = {
  loadingPhrases: [
    "Collecting little moments…",
    "Finding forgotten smiles…",
    "Dusting off old memories…",
    "Putting the pieces together…",
    "Almost ready…",
  ],
  lines: [
    "I've always believed…",
    "…every person lives a story.",
    "Some stories deserve to be remembered.",
    "This one belongs to you.",
  ],
  cta: "Begin Journey",
};

export type LittleThingReaction =
  | { type: "text"; message: string }
  | { type: "audio"; src: string; message: string };

export const littleThings: {
  label: string;
  value: string;
  reaction: LittleThingReaction;
}[] = [
  {
    label: "Favorite scent",
    value: "Vanilla",
    reaction: { type: "text", message: "You've been vanilla'd." },
  },
  {
    label: "Favorite color",
    value: "Pink",
    reaction: { type: "text", message: "Certified pink, through and through." },
  },
  {
    label: "Comfort food",
    value: "Instant ramen & cheesy pasta",
    reaction: { type: "text", message: "A quick bowl fixes everything." },
  },
  {
    label: "Favorite season",
    value: "Summer",
    reaction: { type: "text", message: "Endless summer, unlocked." },
  },
  {
    label: "Favorite time of day",
    value: "Sunset",
    reaction: { type: "text", message: "Golden hour, activated." },
  },
  {
    label: "Favorite music",
    value: "ABBA",
    // Drop your own legally-owned mp3 in /public/assets/music/ and point
    // this at it — e.g. "/assets/music/super-trouper.mp3".
    reaction: {
      type: "audio",
      src: "/assets/music/super-trouper.mp3",
      message: "Super Trouper, just for you.",
    },
  },
  {
    label: "Recharge ritual",
    value: "Fufu",
    reaction: { type: "text", message: "Some things are just between us." },
  },
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
    name: "Switzerland",
    x: 54,
    y: 31,
    reason:
      "You once said if you could wake up anywhere in the world, it would be somewhere like this—surrounded by mountains, quiet mornings, and me beside you. Maybe one day this won't just be a dream on a map.",
  },
  {
    id: "beach",
    name: "A Beach at Sunset",
    x: 31,
    y: 64,
    reason:
      "You always choose sunsets over sunrises. There's something about the sky slowly changing colours that feels like you—calm, warm, and quietly beautiful. I hope we watch countless sunsets together.",
  },
  {
    id: "somewhere-new",
    name: "To Be Continued...",
    x: 75,
    y: 48,
    reason:
      "This place doesn't exist on any map yet. It's every adventure we haven't taken, every city we haven't explored, every memory we haven't created. One day, we'll add this destination together.",
  },
];

export const hiddenQualities = [
  "She puts in real effort to keep everyone included — and doesn't expect anyone to notice.",
  "She calls herself non-judgmental, and she is — even though she'll fully admit she loves a bit of gossip.",
  "Most people don't know she reads. She keeps that one quietly to herself.",
  "She trips over absolutely nothing, on a fairly regular basis — and somehow makes it endearing.",
];

export const dreams = [
  { id: "pottery", label: "Pottery", detail: "The hobby she's been curious about but hasn't tried yet — hands in clay, making something from nothing." },
  { id: "language", label: "Speaking another language", detail: "If she could master any skill instantly with zero practice, this is the one she'd pick." },
  { id: "travel", label: "Travel", detail: "Somewhere exotic and beachy — waking up somewhere far, next to you, obviously." },
  { id: "future", label: "Whatever's next", detail: "She just finished college. This one's still being written." },
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
  "Wildflowers — because she'd want a garden that survives her forgetting to water it.",
  "She's faster to laugh than anyone I know.",
  "She reads in secret, more than anyone would guess.",
  "She loves a bit of gossip, but never with cruelty.",
  "She finished college this year and hasn't made a big deal about it — but she should.",
  "She's made peace with how unpredictable life is, and keeps planning anyway.",
];

export type ScrapbookMemory = {
  id: string;
  caption: string;
  photo: string; // path in /public/assets/photos
  rotation: number; // for scattered look
  isTest?: boolean; // shows a "TEST — replace me" badge; remove before launch
};

export const scrapbookMemories: ScrapbookMemory[] = [
  {
    id: "test",
    caption: "Test placeholder — swap this for a real photo before launch.",
    photo: "/assets/photos/TEST-PLACEHOLDER-remove-me.jpg",
    rotation: -5,
    isTest: true,
  },
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
