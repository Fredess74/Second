/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#FF8F3F',
        secondary: '#7F5AF0',
        accent: '#2CB9B0',
        background: '#F7F7FF',
        surface: '#FFFFFF'
      }
    }
  },
  plugins: []
};
