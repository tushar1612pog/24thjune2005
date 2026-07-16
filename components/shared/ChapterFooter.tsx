"use client";

import { motion } from "framer-motion";
import PillButton from "@/components/shared/PillButton";

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
      <PillButton
        variant="secondary"
        size="md"
        dark={dark}
        onClick={onNext}
        disabled={disabled}
      >
        {label}
      </PillButton>
    </motion.div>
  );
}
