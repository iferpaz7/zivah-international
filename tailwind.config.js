/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./js/**/*.js",
    "./components/**/*.{html,js}",
    // Agregar rutas adicionales según el framework elegido
    // Para Astro: "./src/**/*.{astro,html,js,jsx,ts,tsx,vue}"
    // Para Next.js: "./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de colores ZIVAH
        zivah: {
          primary: '#ff6347',
          coral: '#ff7f50',
          emerald: '#16a085',
          forest: '#1e4d30',
          lime: '#7cb342',
          blue: '#3182ce',
          ocean: '#2b6cb0',
          'deep-blue': '#2980b9',
          navy: '#1a202c',
          charcoal: '#2d3748',
          gray: '#4a5568',
          'light-gray': '#718096',
          aqua: '#26d0ce',
          turquoise: '#1abc9c',
          pale: '#edf2f7',
          'off-white': '#f7fafc',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif'
        ]
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #ff6347 0%, #16a085 100%)',
        'ocean-gradient': 'linear-gradient(135deg, #3182ce 0%, #2980b9 100%)',
        'forest-gradient': 'linear-gradient(135deg, #1e4d30 0%, #7cb342 100%)',
        'premium-gradient': 'linear-gradient(135deg, #1a202c 0%, #ff6347 100%)',
        'shrimp-gradient': 'linear-gradient(135deg, #ff6347 0%, #ff7f50 100%)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        }
      },
      boxShadow: {
        'zivah': '0 8px 30px rgba(0, 0, 0, 0.1)',
        'zivah-hover': '0 20px 50px rgba(0, 0, 0, 0.15)',
      },
      backdropBlur: {
        'zivah': '10px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}