/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary:       '#1E3A5F',
        'primary-light': '#2B5BA0',
        'primary-dark':  '#152B47',
        'primary-50':    '#EFF3FB',
        'primary-100':   '#D6E0F5',
        accent:        '#F59E0B',
        'accent-light':  '#FEF3C7',
        success:       '#10B981',
        danger:        '#EF4444',
        warning:       '#F59E0B',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'card':   '0 2px 12px rgba(0,0,0,0.08)',
        'card-lg':'0 4px 24px rgba(0,0,0,0.12)',
        'bottom': '0 -4px 20px rgba(0,0,0,0.06)',
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      },
    },
  },
  plugins: [],
}
