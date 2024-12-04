// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@shadcn/ui/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('tailwindcss-animate')],
};