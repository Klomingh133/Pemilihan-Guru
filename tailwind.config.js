/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        school: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#38a8f7',
          500: '#0e8ce9',
          600: '#026fc7',
          700: '#0358a1',
          800: '#074b84',
          900: '#0c3f6e',
          950: '#082849',
        },
        celebration: {
          gold: '#f59e0b',
          silver: '#94a3b8',
          bronze: '#d97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'bounce-subtle': 'bounceSubtle 2s infinite',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'podium-rise': 'podiumRise 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pop-wobble': 'popWobble 0.75s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        popWobble: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '40%': { transform: 'scale(1.08) rotate(-5deg)', opacity: '1' },
          '60%': { transform: 'scale(0.96) rotate(4deg)' },
          '80%': { transform: 'scale(1.02) rotate(-2deg)' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        podiumRise: {
          '0%': { transform: 'translateY(80px) scale(0.9)', opacity: '0' },
          '100%': { transform: 'translateY(0) scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
