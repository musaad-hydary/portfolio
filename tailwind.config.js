/** @type {import('tailwindcss').Config} */
module.exports = {
  resolve: {
    extensions: ['.js', '.jsx']
  },
  content: ["./src/**/*.{html,js}"],
  theme: {
    fontFamily: {
      sans: ["Azeret Mono", ]
    },
    cursor: {
      default: 'url(/src/assets/cursor.png), default',
      pointer: 'url(/src/assets/cursor.png), pointer',
    
    }

  },
  plugins: [],
}