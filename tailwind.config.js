/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        "highlight": {
          from: { backgroundColor: 'rgba(88, 101, 119, 1)' },
          to: { backgroundColor: 'transparent' },
        },
        "dropdown": {
          "0%": { opacity: 0 },
          "30%": { opacity: 0 },
          "100%": { opacity: 100 },
        },
        "dropup": {
          "0%": { opacity: 100 },
          "5%": { opacity: 0 },
          "100%": { opacity: 0 },
        },
      },
      animation: {
        "highlight": "highlight 3s ease-out",
        "dropdown": "dropdown 0.5s ease-in-out",
        "dropup": "dropup 0.5s ease-in-out",
      },
    },
  },
  plugins: [],
}

