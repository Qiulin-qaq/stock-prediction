/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        black: {
          primary: '#6666FF',
          secondary: '#33FFCC',
          accent: '#FF8833',
          neutral: '#2A2E37',
          'base-100': '#000000',
          'base-200': '#0D0D0D',
          'base-300': '#1A1A1A',
          'base-content': '#F0F0F0',
          success: '#00FF7F',
          warning: '#FFBF00',
          error: '#FF3366',
          info: '#00BFFF',
        },
      },
    ],
  },
  plugins: [require("daisyui")],
}