import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

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
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "spin-slower": "spin 4s linear infinite",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "white",
            a: {
              color: "white",
              "&:hover": {
                color: "#e5e5e5",
              },
            },
            strong: {
              color: "white",
            },
            h1: {
              color: "white",
            },
            h2: {
              color: "white",
            },
            h3: {
              color: "white",
            },
            h4: {
              color: "white",
            },
            p: {
              color: "white",
            },
            li: {
              color: "white",
            },
            ul: {
              color: "white",
            },
            blockquote: {
              color: "white",
              borderLeftColor: "#e5e5e5",
            },
            code: {
              color: "white",
            },
            pre: {
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
            },
            hr: {
              borderColor: "#404040",
            },
          },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
