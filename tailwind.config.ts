import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F5F1E7",
        ink: "#1C2733",
        brick: "#A63A2E",
        "brick-dark": "#8A2F25",
        sage: "#4B6C5E",
        "sage-light": "#DCE5DF",
        muted: "#5B6670",
        line: "#D9D2C0",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        sans: ["Work Sans", "system-ui", "sans-serif"],
      },
      maxWidth: {
        prose: "38rem",
      },
    },
  },
  plugins: [],
};

export default config;
