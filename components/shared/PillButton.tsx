"use client";

import { ButtonHTMLAttributes } from "react";

type PillButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  size?: "sm" | "md";
  dark?: boolean;
};

/**
 * The one button style used everywhere: intro CTA, chapter-footer
 * "continue," inline secondary actions ("keep going," "another"), form
 * submits. Centralizing this is what keeps padding/radius/hover consistent
 * across every chapter instead of each one hand-rolling its own.
 */
export default function PillButton({
  variant = "secondary",
  size = "md",
  dark = false,
  className = "",
  children,
  ...rest
}: PillButtonProps) {
  const sizeClasses = size === "md" ? "px-8 py-3 text-xs" : "px-6 py-2 text-[11px]";

  const variantClasses =
    variant === "primary"
      ? dark
        ? "bg-gold text-plum hover:scale-105"
        : "bg-coral text-vanilla hover:scale-105 shadow-[0_8px_30px_rgba(232,146,124,0.4)]"
      : dark
      ? "border border-vanilla/25 text-vanilla/80 hover:border-gold hover:text-gold"
      : "border border-plum/20 text-plum/80 hover:border-coral hover:text-coral";

  return (
    <button
      className={`rounded-full font-body tracking-[0.2em] transition-all duration-300 focus:outline-none focus-visible:ring-2 ${
        dark ? "focus-visible:ring-gold" : "focus-visible:ring-coral"
      } disabled:cursor-not-allowed disabled:opacity-0 ${sizeClasses} ${variantClasses} ${className}`}
      {...rest}
    >
      {typeof children === "string" ? children.toUpperCase() : children}
    </button>
  );
}
