import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff6231', // Orange
        secondary: '#055aad', // Blue
        accent: '#0d8c49', // Green
        dark: '#090709', // Black
        'dark-accent': '#082c20', // Dark Green
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
