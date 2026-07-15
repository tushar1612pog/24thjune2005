"use client";

import { motion } from "framer-motion";

type ChapterFooterProps = {
  onNext: () => void;
  label?: string;
  disabled?: boolean;
  hint?: string;
  variant?: "light" | "dark";
};

/** Consistent "advance the journey" control, shown once a chapter is ready. */
export default function ChapterFooter({
  onNext,
  label = "Continue",
  disabled = false,
  hint,
  variant = "light",
}: ChapterFooterProps) {
  const dark = variant === "dark";
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2"
    >
      {hint && !disabled && (
        <span
          className={`font-body text-xs tracking-wide ${
            dark ? "text-vanilla/50" : "text-plum/50"
          }`}
        >
          {hint}
        </span>
      )}
      <button
        onClick={onNext}
        disabled={disabled}
        className={`rounded-full border px-8 py-3 font-body text-xs tracking-[0.2em] transition-all disabled:cursor-not-allowed disabled:opacity-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral ${
          dark
            ? "border-vanilla/25 text-vanilla/80 hover:border-gold hover:text-gold"
            : "border-plum/20 text-plum/80 hover:border-coral hover:text-coral"
        }`}
      >
        {label.toUpperCase()}
      </button>
    </motion.div>
  );
}
