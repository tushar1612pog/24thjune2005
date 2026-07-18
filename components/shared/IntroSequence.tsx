"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { intro } from "@/lib/content";
import { remembered } from "@/lib/animations";
import PillButton from "@/components/shared/PillButton";

type Phase = "loading" | "silence" | "scene";

// A handful of fixed offsets for the dust drifting near the star, so it
// reads as gentle ambient motion rather than anything mechanical.
const DUST = [
  { x: -46, y: -18, delay: 0 },
  { x: 38, y: -30, delay: 0.6 },
  { x: -30, y: 24, delay: 1.1 },
  { x: 50, y: 14, delay: 1.7 },
  { x: 10, y: -42, delay: 2.2 },
  { x: -14, y: 36, delay: 0.3 },
];

const STAR_TOP = "44%";

export default function IntroSequence({ onBegin }: { onBegin: () => void }) {
  const [phase, setPhase] = useState<Phase>("loading");
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [bloom, setBloom] = useState(false);
  const [lineStage, setLineStage] = useState<number | "cta" | null>(null);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const PHRASE_INTERVAL = 1900;
    const SILENCE_MS = 2600;
    const BLOOM_TO_LINE_GAP = 900;
    const LINE_MS = 2600;

    // Cycle the five loading phrases.
    intro.loadingPhrases.forEach((_, i) => {
      if (i === 0) return;
      timers.push(
        setTimeout(() => setLoadingIndex(i), i * PHRASE_INTERVAL)
      );
    });
    const loadingEnd = intro.loadingPhrases.length * PHRASE_INTERVAL;

    // A few seconds of quiet — no text, no star, just held breath.
    timers.push(setTimeout(() => setPhase("silence"), loadingEnd));

    // The star arrives, and with it, the scene proper.
    const sceneStart = loadingEnd + SILENCE_MS;
    timers.push(
      setTimeout(() => {
        setPhase("scene");
        setBloom(true);
        setTimeout(() => setBloom(false), 1400);
      }, sceneStart)
    );

    // First line surfaces while the star's bloom is still settling —
    // no hard cut between loading and the opening scene.
    intro.lines.forEach((_, i) => {
      timers.push(
        setTimeout(
          () => setLineStage(i),
          sceneStart + BLOOM_TO_LINE_GAP + i * LINE_MS
        )
      );
    });
    timers.push(
      setTimeout(
        () => setLineStage("cta"),
        sceneStart + BLOOM_TO_LINE_GAP + intro.lines.length * LINE_MS
      )
    );

    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-plum">
      {/* loading phrases — minimal, one at a time, nothing else on screen */}
      <AnimatePresence mode="wait">
        {phase === "loading" && (
          <motion.p
            key={loadingIndex}
            variants={remembered}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="px-6 text-center font-body text-xs uppercase tracking-[0.35em] text-vanilla/50"
          >
            {intro.loadingPhrases[loadingIndex]}
          </motion.p>
        )}
      </AnimatePresence>

      {/* the star, and everything that follows it */}
      {phase === "scene" && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{
              opacity: 1,
              scale: bloom ? [0.3, 2, 1] : 1,
            }}
            transition={{
              duration: bloom ? 1.4 : 0.8,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute -translate-x-1/2"
            style={{ top: STAR_TOP, left: "50%" }}
          >
            {/* localized drifting dust, only near the star */}
            <div className="pointer-events-none absolute inset-0">
              {DUST.map((d, i) => (
                <motion.span
                  key={i}
                  className="absolute h-[3px] w-[3px] rounded-full bg-vanilla/40"
                  style={{ left: d.x, top: d.y }}
                  animate={{
                    opacity: [0, 0.6, 0],
                    y: [0, -14, 0],
                  }}
                  transition={{
                    duration: 6 + i,
                    delay: d.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>

            <motion.span
              animate={{ opacity: [0.65, 1, 0.65] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="block h-2 w-2 rounded-full bg-gold"
              style={{ boxShadow: "0 0 26px 9px rgba(232,176,75,0.5)" }}
            />
          </motion.div>

          <AnimatePresence mode="wait">
            {typeof lineStage === "number" && (
              <motion.p
                key={lineStage}
                variants={remembered}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute px-6 text-center font-display text-2xl italic text-vanilla md:text-4xl"
                style={{ top: "58%" }}
              >
                {intro.lines[lineStage]}
              </motion.p>
            )}

            {lineStage === "cta" && (
              <motion.div
                key="cta"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                className="absolute"
                style={{ top: "58%" }}
              >
                <PillButton variant="primary" dark onClick={onBegin}>
                  {intro.cta}
                </PillButton>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
