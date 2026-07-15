"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChapterFooter from "@/components/shared/ChapterFooter";
import GlassCard from "@/components/shared/GlassCard";
import { detectivePuzzle } from "@/lib/content";

export default function Chapter6Detective({ onNext }: { onNext: () => void }) {
  const [clueIndex, setClueIndex] = useState(0);
  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);
  const solved = clueIndex >= detectivePuzzle.clues.length;

  const currentClue = detectivePuzzle.clues[clueIndex];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const guess = input.trim().toLowerCase();
    const answer = currentClue.answer.trim().toLowerCase();
    if (guess.length > 0 && guess === answer) {
      setInput("");
      setClueIndex((i) => i + 1);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center px-6">
      <p className="mb-2 font-body text-xs uppercase tracking-[0.3em] text-coral">
        Chapter Six
      </p>
      <h2 className="mb-3 text-center font-display text-3xl text-plum md:text-5xl">
        The Detective
      </h2>
      <p className="mb-8 max-w-sm text-center font-body text-sm text-plum/60">
        {detectivePuzzle.intro}
      </p>

      <AnimatePresence mode="wait">
        {!solved ? (
          <motion.div
            key={clueIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{
              opacity: 1,
              x: shake ? [0, -10, 10, -6, 6, 0] : 0,
            }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: shake ? 0.5 : 0.6 }}
            className="w-full max-w-md"
          >
            <GlassCard>
              <p className="mb-1 font-body text-[10px] uppercase tracking-widest text-coral">
                Clue {clueIndex + 1} of {detectivePuzzle.clues.length}
              </p>
              <p className="mb-4 font-display text-lg italic text-plum">
                {currentClue.prompt}
              </p>
              <form onSubmit={submit} className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Your answer…"
                  className="flex-1 rounded-full border border-plum/20 bg-white/50 px-4 py-2 font-body text-sm text-plum placeholder:text-plum/30 focus:outline-none focus:ring-2 focus:ring-coral"
                />
                <button
                  type="submit"
                  className="rounded-full bg-coral px-5 py-2 font-body text-xs tracking-widest text-vanilla transition-transform hover:scale-105"
                >
                  GO
                </button>
              </form>
            </GlassCard>
          </motion.div>
        ) : (
          <motion.div
            key="reward"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-md"
          >
            <GlassCard className="bg-gold/10 border-gold/30">
              <p className="mb-1 font-body text-[10px] uppercase tracking-widest text-gold">
                Case closed
              </p>
              <p className="font-display text-lg italic text-plum">
                {detectivePuzzle.reward}
              </p>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <ChapterFooter
        onNext={onNext}
        disabled={!solved}
        label="Continue to Chapter Seven"
        hint="A garden, waiting to bloom."
      />
    </div>
  );
}
