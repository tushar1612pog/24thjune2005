import { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    y: -16,
    filter: "blur(6px)",
    transition: { duration: 0.6, ease: "easeIn" },
  },
};

export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1.2, ease: "easeInOut" } },
  exit: { opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } },
};

// The site's signature text-reveal: nothing simply "appears." It surfaces
// slowly out of blur, like it's being remembered rather than rendered.
// Used across the intro and available for any chapter that wants the same
// language. Deliberately avoids typing effects, bounce, or snappy easing.
export const remembered: Variants = {
  hidden: { opacity: 0, y: 10, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.6, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -6,
    filter: "blur(10px)",
    transition: { duration: 1.2, ease: [0.4, 0, 1, 1] },
  },
};

export const staggerChildren = (stagger = 0.12): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger },
  },
});

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export const chapterTransition: Variants = {
  initial: { opacity: 0, scale: 1.04, filter: "blur(12px)" },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    filter: "blur(12px)",
    transition: { duration: 0.7, ease: "easeIn" },
  },
};
