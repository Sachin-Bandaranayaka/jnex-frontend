import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // background: "var(--background)",
        // foreground: "var(--foreground)",

        primary: "#1f2937",
        background: "#f3f4f6",

        // Table colors
        table: {
          header: "#cbd5e1",
          headerText: "#111827",
          row: {
            default: "#ffffff",
            alternate: "#f1f5f9",
            hover: "#f4f4f4",
          },
          rowText: "#6b7280",
          edit: {
            default: "#0284c7",
            hover: "#075985",
          },
          delete: {
            default: "#dc2626",
            hover: "#991b1b",
          },

          btnSelect: "#cbd5e1",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
