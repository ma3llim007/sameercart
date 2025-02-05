/** @type {import('tailwindcss').Config} */
export const darkMode = ["class"];
export const content = ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"];
export const theme = {
    extend: {
        borderRadius: {
            lg: "var(--radius)",
            md: "calc(var(--radius) - 2px)",
            sm: "calc(var(--radius) - 4px)",
        },
        colors: {
            background: "hsl(var(--background))",
            foreground: "hsl(var(--foreground))",
            card: {
                DEFAULT: "hsl(var(--card))",
                foreground: "hsl(var(--card-foreground))",
            },
            popover: {
                DEFAULT: "hsl(var(--popover))",
                foreground: "hsl(var(--popover-foreground))",
            },
            primary: {
                DEFAULT: "hsl(var(--primary))",
                foreground: "hsl(var(--primary-foreground))",
            },
            secondary: {
                DEFAULT: "hsl(var(--secondary))",
                foreground: "hsl(var(--secondary-foreground))",
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
            border: "hsl(var(--border))",
            shadow: "hsl(var(--shadow))",
            input: "hsl(var(--input))",
            ring: "hsl(var(--ring))",
            chart: {
                1: "hsl(var(--chart-1))",
                2: "hsl(var(--chart-2))",
                3: "hsl(var(--chart-3))",
                4: "hsl(var(--chart-4))",
                5: "hsl(var(--chart-5))",
            },
            light: {
                deep: "#146CDA",
                blue: "#0562D6",
                gray: "#D3D3D3",
                bgWhite: "#FFFFFF",
                bgLightGray: "#F9F9F9",
                bgLighterGray: "#F7F7F7",
                bgGray: "#D3D3D3",
                textGray: "#47494A",
                textDarkGray: "#1D1D1D",
                textWhite: "#FFFFFF",
                link: "#146CDA",
                hoverLink: "#146CDA",
            },
            dark: {
                deep: "#1E3A8A",
                dark: "#1E40AF",
                gray: "#4B4B4B",
                light: "#3B82F6",
                bgDark: "#0F172A",
                bgGray: "#1E293B",
                bgDarkGray: "#4B4B4B",
                bgLightGray: "#334155",
                textLightGray: "#E5E7EB",
                textLight: "#F8FFC",
                textWhite: "#FFFFFF",
                link: "#3B82F6",
                hoverLink: "#3B82F6",
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
        fontFamily: {
            sans: ["Inter", "Open Sans"],
        },
        fontSize: {
            xs: ["13px", "12px"],
            sm: ["14px", "20px"],
            base: ["16px", "19.5px"],
            lg: ["18px", "21.94px"],
            xl: ["20px", "24.38px"],
            "2xl": ["24px", "29.26px"],
            "3xl": ["28px", "50px"],
            "4xl": ["48px", "58px"],
            "8xl": ["96px", "106px"],
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
};
// eslint-disable-next-line no-undef
export const plugins = [require("tailwindcss-animate"), require("@tailwindcss/typography")];