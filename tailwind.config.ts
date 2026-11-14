import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        island: {
          bg: "#050505",
          surface: "#0c0d0e",
          card: "#141517",
          border: "#23262a",
          highlight: "#2e3238",
          text: "#f4f4f5",
          muted: "#9ba1a6",
          accent: "#38bdf8",
        },
      },
      borderRadius: {
        pill: "9999px",
        notch: "24px",
      },
      boxShadow: {
        notch: "0 10px 30px -5px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)",
        glow: "0 0 20px -3px rgba(56, 189, 248, 0.25)",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;

