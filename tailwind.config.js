/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,vue}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        cyber: {
          bg: "#030712",
          panel: "#0b1222",
          line: "#1e293b",
          cyan: "#22d3ee",
          blue: "#3b82f6",
          indigo: "#6366f1",
          violet: "#8b5cf6",
          pink: "#ec4899",
          text: "#e2e8f0",
          muted: "#64748b",
        },
      },
      fontFamily: {
        display: [
          "'Orbitron'",
          "'Rajdhani'",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        body: [
          "'Rajdhani'",
          "'Inter'",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "'JetBrains Mono'",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      boxShadow: {
        neon:
          "0 0 20px rgba(34,211,238,0.35), 0 0 60px rgba(59,130,246,0.15)",
        "neon-lg":
          "0 0 40px rgba(99,102,241,0.35), 0 0 80px rgba(139,92,246,0.2)",
        panel:
          "inset 0 0 0 1px rgba(59,130,246,0.25), 0 8px 32px rgba(2,6,23,0.6)",
      },
      backgroundImage: {
        "grid-dark":
          "linear-gradient(rgba(34,211,238,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.07) 1px, transparent 1px)",
        "radial-cyber":
          "radial-gradient(circle at 20% 10%, rgba(99,102,241,0.25), transparent 40%), radial-gradient(circle at 80% 0%, rgba(236,72,153,0.18), transparent 45%), radial-gradient(circle at 50% 100%, rgba(34,211,238,0.18), transparent 40%)",
      },
      keyframes: {
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.75" },
        },
      },
      animation: {
        scan: "scan 6s linear infinite",
        "pulse-glow": "pulseGlow 3s ease-in-out infinite",
        flicker: "flicker 2.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
