"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * The signature element: a single soft light that follows the cursor/touch
 * across the whole journey, growing warmer as more chapters unlock.
 * Reappears transformed as the final star in Chapter 10.
 */
export default function Firefly({ warmth = 0 }: { warmth?: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 20, stiffness: 60 });
  const springY = useSpring(y, { damping: 20, stiffness: 60 });
  const frame = useRef<number>();

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      x.set(clientX);
      y.set(clientY);
    };
    const onMouse = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) handleMove(t.clientX, t.clientY);
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch);
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [x, y]);

  const hue = 24 + Math.min(warmth, 1) * 16; // drifts from coral toward gold

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-30 hidden md:block"
      style={{
        x: springX,
        y: springY,
        translateX: "-50%",
        translateY: "-50%",
      }}
    >
      <div
        className="h-3 w-3 rounded-full animate-flicker"
        style={{
          background: `hsl(${hue} 80% 70%)`,
          boxShadow: `0 0 20px 6px hsl(${hue} 90% 70% / 0.55)`,
        }}
      />
    </motion.div>
  );
}
