"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChapterFooter from "@/components/shared/ChapterFooter";
import { gardenFlowers } from "@/lib/content";

const FLOWER_COLORS = ["#E8927C", "#C9B8D8", "#F4C7B6", "#E8B04B"];

function Flower({ bloomed, color }: { bloomed: boolean; color: string }) {
  const petals = 6;
  return (
    <motion.svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      animate={{ scale: bloomed ? 1 : 0.5, rotate: bloomed ? 0 : -20 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {Array.from({ length: petals }, (_, i) => (
        <ellipse
          key={i}
          cx="24"
          cy="14"
          rx="6"
          ry="11"
          fill={color}
          opacity={bloomed ? 0.85 : 0.35}
          transform={`rotate(${(360 / petals) * i} 24 24)`}
        />
      ))}
      <circle cx="24" cy="24" r="5" fill="#E8B04B" opacity={bloomed ? 1 : 0.4} />
    </motion.svg>
  );
}

export default function Chapter7Garden({ onNext }: { onNext: () => void }) {
  const [bloomed, setBloomed] = useState<Set<number>>(new Set());
  const [reveal, setReveal] = useState<number | null>(null);

  const bloom = (i: number) => {
    setBloomed((prev) => new Set(prev).add(i));
    setReveal(i);
  };

  const allBloomed = bloomed.size === gardenFlowers.length;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-6 py-24">
      {/* soft ground gradient */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-peach/40 to-transparent" />

      <p className="mb-2 font-body text-xs uppercase tracking-[0.3em] text-coral">
        Chapter Seven
      </p>
      <h2 className="mb-3 text-center font-display text-3xl text-plum md:text-5xl">
        A Garden
      </h2>
      <p className="mb-8 max-w-sm text-center font-body text-sm text-plum/60">
        Tap each flower to let it bloom.
      </p>

      <div className="grid grid-cols-3 gap-6 md:grid-cols-6">
        {gardenFlowers.map((text, i) => (
          <button
            key={i}
            onClick={() => bloom(i)}
            aria-label={`Flower ${i + 1}`}
            className="flex flex-col items-center gap-1 focus:outline-none"
          >
            <Flower
              bloomed={bloomed.has(i)}
              color={FLOWER_COLORS[i % FLOWER_COLORS.length]}
            />
          </button>
        ))}
      </div>

      <div className="mt-8 h-16 w-full max-w-md text-center">
        <AnimatePresence mode="wait">
          {reveal !== null && (
            <motion.p
              key={reveal}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
              className="font-display text-lg italic text-plum"
            >
              {gardenFlowers[reveal]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <ChapterFooter
        onNext={onNext}
        disabled={!allBloomed}
        label="Continue to Chapter Eight"
        hint="Our story, scattered like photographs."
      />
    </div>
  );
}
