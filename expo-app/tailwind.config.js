/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#10b981",
        "primary-dark": "#059669",
        background: "#0f172a",
        card: "#1e293b",
        "card-border": "#334155",
        muted: "#64748b",
        foreground: "#f8fafc",
        "muted-foreground": "#94a3b8",
      },
    },
  },
  plugins: [],
}
