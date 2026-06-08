import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#17201b",
        canvas: "#f4f6f2",
        forest: "#24563c",
        mint: "#dcecdf",
        warning: "#b74d2f",
      },
      boxShadow: {
        card: "0 12px 32px rgba(36, 86, 60, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
