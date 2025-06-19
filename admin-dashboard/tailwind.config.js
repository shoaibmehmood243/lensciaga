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
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
    },
  },
  plugins: [
    function({ addBase }) {
      addBase({
        'input[type="text"], input[type="email"], input[type="password"], input[type="number"], input[type="search"], input[type="tel"], input[type="url"], textarea, select': {
          '@apply w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm': {},
          '&:disabled': {
            '@apply bg-gray-100 cursor-not-allowed': {},
          },
          '&::placeholder': {
            '@apply text-gray-400': {},
          },
        },
        'input[type="checkbox"], input[type="radio"]': {
          '@apply h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500': {},
        },
        'select': {
          '@apply pr-10': {},
        },
        'label': {
          '@apply block text-sm font-medium text-gray-700 mb-1': {},
        },
        '.form-group': {
          '@apply mb-4': {},
        },
        '.form-error': {
          '@apply mt-1 text-sm text-red-600': {},
        },
        '.form-hint': {
          '@apply mt-1 text-sm text-gray-500': {},
        },
      })
    }
  ],
} 