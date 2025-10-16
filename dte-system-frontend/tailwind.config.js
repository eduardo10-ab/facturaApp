/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#4B4471', // Color principal morado del diseño
          600: '#3d3761',
          700: '#312d4d',
          800: '#1e1b2e',
          900: '#0f0e14',
        },
        // Mantener los demás colores...
      }
    },
  },
  plugins: [],
}