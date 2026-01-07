import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // High-end dark theme palette
        background: "#050505", // Deepest black
        surface: "rgba(255, 255, 255, 0.05)", // Glass effect base
        primary: "#FFD700", // Neon Gold
        secondary: "#FF55DD", // Neon Pink (Cuter Cyber)
        accent: "#00F0FF", // Keep Cyber Blue as accent
        "sporty-green": "#00FF9D",
        "accent-orange": "#FF8C00",
        "cute-pink": "#FFB7EB",
        "cute-purple": "#D4A5FF",
        text: {
          main: "#FFFFFF",
          muted: "#9CA3AF",
        },
        "brand-black": "#000000",
      },
      fontFamily: {
        sans: ["var(--font-noto-sans-jp)", "sans-serif"],
        heading: ["var(--font-orbitron)", "sans-serif"],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #FFD700 0deg, #000000 180deg, #FFD700 360deg)',
      },
      animation: {
        "fade-in": "fadeIn 1s ease-out forwards",
        "slide-up": "slideUp 0.8s ease-out forwards",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "scanline": "scanline 3s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(255, 215, 0, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(255, 215, 0, 0.6), 0 0 10px rgba(255, 215, 0, 0.4)" },
        },
        scanline: {
          "0%": { transform: "translateY(-10%)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(100%)", opacity: "0" },
        },
      },
      boxShadow: {
        gold: "0 0 15px 5px rgba(255, 215, 0, 0.4)",
        glass: "0 4px 30px rgba(0, 0, 0, 0.1)",
      },
    },
  },
  plugins: [],
};
export default config;

