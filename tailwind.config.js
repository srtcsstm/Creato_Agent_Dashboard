/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      height: {
        '13': '3.25rem', // Custom height for h-13
      },
      borderWidth: {
        '3': '3px', // Custom border width for border-3
      },
      rotate: {
        '360': '360deg', // Custom rotate for rotate-360
      },
      colors: {
        // Shadcn/ui semantic colors mapped to your existing CSS variables
        background: "var(--color-bg)",
        foreground: "var(--color-text-primary)",
        muted: "var(--color-muted-surface)",
        "muted-foreground": "var(--color-text-secondary)",
        border: "var(--color-border)",
        card: "var(--color-surface)",
        "card-foreground": "var(--color-text-primary)",
        primary: {
          DEFAULT: "var(--color-text-primary)", // Adjust if you have a specific primary color variable
          foreground: "var(--color-bg)", // Text color on primary background
        },
        secondary: {
          DEFAULT: "var(--color-text-secondary)", // Adjust if you have a specific secondary color variable
          foreground: "var(--color-bg)",
        },
        destructive: {
          DEFAULT: "var(--color-error)", // Assuming --color-error exists in your CSS
          foreground: "var(--color-bg)",
        },
        accent: {
          DEFAULT: "var(--color-muted-surface)", // Using muted-surface as accent
          foreground: "var(--color-text-primary)",
        },
        popover: {
          DEFAULT: "var(--color-surface)",
          foreground: "var(--color-text-primary)",
        },
        ring: "var(--color-border)",
      },
    },
  },
  plugins: [],
}
