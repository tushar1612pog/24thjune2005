"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

type ParticleFieldProps = {
  count?: number;
  color?: string;
  className?: string;
};

/**
 * Lightweight decorative particles (dust / pollen / stars depending on
 * chapter color). Deterministic-ish random so it doesn't hydrate-mismatch.
 */
export default function ParticleField({
  count = 18,
  color = "#E8927C",
  className = "",
}: ParticleFieldProps) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        size: 2 + ((i * 37) % 5),
        left: (i * 53) % 100,
        top: (i * 29) % 100,
        delay: (i % 8) * 0.4,
        duration: 6 + (i % 5),
      })),
    [count]
  );

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full animate-drift"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            background: color,
            opacity: 0.35,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
