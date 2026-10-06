/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#1E3A5F',
        'primary-light': '#2B5BA0',
        accent: '#F59E0B',
        'accent-light': '#FEF3C7',
        rent: '#7C3AED',
        buy: '#D97706',
        verified: '#10B981',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
