/* eslint-env es2021 */
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{ts,tsx}", "./index.html"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Raleway", ...defaultTheme.fontFamily.sans],
      },
    },
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: colors.white,
      black: colors.black,
      zinc: colors.zinc,
      red: colors.red,
      green: colors.green,
      salmon: {
        300: "#e19c71",
        400: "#e18e5a",
        DEFAULT: "#E18247",
        500: "#E18247",
        600: "#e17a3b",
        700: "#e1722d",
        800: "#e16416",
      },
      background: {
        DEFAULT: "#424143",
      },
    },
  },
  plugins: [],
};
