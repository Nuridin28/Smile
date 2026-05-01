import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
        display: ["var(--font-display)", "Georgia", "serif"]
      },
      colors: {
        cream: {
          50: "#fbf8f3",
          100: "#f5f1ea",
          200: "#ece5d8"
        },
        ink: {
          50: "#f5f3ef",
          100: "#e5ded2",
          200: "#cabfae",
          300: "#a89c87",
          400: "#8a7f70",
          500: "#6b6258",
          600: "#4a4339",
          700: "#2c2620",
          800: "#1a1815",
          900: "#0f0d0b"
        },
        accent: {
          DEFAULT: "#7d3a2c",
          dark: "#5e2a1f",
          tint: "#d4b8b0"
        }
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 9vw, 8rem)", { lineHeight: "0.92", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.5rem, 6vw, 5rem)", { lineHeight: "0.95", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }]
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        rise: "rise 0.6s cubic-bezier(0.16, 1, 0.3, 1) both"
      }
    }
  },
  plugins: []
};
export default config;
