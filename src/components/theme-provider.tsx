/* eslint-disable */
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
    effectiveTheme: "light" | "dark";
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>("dark");
    const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">("dark");
    const [mounted, setMounted] = useState(false);

    // Always enforce dark mode
    useEffect(() => {
        setThemeState("dark");
        setEffectiveTheme("dark");
        setMounted(true);

        const root = window.document.documentElement;
        root.classList.remove("light");
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
    }, []);

    // No-op for theme changes
    useEffect(() => {
        // Intentionally empty to prevent changes
    }, [theme]);

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme);
    };

    // Prevent flash of unstyled content
    if (!mounted) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, effectiveTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
}
