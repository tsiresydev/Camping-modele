import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
          scout: {
          yellow: "#FFE100",
          "yellow-dark": "#E6C700",
          black: "#111111",
          red: "#E53E3E",
          "gray-light": "#F4F4F5",
          "gray-border": "#E4E4E7",
          charcoal: "#1A1A1A",
          mist: "#AEB8BA",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Poppins", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px rgba(17,17,17,0.08), 0 8px 24px rgba(17,17,17,0.06)",
        "card-hover": "0 4px 12px rgba(17,17,17,0.12), 0 16px 40px rgba(17,17,17,0.10)",
        btn: "0 2px 8px rgba(255,225,0,0.45)",
        lift: "0 10px 24px rgba(0,0,0,0.45)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "screen-in": {
          "0%": { opacity: "0", transform: "translateY(10px) scale(0.99)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        eq: {
          "0%, 100%": { transform: "scaleY(0.28)" },
          "50%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "screen-in": "screen-in 0.28s ease-out both",
        eq: "eq 0.9s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
