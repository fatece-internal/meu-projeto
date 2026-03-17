import type { Config } from 'tailwindcss'

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        game: {
          base: '#060912',
          card: '#0e1a32',
          border: '#1e3a6e',
          cyan: '#00e5ff',
          green: '#39ff14',
          yellow: '#ffe600',
          red: '#ff3366',
          purple: '#b44dff',
          text: '#c8deff',
          dim: '#4a6a9a',
        },
      },
      fontFamily: {
        orbitron: ['var(--font-orbitron)'],
        mono: ['var(--font-share-tech)'],
        exo: ['var(--font-exo)'],
      },
      boxShadow: {
        cyan: '0 0 24px #00e5ffaa',
        green: '0 0 24px #39ff14aa',
        yellow: '0 0 24px #ffe600aa',
        red: '0 0 24px #ff3366aa',
      },
      keyframes: {
        titlePulse: {
          '0%,100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.02)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(18px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        correctPop: {
          '0%': { transform: 'scale(1)' },
          '40%': { transform: 'scale(1.06)' },
          '100%': { transform: 'scale(1)' },
        },
        wrongShake: {
          '0%,100%': { transform: 'translateX(0)' },
          '20%': { transform: 'translateX(-6px)' },
          '40%': { transform: 'translateX(6px)' },
          '60%': { transform: 'translateX(-4px)' },
          '80%': { transform: 'translateX(4px)' },
        },
        timerPulse: {
          '0%,100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
      animation: {
        titlePulse: 'titlePulse 2.2s ease-in-out infinite',
        slideUp: 'slideUp 280ms ease-out both',
        correctPop: 'correctPop 260ms ease-out both',
        wrongShake: 'wrongShake 320ms ease-in-out both',
        timerPulse: 'timerPulse 900ms ease-in-out infinite',
      },
    },
  },
  plugins: [],
} satisfies Config

