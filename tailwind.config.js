/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0d0e12",
        surface: "#16181e",
        border: "#262933",
        accent: "#6366f1",
        accentHover: "#4f46e5",
      },
    },
  },
  plugins: [],
};
