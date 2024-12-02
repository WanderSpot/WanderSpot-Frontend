/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}', // Vue 파일 포함
  ],
  theme: {
    extend: {
      colors: {
        main: '#4aaff7',
        sub: '#ff4e4e',
        point: '#a1e44d',
        light: '#f4f3ee',
        dark: '#2b2d42',
      },
    },
  },
  plugins: [],
}
