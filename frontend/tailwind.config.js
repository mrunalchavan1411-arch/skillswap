/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1B2A4E',
        inklight: '#2C3E66',
        paper: '#F7F4ED',
        paperdark: '#EFEAE0',
        amber: '#E8893E',
        amberdark: '#CF6F28',
        teal: '#2F8F7F',
        tealdark: '#236B5F',
        line: '#D8D2C4',
        charcoal: '#2B2B28',
        muted: '#8A8474',
        // Dark mode surfaces
        dbg: '#0F1420',
        dsurface: '#171D2E',
        dsurface2: '#1F273C',
        dline: '#2C3550',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        card: '10px',
      },
      backgroundImage: {
        'grad-amber-teal': 'linear-gradient(135deg, #E8893E 0%, #2F8F7F 100%)',
        'grad-ink': 'linear-gradient(135deg, #1B2A4E 0%, #2C3E66 60%, #2F8F7F 130%)',
        'grad-glass': 'linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,255,255,0.1))',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(27, 42, 78, 0.10)',
        glow: '0 0 24px rgba(232, 137, 62, 0.25)',
      },
    },
  },
  plugins: [],
}

