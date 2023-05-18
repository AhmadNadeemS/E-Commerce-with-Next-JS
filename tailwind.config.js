/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      "new-md": "779px",
    },
    extend: {
      gridTemplateColumns: {
        fluid: "repeat(auto-fit, minmax(20rem,1fr))",
      },
      fontFamily: {
        lobster: ["var(--font-lobster)"],
        roboto: ["var(--font-roboto)"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
};
