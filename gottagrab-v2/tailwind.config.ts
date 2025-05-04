import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['"Red Hat Display"', 'sans-serif'] },
      colors: {
        primary: '#5b9c56',      // green accent
        secondary: '#3a3339',    // dark text
        accent: '#d88250',       // raw-sienna
        bg: '#c7a48a',           // indian-khaki background
        overlay: 'rgba(0,0,0,0.4)',
      },
      boxShadow: {
        bubble: '0 8px 20px rgba(0,0,0,0.1)',
      },
    },
  },
  plugins: [],
}

export default config
