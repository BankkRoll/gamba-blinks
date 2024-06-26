// tailwind.config.ts
import { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        twitter: {
          neutral: {
            100: "#0f1419",
            80: "#202327",
            70: "#2f3336",
            50: "#6E767D",
            40: "#C4C4C4",
            30: "#d9d9d9",
            20: "#eff3f4",
          },
          accent: {
            DEFAULT: "#1d9bf0",
            darker: "#428cd2",
          },
          success: "#12dc88",
          error: {
            DEFAULT: "#ff5e5e",
            lighter: "#ff7373",
          },
          warning: {
            DEFAULT: "#ff9900",
            lighter: "#ffb23d",
          },
        },
      },
      fontSize: {
        text: ["1rem", "1.2rem"], // assuming twitter font size base - 15px
        subtext: ["0.867rem", "1.067rem"],
        caption: ["0.73333rem", "0.93333rem"],
      },
      boxShadow: {
        action:
          "0px 2px 8px 0px rgba(59, 176, 255, 0.22), 0px 1px 48px 0px rgba(29, 155, 240, 0.32)",
      },
    },
  },
  plugins: [],
};

export default config;
