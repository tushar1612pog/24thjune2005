"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChapterFooter from "@/components/shared/ChapterFooter";
import GlassCard from "@/components/shared/GlassCard";
import { destinations } from "@/lib/content";

export default function Chapter3TravelMap({ onNext }: { onNext: () => void }) {
  const [active, setActive] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());

  const openPin = (id: string) => {
    setActive(id);
    setVisited((prev) => new Set(prev).add(id));
  };

  const allVisited = visited.size === destinations.length;
  const activeDestination = destinations.find((d) => d.id === active);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center px-6 py-24">
      <p className="mb-2 font-body text-xs uppercase tracking-[0.3em] text-coral">
        Chapter Three
      </p>
      <h2 className="mb-8 text-center font-display text-3xl text-plum md:text-5xl">
        The World Through Your Eyes
      </h2>

      <div className="relative h-[320px] w-full max-w-xl overflow-hidden rounded-[2rem] border border-plum/10 bg-gradient-to-br from-peach/50 via-vanilla to-lavender/40 shadow-inner">
        {/* soft abstract "landmasses" */}
        <div className="absolute -left-10 top-10 h-40 w-56 rounded-[40%] bg-peach/40 blur-2xl" />
        <div className="absolute bottom-0 right-0 h-48 w-64 rounded-[40%] bg-lavender/30 blur-2xl" />

        {destinations.map((d) => (
          <button
            key={d.id}
            onClick={() => openPin(d.id)}
            aria-label={d.name}
            style={{ left: `${d.x}%`, top: `${d.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
          >
            <motion.span
              animate={{
                scale: visited.has(d.id) ? [1, 1] : [1, 1.15, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="block h-3.5 w-3.5 rounded-full"
              style={{
                background: visited.has(d.id) ? "#E8B04B" : "#E8927C",
                boxShadow: `0 0 0 6px ${
                  visited.has(d.id) ? "#E8B04B33" : "#E8927C33"
                }`,
              }}
            />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {activeDestination && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="mt-6 w-full max-w-md"
          >
            <GlassCard>
              <p className="font-display text-lg italic text-plum">
                {activeDestination.name}
              </p>
              <p className="mt-2 font-body text-sm text-plum/70">
                {activeDestination.reason}
              </p>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {!activeDestination && (
        <p className="mt-6 font-body text-xs text-plum/40">
          Tap a light on the map.
        </p>
      )}

      <ChapterFooter
        onNext={onNext}
        disabled={!allVisited}
        label="Continue to Chapter Four"
        hint="What you don't see in yourself."
      />
    </div>
  );
}
