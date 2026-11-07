/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        khmer: {
          terracotta: '#c2410c', // Warm clay pot red-orange
          terracottaDark: '#9a3412',
          kroeung: '#d97706',    // Golden lemongrass turmeric paste
          kroeungLight: '#fef3c7',
          herb: '#166534',       // Fresh basil / lime leaf green
          herbLight: '#dcfce7',
          cream: '#fdfbf7',      // Soft eye-friendly background
          creamCard: '#ffffff',
          dark: '#1c1917',       // High contrast deep stone charcoal for text
          charcoal: '#292524',
          muted: '#57534e',      // Readable secondary text (passes contrast)
          border: '#e7e5e4',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'warm': '0 4px 20px -2px rgba(180, 83, 9, 0.12), 0 2px 6px -1px rgba(0, 0, 0, 0.06)',
        'card': '0 10px 25px -5px rgba(28, 25, 23, 0.08), 0 8px 10px -6px rgba(28, 25, 23, 0.04)',
        'pop': '0 20px 35px -5px rgba(194, 65, 12, 0.25)',
      }
    },
  },
  plugins: [],
}
