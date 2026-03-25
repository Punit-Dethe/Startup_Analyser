import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        page:    '#F5F4F1',
        card:    '#FFFFFF',
        border:  '#EBEBEA',
        'border-hover': '#D0D0CC',
        't-primary':   '#111110',
        't-secondary': '#3D3D3A',
        't-muted':     '#9B9B97',
        't-hint':      '#C0C0BC',
        'accent-brand':  '#DA291C',
        'accent-green':  '#16A34A',
        'accent-amber':  '#D97706',
        'accent-purple': '#7C3AED',
        'accent-teal':   '#0D9488',
        'accent-blue':   '#2563EB',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
