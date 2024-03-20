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
      backgroundImage: {
        'xs-os': "url('./src/assets/background.png')",
      },
    },
  },
  plugins: [],
};
