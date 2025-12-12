/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";
export default {
  content: [
    "./public/**/*.html",
    "./public/pages/**/*.html",
    "./public/scripts/**/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        mona: ["Mona Sans", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          50: "#E7F8FE",
          100: "#BBEDFC",
          200: "#8FE1FA",
          300: "#63D5F8",
          400: "#27C5F5",
          500: "#0BBDF4",
          600: "#0BBDF4",
          700: "#07799C",
          800: "#033544",
          900: "#011318",
        },
        accent: {
          500: "#F8295C",
          600: "#F5275E",
        },
        bgdark: "#121217",
        bglight: "#F9F9F9",
        subgdark: "#1E1E25",
        subglight: "#EDEDED",
        fontFamily: {},
      },
      fontFamily: {
        sans: ["Mona Sans", ...defaultTheme.fontFamily.sans],
      },
      animation: {
        "slide-down": "slideDown 0.3s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        shake: "shake 0.5s ease-in-out",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        slideDown: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(0)", opacity: "1" },
          "100%": { transform: "translateY(-100%)", opacity: "0" },
        },
        shake: {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-5px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(5px)" },
        },
      },
    },
  },
  darkMode: "class",

  plugins: [],
};
