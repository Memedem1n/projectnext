"use client";

import { LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

export type ViewMode = 'grid' | 'list';

interface ViewModeToggleProps {
    mode: ViewMode;
    onModeChange: (mode: ViewMode) => void;
    className?: string;
}

export function ViewModeToggle({ mode, onModeChange, className }: ViewModeToggleProps) {
    return (
        <div className={cn("flex items-center gap-1 glass-card p-1", className)}>
            <button
                onClick={() => onModeChange('grid')}
                className={cn(
                    "px-3 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-1.5",
                    mode === 'grid'
                        ? "bg-brand-gold text-black shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
                title="Grid View"
            >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Grid</span>
            </button>
            <button
                onClick={() => onModeChange('list')}
                className={cn(
                    "px-3 py-1.5 rounded text-sm font-medium transition-all flex items-center gap-1.5",
                    mode === 'list'
                        ? "bg-brand-gold text-black shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                )}
                title="List View"
            >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Liste</span>
            </button>
        </div>
    );
}
