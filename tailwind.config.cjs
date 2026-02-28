/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Inter'", "'Helvetica Neue'", "Helvetica", "Arial", "sans-serif"],
        mono: ["'Inter'", "'Helvetica Neue'", "Helvetica", "Arial", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
      },
      animation: {
        'pulse-glow': 'pulseGlow 0.8s ease',
        'stagger-in': 'staggerIn 0.3s ease forwards',
        'pin-fill': 'pinFill 0.2s ease forwards',
      },
      keyframes: {
        pulseGlow: {
          '0%':   { boxShadow: '0 0 0 0 rgba(0, 0, 0, 0.3)' },
          '50%':  { boxShadow: '0 0 0 6px rgba(0, 0, 0, 0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(0, 0, 0, 0)' },
        },
        staggerIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        pinFill: {
          '0%':   { transform: 'scale(0.6)', opacity: '0.5' },
          '50%':  { transform: 'scale(1.2)', opacity: '1' },
          '100%': { transform: 'scale(1.1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
