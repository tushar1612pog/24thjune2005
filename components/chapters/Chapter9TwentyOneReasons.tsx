"use client";

import { useState } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import ChapterFooter from "@/components/shared/ChapterFooter";
import { twentyOneReasons } from "@/lib/content";

// A few distinct reveal styles, cycled through, so no two reasons feel
// mechanically identical.
const revealVariants: Variants[] = [
  {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  },
  {
    hidden: { opacity: 0, scale: 0.85, rotate: -3 },
    visible: { opacity: 1, scale: 1, rotate: 0, transition: { duration: 0.6 } },
  },
  {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  },
  {
    hidden: { opacity: 0, filter: "blur(8px)" },
    visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.7 } },
  },
];

export default function Chapter9TwentyOneReasons({
  onNext,
}: {
  onNext: () => void;
}) {
  const [opened, setOpened] = useState<Set<number>>(new Set());

  const open = (i: number) => setOpened((prev) => new Set(prev).add(i));
  const allOpened = opened.size === twentyOneReasons.length;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center px-6 py-24">
      <p className="mb-2 font-body text-xs uppercase tracking-[0.3em] text-coral">
        Chapter Nine
      </p>
      <h2 className="mb-8 text-center font-display text-3xl text-plum md:text-5xl">
        21 Things I Love About You
      </h2>

      <div className="grid w-full max-w-2xl grid-cols-3 gap-3 sm:grid-cols-7">
        {twentyOneReasons.map((_, i) => {
          const isOpen = opened.has(i);
          return (
            <button
              key={i}
              onClick={() => open(i)}
              disabled={isOpen}
              aria-label={`Reason ${i + 1}`}
              className={`flex aspect-square items-center justify-center rounded-xl font-display text-sm transition-colors ${
                isOpen
                  ? "bg-gold/20 text-gold cursor-default"
                  : "glass text-plum/50 hover:text-coral"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex min-h-[6rem] w-full max-w-md flex-col gap-3">
        <AnimatePresence initial={false}>
          {[...opened]
            .sort((a, b) => b - a)
            .slice(0, 3)
            .map((i) => (
              <motion.p
                key={i}
                variants={revealVariants[i % revealVariants.length]}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0 }}
                className="text-center font-body text-sm text-plum/80"
              >
                <span className="mr-1 font-display italic text-coral">
                  #{i + 1}
                </span>
                {twentyOneReasons[i]}
              </motion.p>
            ))}
        </AnimatePresence>
      </div>

      <ChapterFooter
        onNext={onNext}
        disabled={!allOpened}
        label="Continue to the final chapter"
        hint="Plant something for what's next."
      />
    </div>
  );
}
