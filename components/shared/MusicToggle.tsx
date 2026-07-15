"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { music } from "@/lib/content";

export default function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio(music.src);
    audioRef.current.loop = true;
    audioRef.current.volume = 0.35;
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (playing) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {
        // autoplay restrictions — silently ignore, user can retry
      });
    }
    setPlaying((p) => !p);
  };

  return (
    <motion.button
      onClick={toggle}
      aria-label={playing ? "Pause background music" : "Play background music"}
      aria-pressed={playing}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 1 }}
      className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full glass shadow-[0_4px_20px_rgba(74,59,82,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
    >
      <span className="sr-only">{music.label}</span>
      {playing ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="3" y="2" width="3" height="12" rx="1" fill="#4A3B52" />
          <rect x="10" y="2" width="3" height="12" rx="1" fill="#4A3B52" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M4 2.5v11l10-5.5-10-5.5z" fill="#4A3B52" />
        </svg>
      )}
    </motion.button>
  );
}
