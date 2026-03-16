/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        selene: {
          bg: '#0A0A0F',
          card: '#12121A',
          elevated: '#1A1A25',
          hover: '#22222F',
          border: '#2A2A35',
          gold: '#C9A84C',
          'gold-light': '#E8D5A0',
          'gold-dim': '#8B7635',
          white: '#F0EDE4',
          'white-dim': '#A8A4A0',
          blue: '#4A6FA5',
          'blue-light': '#6B8FC5',
          teal: '#5B9E8F',
          rose: '#C97B8B',
          purple: '#7B68AE',
          success: '#5BB88F',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        body: ['Outfit', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #C9A84C, #E8D5A0, #C9A84C)',
        'gradient-card': 'linear-gradient(180deg, #12121A 0%, #1A1A25 100%)',
        'gradient-radial-gold': 'radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%)',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-gold': 'pulse-gold 3s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.6s ease-out forwards',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 1 },
        },
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        'slide-up': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
