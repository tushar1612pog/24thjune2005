"use client";

import { motion } from "framer-motion";
import { useMusic } from "@/lib/musicContext";

/**
 * Bottom-right vinyl "sticker" — Instagram's music-sticker aesthetic.
 * Spins continuously while a track is playing, freezes when paused.
 * The CSS animation is never unmounted/remounted, only paused via
 * animationPlayState, so rotation always resumes smoothly instead of
 * snapping back to 0deg.
 */
export default function MusicToggle() {
  const { isPlaying, togglePlayPause } = useMusic();

  return (
    <motion.button
      onClick={togglePlayPause}
      aria-label={isPlaying ? "Pause music" : "Play music"}
      aria-pressed={isPlaying}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.08, rotate: isPlaying ? 0 : 6 }}
      whileTap={{ scale: 0.94 }}
      transition={{ delay: 1.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="vinyl-toggle fixed bottom-6 right-6 z-40 h-16 w-16 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral focus-visible:ring-offset-2 focus-visible:ring-offset-vanilla"
    >
      <span className="sr-only">{isPlaying ? "Pause background music" : "Play background music"}</span>

      <div className="vinyl-record" style={{ animationPlayState: isPlaying ? "running" : "paused" }}>
        <div className="vinyl-groove" style={{ inset: "10%" }} />
        <div className="vinyl-groove" style={{ inset: "16%" }} />
        <div className="vinyl-groove" style={{ inset: "22%" }} />
        <div className="vinyl-shine" />
        <div className="vinyl-label">
          <div className="vinyl-spindle" />
        </div>
      </div>

      <div className="vinyl-icon">
        {isPlaying ? (
          <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
            <rect x="3" y="2" width="3" height="12" rx="1" fill="#FBF3E7" />
            <rect x="10" y="2" width="3" height="12" rx="1" fill="#FBF3E7" />
          </svg>
        ) : (
          <svg width="9" height="9" viewBox="0 0 16 16" fill="none">
            <path d="M4 2.5v11l10-5.5-10-5.5z" fill="#FBF3E7" />
          </svg>
        )}
      </div>
    </motion.button>
  );
}
