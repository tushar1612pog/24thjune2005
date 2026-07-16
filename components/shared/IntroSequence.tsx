"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { intro } from "@/lib/content";
import { fadeOnly } from "@/lib/animations";

type Stage = "loading" | "blank" | number | "cta"; // number = index into intro.lines

export default function IntroSequence({ onBegin }: { onBegin: () => void }) {
  const [stage, setStage] = useState<Stage>("loading");
  const [starLit, setStarLit] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const LOADING_MS = 1600;
    const BLANK_MS = 1400;
    const STAR_SETTLE_MS = 1000;
    const LINE_MS = 2600;

    timers.push(setTimeout(() => setStage("blank"), LOADING_MS));
    timers.push(
      setTimeout(() => setStarLit(true), LOADING_MS + 300)
    );
    const linesStart = LOADING_MS + BLANK_MS + STAR_SETTLE_MS;
    intro.lines.forEach((_, i) => {
      timers.push(setTimeout(() => setStage(i), linesStart + i * LINE_MS));
    });
    timers.push(
      setTimeout(
        () => setStage("cta"),
        linesStart + intro.lines.length * LINE_MS
      )
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-plum">
      {/* the star — fades in once and stays lit through the rest of the intro */}
      <motion.div
        initial={{ opacity: 0, scale: 0.4 }}
        animate={{
          opacity: starLit ? 1 : 0,
          scale: starLit ? 1 : 0.4,
        }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="absolute"
        style={{ top: "38%" }}
      >
        <motion.span
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="block h-2 w-2 rounded-full bg-gold"
          style={{ boxShadow: "0 0 24px 8px rgba(232,176,75,0.55)" }}
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {stage === "loading" && (
          <motion.p
            key="loading"
            variants={fadeOnly}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="px-6 text-center font-body text-xs uppercase tracking-[0.3em] text-vanilla/50"
          >
            {intro.loading}
          </motion.p>
        )}

        {typeof stage === "number" && (
          <motion.p
            key={stage}
            variants={fadeOnly}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute px-6 text-center font-display text-2xl italic text-vanilla md:text-4xl"
            style={{ top: "54%" }}
          >
            {intro.lines[stage]}
          </motion.p>
        )}

        {stage === "cta" && (
          <motion.button
            key="cta"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
            onClick={onBegin}
            className="absolute rounded-full bg-coral px-10 py-4 font-body text-sm tracking-[0.2em] text-vanilla shadow-[0_8px_30px_rgba(232,146,124,0.4)] transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-plum"
            style={{ top: "58%" }}
          >
            {intro.cta.toUpperCase()}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
