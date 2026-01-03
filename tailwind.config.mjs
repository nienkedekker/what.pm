/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#c45d3a",
          light: "#d4826a",
          dark: "#a34829",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ['"Goudy Bookletter 1911"', "Georgia", "serif"],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "65ch",
            a: {
              color: "#c45d3a",
              textDecoration: "none",
              "&:hover": {
                textDecoration: "underline",
              },
            },
            h1: { fontFamily: '"Goudy Bookletter 1911", Georgia, serif' },
            h2: { fontFamily: '"Goudy Bookletter 1911", Georgia, serif' },
            h3: { fontFamily: '"Goudy Bookletter 1911", Georgia, serif' },
          },
        },
        invert: {
          css: {
            a: {
              color: "#d4826a",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
