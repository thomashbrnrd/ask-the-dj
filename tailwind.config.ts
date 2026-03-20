import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,ts}',
    './composables/**/*.{vue,ts}',
    './pages/**/*.vue',
    './app.vue',
    './layouts/**/*.vue',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'neon-pink': '#FF2D78',
        'neon-green': '#39FF14',
        'electric-blue': '#00CFFF',
      },
    },
  },
} satisfies Config
