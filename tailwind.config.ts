import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        vanilla: "#FBF3E7",
        peach: "#F4C7B6",
        coral: "#E8927C",
        lavender: "#C9B8D8",
        plum: "#4A3B52",
        gold: "#E8B04B",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-instrument)", "sans-serif"],
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate(0, 0)" },
          "50%": { transform: "translate(12px, -18px)" },
        },
        flicker: {
          "0%, 100%": { opacity: "0.6", filter: "blur(1px)" },
          "50%": { opacity: "1", filter: "blur(0.5px)" },
        },
      },
      animation: {
        drift: "drift 8s ease-in-out infinite",
        flicker: "flicker 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
