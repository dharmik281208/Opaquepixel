/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#030f09",
          card: "rgba(16,185,129,0.04)",
          glass: "rgba(4,24,15,0.75)",
          border: "rgba(52,211,153,0.12)",
          muted: "#6b7280",
          text: "#f3f4f6",
          dim: "#9ca3af",
        },
        accent: {
          purple: "#10b981",
          blue: "#06b6d4",
          pink: "#84cc16",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Syne", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      spacing: {
        section: "5rem",
        "section-lg": "7rem",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
        glow: "0 0 60px rgba(168,85,247,0.25)",
        pill: "0 4px 24px rgba(0,0,0,0.35)",
      },
      animation: {
        "fade-up": "fadeUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards",
        "fade-in": "fadeIn 0.5s ease forwards",
        float: "float 12s ease-in-out infinite",
        "gradient-flow": "gradientFlow 18s ease infinite",
        "gradient-shift": "gradientShift 24s ease-in-out infinite",
        "pulse-glow": "pulseGlow 4s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        float: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(30px, -40px) scale(1.08)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.95)" },
        },
        gradientFlow: {
          "0%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        gradientShift: {
          "0%, 100%": { transform: "translate(0%, 0%) rotate(0deg)" },
          "25%": { transform: "translate(5%, -8%) rotate(2deg)" },
          "50%": { transform: "translate(-4%, 6%) rotate(-1deg)" },
          "75%": { transform: "translate(6%, 4%) rotate(1deg)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.75" },
        },
      },
    },
  },
  plugins: [],
};
