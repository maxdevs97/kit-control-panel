/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'linear-bg': '#0d1117',
        'linear-card': '#161b22',
        'linear-border': '#30363d',
        'linear-text': '#c9d1d9',
        'linear-accent': '#58a6ff',
      }
    },
  },
  plugins: [],
}
