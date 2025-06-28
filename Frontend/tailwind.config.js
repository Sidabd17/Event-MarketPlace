/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,jsx}",
    ],
    theme: {
      extend: {
        screens: {
          'xsm': '880px',   // ✅ Your custom
          'xmd': '1300px', // ✅ Your custom   // ✅ High-res desktops
        },
      },
    },
    plugins: [],
  }
  