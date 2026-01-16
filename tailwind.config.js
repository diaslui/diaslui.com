/** @type {import('tailwindcss').Config} */
import defaultTheme from "tailwindcss/defaultTheme";
export default {
  content: [
    "./views/**/*.ejs",
    "./views/*.ejs",
    "./views/views/**/*.ejs",
    "./public/scripts/*.js",
  ],
  theme: {
    extend: {
      fontFamily: {
        mona: ["Mona Sans", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          50: "#EBF2FA",
          100: "#C6DBF1",
          200: "#A1C3E8",
          300: "#7CACDE",
          400: "#5894D5",
          500: "#3178C6",
          600: "#215083",
          700: "#17395E",
          800: "#0E2339",
          900: "#050C14",
        },
        accent: {
          500: "#F8295C",
          600: "#C63331",
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
