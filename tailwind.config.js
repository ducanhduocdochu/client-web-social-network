
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      screens: {
        'mobile': { 'max': '480px' },
      },
      fontFamily: {
        mon: ['Montserrat'],
        plf: ['Playfair Display'],
      },
      colors: {
        'bgr': '#FFF9F6',
        'bgr-auth': '#f5f5f5',
        'primary-text': '#272727',
        '2nd-text': '#272727',
        '3rd-text': '#B78D71',
        'price-text': '#92715A',
        'btn': '#251C17',
        'Neutral/2': '#626262',
        'Neutral/3': '#A9A9A9',
        'border-1': '#6E5544',
        'msgEr': '#d2311b',
      },
      spacing: {
        8: '8px',
        16: '16px',
        24: '24px',
      },
      borderRadius: {
        8: '8px',
        16: '16px',
      },
      fontSize: {
        32: '32px',
      },
      dropShadow: {
        product: '0px 4px 52px rgba(15, 15, 15, 0.25)',
      },
      boxShadow: {
        product: '0px 0px 60px 10px rgba(15, 15, 15, 0.1)',
      },
      boxShadow: {
        'shadow-btn': '0 0 2px 3px #ffd1b9',
        'shadow-gray': '0 0 5px 3px rgba(0,0,0,0.2)'
      },
      keyframes: {
        loading: {
          '0%': { transform: 'rotate(0deg))', boxShadow: "1px 5px 2px #e65c00" },
          '50%': { transform: 'rotate(180deg)', boxShadow: "1px 5px 2px #18b201" },
          '100%': { transform: 'rotate(360deg)', boxShadow: "1px 5px 2px #0456c8" },
        },
        text: {
          '50%': { color: "black" },
        },
        // For Toast
        fromRight: {
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '10%': { transform: 'translateX(0)', opacity: 1 },
          '15%': { transform: 'translateX(10%)', opacity: 1 },
          '20%': { transform: 'translateX(0)', opacity: 1 },
          '30%': { transform: 'translateY(0)', opacity: 1 },
          '90%': { transform: 'translateY(0)', opacity: 1 },
          '100%': { transform: 'translateY(100%)', opacity: 0 },
        },
        growWidth: {
          '0%': { width: 0 },
          '100%': { width: '100%' },
        },
      },
      animation: {
        loading: 'loading 2s linear infinite',
        text: 'text 3s ease-in-out infinite',
        // For Toast
        fromRight: 'fromRight 3s ease-in-out',
        growWidth: 'growWidth 3s ease-in-out',
      },
    },
  },
  plugins: [],
};
