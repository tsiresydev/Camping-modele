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
          "gray-light": "#F4F4F5",
          "gray-border": "#E4E4E7",
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
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
} satisfies Config;
