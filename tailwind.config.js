/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    fontFamily: {
      sans: ['Noto Sans Thai', 'sans-serif'],
    },
    extend: {},
  },
  colors: {
    primary: "#1182c5",
    secondary: "#2aa6df",
    dark: "#1e1e1e",
    light: "#f5f5f5",
  },
  container: {
    center: true,
    padding: {
      DEFAULT: "1rem",
      sm: "3rem",
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark", "cupcake", "synthwave"],
  },
  
}