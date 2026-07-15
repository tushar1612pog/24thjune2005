"use client";

import { motion, AnimatePresence } from "framer-motion";
import { fadeOnly } from "@/lib/animations";

type RevealTextProps = {
  text: string;
  className?: string;
};

/** A single line of text that fades in, holds, then the parent swaps it out. */
export default function RevealText({ text, className = "" }: RevealTextProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.p
        key={text}
        variants={fadeOnly}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={className}
      >
        {text}
      </motion.p>
    </AnimatePresence>
  );
}
