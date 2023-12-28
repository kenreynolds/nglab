/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  important: true,
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
