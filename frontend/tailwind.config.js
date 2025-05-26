/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Extend the existing 'red' palette
        red: {
          // Define your specific #ff0000 for a common shade, e.g., 600
          600: '#E3443E', // This is your desired #ff0000 pure red
          
          // Define slightly darker shades for hover effects, etc.
          // You can find these hex codes using a color picker or online tools
          // These are just examples to go darker than #ff0000
          700: '#e60000', // A bit darker
          800: '#cc0000', // Even darker for button hovers
          900: '#b30000', // Darkest for things like Navbar main background
          
          // You can also add lighter shades if needed, e.g.,
          // 500: '#ff3333', 
          // 400: '#ff6666',
        },
      },
    },
  },
  plugins: [],
}