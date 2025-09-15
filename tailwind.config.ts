import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx}'],
  theme: {
    extend: {
      colors: {
        zivah: {
          lime: '#7CB342',
          green: '#2E7D32',
          'dark-green': '#1B5E20',
          navy: '#0D47A1',
          blue: '#1976D2',
          coral: '#FF5722',
          'light-coral': '#FF8A65',
          'blue-gray': '#37474F',
          charcoal: '#263238',
        },
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
