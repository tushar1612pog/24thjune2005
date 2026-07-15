"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { chapterTransition } from "@/lib/animations";

export default function ChapterTransition({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <motion.div
      variants={chapterTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="chapter-section"
    >
      {children}
    </motion.div>
  );
}
