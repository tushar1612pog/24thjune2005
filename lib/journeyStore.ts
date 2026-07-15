import { create } from "zustand";
import { persist } from "zustand/middleware";

export const CHAPTER_COUNT = 10;

type JourneyState = {
  introComplete: boolean;
  unlockedChapter: number; // highest chapter index (0-based) unlocked
  completeIntro: () => void;
  unlockNext: (fromChapter: number) => void;
  reset: () => void;
};

export const useJourneyStore = create<JourneyState>()(
  persist(
    (set) => ({
      introComplete: false,
      unlockedChapter: 0,
      completeIntro: () => set({ introComplete: true }),
      unlockNext: (fromChapter) =>
        set((state) => ({
          unlockedChapter: Math.max(
            state.unlockedChapter,
            Math.min(fromChapter + 1, CHAPTER_COUNT - 1)
          ),
        })),
      reset: () => set({ introComplete: false, unlockedChapter: 0 }),
    }),
    { name: "her-story-journey" }
  )
);
