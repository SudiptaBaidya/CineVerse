/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cineverse': {
          'bg': '#0D0F15',
          'card': '#1B1D2A',
          'accent': '#E50914',
          'accent-hover': '#b8070f',
        }
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundColor: {
        'cineverse-card-90': 'rgba(27, 29, 42, 0.9)',
      }
    },
  },
  plugins: [],
}