"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChapterFooter from "@/components/shared/ChapterFooter";
import GlassCard from "@/components/shared/GlassCard";
import { dreams } from "@/lib/content";

// Fixed, pleasant positions so stars don't overlap awkwardly.
const positions = [
  { x: 20, y: 30 },
  { x: 72, y: 22 },
  { x: 45, y: 60 },
  { x: 82, y: 68 },
];

export default function Chapter5Dreams({ onNext }: { onNext: () => void }) {
  const [active, setActive] = useState<string | null>(null);
  const [seen, setSeen] = useState<Set<string>>(new Set());

  const open = (id: string) => {
    setActive(id);
    setSeen((prev) => new Set(prev).add(id));
  };

  const allSeen = seen.size === dreams.length;
  const activeDream = dreams.find((d) => d.id === active);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-plum px-6 py-24">
      <p className="mb-2 font-body text-xs uppercase tracking-[0.3em] text-gold">
        Chapter Five
      </p>
      <h2 className="mb-8 text-center font-display text-3xl text-vanilla md:text-5xl">
        Dreams
      </h2>

      <div className="relative h-72 w-full max-w-xl">
        {dreams.map((dream, i) => (
          <button
            key={dream.id}
            onClick={() => open(dream.id)}
            aria-label={dream.label}
            style={{
              left: `${positions[i % positions.length].x}%`,
              top: `${positions[i % positions.length].y}%`,
            }}
            className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
          >
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5], scale: [1, 1.25, 1] }}
              transition={{
                duration: 2.5 + i * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex flex-col items-center gap-2"
            >
              <span
                className="block h-2 w-2 rounded-full bg-gold"
                style={{ boxShadow: "0 0 12px 4px rgba(232,176,75,0.6)" }}
              />
              <span className="whitespace-nowrap font-body text-[10px] uppercase tracking-widest text-vanilla/50">
                {seen.has(dream.id) ? dream.label : ""}
              </span>
            </motion.div>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {activeDream && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="w-full max-w-md"
          >
            <GlassCard className="bg-vanilla/10 border-vanilla/20">
              <p className="font-display text-lg italic text-vanilla">
                {activeDream.label}
              </p>
              <p className="mt-2 font-body text-sm text-vanilla/70">
                {activeDream.detail}
              </p>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {!activeDream && (
        <p className="font-body text-xs text-vanilla/40">
          Tap a star to find out what it holds.
        </p>
      )}

      <ChapterFooter
        onNext={onNext}
        disabled={!allSeen}
        label="Continue to Chapter Six"
        hint="A memory has gone missing."
        variant="dark"
      />
    </div>
  );
}
