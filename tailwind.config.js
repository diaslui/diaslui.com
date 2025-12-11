/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/public/**/*.html",
    "./src/public/pages/**/*.html",
    "./src/public/scripts/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EBC7D1",
          100: "#DFA6B6",
          200: "#D3849B",
          300: "#C7637F",
          400: "#BA4365",
          500: "#983752",
          600: "#772B40",
          700: "#551F2E",
          800: "#34131C",
          900: "#13070A",
        },
        accent: {
          500: "#F7E9F2",
          600: "#983776",
        },
        bgdark: "#121217",
        bglight: "#F9F9F9",
        subgdark: "#1E1E25",
        subglight: "#EDEDED",
      },
      fontFamily: {
        sans: ['Mona Sans', 'sans-serif'],
      },
    },
  },
  darkMode: "class",

  plugins: [],
};
