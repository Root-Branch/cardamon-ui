/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    'node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx,vue}',
    'node_modules/flowbite/**/*.{js,jsx,ts,tsx}'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Be Vietnam Pro', 'sans-serif']
      },
      colors: {
        'chart-value': '#0B1354'
      },
      dropShadow: {
        widget: '0 4px 4px rgba(0, 0, 0, 0.25)'
      }
    }
  },
  plugins: [import('flowbite/plugin')]
}
