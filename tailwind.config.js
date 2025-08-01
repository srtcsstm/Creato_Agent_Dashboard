/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '13': '3.25rem', // Custom height for h-13
      },
      borderWidth: {
        '3': '3px', // Custom border width for border-3
      },
      rotate: {
        '360': '360deg', // Custom rotate for rotate-360
      },
    },
  },
  plugins: [],
}
