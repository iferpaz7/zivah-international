import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,js,jsx,mdx}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff6231', // Orange
        'primary-foreground': '#ffffff',
        secondary: '#055aad', // Blue
        'secondary-foreground': '#ffffff',
        accent: '#0d8c49', // Green
        'accent-foreground': '#ffffff',
        destructive: '#e53e3e', // Red
        'destructive-foreground': '#ffffff',
        warning: '#dd6b20', // Orange
        'warning-foreground': '#ffffff',
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
