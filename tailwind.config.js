/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: 'rgb(var(--navy) / <alpha-value>)',
          light: 'rgb(var(--navy-light) / <alpha-value>)',
          lighter: 'rgb(var(--navy-lighter) / <alpha-value>)',
        },
        gold: {
          DEFAULT: '#d4a843',
          light: '#f0cc7a',
          dark: '#a07828',
        },
      },
      fontFamily: { serif: ['Georgia', 'serif'] },
    },
  },
  plugins: [],
};
