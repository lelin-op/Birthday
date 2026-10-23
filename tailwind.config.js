/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        blush: {
          50: '#fff5f7',
          100: '#ffeef2',
          200: '#ffdbe4',
          300: '#ffb8cb',
          400: '#ff85a5',
          500: '#f84b7a',
          600: '#e3265a',
        },
        lavender: {
          50: '#fbf8ff',
          100: '#f3ebff',
          200: '#e8d9ff',
          300: '#d5b8ff',
          400: '#b785ff',
          500: '#974eff',
        },
        warmGold: {
          100: '#fef9e7',
          300: '#fde68a',
          400: '#fbbf24',
          500: '#f59e0b',
        }
      },
      fontFamily: {
        script: ['"Dancing Script"', 'cursive'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'flutter': 'flutter 0.6s ease-in-out infinite alternate',
        'twinkle': 'twinkle 2s ease-in-out infinite alternate',
        'flicker': 'flicker 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(3deg)' },
        },
        flutter: {
          '0%': { transform: 'scaleX(1) rotate(-5deg)' },
          '100%': { transform: 'scaleX(0.4) rotate(5deg)' },
        },
        twinkle: {
          '0%': { opacity: '0.4', filter: 'drop-shadow(0 0 2px rgba(254, 243, 199, 0.4))' },
          '100%': { opacity: '1', filter: 'drop-shadow(0 0 8px rgba(254, 243, 199, 1))' },
        },
        flicker: {
          '0%': { transform: 'scale(1) rotate(-2deg)', opacity: '0.9' },
          '50%': { transform: 'scale(1.08) rotate(2deg)', opacity: '1' },
          '100%': { transform: 'scale(0.95) rotate(-1deg)', opacity: '0.85' },
        }
      }
    },
  },
  plugins: [],
}
