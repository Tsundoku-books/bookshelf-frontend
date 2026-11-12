// Tailwind 3 cannot apply `/50` opacity to a plain var(), so colours go through color-mix.
// Without a `/NN` modifier opacityValue is undefined or a var() string, both NaN here.
const token = (name) => ({ opacityValue }) => {
  const alpha = Number(opacityValue)
  return Number.isNaN(alpha)
    ? `var(${name})`
    : `color-mix(in srgb, var(${name}) ${alpha * 100}%, transparent)`
}

/** @type {import('tailwindcss').Config} */
export default {
    content: [
      './pages/**/*.{ts,tsx}',
      './components/**/*.{ts,tsx}',
      './app/**/*.{ts,tsx}',
      './src/**/*.{ts,tsx}',
    ],
    prefix: "",
    theme: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          "2xl": "1400px",
        },
      },
      extend: {
        colors: {
          background: token("--background"),
          surface: token("--surface"),
          text: {
            DEFAULT: token("--text"),
            muted: token("--text-muted"),
          },
          heading: token("--heading"),
          primary: token("--primary"),
          "on-primary": token("--on-primary"),
          hero: token("--hero"),
          "on-hero": token("--on-hero"),
          secondary: token("--secondary"),
          "on-secondary": token("--on-secondary"),
          accent: token("--accent"),
          cta: token("--cta"),
          "on-cta": token("--on-cta"),
          border: token("--border"),
          danger: token("--danger"),
          "on-danger": token("--on-danger"),
          "danger-subtle": token("--danger-subtle"),
          success: token("--success"),
          "success-subtle": token("--success-subtle"),
          warning: token("--warning"),
          "warning-subtle": token("--warning-subtle"),
          info: token("--info"),
          "info-subtle": token("--info-subtle"),
        },
        fontFamily: {
          sans: ["var(--font-primary)"],
          serif: ["var(--font-secondary)"],
        },
        borderRadius: {
          DEFAULT: "var(--radius-sm)",
          sm: "var(--radius-sm)",
          md: "var(--radius-sm)",
          lg: "var(--radius-sm)",
          xl: "var(--radius-md)",
          "2xl": "var(--radius-md)",
          full: "var(--radius-pill)",
        },
        boxShadow: {
          DEFAULT: "var(--shadow-card)",
          sm: "var(--shadow-card)",
        },
        keyframes: {
          "accordion-down": {
            from: { height: "0" },
            to: { height: "var(--radix-accordion-content-height)" },
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: "0" },
          },
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out",
        },
      },
    },
    plugins: [],
  }
