import { Config } from "tailwindcss";
const config: Config = {
  // NOTE: Update this to include the paths to all of your component files.
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0070f3",
          light: "#e6f1fe",
          dark: "#0051b2",
        },
        secondary: {
          DEFAULT: "#6c757d",
          light: "#e9ecef",
          dark: "#495057",
        },
        success: {
          DEFAULT: "#28a745",
          light: "#d4edda",
          dark: "#1e7e34",
        },
        color: {
          heading: "#1a1a1a",
          body: "#4a4a4a",
          muted: "#6c757d",
          light: "#ffffff",
        },
        background: {
          DEFAULT: "#f8f9fa",
          card: "#ffffff",
          dark: "#343a40",
        },
        border: {
          DEFAULT: "#dee2e6",
          dark: "#ced4da",
        },
        slate: {
          50: "#f8fafc",
          900: "#0f172a",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        ring: "hsl(var(--ring))",
        input: "hsl(var(--input))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      fontSize: {
        h1: ["32px", { lineHeight: "40px", fontWeight: "700" }],
        h2: ["24px", { lineHeight: "32px", fontWeight: "700" }],
        h3: ["20px", { lineHeight: "28px", fontWeight: "700" }],
        body: ["16px", { lineHeight: "24px" }],
        small: ["14px", { lineHeight: "20px" }],
        caption: ["12px", { lineHeight: "16px" }],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 1px 0 rgba(0, 0, 0, 0.18)",
        md: "0 2px 3.84px 0 rgba(0, 0, 0, 0.25)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
