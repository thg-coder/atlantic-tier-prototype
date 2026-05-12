/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Deep, slightly desaturated "ink navy" — the Atlantic primary.
        navy: {
          DEFAULT: '#142133',
          50: '#F0F2F6',
          100: '#D6DBE4',
          600: '#21314B', // hover / lift
          700: '#142133', // = DEFAULT
          800: '#0F1A29',
          900: '#0B1525' // gradient-dark end
        },
        // Warm cream — pages, soft cards, dividers.
        sand: {
          DEFAULT: '#E5DBC7',
          100: '#F8F4ED',
          200: '#EFE8D8', // borders / hairlines
          300: '#E5DBC7',
          500: '#C7B894'
        },
        cream: '#F8F4ED',
        ink: '#212834'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Cormorant Garamond"', 'Georgia', 'serif']
      },
      maxWidth: {
        widget: '420px'
      },
      boxShadow: {
        // Brand-tinted (navy) elevation scale.
        card: '0 1px 2px rgba(20, 33, 51, 0.04), 0 4px 14px -3px rgba(20, 33, 51, 0.07)',
        'card-hover': '0 2px 4px rgba(20, 33, 51, 0.06), 0 10px 26px -4px rgba(20, 33, 51, 0.12)',
        'card-active': '0 1px 2px rgba(20, 33, 51, 0.10), 0 6px 18px -3px rgba(20, 33, 51, 0.18)',
        cta: '0 4px 14px -2px rgba(20, 33, 51, 0.32), 0 2px 5px rgba(20, 33, 51, 0.14)',
        widget: '0 24px 60px -16px rgba(20, 33, 51, 0.22), 0 4px 14px -3px rgba(20, 33, 51, 0.08)'
      }
    }
  },
  plugins: []
}
