/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#dce8c8',
          dark: '#b2c79a',
          light: '#eaf0e4', // The exact outer background color
          active: '#cce0b4' // The active pill color
        },
        olive: {
          DEFAULT: '#6b7e61',
          dark: '#3e4a38',
          card: '#768766' // For the dark KPI card
        },
        surface: '#f9fbf8',
        card: '#ffffff',
        textMain: '#1c1f1a',
        textMuted: '#6b7066',
        border: '#e8ebe5',
        ring: '#dce8c8'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
