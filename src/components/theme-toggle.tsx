"use client";

import { useTheme } from "./theme-provider";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const themes: { value: "light" | "dark" | "system"; icon: typeof Sun; label: string }[] = [
        { value: "light", icon: Sun, label: "Aydınlık" },
        { value: "dark", icon: Moon, label: "Koyu" },
        { value: "system", icon: Monitor, label: "Sistem" },
    ];

    return (
        <div className="flex gap-1 p-1 bg-white/5 rounded-lg border border-white/5">
            {themes.map((t) => {
                const Icon = t.icon;
                return (
                    <button
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className={cn(
                            "p-2 rounded-md transition-all",
                            theme === t.value
                                ? "bg-primary text-primary-foreground"
                                : "text-muted-foreground hover:text-white hover:bg-white/5"
                        )}
                        title={t.label}
                    >
                        <Icon className="w-4 h-4" />
                    </button>
                );
            })}
        </div>
    );
}
