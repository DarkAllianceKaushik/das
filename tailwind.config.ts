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
        alliance: {
          black: "#0a0a0a",
          darker: "#111111",
          dark: "#1a1a1a",
          card: "#141414",
          border: "#2a1515",
          red: "#dc2626",
          "red-bright": "#ef4444",
          "red-glow": "#ff3333",
          crimson: "#991b1b",
          muted: "#a3a3a3",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(220, 38, 38, 0.25)",
        "glow-sm": "0 0 15px rgba(220, 38, 38, 0.2)",
      },
      backgroundImage: {
        "grid-red":
          "linear-gradient(rgba(220,38,38,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.03) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};

export default config;
