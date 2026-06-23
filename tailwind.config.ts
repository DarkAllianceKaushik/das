import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        glass: {
          black: "#07070d",
          darker: "#0f0f1a",
          dark: "#191928",
          card: "rgba(25, 25, 48, 0.55)",
          border: "rgba(255, 255, 255, 0.06)",
          "border-light": "rgba(255, 255, 255, 0.12)",
          accent: "#7c3aed",
          "accent-bright": "#a78bfa",
          "accent-dim": "#6d28d9",
          "accent-glow": "#8b5cf6",
          muted: "#9ca3af",
          "muted-dim": "#6b7280",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.4)",
        "glass-sm": "0 4px 16px rgba(0, 0, 0, 0.3)",
      },
      backdropBlur: {
        glass: "24px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        "wave": "wave 1.5s ease-in-out",
        "wave-hand": "waveHand 0.5s ease-in-out",
        "pulse-slow": "pulseSlow 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(8px) scale(0.96)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        wave: {
          "0%, 100%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.15) rotate(-5deg)" },
          "50%": { transform: "scale(1.05) rotate(5deg)" },
          "75%": { transform: "scale(1.1) rotate(-3deg)" },
        },
        waveHand: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(-20deg)" },
          "75%": { transform: "rotate(15deg)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
