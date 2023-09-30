// tailwind.config.js
import {
  nextui
} from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: [
    // ...
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{html,js}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        black: "#000000",
        green: {
          50: "#E8FAF0",
          100: "#E0F8C9",
          200: "#BDF296",
          300: "#88DA5D",
          400: "#56B533",
          500: "#1F8506",
          600: "#117204",
          700: "#075F03",
          800: "#014D03",
          900: "#013F07",
        }
        // .. rest of the colors
      },
    },
  },
  darkMode: "class",
  plugins: [nextui({
    prefix: "nextui", // prefix for themes variables
    addCommonColors: true, // override common colors (e.g. "blue", "green", "pink").
    defaultTheme: "light", // default theme from the themes object
    defaultExtendTheme: "light", // default theme to extend on custom themes
    themes: {
      light: {
        colors: {
          background: "#FFFFFF", // or DEFAULT
          foreground: "#11181C", // or 50 to 900 DEFAULT
          success: {
            50: "#E8FAF0",
            100: "#E0F8C9",
            200: "#BDF296",
            300: "#88DA5D",
            400: "#56B533",
            500: "#1F8506",
            600: "#117204",
            700: "#075F03",
            800: "#014D03",
            900: "#013F07",
            foreground: "#FFFFFF",
            DEFAULT: "#1F8506",
          },
        },
      },
      dark: {
        colors: {
          background: "#11181C", // or DEFAULT
          foreground: "#FFFFFF", // or 50 to 900 DEFAULT
          success: {
            50: "#E8FAF0",
            100: "#E0F8C9",
            200: "#BDF296",
            300: "#88DA5D",
            400: "#56B533",
            500: "#1F8506",
            600: "#117204",
            700: "#075F03",
            800: "#014D03",
            900: "#013F07",
            foreground: "#11181C",
            DEFAULT: "#1F8506",
          },
        },
      }
    }
  })]
}

export default config;