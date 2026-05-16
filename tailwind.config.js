/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#003087',
        action: '#C8102E',
        background: '#C9D1D9',
        surface: '#FFFFFF',
        textMain: '#1A1A2E',
        navbar: '#001A5E'
      }
    }
  },
  plugins: []
}
