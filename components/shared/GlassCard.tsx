"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

type GlassCardProps = HTMLMotionProps<"div"> & {
  children: ReactNode;
};

export default function GlassCard({
  children,
  className = "",
  ...rest
}: GlassCardProps) {
  return (
    <motion.div
      className={`glass rounded-3xl px-6 py-5 shadow-[0_8px_32px_rgba(74,59,82,0.08)] ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
