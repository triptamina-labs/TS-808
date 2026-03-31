import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        panel: {
          950: "#181b1a",
          900: "#232425",
          500: "#9b9fa0"
        },
        accent: {
          500: "#ff5a00"
        }
      }
    }
  },
  plugins: []
} satisfies Config;
