"use client";

import { motion } from "framer-motion";
import { CHAPTER_COUNT } from "@/lib/journeyStore";

type ProgressRailProps = {
  currentChapter: number; // 0-based
  unlockedChapter: number;
};

/**
 * A vertical line of stars, one per chapter — lit as chapters are reached.
 * Justified here (unlike generic 01/02/03 markers) because the journey
 * genuinely is a fixed, linear sequence the reader is moving through.
 */
export default function ProgressRail({
  currentChapter,
  unlockedChapter,
}: ProgressRailProps) {
  return (
    <div className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
      {Array.from({ length: CHAPTER_COUNT }, (_, i) => {
        const reached = i <= unlockedChapter;
        const active = i === currentChapter;
        return (
          <div key={i} className="relative flex items-center justify-center">
            <motion.span
              animate={{
                scale: active ? 1.6 : 1,
                opacity: reached ? 1 : 0.25,
              }}
              transition={{ duration: 0.5 }}
              className="block h-1.5 w-1.5 rounded-full"
              style={{
                background: reached ? "#E8B04B" : "#4A3B52",
                boxShadow: active ? "0 0 8px 2px rgba(232,176,75,0.7)" : "none",
              }}
            />
            {i < CHAPTER_COUNT - 1 && (
              <span
                className="absolute top-full h-3 w-px"
                style={{ background: reached ? "#E8B04B55" : "#4A3B5222" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
