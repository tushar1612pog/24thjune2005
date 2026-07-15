"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dreams, future } from "@/lib/content";

type Stage = "seed" | "sprout" | "growing" | "full";

export default function Chapter10Future() {
  const [stage, setStage] = useState<Stage>("seed");
  const [leaves, setLeaves] = useState(0);
  const [confettiFired, setConfettiFired] = useState(false);

  const plant = () => {
    setStage("sprout");
    setTimeout(() => setStage("growing"), 900);
  };

  const grow = async () => {
    if (leaves < dreams.length - 1) {
      setLeaves((l) => l + 1);
      return;
    }
    setLeaves(dreams.length);
    setStage("full");
    if (!confettiFired) {
      setConfettiFired(true);
      try {
        const confetti = (await import("canvas-confetti")).default;
        confetti({
          particleCount: 140,
          spread: 90,
          startVelocity: 35,
          origin: { y: 0.6 },
          colors: ["#E8927C", "#E8B04B", "#C9B8D8", "#FBF3E7"],
        });
      } catch {
        // confetti is a delight, not a dependency — fail silently
      }
    }
  };

  const treeHeight = 40 + leaves * 25 + (stage === "full" ? 20 : 0);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-plum px-6 py-24">
      {/* stars, fade in once the tree is fully grown */}
      <AnimatePresence>
        {stage === "full" &&
          Array.from({ length: 24 }, (_, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.2, 0.9, 0.2] }}
              transition={{
                delay: i * 0.05,
                duration: 2 + (i % 4),
                repeat: Infinity,
              }}
              className="absolute h-1 w-1 rounded-full bg-vanilla"
              style={{
                left: `${(i * 41) % 100}%`,
                top: `${(i * 23) % 60}%`,
              }}
            />
          ))}
      </AnimatePresence>

      <p className="relative z-10 mb-2 font-body text-xs uppercase tracking-[0.3em] text-gold">
        Chapter Ten
      </p>
      <h2 className="relative z-10 mb-10 text-center font-display text-3xl text-vanilla md:text-5xl">
        The Future
      </h2>

      {/* tree */}
      <div className="relative z-10 flex h-64 w-full max-w-md items-end justify-center">
        {stage === "seed" ? (
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mb-2 h-3 w-3 rounded-full bg-gold"
          />
        ) : (
          <div className="relative flex flex-col items-center">
            {/* leaves / dreams */}
            <div className="relative mb-1 flex h-24 w-56 items-end justify-center">
              {dreams.slice(0, leaves).map((dream, i) => {
                const angle = -50 + (100 / (dreams.length - 1 || 1)) * i;
                return (
                  <motion.div
                    key={dream.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    style={{
                      transform: `rotate(${angle}deg) translate(0, -70px) rotate(${-angle}deg)`,
                    }}
                    className="group absolute bottom-0"
                  >
                    <div className="h-5 w-5 rounded-full bg-gold shadow-[0_0_10px_2px_rgba(232,176,75,0.5)]" />
                    <span className="pointer-events-none absolute left-1/2 top-6 w-max -translate-x-1/2 whitespace-nowrap font-body text-[10px] tracking-wide text-vanilla/70 opacity-0 transition-opacity group-hover:opacity-100">
                      {dream.label}
                    </span>
                  </motion.div>
                );
              })}
            </div>
            {/* trunk */}
            <motion.div
              animate={{ height: treeHeight }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="w-3 rounded-full bg-gradient-to-t from-[#7a5c3e] to-[#a5825c]"
            />
          </div>
        )}
      </div>

      <div className="relative z-10 mt-6 flex min-h-[4rem] flex-col items-center gap-4">
        {stage === "seed" && (
          <button
            onClick={plant}
            className="rounded-full bg-gold px-8 py-3 font-body text-xs tracking-[0.2em] text-plum transition-transform hover:scale-105"
          >
            {future.seedPrompt.toUpperCase()}
          </button>
        )}

        {stage === "growing" && (
          <button
            onClick={grow}
            className="rounded-full border border-vanilla/30 px-8 py-3 font-body text-xs tracking-[0.2em] text-vanilla/80 transition-colors hover:border-gold hover:text-gold"
          >
            LET IT GROW
          </button>
        )}

        <AnimatePresence>
          {stage === "full" && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="max-w-sm text-center font-display text-xl italic text-vanilla md:text-2xl"
            >
              {future.finalLine}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
