"use client";

import { motion } from "framer-motion";

export default function ChapterHeading({
  label,
  title,
  dark = false,
  className = "",
}: {
  label: string;
  title: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div className={`mb-8 text-center ${className}`}>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className={`mb-2 font-body text-xs uppercase tracking-[0.3em] ${
          dark ? "text-gold" : "text-coral"
        }`}
      >
        {label}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.2 }}
        className={`font-display text-3xl md:text-5xl ${
          dark ? "text-vanilla" : "text-plum"
        }`}
      >
        {title}
      </motion.h2>
    </div>
  );
}
