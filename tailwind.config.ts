import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#B91C1C',
          darkRed: '#991B1B',
          amber: '#F59E0B',
          gold: '#D97706',
          navy: '#0F172A',
          dark: '#090D16',
          slate: '#1E293B',
          sepiaBg: '#FEF3C7',
          sepiaBorder: '#FDE68A',
        },
      },
      fontFamily: {
        devanagari: ['var(--font-devanagari)', '"Noto Sans Devanagari"', '"Mukta"', 'sans-serif'],
        latin: ['var(--font-latin)', '"Inter"', 'sans-serif'],
      },
      fontSize: {
        'hi-body': ['1.125rem', { lineHeight: '1.9' }],
        'hi-headline': ['2.25rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            lineHeight: '1.9',
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
