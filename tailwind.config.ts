import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    container: {
      center: true,
      padding: "1.25rem",
      screens: { "2xl": "1400px" }
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#fff1f7",
          100: "#ffe3ef",
          200: "#ffc7e0",
          300: "#ff9ac6",
          400: "#ff6daa",
          500: "#ff4fa3",
          600: "#e63d8e",
          700: "#bf2f73",
          800: "#992556",
          900: "#7a1d44"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        brand: {
          pink: "#ff4fa3",
          pinkSoft: "#ffe3ef",
          ink: "#0a0a0a",
          paper: "#ffffff",
          ash: "#f5f5f7"
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"]
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      boxShadow: {
        soft: "0 4px 30px -10px rgba(255,79,163,0.18)",
        card: "0 10px 40px -15px rgba(0,0,0,0.15)",
        glow: "0 0 0 4px rgba(255,79,163,0.18)"
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" }
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" }
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" }
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 1.6s infinite",
        "fade-up": "fade-up 0.6s ease-out",
        marquee: "marquee 25s linear infinite"
      },
      backgroundImage: {
        "hero-gradient":
          "radial-gradient(1200px 600px at 80% 20%, rgba(255,79,163,0.25), transparent 60%), radial-gradient(800px 400px at 10% 90%, rgba(255,79,163,0.18), transparent 60%)",
        "shine":
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
};

export default config;
