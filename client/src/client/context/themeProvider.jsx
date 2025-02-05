import { createContext, useContext, useEffect, useState } from "react";

// Define the ThemeProvider Context
const themeProviderContext = createContext({
    theme: "system",
    setTheme: () => null,
});

// eslint-disable-next-line no-unused-vars
export function ThemeProvider({ children, defaultTheme = "system", storageKey = "vite-ui-theme", ...props }) {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem(storageKey) || defaultTheme;
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Remove Existing Theme Classes
        root.classList.remove("light", "dark");

        if (theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light";
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    }, [theme]);

    const value = {
        theme,
        setTheme: newTheme => {
            localStorage.setItem(storageKey, newTheme);
            setTheme(newTheme);
        },
    };

    return <themeProviderContext.Provider value={value}>{children}</themeProviderContext.Provider>;
}

export const useTheme = () => {
    const context = useContext(themeProviderContext);

    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }

    return context;
};
