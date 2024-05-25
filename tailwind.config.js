/** @type {import('tailwindcss').Config} */
export default {
  // important: true,
  // corePlugins: {
  //   preflight: false,
  // },
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      pixel: ['Pixelify Sans', 'ui-monospace'],
    },
    extend: {
      boxShadow: {
        custom: '0px -3px 0px 0px rgba(17,18,38,0.20) inset',
      },
    },
  },
  plugins: [],
};
