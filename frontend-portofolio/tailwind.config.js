import typography from '@tailwindcss/typography'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-color-mode="dark"]'],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        surface: '#0f0f13',
        surfaceHighlight: '#1a1a24',
        primary: {
          DEFAULT: '#06B6D4', // Cyan accent
          50: '#ECFEFF',
          100: '#CFFAFE',
          200: '#A5F3FC',
          300: '#67E8F9',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
          700: '#0E7490',
          800: '#155E75',
          900: '#164E63',
        },
        secondary: {
          DEFAULT: '#7C3AED', // Purple accent
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Syne', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.slate.700'),
            maxWidth: 'none',
            a: {
              color: theme('colors.primary.600'),
              '&:hover': {
                color: theme('colors.primary.700'),
              },
            },
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.slate.900'),
              fontWeight: '700',
            },
            code: {
              color: theme('colors.pink.600'),
              backgroundColor: theme('colors.slate.100'),
              padding: '0.25rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: '600',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: theme('colors.slate.900'),
              color: theme('colors.slate.100'),
            },
            blockquote: {
              borderLeftColor: theme('colors.primary.500'),
              color: theme('colors.slate.700'),
            },
            table: {
              width: '100%',
            },
            'thead th': {
              backgroundColor: theme('colors.slate.100'),
            },
            'tbody tr': {
              borderBottomColor: theme('colors.slate.200'),
            },
          },
        },
        invert: {
          css: {
            color: theme('colors.slate.300'),
            a: {
              color: theme('colors.primary.400'),
              '&:hover': {
                color: theme('colors.primary.300'),
              },
            },
            'h1, h2, h3, h4, h5, h6': {
              color: theme('colors.slate.100'),
            },
            code: {
              color: theme('colors.pink.400'),
              backgroundColor: theme('colors.slate.800'),
            },
            pre: {
              backgroundColor: theme('colors.slate.950'),
              color: theme('colors.slate.200'),
            },
            blockquote: {
              borderLeftColor: theme('colors.primary.400'),
              color: theme('colors.slate.300'),
            },
            'thead th': {
              backgroundColor: theme('colors.slate.800'),
            },
            'tbody tr': {
              borderBottomColor: theme('colors.slate.700'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    typography,
  ],
}