import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        slate: {
          850: "#151e2e",
          950: "#090d16",
        },
      },
      fontFamily: {
        bengali: ["'Hind Siliguri'", "sans-serif"],
        english: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;

