"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import ChapterFooter from "@/components/shared/ChapterFooter";
import { scrapbookMemories } from "@/lib/content";

function ScrapbookCard({
  memory,
  onOpen,
  opened,
  offset,
}: {
  memory: (typeof scrapbookMemories)[number];
  onOpen: () => void;
  opened: boolean;
  offset: number;
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      drag
      dragElastic={0.4}
      whileDrag={{ scale: 1.05, zIndex: 20 }}
      onClick={onOpen}
      initial={{ rotate: memory.rotation, opacity: 0, y: 30 }}
      animate={{ rotate: memory.rotation, opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: offset * 0.1 }}
      className="relative w-40 cursor-grab rounded-lg bg-white p-2 pb-8 shadow-[0_10px_30px_rgba(74,59,82,0.18)] active:cursor-grabbing md:w-48"
    >
      <div className="aspect-square w-full overflow-hidden rounded bg-peach/30">
        {!imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={memory.photo}
            alt={memory.caption}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-peach/60 to-lavender/40">
            <span className="font-display text-xs italic text-plum/40">
              photo
            </span>
          </div>
        )}
        {memory.isTest && (
          <span className="pointer-events-none absolute left-1 top-1 rounded-full bg-coral px-2 py-0.5 font-body text-[9px] font-semibold uppercase tracking-wider text-vanilla shadow">
            Test — replace me
          </span>
        )}
      </div>
      {opened && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-2 left-2 right-2 text-center font-display text-[11px] italic text-plum/70"
        >
          {memory.caption}
        </motion.p>
      )}
    </motion.div>
  );
}

export default function Chapter8Scrapbook({ onNext }: { onNext: () => void }) {
  const [opened, setOpened] = useState<Set<string>>(new Set());
  const containerRef = useRef<HTMLDivElement>(null);

  const open = (id: string) =>
    setOpened((prev) => new Set(prev).add(id));

  const allOpened = opened.size === scrapbookMemories.length;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center px-6 py-24">
      <p className="mb-2 font-body text-xs uppercase tracking-[0.3em] text-coral">
        Chapter Eight
      </p>
      <h2 className="mb-3 text-center font-display text-3xl text-plum md:text-5xl">
        Our Story
      </h2>
      <p className="mb-10 max-w-sm text-center font-body text-sm text-plum/60">
        Drag them around. Tap one to read it.
      </p>

      <div
        ref={containerRef}
        className="relative flex w-full max-w-2xl flex-wrap items-center justify-center gap-6"
      >
        {scrapbookMemories.map((memory, i) => (
          <ScrapbookCard
            key={memory.id}
            memory={memory}
            offset={i}
            opened={opened.has(memory.id)}
            onOpen={() => open(memory.id)}
          />
        ))}
      </div>

      <ChapterFooter
        onNext={onNext}
        disabled={!allOpened}
        label="Continue to Chapter Nine"
        hint="21 reasons, one for every year."
      />
    </div>
  );
}
