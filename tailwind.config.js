/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      maxWidth: {
        'content-sm': '640px',
        'content': '800px',
        'content-lg': '960px',
        'content-xl': '1120px',
      },
      colors: {
        // ROCOCO-BOTANICAL CREAM REMAP — every legacy `selene-*` class
        // now points to a cream-system token. This converts the entire
        // academy to the editorial cream palette in one pass without
        // touching individual pages. Pages can migrate to direct
        // var(--ink), var(--gold) etc on a one-by-one basis later.
        selene: {
          // Surfaces — cream parchment family
          bg: '#FBF6EE',         // page background
          card: '#FFF9F2',       // raised card
          elevated: '#F5EBE0',   // softer elevated surface
          hover: '#F0E6D3',      // hover state on cards
          border: 'rgba(184,151,90,0.3)',
          // Gold — same gold as selenaura-main (B8975A, less saturated)
          gold: '#B8975A',
          'gold-light': '#D4BC8A',
          'gold-dim': '#8F7340',
          // "white"/"white-dim" remapped to chocolate ink — any pre-
          // existing text-selene-white now reads on cream as the
          // intended ink colour.
          white: '#2D1F14',
          'white-dim': '#6B5D52',
          // Accent palette — rose-deep dominant, harmonised values
          lavender: '#9E5570',
          'lavender-dim': '#7A3F56',
          silver: '#8E7F72',
          blue: '#6B8FC5',
          'blue-light': '#8BADD6',
          teal: '#5BB8A6',
          rose: '#C4768C',
          purple: '#9E5570',
          success: '#7EA87A',
        },
      },
      fontFamily: {
        // Fraunces variable + Lora pair, same stack as selenaura-main
        display: ['var(--font-display)', 'Fraunces', 'Cormorant Garamond', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'Lora', 'Georgia', 'serif'],
      },
      backgroundImage: {
        // Gradients remapped to cream-system colours — gold gradient
        // stays meaningful, lavender now reads as warm rose-deep,
        // cosmic loses the dark shimmer.
        'gradient-gold': 'linear-gradient(135deg, #B8975A, #D4BC8A, #B8975A)',
        'gradient-card': 'linear-gradient(180deg, #FFF9F2 0%, #F5EBE0 100%)',
        'gradient-radial-gold': 'radial-gradient(circle, rgba(184,151,90,0.08) 0%, transparent 70%)',
        'gradient-lavender': 'linear-gradient(135deg, #9E5570, #C4768C)',
        'gradient-cosmic': 'linear-gradient(135deg, rgba(184,151,90,0.10), rgba(196,118,140,0.08), rgba(158,85,112,0.10))',
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-gold': 'pulse-gold 3s ease-in-out infinite',
        'pulse-lavender': 'pulse-lavender 4s ease-in-out infinite',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        'bounce-slow': 'bounce-slow 2s ease-in-out infinite',
      },
      keyframes: {
        'pulse-gold': {
          '0%, 100%': { opacity: 0.4 },
          '50%': { opacity: 1 },
        },
        'pulse-lavender': {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 0.8 },
        },
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        'slide-up': {
          from: { opacity: 0, transform: 'translateY(20px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};
