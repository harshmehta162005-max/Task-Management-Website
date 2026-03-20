import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5048e5",
        "primary-hover": "#4338CA",
        "background-light": "#f6f6f8",
        "background-dark": "#121121",
        surface: "#111827",
        "surface-dark": "#111827",
        "card-dark": "#111827",
        "border-subtle": "rgba(255, 255, 255, 0.08)",
        "border-dark": "rgba(255,255,255,0.08)",
        "border-dark-strong": "#1f2937",
      },
      fontFamily: {
        display: ["var(--font-manrope)", "sans-serif"],
      },
      borderRadius: {
        lg: "1rem",
        xl: "1.5rem",
        "2xl": "2rem",
        full: "9999px",
      },
    },
  },
  plugins: [forms, require("@tailwindcss/typography")],
};

export default config;
