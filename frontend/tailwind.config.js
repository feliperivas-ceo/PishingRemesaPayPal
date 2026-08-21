/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: '#001c64',
          blue: '#003087',
          accent: '#0070e0',
          gold: '#ffd140',
        },
      },
    },
  },
  plugins: [],
};
