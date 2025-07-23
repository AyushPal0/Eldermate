/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Extend keyframes for pulse-fast animation
      keyframes: {
        "pulse-fast": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(0.95)" },
        },
      },
      animation: {
        "pulse-fast": "pulse-fast 1.5s ease-in-out infinite",
      },
      // Optional: extend colors or shadows if you want custom neon/glow utilities
      colors: {
        blueglow: "#3b82f6cc",
        blueglowlight: "#a5f3fc99",
      },
      boxShadow: {
        neon:
          "0 0 20px #3b82f6cc, 0 0 40px #a5f3fc99",
      },
    },
  },
  plugins: [],
}
