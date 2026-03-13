/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{ts,tsx,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: '#f5f7fb',
        panel: '#ffffff',
        text: '#0f172a',
        muted: '#64748b',
        border: '#e2e8f0',
        brand: '#6d57ff',
        danger: '#ef4444',
        ok: '#22c55e',
      },
      boxShadow: {
        panel: '0 10px 30px rgba(15, 23, 42, 0.08)',
      },
      borderRadius: {
        card: '18px',
      },
    },
  },
  plugins: [],
}
