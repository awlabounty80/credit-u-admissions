/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        creditBlue: "#073B8E",
        creditRoyal: "#0057FF",
        creditGold: "#FFD23F",
        creditNavy: "#061A40",
        honey: "#F9C846",
        campusBlue: "#0B37A5",
        royalBlue: "#174BFF",
        honeyGold: "#F6B51E",
        ink: "#071025",
        cream: "#FFF8E7"
      },
      boxShadow: {
        campus: "0 20px 60px rgba(0, 87, 255, 0.25)",
        gold: "0 20px 60px rgba(255, 210, 63, 0.22)",
        luxury: "0 30px 80px rgba(7, 30, 99, .28)",
        glow: "0 0 45px rgba(255, 216, 77, .34)"
      },
      borderRadius: {
        luxury: "2rem"
      }
    },
  },
  plugins: [],
}
