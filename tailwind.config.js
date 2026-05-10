/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1E3F',
          50: '#F1F4FA',
          100: '#D9DFEC',
          600: '#162B58',
          700: '#0B1E3F',
          800: '#081632',
          900: '#050E22'
        },
        sand: {
          DEFAULT: '#E8DFCF',
          100: '#F7F2E8',
          200: '#EFE7D6',
          300: '#E8DFCF',
          500: '#C9B98F'
        },
        cream: '#F7F2E8',
        ink: '#1F2937'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Inter', 'serif']
      },
      maxWidth: {
        widget: '420px'
      },
      boxShadow: {
        widget: '0 10px 40px -8px rgba(11, 30, 63, 0.18), 0 2px 6px rgba(11, 30, 63, 0.06)'
      }
    }
  },
  plugins: []
}
