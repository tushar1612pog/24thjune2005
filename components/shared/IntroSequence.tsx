"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { intro } from "@/lib/content";
import { fadeOnly } from "@/lib/animations";

type Stage = "blank" | number | "cta"; // number = index into intro.lines

export default function IntroSequence({ onBegin }: { onBegin: () => void }) {
  const [stage, setStage] = useState<Stage>("blank");

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    timers.push(setTimeout(() => setStage(0), 1200));
    intro.lines.forEach((_, i) => {
      if (i === 0) return;
      timers.push(
        setTimeout(() => setStage(i), 1200 + i * 2600)
      );
    });
    timers.push(
      setTimeout(() => setStage("cta"), 1200 + intro.lines.length * 2600)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-vanilla">
      <AnimatePresence mode="wait">
        {typeof stage === "number" && (
          <motion.p
            key={stage}
            variants={fadeOnly}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="px-6 text-center font-display text-3xl italic text-plum md:text-5xl"
          >
            {intro.lines[stage]}
          </motion.p>
        )}
        {stage === "cta" && (
          <motion.button
            key="cta"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            onClick={onBegin}
            className="group relative rounded-full bg-coral px-10 py-4 font-body text-sm tracking-[0.2em] text-vanilla shadow-[0_8px_30px_rgba(232,146,124,0.4)] transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-plum focus-visible:ring-offset-2"
          >
            {intro.cta.toUpperCase()}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
