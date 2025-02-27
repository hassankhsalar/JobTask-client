/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'text': '#090909',
        'background': '#f9f6f6',
        'primary': '#bc4662',
        'secondary': '#e8849c',
        'accent': '#f64871',
       },
    },
  },
  plugins: [require('daisyui'),],
  daisyui: {
    themes: ["light", "dark"], // Enable light & dark mode
  },
};