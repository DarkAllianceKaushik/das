import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        alliance: {
          black: "#000000",
          darker: "#1C1C1E",
          dark: "#2C2C2E",
          card: "#3A3A3C",
          border: "#38383A",
          red: "#FF453A",
          "red-bright": "#FF6961",
          "red-glow": "#FF453A",
          crimson: "#BF5A5A",
          muted: "#8E8E93",
        },
        glass: {
          black: "#000000",
          darker: "#1C1C1E",
          dark: "#2C2C2E",
          card: "rgba(44, 44, 46, 0.75)",
          border: "rgba(255, 255, 255, 0.08)",
          "border-light": "rgba(255, 255, 255, 0.15)",
          accent: "#0A84FF",
          "accent-bright": "#5AC8FA",
          "accent-dim": "#007AFF",
          "accent-glow": "#0A84FF",
          muted: "#8E8E93",
          "muted-dim": "#636366",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: {
            DEFAULT: "var(--sidebar-primary)",
            foreground: "var(--sidebar-primary-foreground)",
          },
          accent: {
            DEFAULT: "var(--sidebar-accent)",
            foreground: "var(--sidebar-accent-foreground)",
          },
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
        },
      },
      fontFamily: {
        display: ["-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
        body: ["-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(10, 132, 255, 0.3)",
        "glow-sm": "0 0 15px rgba(10, 132, 255, 0.2)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.5)",
        "glass-sm": "0 4px 16px rgba(0, 0, 0, 0.4)",
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "grid-red":
          "linear-gradient(rgba(10,132,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(10,132,255,0.03) 1px, transparent 1px)",
      },
      backdropBlur: {
        glass: "24px",
      },
      animation: {
        "fade-in": "fadeIn 0.3s ease-out",
        wave: "wave 1.5s ease-in-out",
        "wave-hand": "waveHand 0.5s ease-in-out",
        "pulse-slow": "pulseSlow 3s ease-in-out infinite",
        "gradient-shift": "gradientShift 20s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
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
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(10,132,255,0.15)" },
          "50%": { boxShadow: "0 0 40px rgba(10,132,255,0.3)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;