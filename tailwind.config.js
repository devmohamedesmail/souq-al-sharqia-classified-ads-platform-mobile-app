/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary:"#074799",
        secondary: "#f1aa00",
        danger:"#FF3131"
      },
    },
  },
  plugins: [],
}

