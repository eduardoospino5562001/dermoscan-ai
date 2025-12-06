/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0F172A", // Slate 900
        secondary: "#1E293B", // Slate 800
        accent: "#38BDF8", // Sky 400
        success: "#4ADE80", // Green 400
        warning: "#FBBF24", // Amber 400
        danger: "#F87171", // Red 400
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}