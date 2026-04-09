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
          bg: '#0C0E1A',
          card: '#1C1F38',
          elevated: '#1A1A25',
          hover: '#22222F',
          border: '#2A2A35',
          gold: '#D4A843',
          lavender: '#9B8EC4',
          'gold-light': '#E8D5A0',
          'gold-dim': '#8B7635',
          white: '#F0EDE4',
          'white-dim': '#A8A4A0',
          blue: '#6B8FC5',
          'blue-light': '#8BAFD5',
          teal: '#5BB8A6',
          rose: '#D4879B',
          purple: '#8B7CC8',
          success: '#5BB88F',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        body: ['Outfit', 'DM Sans', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #D4A843, #E8D5A0, #D4A843)',
        'gradient-card': 'linear-gradient(180deg, #1C1F38 0%, #242845 100%)',
        'gradient-radial-gold': 'radial-gradient(circle, rgba(212,168,67,0.08) 0%, transparent 70%)',
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
