"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ParticleField from "@/components/shared/ParticleField";
import ChapterFooter from "@/components/shared/ChapterFooter";
import { staggerChildren, fadeUp } from "@/lib/animations";

type TimelineMoment = {
  year: string;
  text: string;
};

// EDIT ME — replace with real early-life milestones.
const moments: TimelineMoment[] = [
  { year: "July 24, 2005", text: "Born in Hyderabad — the beginning of everything." },
  {
    year: "Evenings, growing up",
    text: "She'd walk to the office campus where they lived, just to bring her father home. He'd spend the hour playing carrom, waiting for his wife and kids to show up so they could all walk back together.",
  },
  {
    year: "The move to Delhi",
    text: "Then came the move to Delhi, and joining Vandana International School in 2nd standard — a new city, a new school, and a childhood that didn't always come with a lot of friends. It quietly shaped who she'd become.",
  },
  { year: "Today", text: "21 years, and still just the beginning." },
];

export default function Chapter1Beginning({
  onNext,
}: {
  onNext: () => void;
}) {
  const [revealed, setRevealed] = useState(1);
  const allRevealed = revealed >= moments.length;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center px-6">
      <ParticleField color="#E8927C" count={14} />

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="mb-2 font-body text-xs uppercase tracking-[0.3em] text-coral"
      >
        Chapter One
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="mb-12 text-center font-display text-3xl text-plum md:text-5xl"
      >
        The Beginning
      </motion.h2>

      <motion.ol
        variants={staggerChildren(0.15)}
        initial="hidden"
        animate="visible"
        className="relative flex w-full max-w-xl flex-col gap-8 border-l border-plum/15 pl-8"
      >
        {moments.slice(0, revealed).map((m, i) => (
          <motion.li key={m.year + i} variants={fadeUp} className="relative">
            <span className="absolute -left-[2.35rem] top-1.5 h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_8px_2px_rgba(232,176,75,0.5)]" />
            <p className="font-display text-sm italic text-coral">{m.year}</p>
            <p className="mt-1 font-body text-lg text-plum">{m.text}</p>
          </motion.li>
        ))}
      </motion.ol>

      {!allRevealed && (
        <button
          onClick={() => setRevealed((r) => r + 1)}
          className="mt-10 font-body text-xs tracking-[0.2em] text-plum/50 underline decoration-plum/20 underline-offset-4 transition-colors hover:text-coral"
        >
          KEEP GOING
        </button>
      )}

      <ChapterFooter
        onNext={onNext}
        disabled={!allRevealed}
        label="Continue to Chapter Two"
        hint="The little things, next."
      />
    </div>
  );
}
