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
    },
  },
  plugins: [],
};

export default config;
