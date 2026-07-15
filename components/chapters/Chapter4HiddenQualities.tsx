"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ParticleField from "@/components/shared/ParticleField";
import ChapterFooter from "@/components/shared/ChapterFooter";
import { hiddenQualities } from "@/lib/content";

export default function Chapter4HiddenQualities({
  onNext,
}: {
  onNext: () => void;
}) {
  const [index, setIndex] = useState(0);
  const done = index >= hiddenQualities.length;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center px-6">
      <ParticleField color="#4A3B52" count={10} />

      <p className="mb-2 font-body text-xs uppercase tracking-[0.3em] text-coral">
        Chapter Four
      </p>
      <h2 className="mb-10 text-center font-display text-3xl text-plum md:text-5xl">
        Things You Don&apos;t Realize About Yourself
      </h2>

      <div className="flex h-40 w-full max-w-lg items-center justify-center">
        <AnimatePresence mode="wait">
          {!done ? (
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.96 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="text-center font-display text-xl italic text-plum md:text-2xl"
            >
              &ldquo;{hiddenQualities[index]}&rdquo;
            </motion.p>
          ) : (
            <motion.p
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center font-body text-sm text-plum/50"
            >
              All true. Even the ones you don&apos;t see yet.
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {!done && (
        <button
          onClick={() => setIndex((i) => i + 1)}
          className="mt-6 rounded-full border border-plum/20 px-6 py-2 font-body text-xs tracking-[0.2em] text-plum/70 transition-colors hover:border-coral hover:text-coral"
        >
          {index === hiddenQualities.length - 1 ? "LAST ONE" : "ANOTHER"}
        </button>
      )}

      <ChapterFooter
        onNext={onNext}
        disabled={!done}
        label="Continue to Chapter Five"
        hint="Somewhere up there, your dreams are waiting."
      />
    </div>
  );
}
