/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ground: "#0a0c10",
        surface: {
          raised: "#12161f",
          inset: "#07080c",
          hover: "#18202e",
          border: "#1e2638",
          "border-strong": "#2a364f",
        },
        nominal: {
          DEFAULT: "#10b981",
          dim: "#052e16",
          glow: "rgba(16, 185, 129, 0.15)",
        },
        warning: {
          DEFAULT: "#f59e0b",
          dim: "#451a03",
          glow: "rgba(245, 158, 11, 0.15)",
        },
        critical: {
          DEFAULT: "#ef4444",
          dim: "#450a0a",
          glow: "rgba(239, 68, 68, 0.15)",
        },
        aws: {
          blue: "#3b82f6",
          orange: "#ff9900",
          dim: "#1e3a8a",
        },
        telemetry: {
          cyan: "#06b6d4",
          purple: "#a855f7",
        }
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.025em",
        wideCode: "0.08em",
      },
      animation: {
        "pulse-subtle": "pulseSubtle 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "beacon": "beaconPing 2s cubic-bezier(0, 0, 0.2, 1) infinite",
      },
      keyframes: {
        pulseSubtle: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        beaconPing: {
          "75%, 100%": { transform: "scale(2)", opacity: "0" },
        }
      }
    },
  },
  plugins: [],
};
