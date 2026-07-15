"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ParticleField from "@/components/shared/ParticleField";
import ChapterFooter from "@/components/shared/ChapterFooter";
import { littleThings } from "@/lib/content";

export default function Chapter2LittleThings({
  onNext,
}: {
  onNext: () => void;
}) {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());
  const [popup, setPopup] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const flip = (i: number) => {
    const item = littleThings[i];
    setFlipped((prev) => new Set(prev).add(i));

    // Fire the card's reaction — a playful pop-up, and audio if it has one.
    setPopup(item.reaction.message);
    setTimeout(() => setPopup((p) => (p === item.reaction.message ? null : p)), 2600);

    if (item.reaction.type === "audio") {
      if (!audioRef.current) audioRef.current = new Audio();
      audioRef.current.src = item.reaction.src;
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch(() => {
        // autoplay restrictions or missing file — pop-up message still shows
      });
    }
  };

  const allFlipped = flipped.size === littleThings.length;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center px-6 py-24">
      <ParticleField color="#C9B8D8" count={16} />

      {/* reaction pop-up */}
      <AnimatePresence>
        {popup && (
          <motion.div
            key={popup}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute top-16 z-20 rounded-full bg-plum px-6 py-2.5 shadow-[0_8px_24px_rgba(74,59,82,0.35)]"
          >
            <span className="whitespace-nowrap font-display text-sm italic text-vanilla">
              {popup}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="mb-2 font-body text-xs uppercase tracking-[0.3em] text-coral">
        Chapter Two
      </p>
      <h2 className="mb-3 text-center font-display text-3xl text-plum md:text-5xl">
        Little Things That Make You…
      </h2>
      <p className="mb-10 max-w-md text-center font-body text-sm text-plum/60">
        Tap each one.
      </p>

      <div className="grid w-full max-w-2xl grid-cols-2 gap-4 md:grid-cols-3">
        {littleThings.map((item, i) => {
          const isFlipped = flipped.has(i);
          return (
            <button
              key={item.label}
              onClick={() => flip(i)}
              className="relative h-32 [perspective:1000px] focus:outline-none"
              aria-label={item.label}
            >
              <motion.div
                animate={{ rotateY: isFlipped ? 180 : 0 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="relative h-full w-full [transform-style:preserve-3d]"
              >
                {/* front */}
                <div className="glass absolute inset-0 flex items-center justify-center rounded-2xl [backface-visibility:hidden]">
                  <span className="font-display text-2xl text-plum/40">?</span>
                </div>
                {/* back */}
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-coral/90 px-3 text-center [backface-visibility:hidden]"
                  style={{ transform: "rotateY(180deg)" }}
                >
                  <span className="font-body text-[10px] uppercase tracking-widest text-vanilla/70">
                    {item.label}
                  </span>
                  <span className="mt-1 font-display text-base text-vanilla">
                    {item.value}
                  </span>
                </div>
              </motion.div>
            </button>
          );
        })}
      </div>

      <ChapterFooter
        onNext={onNext}
        disabled={!allFlipped}
        label="Continue to Chapter Three"
        hint="A map of everywhere you'd rather be."
      />
    </div>
  );
}
