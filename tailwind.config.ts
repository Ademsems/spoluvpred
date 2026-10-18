import type { Config } from "tailwindcss";
import { BRAND } from "./src/lib/brand";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: BRAND.blue,
          red: BRAND.red,
          navy: BRAND.navy,
          burgundy: BRAND.burgundy,
        },
        surface: BRAND.surface,
        ink: BRAND.ink,
      },
      fontFamily: {
        // `--font-sans` is injected by next/font (Nunito Sans) in app/layout.tsx.
        // Avenir Next is the brand typeface; Nunito Sans is its web stand-in.
        sans: [
          "var(--font-sans)",
          '"Avenir Next"',
          "Avenir",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          '"Segoe UI"',
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        soft: "0 12px 32px -14px rgba(8, 45, 112, 0.28)",
        lift: "0 22px 44px -18px rgba(8, 45, 112, 0.38)",
        cta: "0 12px 24px -10px rgba(218, 13, 59, 0.55)",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.65", transform: "scale(0.92)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        twinkle: "twinkle 3.2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
